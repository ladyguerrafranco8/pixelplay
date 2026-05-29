// ============================================================
// PixelPlay — edge function `crear-pedido`
// Único camino de escritura de pedidos. Se invoca desde el cliente
// (verify_jwt = false). Hace TODO con service role:
//   1. valida el payload
//   2. sube el comprobante al bucket privado `comprobantes`
//   3. inserta el pedido en `orders`
//   4. notifica a Lady por email (Resend) con el comprobante adjunto
//
// Si RESEND_API_KEY no está seteada, el email se omite limpiamente:
// el pedido igual queda guardado y visible en el panel /admin.
//
// Deploy con el MCP de Supabase de Lady:
//   deploy_edge_function(name="crear-pedido", verify_jwt=false, files=[...])
// ============================================================

import { createClient } from "jsr:@supabase/supabase-js@2";
import { corsHeaders } from "../_shared/cors.ts";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_ROLE = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
// Secrets que Lady setea en el Dashboard → Edge Functions → Secrets:
const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY") ?? "";
const NOTIFY_EMAIL = Deno.env.get("NOTIFY_EMAIL") ?? "";
const EMAIL_FROM =
  Deno.env.get("EMAIL_FROM") ?? "PixelPlay <onboarding@resend.dev>";

const fmtCOP = (n: number) =>
  "$ " + Math.round(Number(n) || 0).toLocaleString("es-CO");

interface CartItem {
  id?: string;
  name?: string;
  planType?: string;
  planLabel?: string;
  price?: number;
}

interface Payload {
  customer?: { name?: string; email?: string; whatsapp?: string };
  paymentMethod?: string;
  items?: CartItem[];
  subtotal?: number;
  discount?: number;
  total?: number;
  screenshot?: { base64?: string; ext?: string; contentType?: string };
}

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }
  if (req.method !== "POST") {
    return json({ ok: false, message: "Método no permitido" }, 405);
  }

  let body: Payload;
  try {
    body = await req.json();
  } catch {
    return json({ ok: false, message: "JSON inválido" }, 400);
  }

  const customer = body.customer ?? {};
  const name = (customer.name ?? "").trim();
  const email = (customer.email ?? "").trim();
  const whatsapp = (customer.whatsapp ?? "").trim();
  const items = Array.isArray(body.items) ? body.items : [];
  const shot = body.screenshot ?? {};

  // ---- Validación de entrada ----
  if (!name) return json({ ok: false, message: "Falta el nombre." }, 400);
  if (!email || !email.includes("@")) {
    return json({ ok: false, message: "Email inválido." }, 400);
  }
  if (items.length === 0) {
    return json({ ok: false, message: "El carrito está vacío." }, 400);
  }
  if (!shot.base64) {
    return json({ ok: false, message: "Falta el comprobante de pago." }, 400);
  }

  // Recalculamos los totales en el servidor a partir de los precios enviados
  // por ítem (defensa básica contra montos manipulados). El comprobante real
  // sigue siendo la prueba de pago que Lady valida a mano.
  const subtotal = items.reduce((s, it) => s + (Number(it.price) || 0), 0);
  const n = items.length;
  const rate = n >= 4 ? 0.2 : n >= 3 ? 0.15 : n >= 2 ? 0.1 : 0;
  const discount = Math.round(subtotal * rate);
  const total = subtotal - discount;

  const supabase = createClient(SUPABASE_URL, SERVICE_ROLE, {
    auth: { persistSession: false },
  });

  // ---- 1. Subir el comprobante al bucket privado ----
  let bytes: Uint8Array;
  try {
    const raw = String(shot.base64).split(",").pop() ?? "";
    bytes = Uint8Array.from(atob(raw), (c) => c.charCodeAt(0));
  } catch {
    return json({ ok: false, message: "Comprobante corrupto." }, 400);
  }

  const ext = (shot.ext ?? "jpg").replace(/[^a-z0-9]/gi, "").toLowerCase() ||
    "jpg";
  const contentType = shot.contentType ?? "image/jpeg";
  const path = `${crypto.randomUUID()}.${ext}`;

  const { error: upErr } = await supabase.storage
    .from("comprobantes")
    .upload(path, bytes, { contentType, upsert: false });

  if (upErr) {
    console.error("[crear-pedido] upload error:", upErr.message);
    return json({ ok: false, message: "Error al subir el comprobante." }, 500);
  }

  // ---- 2. Insertar el pedido ----
  const { data: inserted, error: insErr } = await supabase
    .from("orders")
    .insert({
      customer_name: name,
      customer_email: email,
      customer_whatsapp: whatsapp || null,
      payment_method: body.paymentMethod ?? null,
      items,
      subtotal,
      discount,
      total,
      screenshot_path: path,
      status: "pendiente",
    })
    .select("id, order_number")
    .single();

  if (insErr || !inserted) {
    console.error("[crear-pedido] insert error:", insErr?.message);
    // limpiar el comprobante huérfano
    await supabase.storage.from("comprobantes").remove([path]);
    return json({ ok: false, message: "Error al registrar el pedido." }, 500);
  }

  const orderNumber = inserted.order_number;

  // ---- 3. Email a Lady (best-effort; no rompe el flujo si falla) ----
  if (RESEND_API_KEY && NOTIFY_EMAIL) {
    const lines = items
      .map((it) =>
        `• ${it.name ?? "Servicio"}${
          it.planLabel ? ` (${it.planLabel})` : ""
        } — ${fmtCOP(Number(it.price) || 0)}`
      )
      .join("\n");

    const text = `
Nuevo pedido en PixelPlay.

Pedido #${orderNumber}
Cliente: ${name} (${email})${whatsapp ? `\nWhatsApp: ${whatsapp}` : ""}
Método de pago: ${body.paymentMethod ?? "—"}

Servicios:
${lines}

Subtotal: ${fmtCOP(subtotal)}
Descuento: -${fmtCOP(discount)}
Total: ${fmtCOP(total)}

El comprobante de pago va adjunto en este correo.
Gestioná el pedido en el panel: /admin
`.trim();

    try {
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${RESEND_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: EMAIL_FROM,
          to: NOTIFY_EMAIL,
          subject: `Nuevo pedido #${orderNumber} — ${name}`,
          text,
          attachments: [
            {
              filename: `comprobante-${orderNumber}.${ext}`,
              content: String(shot.base64).split(",").pop() ?? "",
            },
          ],
        }),
      });
      if (!res.ok) {
        console.error("[crear-pedido] Resend rechazó:", await res.text());
      }
    } catch (err) {
      console.error("[crear-pedido] email falló:", err);
    }
  } else {
    console.log(
      "[crear-pedido] RESEND_API_KEY / NOTIFY_EMAIL no seteadas — email omitido.",
    );
  }

  return json({ ok: true, order_number: orderNumber });
});
