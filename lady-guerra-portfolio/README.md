# Lady Guerra — Portfolio

Sitio de portafolio (modeling book) de Lady Guerra. HTML/CSS puro, sin build ni
dependencias — funciona en cualquier navegador, en cualquier dispositivo, sin
necesidad de ninguna cuenta ni app. Pensado para deployar en Vercel como
proyecto independiente (dominio propio, separado de la tienda PixelPlay que
vive en la raíz de este repo).

## Estructura

```
index.html   # Nombre + titular (Casual/Editorial/Comercial) + fotos + contacto
styles.css   # diseño editorial claro (tipografía Cormorant Garamond + Bodoni Moda)
public/images/book/
  01-black-coat.jpg
  02-porch-strawberry.jpg
  03-orange-sweater.jpg
  04-zebra-cube.jpg
  05-sunglasses-blue.jpg
```

## Cómo reemplazar o reordenar las fotos

Cada foto es un archivo numerado en `public/images/book/`. Para cambiar una
foto, sube el archivo nuevo con el mismo nombre. Para reordenarlas o agregar
más, edita las etiquetas `<img>` dentro de la sección `.gallery` en
`index.html` (el orden en el HTML es el orden en que se ven en la página).

**Specs recomendadas de las fotos:** JPG, orientación vertical, ancho mínimo
1000px, sin comprimir de más (mándalas como archivo/documento, no como "foto"
de WhatsApp, para no perder calidad).

## Contacto (editar en `index.html`)

El link de Instagram está en la sección `.contact` — busca `ladyguerraf` y
reemplázalo si cambia el usuario.

## Correr local

```bash
cd lady-guerra-portfolio
python -m http.server 3000
```

Y abrir `http://localhost:3000`.

## Deploy en Vercel

Este folder es un proyecto de Vercel independiente, con su propio dominio
`.vercel.app` gratis — no depende de ninguna cuenta ni app para que la gente
lo abra, solo del link:

1. En Vercel → **Add New Project** → importar el repo `pixelplay`.
2. En **Root Directory** elegir `lady-guerra-portfolio`.
3. Framework Preset: **Other** (sitio estático, sin build command).
4. Deploy. Vercel asigna un dominio gratis tipo `lady-guerra-portfolio.vercel.app`;
   se puede renombrar a algo como `ladyguerra.vercel.app` (si está disponible) desde
   Project Settings → Domains.
