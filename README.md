# PixelPlay

Tienda de cuentas de streaming (Netflix, Disney+, Max, Spotify, etc.) con **pago por
transferencia + comprobante**: el cliente arma su carrito, transfiere a la cuenta de la
tienda (Nequi / Bancolombia / Daviplata) y **sube la captura del pago**. Cada compra le
llega por email a la administradora y se gestiona desde un panel privado en `/admin`.

Sitio estático (React 18 + Babel vía CDN, **sin build**) desplegado en Vercel. El backend
es **Supabase** (DB + Storage + 1 edge function) y **Resend** para los emails.

## Estructura

```
index.html            # tienda (carga config.js + api.js + app.jsx)
app.jsx               # storefront: catálogo, carrito, checkout + subida de comprobante
admin.html / admin.jsx# panel /admin: login + pedidos + cambiar estado + ver comprobante
admin.css             # estilos del panel
styles.css            # estilos de la tienda (design tokens --*)
config.js             # claves públicas Supabase + métodos de pago (se completa al conectar)
api.js                # cliente Supabase, compresión de imagen, submitOrder()
tweaks-panel.jsx      # panel de tweaks (color/densidad) — del template original
vercel.json           # rutas: /admin → admin.html + passthrough de assets
supabase/
  migrations/0001_pixelplay_init.sql   # orders + RLS + bucket privado + is_admin() + admin user
  functions/crear-pedido/index.ts      # edge function: sube comprobante, guarda pedido, email Resend
LADY-NEXT-STEPS.md    # handoff: pasos para que Claude (en el PC de Lady) termine el setup
```

## Flujo de una compra

1. Cliente agrega servicios al carrito → **Pagar**.
2. Pone nombre, email, WhatsApp y elige por dónde paga.
3. Transfiere, sube la captura → la edge function `crear-pedido` guarda el pedido (service
   role) en `orders`, el comprobante en el bucket privado `comprobantes`, y emaila a Lady.
4. Lady abre `/admin`, verifica el comprobante y marca el pedido **pagado** / **entregado**.

## Seguridad (desde el día uno)

- RLS activo en `orders`: `anon` no lee ni escribe; solo `is_admin()` (Lady) hace SELECT/UPDATE.
- Bucket `comprobantes` **privado**: solo el admin genera URLs firmadas.
- Las escrituras pasan **solo** por la edge function con `service_role` (la key nunca toca el cliente).
- `config.js` solo lleva claves **públicas** (URL + anon). La `RESEND_API_KEY` vive como secret
  de la edge function, nunca en el repo.

## Cómo correrlo local

```bash
python -m http.server 3000     # luego abrir http://localhost:3000/index.html y /admin.html
```

Sin Supabase configurado, la tienda muestra todo pero el envío avisa "todavía no conectado".

## Conectar el backend

Ver **`LADY-NEXT-STEPS.md`**. Resumen: completar `config.js`, aplicar la migración, crear el
usuario admin y deployar la edge function (todo vía MCP de Supabase), y setear 2 secrets
(`RESEND_API_KEY`, `NOTIFY_EMAIL`) en el dashboard. El **usuario y clave del panel los define
Lady en `.env.local`** (no van al repo); Claude los usa en el setup para crear el usuario en
Supabase Auth.
