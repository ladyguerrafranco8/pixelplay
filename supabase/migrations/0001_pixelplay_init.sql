-- ============================================================
-- PixelPlay — esquema inicial (pedidos + comprobantes de pago)
-- Aplicar con el MCP de Supabase de Lady:  apply_migration("pixelplay_init", <este archivo>)
-- Seguridad desde el día uno: RLS en TODA tabla, anon SIN acceso directo.
-- El único camino de escritura es la edge function `crear-pedido` (service role).
-- El admin (Lady) lee/actualiza vía Supabase Auth + RLS is_admin().
-- ============================================================

-- gen_random_uuid() / crypt() viven en pgcrypto
create extension if not exists pgcrypto;

-- ------------------------------------------------------------
-- Config de la app: guarda el EMAIL del admin (lo define Lady en el setup,
-- desde su .env.local — NUNCA va hardcodeado en el repo).
-- Bloqueada: anon/authenticated no la leen desde el cliente. is_admin() la lee
-- igual porque es SECURITY DEFINER.
-- ------------------------------------------------------------
create table if not exists public.app_config (
  id          smallint primary key default 1 check (id = 1),
  admin_email text
);
insert into public.app_config (id, admin_email) values (1, null)
  on conflict (id) do nothing;
alter table public.app_config enable row level security;
-- (sin policies a propósito: nadie lo lee desde el cliente)

-- ------------------------------------------------------------
-- Secuencia para el número de pedido legible (#1000, #1001, ...)
-- ------------------------------------------------------------
create sequence if not exists public.pixelplay_order_seq start 1000;

-- ------------------------------------------------------------
-- Tabla de pedidos
-- ------------------------------------------------------------
create table if not exists public.orders (
  id                 uuid primary key default gen_random_uuid(),
  order_number       bigint not null default nextval('public.pixelplay_order_seq'),
  created_at         timestamptz not null default now(),
  customer_name      text not null,
  customer_email     text not null,
  customer_whatsapp  text,
  payment_method     text,
  -- snapshot del carrito: [{ id, name, planType, planLabel, price }]
  items              jsonb not null default '[]'::jsonb,
  subtotal           numeric(12,2) not null default 0,
  discount           numeric(12,2) not null default 0,
  total              numeric(12,2) not null default 0,
  -- ruta dentro del bucket privado `comprobantes`
  screenshot_path    text,
  status             text not null default 'pendiente'
                       check (status in ('pendiente','pagado','entregado','cancelado')),
  admin_notes        text
);

create index if not exists orders_created_at_idx on public.orders (created_at desc);
create index if not exists orders_status_idx      on public.orders (status);

alter table public.orders enable row level security;

-- ------------------------------------------------------------
-- ¿El usuario autenticado es el admin (Lady)?
-- Defense in depth: no usamos USING(true). Solo pasa el email guardado en
-- app_config (que Lady setea en el setup). Antes del setup admin_email es null
-- => nadie es admin.
-- ------------------------------------------------------------
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(
    lower(auth.jwt() ->> 'email') = (
      select lower(admin_email) from public.app_config where id = 1
    ),
    false
  );
$$;

-- Políticas de la tabla orders:
--  · anon NO tiene ninguna policy => no puede SELECT/INSERT/UPDATE/DELETE.
--  · La edge function escribe con service_role (bypassa RLS).
--  · Lady (is_admin) puede leer, actualizar y borrar.
drop policy if exists orders_admin_select on public.orders;
create policy orders_admin_select on public.orders
  for select using (public.is_admin());

drop policy if exists orders_admin_update on public.orders;
create policy orders_admin_update on public.orders
  for update using (public.is_admin()) with check (public.is_admin());

drop policy if exists orders_admin_delete on public.orders;
create policy orders_admin_delete on public.orders
  for delete using (public.is_admin());

-- ------------------------------------------------------------
-- Storage: bucket PRIVADO para los comprobantes de pago
-- ------------------------------------------------------------
insert into storage.buckets (id, name, public)
values ('comprobantes', 'comprobantes', false)
on conflict (id) do nothing;

-- Solo Lady puede leer/firmar URLs de los comprobantes.
-- La edge function sube con service_role (bypassa RLS). anon: sin acceso.
drop policy if exists comprobantes_admin_read on storage.objects;
create policy comprobantes_admin_read on storage.objects
  for select using (bucket_id = 'comprobantes' and public.is_admin());

drop policy if exists comprobantes_admin_delete on storage.objects;
create policy comprobantes_admin_delete on storage.objects
  for delete using (bucket_id = 'comprobantes' and public.is_admin());

-- ============================================================
-- El usuario admin NO se crea acá (no queremos credenciales en el repo).
-- En el setup, Claude lee el .env.local de Lady (ADMIN_EMAIL + ADMIN_PASSWORD),
-- crea el usuario en Supabase Auth y guarda el email en app_config.
-- Ver LADY-NEXT-STEPS.md → "Crear el usuario admin".
-- ============================================================
