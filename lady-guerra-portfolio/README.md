# Lady Guerra — Portfolio

Sitio de portafolio (modeling book) de Lady Guerra. HTML/CSS/JS simple, sin build,
pensado para deployar en Vercel como proyecto independiente (dominio propio, separado
de la tienda PixelPlay que vive en la raíz de este repo).

## Estructura

```
index.html   # Hero + Book (Casual/Editorial/Comercial) + Contact
styles.css   # diseño editorial oscuro
script.js    # cambio de categoría del book + menú móvil
public/images/
  hero/hero-placeholder.svg
  casual/casual-1.svg … casual-6.svg
  editorial/editorial-1.svg … editorial-6.svg
  comercial/comercial-1.svg … comercial-6.svg
```

## Cómo reemplazar las fotos

Cada imagen SVG es un placeholder temporal. Para poner tus fotos reales **no hay que
tocar el código**: solo sube un `.jpg` con el mismo nombre en la misma carpeta y el
sitio lo usa automáticamente (si el `.jpg` no existe, sigue mostrando el placeholder).

- Hero: `public/images/hero/hero-placeholder.jpg`
- Casual: `public/images/casual/casual-1.jpg` … `casual-6.jpg`
- Editorial: `public/images/editorial/editorial-1.jpg` … `editorial-6.jpg`
- Comercial: `public/images/comercial/comercial-1.jpg` … `comercial-6.jpg`

Si quieres más o menos fotos por categoría, avísame y ajusto `script.js`
(la variable `CATEGORIES` al inicio del archivo).

**Specs recomendadas de las fotos:**
- Formato JPG, orientación vertical/retrato (relación 3:4 aprox.).
- Ancho mínimo 1200px (para que se vea nítido en pantallas grandes).
- Peso ideal por foto: menos de 500KB (comprimidas) para que cargue rápido en celular.
- La foto del hero puede ser horizontal o vertical; se recorta automáticamente para
  llenar la pantalla.

## Contacto (editar en `index.html`)

En la sección `#contact` hay 4 datos de ejemplo que hay que reemplazar por los reales:
Instagram, Pinterest, email y WhatsApp (busca `ladyguerra`, `booking@ladyguerra.com`
y `+57 300 000 0000`).

## Correr local

No necesita instalación. Basta con:

```bash
cd lady-guerra-portfolio
python -m http.server 3000
```

Y abrir `http://localhost:3000`.

## Deploy en Vercel

Este folder es un proyecto de Vercel independiente:

1. En Vercel → **Add New Project** → importar el repo `pixelplay`.
2. En **Root Directory** elegir `lady-guerra-portfolio`.
3. Framework Preset: **Other** (sitio estático, sin build command).
4. Deploy. Vercel asigna un dominio gratis tipo `lady-guerra-portfolio.vercel.app`;
   se puede renombrar a algo como `ladyguerra.vercel.app` (si está disponible) desde
   Project Settings → Domains.
