# Mujeres DIM — logo

Este logo **no es parte del proyecto PixelPlay** (la tienda de streaming). Vive en esta
carpeta solo porque la rama de trabajo se creó dentro de este repositorio; es un asset
para la página de contenido de fútbol "Mujeres DIM", dedicada al lado femenino del
Deportivo Independiente de Medellín.

## Archivos

- `mujeres-dim-logo.svg` — versión vectorial editable (colores, texto, tamaño).
- `mujeres-dim-logo.png` — versión rectangular en alta resolución, fondo transparente.
- `mujeres-dim-logo-avatar.png` — versión cuadrada 1600×1600, fondo transparente,
  con margen pensado para recorte circular (foto de perfil en redes sociales).
- `mujeres-dim-logo-avatar-fondo.png` — igual a la anterior pero con fondo crema sólido,
  por si alguna plataforma no soporta transparencia.

## Qué cambió respecto al logo anterior

Mismo diseño exacto (escudo con pico arriba, franja diagonal roja/azul, cinta "DIM",
"MUJERES" en arco dorado arriba y "2025" abajo) — redibujado como vector nítido y pulido
a nivel de acabado profesional:

- Texto perfectamente centrado (verificado a nivel de píxel) en el escudo y la cinta.
- Kerning ajustado para dar jerarquía: "DIM" domina (más grande, más peso, contorno
  oscuro nítido), "MUJERES" y "2025" quedan como elementos secundarios en dorado.
- Degradados sutiles (radiales en rojo/azul, bisel metálico en el borde) para dar
  volumen, en vez de colores planos.
- Textura fina tipo tela/bordado sobre el escudo y la cinta (muy sutil, no decorativa).
- Sombra suave general (el escudo "flota") y sombra propia bajo la cinta para que se
  vea superpuesta, más un relieve ligero en las letras de "DIM".
- Bordes vectoriales limpios, sin pixelación en ningún tamaño de exportación.

## Post-proceso aplicado a los PNG

Los tres archivos `.png` pasaron por un post-proceso de edición de imagen sobre los
píxeles exactos exportados (sin regenerar ni tocar el diseño/SVG):

- Ajuste de curvas de color / saturación sobre las áreas existentes.
- Sharpen (unsharp mask) sobre los bordes ya existentes.
- Overlay de una textura sutil de ruido de tela, blend mode "overlay", baja opacidad,
  aplicado sobre toda la imagen sin alterar ninguna forma ni la transparencia.

El `.svg` es la fuente vectorial y no lleva este post-proceso (no aplica a vectores).
