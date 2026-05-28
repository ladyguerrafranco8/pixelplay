/* ============================================================
   PixelPlay — configuración pública del cliente.
   Estas claves son PÚBLICAS (publishable / anon) — seguras en el navegador.
   La clave anon NO da acceso a los pedidos: RLS solo deja entrar al admin,
   y los pedidos se crean por la edge function `crear-pedido` (service role).

   👉 Al conectar el Supabase de Lady, reemplazar SUPABASE_URL y
      SUPABASE_ANON_KEY por los reales (Dashboard → Project Settings → API,
      o vía MCP get_project_url + get_publishable_keys).

   👉 Reemplazar los datos de PAYMENT_METHODS por las cuentas reales de Lady
      (Nequi, Bancolombia, etc.). Es lo que ve el cliente para pagar.
   ============================================================ */
window.PIXELPLAY_CONFIG = {
  // ---- Supabase (públicas) ----
  SUPABASE_URL: "https://TU-PROYECTO.supabase.co",
  SUPABASE_ANON_KEY: "TU_ANON_KEY_PUBLICA",

  // Login del panel /admin: Lady entra con el email que definió en su .env.local
  // (ADMIN_EMAIL) y su clave. Si escribe solo el usuario sin "@", se le agrega
  // este dominio por comodidad. La clave nunca está acá ni en el repo.
  ADMIN_EMAIL_DOMAIN: "pixelplay.local",

  // ---- Métodos de pago que ve el cliente al hacer checkout ----
  // El cliente transfiere a una de estas cuentas y sube el comprobante.
  PAYMENT_METHODS: [
    {
      id: "nequi",
      label: "Nequi",
      holder: "Lady Guerra",
      account: "300 000 0000",
      hint: "Enviá a este número desde tu app Nequi.",
    },
    {
      id: "bancolombia",
      label: "Bancolombia",
      holder: "Lady Guerra",
      account: "Ahorros 000-000000-00",
      hint: "Transferencia o consignación a esta cuenta de ahorros.",
    },
    {
      id: "daviplata",
      label: "Daviplata",
      holder: "Lady Guerra",
      account: "300 000 0000",
      hint: "Enviá a este número desde Daviplata.",
    },
  ],

  // WhatsApp de contacto/soporte (opcional, solo display).
  WHATSAPP: "+57 300 000 0000",
};
