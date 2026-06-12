-- El email del cliente ahora es opcional (el WhatsApp es el contacto
-- principal para enviar los accesos), así que pasa a requerido.
alter table public.orders alter column customer_email drop not null;
alter table public.orders alter column customer_whatsapp set not null;
