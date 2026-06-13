/* global React, ReactDOM, useTweaks, TweaksPanel, TweakSection, TweakColor, TweakRadio, TweakToggle */
const { useState, useEffect, useRef, useMemo } = React;

// ============================================================
// DATA
// ============================================================
const formatCOP = (n) => '$ ' + n.toLocaleString('es-CO');

const SERVICES = [
  {
    id: 'netflix',
    name: 'Netflix',
    tagline: 'Películas, series y originales',
    plans: [
      { type: 'Pantalla', label: '1 Pantalla · 4K', price: 16000, popular: false },
    ],
    color: '#E50914',
    logoSlug: 'netflix',
  },
  {
    id: 'disney',
    name: 'Disney+',
    tagline: 'Marvel, Star Wars, Pixar',
    plans: [
      { type: 'Con ESPN', label: 'Pantalla · Con ESPN', price: 15000, popular: true },
      { type: 'Sin ESPN', label: 'Pantalla · Sin ESPN', price: 12000, popular: false },
    ],
    color: '#1E3A8A',
    logoUrl: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnIHZpZXdCb3g9JzAgMCA2MCA2MCc+CiAgPHRleHQgeD0nMTknIHk9JzQ2JyB0ZXh0LWFuY2hvcj0nbWlkZGxlJyBmaWxsPSd3aGl0ZScgZm9udC1mYW1pbHk9J0FyaWFsIEJsYWNrLEFyaWFsLHNhbnMtc2VyaWYnIGZvbnQtd2VpZ2h0PSc5MDAnIGZvbnQtc2l6ZT0nNDgnPkQ8L3RleHQ+CiAgPHRleHQgeD0nNDgnIHk9JzQzJyB0ZXh0LWFuY2hvcj0nbWlkZGxlJyBmaWxsPScjNUJBNEZGJyBmb250LWZhbWlseT0nQXJpYWwgQmxhY2ssQXJpYWwsc2Fucy1zZXJpZicgZm9udC13ZWlnaHQ9JzkwMCcgZm9udC1zaXplPSczMic+KzwvdGV4dD4KPC9zdmc+Cg==',
  },
  {
    id: 'max',
    name: 'Max',
    tagline: 'HBO, Warner, DC Universe',
    plans: [
      { type: 'Pantalla', label: '1 Pantalla · 4K', price: 14000, popular: false },
    ],
    color: '#7C3AED',
    logoUrl: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnIHZpZXdCb3g9JzAgMCA2MCA2MCc+CiAgPHRleHQgeD0nMzAnIHk9JzQwJyB0ZXh0LWFuY2hvcj0nbWlkZGxlJyBmaWxsPSd3aGl0ZScgZm9udC1mYW1pbHk9J0FyaWFsIEJsYWNrLEltcGFjdCxzYW5zLXNlcmlmJyBmb250LXdlaWdodD0nOTAwJyBmb250LXNpemU9JzI4JyBsZXR0ZXItc3BhY2luZz0nLTEnPm1heDwvdGV4dD4KPC9zdmc+Cg==',
    logoScale: 0.8,
  },
  {
    id: 'prime',
    name: 'Prime Video',
    tagline: 'Originales y exclusivas',
    plans: [
      { type: 'Pantalla', label: '1 Pantalla · 4K', price: 14000, popular: false },
    ],
    color: '#0EA5E9',
    logoUrl: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnIHZpZXdCb3g9JzAgMCA2MCA2MCc+CiAgPHRleHQgeD0nMzAnIHk9JzM0JyB0ZXh0LWFuY2hvcj0nbWlkZGxlJyBmaWxsPSd3aGl0ZScgZm9udC1mYW1pbHk9J0FyaWFsIEJsYWNrLEFyaWFsLHNhbnMtc2VyaWYnIGZvbnQtd2VpZ2h0PSc5MDAnIGZvbnQtc2l6ZT0nMjInIGxldHRlci1zcGFjaW5nPSctMC41Jz5QcmltZTwvdGV4dD4KICA8cGF0aCBkPSdNMTIgNDYgUTMwIDQwIDQ4IDQ2JyBmaWxsPSdub25lJyBzdHJva2U9JyMwMEE4RTEnIHN0cm9rZS13aWR0aD0nMy41JyBzdHJva2UtbGluZWNhcD0ncm91bmQnLz4KPC9zdmc+Cg==',
  },
  {
    id: 'vix',
    name: 'VIX',
    tagline: 'Series y cine en español',
    plans: [
      { type: 'Pantalla', label: '1 Pantalla', price: 12000, popular: false },
    ],
    color: '#D20029',
    logoUrl: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnIHZpZXdCb3g9JzAgMCA2MCA2MCc+CiAgPHRleHQgeD0nMzAnIHk9JzQyJyB0ZXh0LWFuY2hvcj0nbWlkZGxlJyBmaWxsPSd3aGl0ZScgZm9udC1mYW1pbHk9J0FyaWFsIEJsYWNrLEltcGFjdCxzYW5zLXNlcmlmJyBmb250LXdlaWdodD0nOTAwJyBmb250LXNpemU9JzMwJyBsZXR0ZXItc3BhY2luZz0nLTInPlZJWDwvdGV4dD4KPC9zdmc+Cg==',
    logoScale: 0.8,
  },
  {
    id: 'paramount',
    name: 'Paramount+',
    tagline: 'Series y deportes en vivo',
    plans: [
      { type: 'Pantalla', label: '1 Pantalla · HD', price: 18000, popular: false },
    ],
    color: '#0064FF',
    logoUrl: 'data:image/svg+xml;base64,PHN2ZyBmaWxsPSIjZmZmZmZmIiByb2xlPSJpbWciIHZpZXdCb3g9IjAgMCAyNCAyNCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48dGl0bGU+UGFyYW1vdW50KzwvdGl0bGU+PHBhdGggZD0iTTE2LjM0NyAyMS4zNzNjLjA1Ny0uMDg0LjE1MS0uMzE0LS4wMjUtLjc0bC0uNTMtMS40MjhjLS4wNzMtLjE4Mi4wODQtLjI5My4xOS0uMTczIDAgMCAxLjAwNCAxLjE1NyAxLjI2NCAxLjY0bC40OTUuODIyYy40MjUuMDI4IDEuNi4wNiAyLjczMi4wNmEzLjI2IDMuMjYgMCAwIDEtLjMxNi0uMzY0Yy0xLjkzLTIuMzkyLTMuMTU0LTMuNzI0LTMuMTY2LTMuNzM3LS4zOTEtLjQyNi0uNTcyLS41MDgtLjg3LS42NDNhNC44MiA0LjgyIDAgMCAxLS4xMzgtLjA2NXYuMzY0YzAgLjA0Ny0uMDU3LjA3My0uMDg2LjAyMmwtMi44NDYtNS4wMDFhMS41OTggMS41OTggMCAwIDAtLjUwOC0uNTg3bC0uMjc3LS4xOTQtMS4zNTQgMy4xMjNjLjIxMiAwIC4zNTQuMjE2LjI3LjQwOWwtMS4yNSAyLjg5M2gxLjE0N2MuNDQzIDAgLjg4My4wODcgMS4yOTQuMjU1bC4zMDIuMTI1cy0uOTEzIDEuODc4LS45MTMgMi44NjdjMCAuMTgxLjAyOC4zNjIuMDc1LjUzNGgyLjEwNGwtLjA5Ni0uNTk1czEuMjY2LjI5NCAyLjUwMi40MTNNMTIgMi40MzdjLTYuNjI3IDAtMTIgNS4zNzMtMTIgMTIgMCAyLjY2OS44NzMgNS4xMzMgMi4zNDYgNy4xMjYuNTAzLS4yMTguNzgzLS41NDIuOTgzLS43OTFsMi4yMzQtMi44NThhLjQ2Ny40NjcgMCAwIDEgLjE3OS0uMTM4bC4zMzYtLjE0NiAzLjY3NC00LjY1OS41MzQtLjQxNyAxLjA5NC0xLjUyNGEuNDgyLjQ4MiAwIDAgMSAuMTAxLS4xMDJsLjQ3OC0uMzQ3YS4zNC4zNCAwIDAgMSAuMzk4LS4wMDRsLjU3OC40MDdjLjMwOC4yMTYuNTU3LjUwNC43MjYuODRsMi4zMjIgNC4wNzdjLjA1MS4wOS4wOS4xMjkuMTgyLjE3NC40NTQuMjI3LjczMi4yNjggMS4zMy45MTMuMjc3LjMwNCAxLjQ5NSAxLjY2NiAzLjIwMyAzLjc4NC4yMzYuMzE4LjUzOC41ODguOTYzLjc4M0ExMS45NDggMTEuOTQ4IDAgMCAwIDI0IDE0LjQzN2MwLTYuNjI3LTUuMzczLTEyLTEyLTEyTTMuMjM2IDE1LjFsLS43NzgtLjI1My0uNDguNjYydi0uODE4bC0uNzc4LS4yNTMuNzc4LS4yNTN2LS44MThsLjQ4LjY2Mi43NzgtLjI1My0uNDguNjYyWm0tLjE4NSAyLjY3Ni0uMjUyLjc3OC0uMjUzLS43NzhoLS44MThsLjY2MS0uNDgxLS4yNTMtLjc3Ny42NjMuNDguNjYtLjQ4LS4yNTIuNzc3LjY2Mi40ODFabS4xNTYtNi4xOTUuMjUzLjc3OC0uNjYxLS40OC0uNjYzLjQ4LjI1My0uNzc4LS42Ni0uNDhoLjgxN2wuMjUzLS43NzguMjUyLjc3N2guODE4Wm0xLjMxNC0xLjc2TDQuMDQgOS4xNmwtLjc3OC4yNTMuNDgtLjY2MS0uNDgtLjY2My43NzguMjU0LjQ4LS42NjJ2LjgxOGwuNzc4LjI1My0uNzc3LjI1MlptMi4wNDUtMi44NjItLjI1My43NzctLjI1Mi0uNzc3aC0uODE4bC42NjItLjQ4LS4yNTMtLjc3OC42NjEuNDguNjYxLS40OC0uMjUyLjc3Ny42NjIuNDhabTIuNTc3LTEuMzEzLS40OC42NjFWNS40OWwtLjc3OS0uMjU0Ljc3OC0uMjUzdi0uODE3bC40OC42Ni43OC0uMjUzLS40ODEuNjYzLjQ4LjY2em0zLjI2NS0uNzUuMjUzLjc3OC0uNjYxLS40OC0uNjYyLjQ4LjI1Mi0uNzc3LS42Ni0uNDgxaC44MThMMTIgMy42MzdsLjI1Mi43NzhoLjgxOHptMi45My41OTV2LjgxNmwtLjQ4MS0uNjYxLS43NzcuMjUyLjQ4LS42NjItLjQ4LS42NjIuNzc3LjI1My40OC0uNjZ2LjgxN2wuNzc5LjI1MnptNS40MjYgOC4yODUuNzc4LjI1My40OC0uNjYydi44MThsLjc3OC4yNTMtLjc3OC4yNTN2LjgxOGwtLjQ4LS42NjItLjc3OC4yNTMuNDgtLjY2MnptLTMuMDc3LTYuMDQtLjI1My0uNzc3aC0uODE4bC42NjItLjQ4LS4yNTMtLjc3OC42NjIuNDguNjYyLS40OC0uMjU0Ljc3OC42NjIuNDhoLS44MTh6bTEuNzkyIDIuMDg2di0uODE4bC0uNzc3LS4yNTIuNzc3LS4yNTNWNy42OGwuNDgxLjY2Mi43NzctLjI1NC0uNDguNjYzLjQ4LjY2LS43NzctLjI1MnptMS40NjkgMS4yNzguMjUzLS43NzcuMjU0Ljc3N2guODE2bC0uNjYuNDgxLjI1Mi43NzgtLjY2Mi0uNDgtLjY2MS40OC4yNTMtLjc3OC0uNjYyLS40OHptLjUwNiA2LjY3Ni0uMjUzLjc3OC0uMjUzLS43NzhoLS44MTdsLjY2Mi0uNDgxLS4yNTMtLjc3Ny42Ni40OC42NjMtLjQ4LS4yNTMuNzc3LjY2MS40ODF6bS0xMi4wOC0uNjE1Ljc2LTEuNTg4Yy4wMjQtLjA0OC0uMDMyLS4xMDgtLjA2Ny0uMDY3bC0uNjY0LjY2OGMtLjMxMy4zMjktLjg0NyAxLjI1LS45NSAxLjQyMWwtLjgwOCAxLjMzNWEuMTA5LjEwOSAwIDAgMSAuMS4xNjJsLS43MzkgMS4yMzhjLS4xOC4zMDkuMTQ1LjUyMy4xODkuNDUyIDEuMTU3LTEuODY4IDEuODMyLTEuNzE5IDEuODMyLTEuNzE5bC4zODctLjg5N2MuMDIyLS4wNDctLjAwMS0uMS0uMDUtLjEyLS4xMi0uMDUtLjMxNi0uMjcuMDEtLjg4NXoiLz48L3N2Zz4=',
  },
  {
    id: 'crunchyroll',
    name: 'Crunchyroll',
    tagline: 'Anime sin límites',
    plans: [
      { type: 'Pantalla', label: '1 Pantalla', price: 12000, popular: false },
    ],
    color: '#F47521',
    logoSlug: 'crunchyroll',
  },
  {
    id: 'plex',
    name: 'Plex',
    tagline: 'Streaming y media personal',
    plans: [
      { type: 'Pantalla', label: '1 Pantalla', price: 12000, popular: false },
    ],
    color: '#E5A00D',
    logoSlug: 'plex',
  },
  {
    id: 'spotify',
    name: 'Spotify',
    tagline: 'Música sin anuncios',
    plans: [
      { type: '1 Mes', label: '1 Mes', price: 13000, popular: false },
      { type: 'Renovable', label: '1 Mes Renovable', price: 14000, popular: true },
      { type: '6 Meses', label: '6 Meses', price: 45000, popular: false },
    ],
    color: '#1DB954',
    logoSlug: 'spotify',
  },
  {
    id: 'youtube',
    name: 'YouTube Premium',
    tagline: 'Sin anuncios + Music',
    plans: [
      { type: 'Mensual', label: '1 Mes', price: 12000, popular: false },
    ],
    color: '#FF0000',
    logoSlug: 'youtube',
  },
  {
    id: 'appletv',
    name: 'Apple TV+',
    tagline: 'Originales exclusivos de Apple',
    plans: [
      { type: '1 Mes', label: '1 Mes', price: 18000, popular: false },
      { type: '3 Meses', label: '3 Meses', price: 32000, popular: true },
    ],
    color: '#555555',
    logoSlug: 'appletv',
  },
  {
    id: 'canva',
    name: 'Canva Pro',
    tagline: 'Diseño profesional sin límites',
    plans: [
      { type: '1 Mes', label: '1 Mes', price: 12000, popular: false },
      { type: '3 Meses', label: '3 Meses', price: 20000, popular: false },
      { type: '6 Meses', label: '6 Meses', price: 30000, popular: true },
      { type: '12 Meses', label: '12 Meses', price: 45000, popular: false },
    ],
    color: '#7D2AE8',
    logoUrl: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnIHZpZXdCb3g9JzAgMCA2MCA2MCc+CiAgPGRlZnM+CiAgICA8bGluZWFyR3JhZGllbnQgaWQ9J2cnIHgxPScwJyB5MT0nMCcgeDI9JzEnIHkyPScxJz4KICAgICAgPHN0b3Agb2Zmc2V0PScwJScgc3RvcC1jb2xvcj0nIzAwQzRDQycvPgogICAgICA8c3RvcCBvZmZzZXQ9JzEwMCUnIHN0b3AtY29sb3I9JyM3RDJBRTgnLz4KICAgIDwvbGluZWFyR3JhZGllbnQ+CiAgPC9kZWZzPgogIDxyZWN0IHdpZHRoPSc2MCcgaGVpZ2h0PSc2MCcgZmlsbD0ndXJsKCNnKScvPgogIDx0ZXh0IHg9JzMwJyB5PSc0MicgdGV4dC1hbmNob3I9J21pZGRsZScgZmlsbD0nd2hpdGUnIGZvbnQtZmFtaWx5PSJQYWxhdGlubywnUGFsYXRpbm8gTGlub3R5cGUnLCdCb29rIEFudGlxdWEnLEdlb3JnaWEsc2VyaWYiIGZvbnQtc2l6ZT0nMzcnIGZvbnQtc3R5bGU9J2l0YWxpYycgZm9udC13ZWlnaHQ9JzYwMCc+QzwvdGV4dD4KPC9zdmc+Cg==',
    logoScale: 1.0,
  },
];

const TESTIMONIALS = [
  {
    name: 'Sandra Franco',
    handle: 'sandraf',
    text: 'Honestamente tenía mis dudas pero todo llegó por WhatsApp en minutos. Llevo 3 meses con Netflix sin un solo problema. Ya se lo conté a varias amigas.',
    rating: 5,
    avatar: 'SF',
  },
  {
    name: 'Janet Nieto',
    handle: 'janetn',
    text: 'Se me dañó la cuenta un domingo de noche y me la resolvieron rapidísimo. Pensé que iba a tocar esperar hasta el lunes. Muy buena atención.',
    rating: 5,
    avatar: 'JN',
  },
  {
    name: 'Diana Zapata',
    handle: 'dianaz',
    text: 'Tengo Disney+ y Spotify desde hace 4 meses y los dos funcionan perfecto. Uno se ahorra bastante comparado con pagar cada cosa por separado.',
    rating: 5,
    avatar: 'DZ',
  },
  {
    name: 'John Moreno',
    handle: 'johnm',
    text: 'El proceso es sencillo: pagas, te llega todo al WhatsApp y listo. Ya lo he renovado tres veces sin ningún inconveniente.',
    rating: 5,
    avatar: 'JM',
  },
  {
    name: 'Tatiana Lopera',
    handle: 'tatianal',
    text: 'Antes pagaba más caro en otra parte. Aquí me salió mucho más barato y llegó en minutos. Mi hermana también compró después de que se lo conté.',
    rating: 5,
    avatar: 'TL',
  },
  {
    name: 'Roberto Mendoza',
    handle: 'robertom',
    text: 'Llevo varios meses usando el servicio y no me ha fallado. Fácil de pagar, fácil de usar. No me cambio.',
    rating: 5,
    avatar: 'RM',
  },
];

const FAQ = [
  {
    q: '¿Son cuentas legales y seguras?',
    a: 'Sí. Trabajamos con licencias autorizadas y métodos de distribución verificados. Tus datos de pago están protegidos con cifrado bancario y nunca compartimos información con terceros.',
  },
  {
    q: '¿Cuánto tarda la entrega de mi cuenta?',
    a: 'La entrega es inmediata: entre 1 y 5 minutos después de confirmar tu pago. Recibes los accesos directamente por WhatsApp o correo electrónico, lo que prefieras.',
  },
  {
    q: '¿Qué pasa si mi cuenta deja de funcionar?',
    a: 'Tienes garantía durante toda la duración de tu plan. Si por cualquier motivo tu acceso falla, lo reemplazamos en menos de 1 hora sin costo adicional. Cero preguntas.',
  },
  {
    q: '¿Puedo cambiar de servicio durante mi suscripción?',
    a: 'Por supuesto. Desde tu panel de cliente puedes cambiar entre servicios disponibles, pausar tu plan o renovar con un clic. Sin permanencias.',
  },
  {
    q: '¿Qué métodos de pago aceptan?',
    a: 'Aceptamos tarjeta de crédito y débito (Visa, Mastercard, Amex), PayPal y transferencia bancaria.',
  },
  {
    q: '¿Puedo cambiar mi PIN o perfil?',
    a: 'En las cuentas compartidas, tienes asignado un perfil específico con tu propio PIN. Puedes personalizar tu perfil pero por respeto a otros usuarios no puedes modificar los datos principales de la cuenta.',
  },
  {
    q: '¿Hay descuento si compro varios servicios?',
    a: 'Sí. Al añadir 2 o más servicios al carrito obtienes un 10% de descuento sobre el total. El descuento se aplica automáticamente.',
  },
  {
    q: '¿Cómo funciona la renovación?',
    a: 'Te recordamos por WhatsApp 3 días antes del vencimiento. Puedes renovar manualmente o activar la renovación automática desde tu panel. Nunca te cobramos sin avisarte.',
  },
];

const WHY = [
  {
    icon: 'savings',
    color: '#10B981',
    title: 'Hasta 80% de ahorro',
    body: 'Pagás una fracción de lo que costaría cada servicio por separado. Sin letra chica, sin sorpresas en la factura.',
  },
  {
    icon: 'clock',
    color: '#FBBF24',
    title: 'Entrega en minutos',
    body: 'Tu cuenta llega directo a tu WhatsApp o correo en menos de 5 minutos tras confirmar el pago. Automatizado.',
  },
  {
    icon: 'shield2',
    color: '#60A5FA',
    title: 'Garantía total',
    body: 'Si tu cuenta falla durante el plan, la reemplazamos en menos de 1 hora. Sin trámites, sin excusas.',
  },
  {
    icon: 'headset',
    color: '#A78BFA',
    title: 'Soporte 24/7 real',
    body: 'Humanos respondiendo, no bots. Cualquier día, cualquier hora. Promedio de respuesta: 8 minutos.',
  },
  {
    icon: 'box',
    color: '#34D399',
    title: 'Stock siempre disponible',
    body: 'Inventario actualizado en tiempo real. Si lo ves disponible, lo tenés. Sin esperas.',
  },
  {
    icon: 'wallet',
    color: '#FB923C',
    title: 'Pago como tú quieras',
    body: 'Tarjeta, PayPal o transferencia. Adaptados a tu forma de pagar, no al revés.',
  },
];

const STEPS = [
  {
    n: '01',
    title: 'Elegí tu servicio',
    body: 'Elegí el plan que necesitás. Combiná servicios y ahorrá más.',
  },
  {
    n: '02',
    title: 'Pagá en segundos',
    body: 'Tarjeta, PayPal o transferencia. Sin crear cuenta.',
  },
  {
    n: '03',
    title: 'Recibí y disfrutá',
    body: 'Accesos en menos de 5 min por WhatsApp o correo.',
  },
];

// ============================================================
// ICONS
// ============================================================
const Icon = ({ name, size = 20 }) => {
  const stroke = 'currentColor';
  const sw = 1.6;
  const props = { width: size, height: size, viewBox: '0 0 24 24', fill: 'none', stroke, strokeWidth: sw, strokeLinecap: 'round', strokeLinejoin: 'round' };
  switch (name) {
    case 'cart': return <svg {...props}><path d="M3 4h2l2.4 12.2a2 2 0 002 1.6h8.7a2 2 0 002-1.6L21 8H6"/><circle cx="9" cy="21" r="1.2"/><circle cx="18" cy="21" r="1.2"/></svg>;
    case 'price': return <svg {...props}><path d="M20 12V7a2 2 0 00-2-2H7l-4 4v8a2 2 0 002 2h6"/><circle cx="9" cy="10" r="1.5"/><path d="M16 18l2 2 4-4"/></svg>;
    case 'bolt': return <svg {...props}><path d="M13 2L4 14h7l-1 8 9-12h-7l1-8z"/></svg>;
    case 'shield': return <svg {...props}><path d="M12 2l8 4v6c0 5-3.5 9-8 10-4.5-1-8-5-8-10V6l8-4z"/><path d="M9 12l2 2 4-4"/></svg>;
    case 'chat': return <svg {...props}><path d="M21 12a8 8 0 01-12.4 6.7L3 21l1.6-4.4A8 8 0 1121 12z"/></svg>;
    case 'check': return <svg {...props}><circle cx="12" cy="12" r="9"/><path d="M8 12l3 3 5-6"/></svg>;
    case 'card': return <svg {...props} strokeWidth={1.5}><rect x="2" y="5" width="20" height="14" rx="2.5"/><path d="M2 10h20" strokeWidth={2.5}/><rect x="5" y="13" width="5" height="2.5" rx="0.5" fill="currentColor" stroke="none"/><rect x="13" y="13" width="3" height="2.5" rx="0.5" fill="currentColor" stroke="none"/></svg>;
    case 'wa': return <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>;
    case 'arrow': return <svg {...props}><path d="M5 12h14M13 5l7 7-7 7"/></svg>;
    case 'plus': return <svg {...props}><path d="M12 5v14M5 12h14"/></svg>;
    case 'minus': return <svg {...props}><path d="M5 12h14"/></svg>;
    case 'close': return <svg {...props}><path d="M6 6l12 12M18 6L6 18"/></svg>;
    case 'star': return <svg {...props} fill="currentColor" stroke="none"><path d="M12 2l3 6.5 7 1-5 5 1.2 7-6.2-3.3L5.8 21 7 14l-5-5 7-1z"/></svg>;
    case 'lock': return <svg {...props}><rect x="4" y="11" width="16" height="10" rx="2"/><path d="M8 11V7a4 4 0 018 0v4"/></svg>;
    case 'menu': return <svg {...props}><path d="M3 6h18M3 12h18M3 18h18"/></svg>;
    case 'tg': return <svg {...props}><path d="M22 4L2 11l6 2 2 7 4-4 5 4 3-16z"/></svg>;
    case 'ig': return <svg {...props}><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="0.8" fill="currentColor"/></svg>;
    case 'mail': return <svg {...props}><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/></svg>;
    case 'savings': return <svg {...props} strokeWidth={1.5}><circle cx="12" cy="12" r="9"/><path d="M9 15l6-6"/><circle cx="9.5" cy="9.5" r="1.5" fill="currentColor" stroke="none"/><circle cx="14.5" cy="14.5" r="1.5" fill="currentColor" stroke="none"/></svg>;
    case 'rocket': return <svg {...props} strokeWidth={1.5}><path d="M12 2C7 7 6 12 8 17l-3 3 3-1 1 3 3-3c5 2 10 1 15-4-3-5-8-8-15-10z"/><path d="M9 15l-2 2"/><circle cx="14" cy="9" r="1.5" fill="currentColor" stroke="none"/></svg>;
    case 'shield2': return <svg {...props} strokeWidth={1.5}><path d="M12 2l8 4v6c0 5-3.5 9-8 10-4.5-1-8-5-8-10V6l8-4z" fill="currentColor" fillOpacity="0.15"/><path d="M12 2l8 4v6c0 5-3.5 9-8 10-4.5-1-8-5-8-10V6l8-4z"/><path d="M8.5 12l2.5 2.5 5-5"/></svg>;
    case 'headset': return <svg {...props} strokeWidth={1.5}><path d="M4 14.5V12a8 8 0 0116 0v2.5"/><rect x="2" y="13" width="4" height="6" rx="2"/><rect x="18" y="13" width="4" height="6" rx="2"/><path d="M20 19a4 4 0 01-4 4h-2"/></svg>;
    case 'pulse': return <svg {...props} strokeWidth={1.5}><polyline points="2,12 6,12 9,4 12,20 15,8 18,12 22,12"/></svg>;
    case 'box': return <svg {...props} strokeWidth={1.5}><path d="M2 7l10-5 10 5v10l-10 5L2 17V7z"/><path d="M12 2v20"/><path d="M2 7l10 5 10-5"/></svg>;
    case 'wallet': return <svg {...props} strokeWidth={1.5}><rect x="2" y="5" width="20" height="14" rx="2"/><path d="M16 2v6"/><path d="M8 2v6"/><path d="M2 10h20"/><circle cx="16.5" cy="15" r="1.5" fill="currentColor" stroke="none"/></svg>;
    case 'trophy': return <svg {...props} strokeWidth={1.5}><path d="M6 2h12v8a6 6 0 01-12 0V2z"/><path d="M6 6H3a2 2 0 000 4h3"/><path d="M18 6h3a2 2 0 010 4h-3"/><path d="M12 16v4"/><path d="M8 20h8"/></svg>;
    case 'soccer': return <svg {...props} strokeWidth={1.5}><circle cx="12" cy="12" r="9"/><path d="M12 3l3 5-3 3-3-3 3-5z" fill="currentColor" fillOpacity="0.3"/><path d="M12 21l-3-5 3-3 3 3-3 5z" fill="currentColor" fillOpacity="0.3"/><path d="M3.5 7.5L8 9l1 4-4-1.5-1.5-4z" fill="currentColor" fillOpacity="0.3"/><path d="M20.5 7.5L16 9l-1 4 4-1.5 1.5-4z" fill="currentColor" fillOpacity="0.3"/></svg>;
    case 'clock': return <svg {...props} strokeWidth={1.5}><circle cx="12" cy="13" r="8"/><path d="M12 9v4l2.5 2.5"/><path d="M10 2h4"/><path d="M12 2v2"/></svg>;
    case 'upload': return <svg {...props} strokeWidth={1.5}><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>;
    default: return null;
  }
};

// ============================================================
// SERVICE BADGE — logo real via Simple Icons CDN
// ============================================================
const ServiceBadge = ({ service, size = 64 }) => {
  const s = service;
  const logoSize = Math.round(size * (s.logoScale || 0.55));
  return (
    <div
      className="svc-badge"
      style={{
        width: size,
        height: size,
        background: `linear-gradient(135deg, ${s.color}, ${s.color}cc)`,
        boxShadow: `0 8px 24px -8px ${s.color}80, inset 0 1px 0 rgba(255,255,255,0.2)`,
      }}
    >
      <img
        src={s.logoUrl || `https://cdn.simpleicons.org/${s.logoSlug}/ffffff`}
        alt={s.name}
        width={logoSize}
        height={logoSize}
        style={{ objectFit: 'contain', filter: 'drop-shadow(0 1px 3px rgba(0,0,0,0.3))', ...(s.logoScale >= 1.0 ? { borderRadius: '12px', display: 'block' } : {}) }}
        onError={(e) => {
          e.target.style.display = 'none';
          e.target.nextSibling.style.display = 'flex';
        }}
      />
      <div className="svc-glyph-fallback" style={{ fontSize: size * 0.42, display: 'none' }}>
        {s.name[0]}
      </div>
    </div>
  );
};

// ============================================================
// NAV
// ============================================================
const Nav = ({ cartCount, onCartOpen, accent }) => {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  const links = [
    ['Catálogo', '#catalogo'],
    ['Por qué nosotros', '#porque'],
    ['Cómo funciona', '#como'],
    ['FAQ', '#faq'],
  ];
  return (
    <nav className={`nav ${scrolled ? 'nav-scrolled' : ''}`}>
      <div className="nav-inner">
        <a href="#top" className="logo">
          <span className="logo-mark" style={{ background: 'rgba(255,255,255,0.92)', boxShadow: '0 2px 10px rgba(255,255,255,0.15)' }} />
          <span className="logo-text">PixelPlay</span>
        </a>
        <div className="nav-links">
          {links.map(([label, href]) => (
            <a key={href} href={href} className="nav-link">{label}</a>
          ))}
        </div>
        <div className="nav-actions">
          <button className="btn-ghost cart-btn" onClick={onCartOpen}>
            <Icon name="cart" size={22} />
            <span className="cart-label">Carrito</span>
            {cartCount > 0 && <span className="cart-bubble" style={{ background: accent }}>{cartCount}</span>}
          </button>
          <a href="#catalogo" className="btn-primary" style={{ background: accent }}>
            Empezar
          </a>
        </div>
      </div>
    </nav>
  );
};

// ============================================================
// HERO
// ============================================================
const Hero = ({ accent }) => {
  return (
    <section className="hero" id="top">
      <div className="hero-glow" style={{ background: `radial-gradient(closest-side, ${accent}40, transparent)` }} />
      <div className="hero-glow hero-glow-2" />

      <div className="hero-inner">
        <div className="hero-eyebrow">
          <span className="dot" style={{ background: '#10B981' }} />
          <span>+7.480 clientes activos · stock disponible ahora</span>
        </div>

        <h1 className="hero-title">
          Todo el <span className="title-accent" style={{ color: accent }}>streaming</span>
          <br />a una fracción del precio.
        </h1>

        <div className="hero-services-strip">
          <div className="strip-label">DISPONIBLES AHORA</div>
          <div className="strip-badges">
            {SERVICES.slice(0, 8).map((s) => (
              <div className="strip-badge" key={s.id} title={s.name}>
                <ServiceBadge service={s} size={56} />
              </div>
            ))}
          </div>
        </div>

        <p className="hero-sub">
          Del carrito a <strong style={{ color: 'var(--text)' }}>Netflix</strong> en 5 minutos.
          Disney+, Max, Spotify y más — con garantía total y soporte 24/7.
        </p>

        <div className="hero-cta">
          <a href="#catalogo" className="btn-primary btn-lg" style={{ background: accent }}>
            Ver catálogo
            <Icon name="arrow" size={18} />
          </a>
          <a href="#como" className="btn-secondary btn-lg">
            ¿Cómo funciona?
          </a>
        </div>

        <div className="hero-trust">
          <div className="trust-item">
            <Icon name="lock" size={16} />
            <span>Pago seguro</span>
          </div>
          <div className="trust-divider" />
          <div className="trust-item">
            <Icon name="bolt" size={16} />
            <span>Entrega inmediata</span>
          </div>
          <div className="trust-divider" />
          <div className="trust-item">
            <Icon name="shield" size={16} />
            <span>Garantía total</span>
          </div>
        </div>
      </div>
    </section>
  );
};

// ============================================================
// CATALOG
// ============================================================
const ServiceCard = ({ service, onAdd, inCart, accent }) => {
  const [planIdx, setPlanIdx] = useState(service.plans.findIndex(p => p.popular) >= 0 ? service.plans.findIndex(p => p.popular) : 0);
  const [open, setOpen] = useState(false);
  const plan = service.plans[planIdx];

  return (
    <article className={`svc-card ${open ? 'svc-card--open' : ''}`}>
      <div className="svc-card-top" onClick={() => setOpen(o => !o)} style={{ cursor: 'pointer' }}>
        <ServiceBadge service={service} size={64} />
        <div className="svc-card-meta">
          <h3>{service.name}</h3>
          <p>{service.tagline}</p>
        </div>
        <div className="svc-card-chevron" style={{ color: accent }}>
          <Icon name="arrow" size={16} />
        </div>
      </div>

      {open && (
        <>
          <div className="svc-plans">
            {service.plans.map((p, i) => (
              <button
                key={i}
                className={`plan-pill ${planIdx === i ? 'active' : ''}`}
                onClick={e => { e.stopPropagation(); setPlanIdx(i); }}
                style={planIdx === i ? { borderColor: accent, color: '#fff' } : {}}
              >
                {p.type}
                {p.popular && <span className="popular-dot" style={{ background: accent }} />}
              </button>
            ))}
          </div>

          <div className="svc-plan-label">{plan.label}</div>

          <div className="svc-card-bottom">
            <div className="svc-price">
              <span className="svc-price-num">{formatCOP(plan.price)}</span>
              <span className="svc-price-per">/mes</span>
            </div>
            <button
              className={`btn-buy ${inCart ? 'in-cart' : ''}`}
              onClick={e => { e.stopPropagation(); onAdd(service, plan); }}
              style={!inCart ? { background: accent } : {}}
            >
              {inCart ? <><Icon name="check" size={16} /> Agregado</> : <>Agregar <Icon name="plus" size={16} /></>}
            </button>
          </div>
        </>
      )}
    </article>
  );
};

const Catalog = ({ onAdd, cart, accent }) => {
  const [filter, setFilter] = useState('all');
  const filtered = useMemo(() => {
    if (filter === 'all') return SERVICES;
    if (filter === 'video') return SERVICES.filter(s => ['netflix','disney','max','prime','paramount','crunchyroll'].includes(s.id));
    if (filter === 'music') return SERVICES.filter(s => ['spotify','youtube'].includes(s.id));
    return SERVICES;
  }, [filter]);

  return (
    <section className="catalog" id="catalogo">
      <div className="section-head">
        <span className="section-eyebrow">CATÁLOGO</span>
      </div>

      <div className="catalog-filters">
        {[['all','Todos'],['video','Entretenimiento'],['music','Música']].map(([k, l]) => (
          <button
            key={k}
            className={`filter-chip ${filter === k ? 'active' : ''}`}
            onClick={() => setFilter(k)}
            style={filter === k ? { background: accent, borderColor: accent } : {}}
          >
            {l}
          </button>
        ))}
        <div className="catalog-bundle-tip">
          <Icon name="bolt" size={14} /> Combiná 2 o más servicios y obtené <strong>10% off</strong>
        </div>
      </div>

      <div className="svc-grid">
        {filtered.map((s) => (
          <ServiceCard
            key={s.id}
            service={s}
            onAdd={onAdd}
            inCart={cart.some(c => c.id === s.id)}
            accent={accent}
          />
        ))}
      </div>
    </section>
  );
};

// ============================================================
// WHY
// ============================================================
const Why = ({ accent }) => (
  <section className="why" id="porque">
    <div className="section-head">
      <h2 className="section-title">Precio justo,<br/>servicio <em>premium</em>.</h2>
    </div>
    <div className="why-grid">
      {WHY.map((w, i) => (
        <div key={i} className="why-card" style={{ '--why-color': w.color }}>
          <div className="why-icon" style={{ color: w.color }}>
            <Icon name={w.icon} size={28} />
          </div>
          <h3>{w.title}</h3>
          <p>{w.body}</p>
        </div>
      ))}
    </div>
  </section>
);

// ============================================================
// WORLD CUP MATCH SCHEDULE (Colombia local time)
// ============================================================
const WORLD_CUP_MATCHES = {
  '2026-06-11': [
    { home: 'México', homeFlag: '🇲🇽', away: 'Sudáfrica', awayFlag: '🇿🇦', time: '1:00 p.m.' },
    { home: 'Corea del Sur', homeFlag: '🇰🇷', away: 'Chequia', awayFlag: '🇨🇿', time: '7:00 p.m.' },
  ],
  '2026-06-12': [
    { home: 'Canadá', homeFlag: '🇨🇦', away: 'Bosnia y Herzegovina', awayFlag: '🇧🇦', time: '2:00 p.m.' },
    { home: 'Estados Unidos', homeFlag: '🇺🇸', away: 'Paraguay', awayFlag: '🇵🇾', time: '8:00 p.m.' },
  ],
  '2026-06-13': [
    { home: 'Qatar', homeFlag: '🇶🇦', away: 'Suiza', awayFlag: '🇨🇭', time: '2:00 p.m.' },
    { home: 'Brasil', homeFlag: '🇧🇷', away: 'Marruecos', awayFlag: '🇲🇦', time: '5:00 p.m.' },
    { home: 'Haití', homeFlag: '🇭🇹', away: 'Escocia', awayFlag: '🏴󠁧󠁢󠁳󠁣󠁴󠁿', time: '8:00 p.m.' },
    { home: 'Australia', homeFlag: '🇦🇺', away: 'Turquía', awayFlag: '🇹🇷', time: '11:00 p.m.' },
  ],
  '2026-06-14': [
    { home: 'Alemania', homeFlag: '🇩🇪', away: 'Curazao', awayFlag: '🇨🇼', time: '12:00 m.' },
    { home: 'Países Bajos', homeFlag: '🇳🇱', away: 'Japón', awayFlag: '🇯🇵', time: '3:00 p.m.' },
    { home: 'Costa de Marfil', homeFlag: '🇨🇮', away: 'Ecuador', awayFlag: '🇪🇨', time: '6:00 p.m.' },
    { home: 'Suecia', homeFlag: '🇸🇪', away: 'Túnez', awayFlag: '🇹🇳', time: '9:00 p.m.' },
  ],
  '2026-06-15': [
    { home: 'España', homeFlag: '🇪🇸', away: 'Cabo Verde', awayFlag: '🇨🇻', time: '12:00 m.' },
    { home: 'Bélgica', homeFlag: '🇧🇪', away: 'Egipto', awayFlag: '🇪🇬', time: '5:00 p.m.' },
    { home: 'Arabia Saudita', homeFlag: '🇸🇦', away: 'Uruguay', awayFlag: '🇺🇾', time: '5:00 p.m.' },
    { home: 'Irán', homeFlag: '🇮🇷', away: 'Nueva Zelanda', awayFlag: '🇳🇿', time: '8:00 p.m.' },
  ],
};

// ============================================================
// WORLD CUP BANNER
// ============================================================
const WorldCupBanner = ({ onAdd, cart }) => {
  const todayKey = new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Bogota', year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date());
  const todayMatches = WORLD_CUP_MATCHES[todayKey] || [];

  const paramount = SERVICES.find(s => s.id === 'paramount');
  const promoPrice = 35000;
  const regularPrice = 18000 * 3;
  const savings = regularPrice - promoPrice;
  const promoService = { ...paramount, id: 'paramount-promo' };
  const inCart = cart.some(c => c.id === 'paramount-promo');
  const promoPlan = { type: 'promo-mundial', label: '3 meses · Promo Mundial', price: promoPrice };

  return (
    <section className="wc-banner">
      <div className="wc-glow" />
      <div className="wc-glow-red" />
      <div className="wc-inner">
        <div className="wc-left">
          <div className="wc-eyebrow">
            PROMO MUNDIAL 2026
          </div>
          <h2 className="wc-title">
            El fútbol más grande<br/>
            <span className="wc-title-em">del planeta viene.</span>
          </h2>
          <p className="wc-sub">Paramount+ te trae toda la acción del Mundial. Asegurá 3 meses al mejor precio antes de que arranque el torneo.</p>

          <div className="wc-promo-card">
            <div className="wc-promo-top">
              <ServiceBadge service={paramount} size={62} />
              <div className="wc-promo-name-wrap">
                <div className="wc-promo-name">Paramount<span className="wc-promo-espn">+</span></div>
                <div className="wc-promo-tag">Todos los partidos del Mundial</div>
              </div>
            </div>
            <div className="wc-promo-pricing">
              <span className="wc-promo-old">{formatCOP(regularPrice)}</span>
              <span className="wc-promo-arrow">→</span>
              <span className="wc-promo-new">{formatCOP(promoPrice)}</span>
            </div>
            <div className="wc-promo-badges">
              <div className="wc-promo-period">3 meses</div>
              <div className="wc-promo-savings">Ahorrás {formatCOP(savings)}</div>
            </div>
            <button
              className={`wc-btn-promo ${inCart ? 'wc-btn-in' : ''}`}
              onClick={() => !inCart && onAdd(promoService, promoPlan)}
              disabled={inCart}
            >
              {inCart ? '✓ Agregado' : '+ Agregar'}
            </button>
          </div>
        </div>
        <div className="wc-right">
          <div className="wc-live-tag"><span className="wc-live-dot" />EL MUNDIAL YA ESTÁ AQUÍ</div>
          {todayMatches.length > 0 ? (
            <>
              <div className="wc-countdown-label">Partidos de hoy</div>
              <div className="wc-matches">
                {todayMatches.map((m, i) => (
                  <div className="wc-match" key={i}>
                    <span className="wc-match-team wc-match-home">
                      <span className="wc-match-name">{m.home}</span>
                      <span className="wc-match-flag">{m.homeFlag}</span>
                    </span>
                    <span className="wc-match-vs">vs</span>
                    <span className="wc-match-team wc-match-away">
                      <span className="wc-match-flag">{m.awayFlag}</span>
                      <span className="wc-match-name">{m.away}</span>
                    </span>
                    <span className="wc-match-time">{m.time}</span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="wc-countdown-label">Hoy no hay partidos, pero el torneo sigue</div>
          )}
          <div className="wc-badge">🏆 FIFA World Cup 2026™</div>
        </div>
      </div>
    </section>
  );
};

// ============================================================
// HOW
// ============================================================
const STEP_COLORS = ['#8B5CF6', '#F59E0B', '#10B981'];
const STEP_ICONS = ['cart', 'card', 'check'];

const How = ({ accent }) => (
  <section className="how" id="como">
    <div className="section-head">
      <span className="section-eyebrow">CÓMO FUNCIONA</span>
    </div>
    <div className="how-grid">
      {STEPS.map((s, i) => (
        <div key={i} className="how-card" style={{ '--step-color': STEP_COLORS[i] }}>
          <div className="how-num-badge">
            <div className="how-num-inner">
              <span className="how-num">{i + 1}</span>
            </div>
          </div>
          <h3>{s.title}</h3>
          <p>{s.body}</p>
          {i < STEPS.length - 1 && (
            <div className="how-arrow">
              <Icon name="arrow" size={18} />
            </div>
          )}
        </div>
      ))}
    </div>
  </section>
);

// ============================================================
// TESTIMONIALS
// ============================================================
const Testimonials = ({ accent }) => (
  <section className="testimonials">
    <div className="section-head">
      <span className="section-eyebrow">TESTIMONIOS</span>
      <h2 className="section-title">+7.000 clientes <em>que repiten</em>.</h2>
      <div className="rating-summary">
        <div className="stars" style={{ color: '#FBBF24' }}>
          {[...Array(5)].map((_, i) => <Icon key={i} name="star" size={18} />)}
        </div>
        <span className="rating-num">4.9 / 5</span>
        <span className="rating-meta">basado en 3.214 reseñas</span>
      </div>
    </div>
    <div className="testi-marquee">
      <div className="testi-track">
        {[...TESTIMONIALS, ...TESTIMONIALS].map((t, i) => (
          <div key={i} className="testi-card">
            <div className="testi-stars" style={{ color: '#FBBF24' }}>
              {[...Array(t.rating)].map((_, j) => <Icon key={j} name="star" size={13} />)}
            </div>
            <p className="testi-text">{t.text}</p>
            <div className="testi-author">
              <div className="testi-avatar" style={{ background: `linear-gradient(135deg, ${accent}, #3b82f6)` }}>{t.avatar}</div>
              <div>
                <div className="testi-name">{t.name}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

// ============================================================
// FAQ
// ============================================================
const Faq = ({ accent }) => {
  const [open, setOpen] = useState(0);
  return (
    <section className="faq" id="faq">
      <div className="section-head">
        <span className="section-eyebrow">PREGUNTAS FRECUENTES</span>
        <h2 className="section-title">Resolvemos tus dudas <em>antes</em><br/>de que las tengas.</h2>
      </div>
      <div className="faq-list">
        {FAQ.map((f, i) => (
          <button
            key={i}
            className={`faq-item ${open === i ? 'open' : ''}`}
            onClick={() => setOpen(open === i ? -1 : i)}
            style={open === i ? { borderColor: `${accent}50` } : {}}
          >
            <div className="faq-q">
              <span>{f.q}</span>
              <span className="faq-toggle" style={open === i ? { background: accent, color: '#fff', borderColor: accent } : {}}>
                <Icon name={open === i ? 'minus' : 'plus'} size={16} />
              </span>
            </div>
            <div className="faq-a-wrap">
              <div className="faq-a">{f.a}</div>
            </div>
          </button>
        ))}
      </div>
    </section>
  );
};

// ============================================================
// CTA + FOOTER
// ============================================================
const FinalCta = ({ accent }) => (
  <section className="final-cta">
    <div className="final-cta-inner" style={{ background: `linear-gradient(135deg, ${accent}25, #3b82f615)`, borderColor: `${accent}40` }}>
      <h2>¿Listo para dejar de pagar de más?</h2>
      <p>Activá tu primer servicio hoy. Si no te convence, te devolvemos cada peso en las primeras 24 horas.</p>
      <div className="final-cta-actions">
        <a href="#catalogo" className="btn-primary btn-lg" style={{ background: accent }}>
          Ver catálogo <Icon name="arrow" size={18} />
        </a>
        <a href="#" className="btn-wa">
          <Icon name="wa" size={18} /> Hablar por WhatsApp
        </a>
      </div>
    </div>
  </section>
);

const Footer = ({ accent }) => (
  <footer className="footer">
    <div className="footer-inner">
      <div className="footer-brand">
        <a href="#top" className="logo">
          <span className="logo-mark" style={{ background: 'rgba(255,255,255,0.92)', boxShadow: '0 2px 10px rgba(255,255,255,0.15)' }} />
          <span className="logo-text">PixelPlay</span>
        </a>
        <p>Streaming premium accesible.<br/>Soporte 24/7, garantía real.</p>
        <div className="footer-badge-exp">Más de 8 años de experiencia</div>
        <div className="footer-socials">
          <a href="#" className="social-btn"><Icon name="wa" size={18} /></a>
          <a href="#" className="social-btn"><Icon name="ig" size={18} /></a>
          <a href="#" className="social-btn"><Icon name="tg" size={18} /></a>
          <a href="#" className="social-btn"><Icon name="mail" size={18} /></a>
        </div>
      </div>
      <div className="footer-col">
        <h4>Producto</h4>
        <a href="#catalogo">Catálogo</a>
        <a href="#porque">Por qué nosotros</a>
        <a href="#como">Cómo funciona</a>
        <a href="#faq">FAQ</a>
      </div>
      <div className="footer-col">
        <h4>Soporte</h4>
        <a href="#">Centro de ayuda</a>
        <a href="#">Garantía y reembolsos</a>
        <a href="#">Estado del servicio</a>
        <a href="#">Reportar problema</a>
      </div>
      <div className="footer-col">
        <h4>Contacto</h4>
        <a href="#"><Icon name="wa" size={14} /> +1 (555) 010-2024</a>
        <a href="#"><Icon name="mail" size={14} /> hola@pixelplay.shop</a>
        <a href="#"><Icon name="tg" size={14} /> @pixelplay_oficial</a>
        <a href="#"><Icon name="ig" size={14} /> @pixelplay.shop</a>
      </div>
    </div>
    <div className="footer-bottom">
      <div>© 2026 PixelPlay. Todos los derechos reservados.</div>
      <div className="footer-legal">
        <a href="#">Términos</a>
        <a href="#">Privacidad</a>
        <a href="#">Cookies</a>
      </div>
    </div>
  </footer>
);

// ============================================================
// CART DRAWER
// ============================================================
const CartDrawer = ({ open, onClose, cart, setCart, accent, onCheckout }) => {
  const subtotal = cart.reduce((sum, c) => sum + c.plan.price, 0);
  const discountRate = cart.length >= 2 ? 0.10 : 0;
  const discount = subtotal * discountRate;
  const total = subtotal - discount;

  return (
    <>
      <div className={`drawer-backdrop ${open ? 'open' : ''}`} onClick={onClose} />
      <aside className={`drawer ${open ? 'open' : ''}`}>
        <div className="drawer-head">
          <div>
            <div className="drawer-title">Tu carrito</div>
            <div className="drawer-sub">{cart.length} {cart.length === 1 ? 'servicio' : 'servicios'}</div>
          </div>
          <button className="icon-btn" onClick={onClose}><Icon name="close" size={20} /></button>
        </div>

        <div className="drawer-body">
          {cart.length === 0 ? (
            <div className="cart-empty">
              <div className="cart-empty-icon"><Icon name="cart" size={28} /></div>
              <h3>Tu carrito está vacío</h3>
              <p>Explorá el catálogo y empezá a armar tu combo.</p>
              <button className="btn-primary" style={{ background: accent }} onClick={onClose}>Ver catálogo</button>
            </div>
          ) : (
            <div className="cart-items">
              {cart.map((c, i) => (
                <div key={i} className="cart-item">
                  <ServiceBadge service={c} size={48} />
                  <div className="cart-item-meta">
                    <div className="cart-item-name">{c.name}</div>
                    <div className="cart-item-plan">{c.plan.label}</div>
                  </div>
                  <div className="cart-item-right">
                    <div className="cart-item-price">${c.plan.price.toFixed(2)}</div>
                    <button className="cart-remove" onClick={() => setCart(cart.filter((_, j) => j !== i))}>
                      <Icon name="close" size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {cart.length > 0 && (
          <div className="drawer-foot">
            <div className="totals">
              <div className="total-row">
                <span>Subtotal</span>
                <span>{formatCOP(subtotal)}</span>
              </div>
              {discountRate > 0 && (
                <div className="total-row discount">
                  <span>Descuento combo ({(discountRate * 100).toFixed(0)}%)</span>
                  <span>-{formatCOP(Math.round(discount))}</span>
                </div>
              )}
              <div className="total-row total-final">
                <span>Total mensual</span>
                <span>{formatCOP(Math.round(total))}</span>
              </div>
            </div>
            <button className="btn-primary btn-lg btn-block" style={{ background: accent }} onClick={onCheckout}>
              <Icon name="lock" size={16} /> Pagar ahora · {formatCOP(Math.round(total))}
            </button>
            <div className="drawer-trust">
              <Icon name="shield" size={13} /> Pago cifrado · Entrega en minutos · Garantía total
            </div>
          </div>
        )}
      </aside>
    </>
  );
};

// ============================================================
// IMAGE COMPRESSION — resize comprobante before upload so large
// camera photos don't fail on slow mobile connections.
// ============================================================
const compressImage = (file, maxDim = 1280, quality = 0.75) => new Promise((resolve, reject) => {
  const reader = new FileReader();
  reader.onerror = reject;
  reader.onload = (e) => {
    const img = new Image();
    img.onerror = reject;
    img.onload = () => {
      let { width, height } = img;
      if (width > maxDim || height > maxDim) {
        if (width > height) { height = Math.round(height * maxDim / width); width = maxDim; }
        else { width = Math.round(width * maxDim / height); height = maxDim; }
      }
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      canvas.getContext('2d').drawImage(img, 0, 0, width, height);
      resolve(canvas.toDataURL('image/jpeg', quality));
    };
    img.src = e.target.result;
  };
  reader.readAsDataURL(file);
});

// ============================================================
// CHECKOUT MODAL
// ============================================================
const CheckoutModal = ({ open, onClose, cart, setCart, total, accent }) => {
  const [step, setStep] = useState('form');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [file, setFile] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [orderNum, setOrderNum] = useState(null);
  const openedAtRef = useRef(null);

  React.useEffect(() => {
    if (open) {
      openedAtRef.current = Date.now();
      setStep('form');
      setName(''); setEmail(''); setWhatsapp('');
      setFile(null); setErrorMsg(''); setOrderNum(null);
    }
  }, [open]);

  if (!open) return null;

  const cfg = window.PIXELPLAY_CONFIG || {};
  const payMethod = (cfg.PAYMENT_METHODS || [])[0];

  const handleSubmit = async () => {
    if (!name.trim()) { setErrorMsg('Por favor ingresá tu nombre.'); return; }
    if (!whatsapp.trim()) { setErrorMsg('Por favor ingresá tu número de WhatsApp.'); return; }
    if (!file) { setErrorMsg('Subí el comprobante de pago para continuar.'); return; }
    setStep('submitting');
    setErrorMsg('');
    try {
      const base64 = await compressImage(file);
      const res = await fetch(`${cfg.SUPABASE_URL}/functions/v1/crear-pedido`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'apikey': cfg.SUPABASE_ANON_KEY },
        body: JSON.stringify({
          customer: { name: name.trim(), email: email.trim(), whatsapp: whatsapp.trim() },
          paymentMethod: payMethod?.id || 'bancolombia',
          items: cart.map(c => ({
            id: c.id, name: c.name,
            planType: c.plan.type, planLabel: c.plan.label,
            price: c.plan.price
          })),
          screenshot: { base64, ext: 'jpg', contentType: 'image/jpeg' }
        })
      });
      const data = await res.json();
      if (data.ok) {
        setOrderNum(data.order_number);
        setCart([]);
        setStep('success');
      } else {
        setErrorMsg(data.message || 'Error al procesar el pedido.');
        setStep('form');
      }
    } catch {
      setErrorMsg('Error de conexión. Verificá tu internet e intentá de nuevo.');
      setStep('form');
    }
  };

  if (step === 'submitting') return (
    <div className="modal-backdrop">
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="checkout-success">
          <div className="success-ring" style={{ borderColor: accent, opacity: 0.7 }}>
            <Icon name="lock" size={32} />
          </div>
          <h3>Procesando tu pedido…</h3>
          <p>Esto tarda unos segundos.</p>
        </div>
      </div>
    </div>
  );

  if (step === 'success') return (
    <div className="modal-backdrop">
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="checkout-success">
          <div className="success-ring" style={{ borderColor: accent }}>
            <Icon name="check" size={36} />
          </div>
          <h3>¡Pedido recibido!</h3>
          {orderNum && <p className="order-number-badge" style={{ color: accent }}>Pedido #{orderNum}</p>}
          <p>Revisaremos tu comprobante y te enviamos los accesos por WhatsApp en los próximos minutos.</p>
          <button className="btn-primary" style={{ background: accent }} onClick={onClose}>Listo</button>
        </div>
      </div>
    </div>
  );

  const handleBackdropClick = () => {
    if (Date.now() - (openedAtRef.current || 0) < 500) return;
    onClose();
  };

  return (
    <div className="modal-backdrop" onClick={handleBackdropClick}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-head">
          <div className="modal-title">Finalizar pedido</div>
          <button className="icon-btn" onClick={onClose}><Icon name="close" size={18} /></button>
        </div>
        <div className="modal-body">
          <div className="pay-fields">
            <label>Nombre completo
              <input type="text" placeholder="Tu nombre" value={name} onChange={e => setName(e.target.value)} />
            </label>
            <label>WhatsApp <span className="field-required-tag">te enviamos los accesos aquí</span>
              <input type="tel" placeholder="+57 300 000 0000" value={whatsapp} onChange={e => setWhatsapp(e.target.value)} />
            </label>
            <label>Email <span className="field-optional-tag">opcional</span>
              <input type="email" placeholder="tu@email.com" value={email} onChange={e => setEmail(e.target.value)} />
            </label>
          </div>

          {payMethod && (
            <div className="pay-transfer-info">
              <div className="pay-transfer-title">Transferí el pago a:</div>
              <div className="pay-transfer-row">
                <span className="pay-transfer-bank">{payMethod.label}</span>
                <span className="pay-transfer-account">{payMethod.account}</span>
              </div>
              <div className="pay-transfer-holder">{payMethod.holder}</div>
              {payMethod.hint && <div className="pay-transfer-hint">{payMethod.hint}</div>}
            </div>
          )}

          <div className="pay-upload-section">
            <div className="pay-upload-header">
              <span className="pay-upload-title">Comprobante de pago</span>
              <span className="pay-upload-required-tag">Requerido</span>
            </div>
            <label className={`pay-upload-box ${file ? 'has-file' : ''}`} htmlFor="comprobante-input">
              <input
                type="file"
                accept="image/*"
                id="comprobante-input"
                style={{ display: 'none' }}
                onChange={e => setFile(e.target.files[0] || null)}
              />
              <Icon name="upload" size={28} />
              <span className="pay-upload-main">{file ? file.name : 'Subí la foto o captura del pago'}</span>
              {!file && <span className="pay-upload-sub">Sin esto no podemos procesar tu pedido</span>}
            </label>
          </div>

          {errorMsg && <div className="pay-error">{errorMsg}</div>}

          <button
            className="btn-primary btn-lg btn-block"
            style={{ background: accent, marginTop: 18 }}
            onClick={handleSubmit}
          >
            <Icon name="lock" size={16} /> Confirmar pedido · {formatCOP(Math.round(total))}
          </button>
          <div className="modal-trust">Tu comprobante será revisado y tendrás acceso en minutos</div>
        </div>
      </div>
    </div>
  );
};

// ============================================================
// FLOATING WA
// ============================================================
const FloatingWA = () => {
  const cfg = window.PIXELPLAY_CONFIG || {};
  const num = (cfg.WHATSAPP || '').replace(/\D/g, '');
  return (
    <a href={`https://wa.me/${num}`} target="_blank" rel="noopener noreferrer" className="float-wa" aria-label="Contactar por WhatsApp">
      <Icon name="wa" size={24} />
      <span className="float-wa-pulse" />
    </a>
  );
};

// ============================================================
// APP
// ============================================================
const DEFAULTS = /*EDITMODE-BEGIN*/{
  "accent": "#8b5cf6",
  "density": "comfortable",
  "showFloatingWA": true
}/*EDITMODE-END*/;

function App() {
  const [t, setTweak] = useTweaks(DEFAULTS);
  const [cart, setCart] = useState([]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);

  const addToCart = (service, plan) => {
    if (cart.some(c => c.id === service.id)) {
      setCart(cart.filter(c => c.id !== service.id));
    } else {
      setCart([...cart, { ...service, plan }]);
    }
  };

  const subtotal = cart.reduce((sum, c) => sum + c.plan.price, 0);
  const discountRate = cart.length >= 2 ? 0.10 : 0;
  const total = subtotal * (1 - discountRate);

  return (
    <div className={`app density-${t.density}`} style={{ '--accent': t.accent }}>
      <Nav cartCount={cart.length} onCartOpen={() => setDrawerOpen(true)} accent={t.accent} />
      <Hero accent={t.accent} />
      <WorldCupBanner onAdd={addToCart} cart={cart} />
      <How accent={t.accent} />
      <Catalog onAdd={addToCart} cart={cart} accent={t.accent} />
      <Why accent={t.accent} />
      <Testimonials accent={t.accent} />

      <CartDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        cart={cart}
        setCart={setCart}
        accent={t.accent}
        onCheckout={() => { setDrawerOpen(false); setCheckoutOpen(true); }}
      />
      <CheckoutModal
        open={checkoutOpen}
        onClose={() => setCheckoutOpen(false)}
        cart={cart}
        setCart={setCart}
        total={total}
        accent={t.accent}
      />
      {t.showFloatingWA && <FloatingWA />}

      <TweaksPanel title="Tweaks">
        <TweakSection title="Color de acento">
          <TweakColor
            value={t.accent}
            onChange={(v) => setTweak('accent', v)}
            options={['#8b5cf6', '#3b82f6', '#06b6d4', '#ec4899', '#f59e0b', '#10b981']}
          />
        </TweakSection>
        <TweakSection title="Densidad">
          <TweakRadio
            value={t.density}
            onChange={(v) => setTweak('density', v)}
            options={[['comfortable', 'Cómoda'], ['compact', 'Compacta']]}
          />
        </TweakSection>
        <TweakSection title="Botón flotante WhatsApp">
          <TweakToggle value={t.showFloatingWA} onChange={(v) => setTweak('showFloatingWA', v)} />
        </TweakSection>
      </TweaksPanel>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
