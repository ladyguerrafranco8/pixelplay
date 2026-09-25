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

## Mundial 2026 — Partidos diarios

- El Mundial FIFA 2026 va del 11 de junio al 19 de julio de 2026. **Hay partidos todos los días sin excepción.**
- El objeto `WORLD_CUP_MATCHES` en `app.jsx` debe mantenerse siempre actualizado con los partidos correctos.
- Los horarios van en **hora Colombia (UTC-5)**. Para convertir desde ET (EDT, UTC-4) restar 1 hora.
- Cuando Lady avise que faltan partidos o hay horarios incorrectos: buscar el calendario real con WebSearch/WebFetch y actualizar `app.jsx` cubriendo al menos los próximos 7 días.
- **IMPORTANTE — revisar SIEMPRE al inicio de cualquier tarea en este repo:** comparar la fecha de hoy contra la última fecha cargada en `WORLD_CUP_MATCHES`. Si la fecha de hoy no tiene partidos cargados (o faltan días), buscar el calendario real y completarlo ANTES de hacer cualquier otra cosa, sin esperar a que Lady lo pida.
- Para partidos de fase de grupos: usar siempre los nombres reales de los equipos.
- Para fases de eliminación directa (octavos en adelante) cuyo cruce todavía no esté definido (depende de resultados pendientes): usar marcadores tipo `2° Grupo A` / `1° Grupo C` con bandera 🏆 en vez de inventar equipos — y volver a actualizar con los nombres reales tan pronto se conozcan los resultados de grupos.

## Nitrato — trabajo de marca de Lady (no es parte de la app de este repo)

Lady también es social media manager / directora creativa de **Nitrato** (@nitrato.co), marca de streetwear de Medellín, identidad rebelde/rockera/"parchada". Ese trabajo (piezas para Instagram/Meta Ads) se hace por chat, no vive en la app — pero como el entorno de la sesión se reinicia y borra `/tmp` y los uploads, este repo es el único lugar persistente para guardar sus assets de marca. Por eso quedan aquí:

- **Logo oficial**: `assets/brand/nitrato-logo-red.png` — wordmark script rojo, fondo transparente, alta resolución (873×470). Rojo de marca aprox `#B42429` / rgb(180,36,41) (tono real muestreado del archivo, no adivinar). Es el único logo válido — nunca recrearlo a mano con una fuente script parecida.
- Al montar el logo sobre una foto (ej. camiseta, empaque): que quede **integrado de verdad** — seguir la perspectiva/curvatura de la superficie, que la luz y sombra de la foto (parches de sol, pliegues de tela) se reflejen sobre el logo (no pegado plano tipo sticker), tamaño pequeño salvo que pida lo contrario.
- **Regla no negociable de calidad**: cero errores visibles de edición — nunca debe notarse un boceto por debajo, una textura que no combina con la foto original, ni ningún artefacto. Debe verse 100% profesional y natural; este es el trabajo real de Lady.
- Cada pieza debe ser moderna, estética y muy creativa (no genérica) — son piezas de portafolio hacia su meta de ser directora creativa.
- Sistema tipográfico Nitrato (máximo 2 fuentes por pieza): Bebas Neue (títulos de impacto/mayúsculas), Barlow Condensed Light itálica con tracking ancho (subtítulos/texto de campaña), Futura Bold (claims/CTAs en mayúsculas), DIN Condensed Bold (alterna streetwear), Bodoni 72/Didot (editorial).
- Si Lady comparte un nuevo asset de marca (logo, fuente, foto de producto) y pide guardarlo en memoria: copiarlo a `assets/brand/` (o `assets/` con subcarpeta clara) y documentarlo aquí mismo, luego commit + push.
