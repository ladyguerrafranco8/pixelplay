# PixelPlay — Handoff para terminar el setup (Lady)

> **Lady:** abrí Claude Code en la carpeta de este repo y escribile:
> _"Leé `LADY-NEXT-STEPS.md` y terminá de conectar Supabase, el panel y Resend."_
>
> Claude tiene tu **MCP de Supabase** conectado, así que va a hacer casi todo solo.
> Lo único 100% manual tuyo son **3 cositas** (marcadas con 🙋‍♀️ abajo).

---

## Qué ya está construido (no hay que tocar el código)

- **Tienda** (`index.html` + `app.jsx`): catálogo + carrito + checkout. En el checkout el
  cliente pone sus datos, ve la cuenta para pagar (Nequi/Banco/Daviplata) y **sube el
  comprobante de pago**.
- **Panel admin** (`/admin` → `admin.html` + `admin.jsx`): login + lista de pedidos,
  ver el comprobante, marcar **pagado / entregado / cancelado**.
- **Backend listo para aplicar**:
  - `supabase/migrations/0001_pixelplay_init.sql` — tabla `orders`, RLS, bucket privado
    `comprobantes`, función `is_admin()`, y el usuario admin de Lady.
  - `supabase/functions/crear-pedido/` — edge function que sube el comprobante, guarda el
    pedido y le manda el **email a Lady por Resend** (con el comprobante adjunto).
- **Seguridad**: `anon` NO puede leer ni escribir pedidos. Los pedidos se crean por la edge
  function (service role). El panel solo lo abre Lady (Supabase Auth + RLS `is_admin()`).

---

## 🙋‍♀️ Lo que SOLO Lady puede hacer (3 cosas, ~10 min)

1. **Crear cuenta en Resend y sacar la API key.**
   - Entrá a https://resend.com → registrate gratis.
   - Menú **API Keys** → **Create API Key** (permiso "Sending access").
   - Copiá la key (empieza con `re_...`). Guardala para el paso de secrets.
   - No hace falta verificar dominio: el remitente `onboarding@resend.dev` funciona para
     avisarte a vos misma. (Si querés mandar correos a clientes con tu dominio, eso se
     verifica después.)

2. **Poner 2 secrets en Supabase** (Dashboard → tu proyecto → **Edge Functions** →
   **Manage secrets** / **Secrets**):
   - `RESEND_API_KEY` = la key `re_...` del paso 1.
   - `NOTIFY_EMAIL` = tu correo (ahí te llegan los avisos de cada compra).
   - (Opcional) `EMAIL_FROM` = `PixelPlay <onboarding@resend.dev>` (ya es el default).

3. **Confirmarle a Claude** que esos 2 secrets ya están puestos, para que pruebe el envío.

Todo lo demás (abajo) lo hace **Claude** con tu MCP.

---

## 🤖 Instrucciones para Claude Code (ejecutar con el MCP de Supabase de Lady)

Hacé esto en orden. Si algo falla, pará y reportá el error exacto.

### 1. Identificar el proyecto y traer las claves públicas
- `list_projects` → elegir el proyecto de PixelPlay (preguntarle a Lady si hay dudas).
- `get_project_url` → guardar la URL.
- `get_publishable_keys` (o `get_anon_key`) → guardar la **anon/publishable key**.

### 2. Completar `config.js`
Editar `config.js` en el repo:
- `SUPABASE_URL` → la URL del paso 1.
- `SUPABASE_ANON_KEY` → la anon key del paso 1 (es pública, va segura en el cliente).
- `PAYMENT_METHODS` → **reemplazar por las cuentas reales de Lady**. Preguntale a Lady:
  número de **Nequi**, cuenta de **Bancolombia**, **Daviplata**, titular, etc. Borrar los
  métodos que no use.
- `WHATSAPP` → el número real de soporte de Lady.

### 3. Aplicar la migración (tabla + RLS + bucket + usuario admin)
- `apply_migration(name="pixelplay_init", query=<contenido de supabase/migrations/0001_pixelplay_init.sql>)`.
- Verificar con `list_tables` que existe `orders`, y con `get_advisors(type="security")` que
  RLS está activo y no hay políticas abiertas.
- **Si el bloque del usuario admin falla** (varía según versión de GoTrue): decirle a Lady
  que cree el usuario a mano en **Dashboard → Authentication → Users → Add user**:
  - Email: `ladyguerrafranco@pixelplay.local`
  - Password: `lady123`
  - **Auto Confirm User**: ✅ sí.

### 4. Deployar la edge function `crear-pedido`
- `deploy_edge_function`:
  - `name`: `crear-pedido`
  - **`verify_jwt`: `false`** (importante — la tienda la llama sin sesión).
  - `files`: incluir `supabase/functions/crear-pedido/index.ts`.
  - El archivo importa `../_shared/cors.ts`. Si el deploy por MCP no soporta el import
    relativo, **inlinear** el contenido de `_shared/cors.ts` dentro de `index.ts` (las
    `corsHeaders`) y deployar un solo archivo. No cambia la lógica.
- `SUPABASE_URL` y `SUPABASE_SERVICE_ROLE_KEY` ya los inyecta Supabase solo — no hay que setearlos.

### 5. Verificar el flujo de punta a punta
- Pedirle a Lady que confirme que ya puso `RESEND_API_KEY` + `NOTIFY_EMAIL` (los 3 pasos 🙋‍♀️).
- Probar la tienda: abrir el sitio, agregar un servicio, hacer checkout y subir una captura
  cualquiera. Debe salir "¡Comprobante recibido! Pedido #...".
- Confirmar que el pedido aparece con `execute_sql("select order_number, customer_name, status from orders order by created_at desc limit 5")`.
- Confirmar que a Lady le llegó el email con el comprobante adjunto.
- Abrir `/admin`, loguear con usuario **ladyguerrafranco** / clave **lady123**, ver el pedido,
  abrir el comprobante y marcarlo como **pagado**.

### 6. Deploy del frontend a Vercel (proyecto de Lady)
- Es un sitio estático (sin build). Commitear y pushear; si el repo está conectado a Vercel,
  deploya solo. Si no: `vercel --prod` desde la carpeta (Lady logueada en su Vercel).
- Verificar que `pixel-play.vercel.app/` carga la tienda y `pixel-play.vercel.app/admin` el panel.

---

## Credenciales y datos de referencia

| Qué | Valor |
|---|---|
| Login del panel — usuario | `ladyguerrafranco` |
| Login del panel — clave | `lady123` |
| Email interno del admin (Supabase Auth) | `ladyguerrafranco@pixelplay.local` |
| URL del panel | `/admin` |
| Bucket de comprobantes (privado) | `comprobantes` |
| Edge function | `crear-pedido` (verify_jwt = false) |
| Secrets a setear (manual) | `RESEND_API_KEY`, `NOTIFY_EMAIL` |

> Para cambiar la clave del panel después: Dashboard → Authentication → el usuario →
> Reset password. (O cambiá el email en `is_admin()` en la migración + en `config.js`
> `ADMIN_EMAIL_DOMAIN` si querés otro usuario.)

---

## Cómo funciona el dinero / los pedidos (para entender el panel)

- Estados de un pedido: **pendiente** → **pagado** → **entregado** (o **cancelado**).
- Cada compra entra como `pendiente`. Lady abre el comprobante, verifica que la plata llegó
  y marca **pagado**. Cuando ya le mandó la cuenta al cliente, marca **entregado**.
- El descuento por combo (2=10%, 3=15%, 4+=20%) se recalcula en el servidor; el comprobante
  es la prueba real de pago que Lady valida a ojo.
