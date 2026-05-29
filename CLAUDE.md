# PixelPlay — Reglas para Claude

## SEGURIDAD — OBLIGATORIO

**NUNCA poner claves, API keys, contraseñas, tokens ni credenciales en el chat de Claude.**

- Si Lady pega una clave en el chat → avisarle de inmediato para que la cambie directamente en Vercel, Supabase o donde corresponda.
- Las claves van SIEMPRE en: Vercel (Environment Variables), Supabase (Secrets / Edge Functions), o `.env.local` (local, nunca se sube al repo).
- El archivo `.env.local` está en `.gitignore` — nunca commitear ni mencionar su contenido en el chat.
- Las únicas claves que pueden ir en el código son las **públicas/anon** de Supabase (anon key, project URL) — son seguras en el navegador por diseño.

## Proyecto

- Repositorio: `ladyguerrafranco8/pixelplay`
- Rama de trabajo: `claude/pixelplay-vercel-deploy-fnXhi`
- URL producción: `pixels-plays.vercel.app`
- Siempre hacer commit + push + deploy a Vercel al terminar cambios.
