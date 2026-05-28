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
-- Defense in depth: no usamos USING(true). Solo el email de Lady pasa.
-- ------------------------------------------------------------
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(
    lower(auth.jwt() ->> 'email') = 'ladyguerrafranco@pixelplay.local',
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
-- Usuario admin de Lady (Supabase Auth).
-- Email interno: ladyguerrafranco@pixelplay.local  ·  Clave: lady123
-- El login del panel acepta el usuario "ladyguerrafranco" y le agrega
-- el dominio @pixelplay.local automáticamente.
--
-- NOTA: si este bloque falla por diferencias de versión de GoTrue, crear
-- el usuario a mano en el Dashboard → Authentication → Add user
-- (email ladyguerrafranco@pixelplay.local, password lady123, Auto Confirm).
-- ============================================================
do $$
declare
  v_uid uuid;
begin
  select id into v_uid from auth.users
   where email = 'ladyguerrafranco@pixelplay.local';

  if v_uid is null then
    v_uid := gen_random_uuid();

    insert into auth.users (
      instance_id, id, aud, role, email, encrypted_password,
      email_confirmed_at, created_at, updated_at,
      raw_app_meta_data, raw_user_meta_data,
      confirmation_token, recovery_token, email_change_token_new, email_change
    ) values (
      '00000000-0000-0000-0000-000000000000',
      v_uid, 'authenticated', 'authenticated',
      'ladyguerrafranco@pixelplay.local',
      crypt('lady123', gen_salt('bf')),
      now(), now(), now(),
      '{"provider":"email","providers":["email"]}'::jsonb, '{}'::jsonb,
      '', '', '', ''
    );

    insert into auth.identities (
      id, user_id, identity_data, provider, provider_id,
      last_sign_in_at, created_at, updated_at
    ) values (
      gen_random_uuid(), v_uid,
      jsonb_build_object('sub', v_uid::text, 'email', 'ladyguerrafranco@pixelplay.local'),
      'email', v_uid::text,
      now(), now(), now()
    );
  end if;
end $$;
