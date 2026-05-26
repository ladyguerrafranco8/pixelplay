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
      { type: 'Pantalla', label: '1 Pantalla · 4K', price: 19900, popular: false },
      { type: 'Compartida', label: 'Cuenta Premium', price: 34900, popular: true },
    ],
    color: '#E50914',
    logoSlug: 'netflix',
  },
  {
    id: 'disney',
    name: 'Disney+',
    tagline: 'Marvel, Star Wars, Pixar',
    plans: [
      { type: 'Pantalla', label: '1 Pantalla · 4K', price: 13900, popular: false },
      { type: 'Compartida', label: 'Plan Estándar', price: 24900, popular: true },
    ],
    color: '#1E3A8A',
    logoUrl: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnIHZpZXdCb3g9JzAgMCA2MCA2MCc+PHRleHQgeD0nMzAnIHk9JzQ0JyB0ZXh0LWFuY2hvcj0nbWlkZGxlJyBmaWxsPSd3aGl0ZScgZm9udC1mYW1pbHk9J0dlb3JnaWEsc2VyaWYnIGZvbnQtd2VpZ2h0PSdib2xkJyBmb250LXNpemU9JzM4Jz5EKzwvdGV4dD48L3N2Zz4=',
  },
  {
    id: 'max',
    name: 'Max',
    tagline: 'HBO, Warner, DC Universe',
    plans: [
      { type: 'Pantalla', label: '1 Pantalla · 4K', price: 15900, popular: false },
      { type: 'Compartida', label: 'Plan Platino', price: 28900, popular: true },
    ],
    color: '#7C3AED',
    logoSlug: 'hbomax',
  },
  {
    id: 'prime',
    name: 'Prime Video',
    tagline: 'Originales y exclusivas',
    plans: [
      { type: 'Pantalla', label: '1 Pantalla · 4K', price: 11900, popular: false },
      { type: 'Compartida', label: 'Cuenta Completa', price: 21900, popular: false },
    ],
    color: '#0EA5E9',
    logoUrl: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnIHZpZXdCb3g9JzAgMCA2MCA2MCc+PHBvbHlnb24gcG9pbnRzPScxNCwxMCA1MCwzMCAxNCw1MCcgZmlsbD0nd2hpdGUnLz48L3N2Zz4=',
  },
  {
    id: 'spotify',
    name: 'Spotify',
    tagline: 'Música sin anuncios',
    plans: [
      { type: 'Individual', label: 'Premium Individual', price: 9900, popular: true },
      { type: 'Familiar', label: 'Premium Familiar', price: 18900, popular: false },
    ],
    color: '#1DB954',
    logoSlug: 'spotify',
  },
  {
    id: 'paramount',
    name: 'Paramount+',
    tagline: 'Series y deportes en vivo',
    plans: [
      { type: 'Pantalla', label: '1 Pantalla · HD', price: 11900, popular: false },
      { type: 'Compartida', label: 'Plan Anual', price: 19900, popular: false },
    ],
    color: '#0064FF',
    logoSlug: 'paramountplus',
  },
  {
    id: 'crunchyroll',
    name: 'Crunchyroll',
    tagline: 'Anime sin límites',
    plans: [
      { type: 'Individual', label: 'Mega Fan', price: 11900, popular: false },
      { type: 'Compartida', label: 'Ultimate Fan', price: 18900, popular: false },
    ],
    color: '#F47521',
    logoSlug: 'crunchyroll',
  },
  {
    id: 'youtube',
    name: 'YouTube Premium',
    tagline: 'Sin anuncios + Music',
    plans: [
      { type: 'Individual', label: 'Premium Individual', price: 11900, popular: false },
      { type: 'Familiar', label: 'Premium Familiar', price: 19900, popular: true },
    ],
    color: '#FF0000',
    logoSlug: 'youtube',
  },
];

const TESTIMONIALS = [
  {
    name: 'María González',
    handle: '@mariag',
    text: 'Llevaba meses pagando precios altísimos. Con PixelPlay ahorro más del 70% al mes y la entrega fue en literalmente 2 minutos por WhatsApp.',
    rating: 5,
    avatar: 'MG',
  },
  {
    name: 'Carlos Ramírez',
    handle: '@carlosr',
    text: 'El soporte 24/7 es real. Tuve un problema con mi cuenta a las 3 AM y me respondieron en menos de 10 minutos. Excelente servicio.',
    rating: 5,
    avatar: 'CR',
  },
  {
    name: 'Andrea Torres',
    handle: '@andre.t',
    text: 'Compré 4 servicios distintos. Todos funcionando perfecto desde hace 5 meses. Por fin algo que cumple lo que promete.',
    rating: 5,
    avatar: 'AT',
  },
];

const WHY_ITEMS = [
  {
    icon: 'price',
    title: 'Hasta 80% de ahorro',
    body: 'Pagás una fracción de lo que costaría cada servicio por separado. Sin letra chica, sin sorpresas en la factura.',
  },
  {
    icon: 'bolt',
    title: 'Entrega en 5 minutos',
    body: 'Accesos por WhatsApp o correo en minutos. Nada de esperas, nada de tramitología. Solo streaming.',
  },
  {
    icon: 'shield',
    title: 'Garantía durante todo el plan',
    body: 'Si algo falla, lo solucionamos o te devolvemos el dinero. Sin preguntas, sin vueltas.',
  },
  {
    icon: 'chat',
    title: 'Soporte humano 24/7',
    body: 'Persona real, respuesta real. WhatsApp, Telegram o correo. Siempre disponibles.',
  },
  {
    icon: 'check',
    title: 'Stock siempre disponible',
    body: 'Inventario actualizado en tiempo real. Si lo ves disponible, lo tenés. Sin esperas.',
  },
  {
    icon: 'card',
    title: 'Pago como tú quieras',
    body: 'Tarjeta, PayPal, transferencia, cripto o efectivo. Adaptados a tu forma de pagar, no al revés.',
  },
];

const STEPS = [
  {
    n: '01',
    title: 'Elegí tu servicio',
    body: 'Explorá el catálogo y seleccioná el plan que se ajusta a vos. Podés combinar varios servicios y obtener descuentos automáticos.',
  },
  {
    n: '02',
    title: 'Pagá en segundos',
    body: 'Tarjeta, PayPal, transferencia o cripto. Checkout seguro, sin crear cuenta si no querés. Confirmación inmediata.',
  },
  {
    n: '03',
    title: 'Recibí y disfrutá',
    body: 'En menos de 5 minutos recibís tus accesos por WhatsApp o correo. Acceso completo desde cualquier dispositivo.',
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
    case 'card': return <svg {...props}><rect x="2.5" y="5.5" width="19" height="13" rx="2"/><path d="M2.5 10h19M6 15h3"/></svg>;
    case 'wa': return <svg {...props}><path d="M21 11.5a8.5 8.5 0 01-13 7.2L3 20l1.4-4.7A8.5 8.5 0 1121 11.5z"/><path d="M8.5 9.5c0 4 3 7 7 7l1.5-1.7-2.2-1.3-1.2 1c-1.5-.7-2.7-1.9-3.3-3.3l1-1.2L10 7.8 8.5 9.5z" fill="currentColor"/></svg>;
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
    default: return null;
  }
};

// ============================================================
// SERVICE BADGE — logo real via Simple Icons CDN
// ============================================================
const ServiceBadge = ({ service, size = 64 }) => {
  const s = service;
  const logoSize = Math.round(size * 0.55);
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
        style={{ objectFit: 'contain', filter: 'drop-shadow(0 1px 3px rgba(0,0,0,0.3))' }}
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
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', fn);
    return () => window.removeEventListener('scroll', fn);
  }, []);
  return (
    <nav className={`nav ${scrolled ? 'nav-scrolled' : ''}`}>
      <a href="#top" className="nav-logo">PixelPlay</a>
      <div className="nav-links">
        <a href="#catalogo">Catálogo</a>
        <a href="#como-funciona">Cómo funciona</a>
        <a href="#faq">FAQ</a>
      </div>
      <button className="nav-cart" onClick={onCartOpen}>
        <Icon name="cart" size={20} />
        {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
      </button>
    </nav>
  );
};

// ============================================================
// HERO
// ============================================================
const Hero = ({ accent }) => {
  return (
    <section className="hero" id="top">
      <div className="hero-grid-bg" />
      <div className="hero-glow" style={{ background: `radial-gradient(closest-side, ${accent}40, transparent)` }} />
      <div className="hero-glow hero-glow-2" />

      <div className="hero-inner">
        <div className="hero-eyebrow">
          <span className="dot" style={{ background: '#10B981' }} />
          <span>+12.480 clientes activos · stock disponible ahora</span>
        </div>

        <h1 className="hero-title">
          Todo el <span className="title-accent" style={{ color: accent }}>streaming</span>
          <br />a una fracción del precio.
        </h1>

        <p className="hero-sub">
          Cuentas premium de Netflix, Disney+, Max, Prime Video, Spotify y más. Entrega
          en menos de 5 minutos, garantía durante todo tu plan, soporte humano 24/7.
        </p>

        <div className="hero-cta">
          <a href="#catalogo" className="btn-primary btn-lg" style={{ background: accent }}>
            Ver catálogo
            <Icon name="arrow" size={18} />
          </a>
          <a href="https://wa.me/" className="btn-ghost btn-lg">
            <Icon name="wa" size={18} />
            Hablar con nosotros
          </a>
        </div>

        <div className="hero-trust">
          <div className="trust-item">
            <Icon name="lock" size={16} />
            <span>Pago seguro</span>
          </div>
          <div className="trust-item">
            <Icon name="bolt" size={16} />
            <span>Entrega en 5 min</span>
          </div>
          <div className="trust-item">
            <Icon name="shield" size={16} />
            <span>Garantía total</span>
          </div>
        </div>

        <div className="hero-services-strip">
          <div className="strip-label">DISPONIBLES AHORA</div>
          <div className="strip-badges">
            {SERVICES.slice(0, 8).map((s) => (
              <ServiceBadge key={s.id} service={s} size={40} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

// ============================================================
// HOW IT WORKS
// ============================================================
const How = ({ accent }) => (
  <section className="how" id="como-funciona">
    <div className="section-header">
      <h2>¿Cómo funciona?</h2>
      <p>Tres pasos y ya estás viendo tu contenido favorito.</p>
    </div>
    <div className="steps">
      {STEPS.map((step) => (
        <div className="step" key={step.n}>
          <div className="step-num" style={{ color: accent }}>{step.n}</div>
          <h3>{step.title}</h3>
          <p>{step.body}</p>
        </div>
      ))}
    </div>
  </section>
);

// ============================================================
// CATALOG
// ============================================================
const Catalog = ({ onAdd, cart, accent }) => {
  const [active, setActive] = useState(null);

  const handleAdd = (service, plan) => {
    onAdd(service, plan);
    setActive(`${service.id}-${plan.type}`);
    setTimeout(() => setActive(null), 1200);
  };

  return (
    <section className="catalog" id="catalogo">
      <div className="section-header">
        <h2>Catálogo de servicios</h2>
        <p>Elegí uno o combiná varios y ahorrá hasta un 20% extra.</p>
      </div>
      <div className="svc-grid">
        {SERVICES.map((service) => {
          const inCart = cart.filter((c) => c.service.id === service.id);
          return (
            <div className="svc-card" key={service.id}>
              <div className="svc-card-head">
                <ServiceBadge service={service} size={56} />
                <div className="svc-card-meta">
                  <h3>{service.name}</h3>
                  <p>{service.tagline}</p>
                </div>
              </div>
              <div className="svc-plans">
                {service.plans.map((plan) => {
                  const key = `${service.id}-${plan.type}`;
                  const added = active === key;
                  const alreadyIn = inCart.some((c) => c.plan.type === plan.type);
                  return (
                    <div className={`svc-plan ${plan.popular ? 'plan-popular' : ''}`} key={plan.type}>
                      {plan.popular && <div className="plan-badge" style={{ background: accent }}>Más popular</div>}
                      <div className="plan-label">{plan.label}</div>
                      <div className="svc-price">
                        <span className="svc-price-num">{formatCOP(plan.price)}</span>
                        <span className="svc-price-per">/mes</span>
                      </div>
                      <button
                        className={`btn-add ${added ? 'btn-added' : ''} ${alreadyIn ? 'btn-in-cart' : ''}`}
                        style={added || alreadyIn ? {} : { borderColor: accent, color: accent }}
                        onClick={() => !alreadyIn && handleAdd(service, plan)}
                        disabled={alreadyIn}
                      >
                        {alreadyIn ? 'En carrito' : added ? '¡Agregado!' : '+ Agregar'}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

// ============================================================
// WHY
// ============================================================
const Why = ({ accent }) => (
  <section className="why">
    <div className="section-header">
      <h2 dangerouslySetInnerHTML={{ __html: 'Precio justo,<br/>servicio <em>premium</em>.' }} />
      <p>Todo lo que necesitás para disfrutar sin complicaciones.</p>
    </div>
    <div className="why-grid">
      {WHY_ITEMS.map((item) => (
        <div className="why-card" key={item.title}>
          <div className="why-icon" style={{ color: accent }}>
            <Icon name={item.icon} size={24} />
          </div>
          <h3>{item.title}</h3>
          <p>{item.body}</p>
        </div>
      ))}
    </div>
  </section>
);

// ============================================================
// TESTIMONIALS
// ============================================================
const Testimonials = () => (
  <section className="testimonials">
    <div className="section-header">
      <h2>Lo que dicen nuestros clientes</h2>
      <p>Más de 12.480 personas ya confían en PixelPlay.</p>
    </div>
    <div className="testimonials-grid">
      {TESTIMONIALS.map((t) => (
        <div className="t-card" key={t.name}>
          <div className="t-stars">
            {Array.from({ length: t.rating }).map((_, i) => (
              <Icon key={i} name="star" size={14} />
            ))}
          </div>
          <p className="t-text">{t.text}</p>
          <div className="t-author">
            <div className="t-avatar">{t.avatar}</div>
            <div>
              <div className="t-name">{t.name}</div>
              <div className="t-handle">{t.handle}</div>
            </div>
          </div>
        </div>
      ))}
    </div>
  </section>
);

// ============================================================
// FAQ
// ============================================================
const Faq = () => {
  const [open, setOpen] = useState(null);
  const items = [
    {
      q: '¿Cómo recibo mis accesos?',
      a: 'Inmediatamente después de confirmar el pago te enviamos las credenciales por WhatsApp o correo electrónico. El proceso tarda menos de 5 minutos.',
    },
    {
      q: '¿Los servicios son legales?',
      a: 'Trabajamos con cuentas compartidas o de perfil individual dentro de los planes familiares oficiales de cada plataforma. Es completamente legal y dentro de los términos de uso.',
    },
    {
      q: '¿Qué pasa si mi cuenta deja de funcionar?',
      a: 'Tenés garantía durante todo el período contratado. Si algo falla, te solucionamos el problema en menos de 2 horas o te devolvemos el dinero sin preguntas.',
    },
    {
      q: '¿Puedo cancelar cuando quiera?',
      a: 'Sí, aunque los planes son por período (mensual o anual), si necesitás cancelar antes de tiempo evaluamos caso por caso y buscamos la mejor solución para vos.',
    },
    {
      q: '¿Qué métodos de pago aceptan?',
      a: 'Tarjeta de crédito/débito, PayPal, transferencia bancaria, Nequi, Daviplata, cripto (USDT/BTC) y efectivo contra entrega en Bogotá.',
    },
  ];
  return (
    <section className="faq" id="faq">
      <div className="section-header">
        <h2>Preguntas frecuentes</h2>
        <p>Todo lo que necesitás saber antes de comprar.</p>
      </div>
      <div className="faq-list">
        {items.map((item, i) => (
          <div className={`faq-item ${open === i ? 'faq-open' : ''}`} key={i}>
            <button className="faq-q" onClick={() => setOpen(open === i ? null : i)}>
              {item.q}
              <Icon name={open === i ? 'minus' : 'plus'} size={18} />
            </button>
            <div className="faq-a">{item.a}</div>
          </div>
        ))}
      </div>
    </section>
  );
};

// ============================================================
// FINAL CTA
// ============================================================
const FinalCta = ({ accent, onCartOpen }) => (
  <section className="final-cta">
    <div className="cta-inner">
      <h2>¿Listo para empezar?</h2>
      <p>Elegí tu plan, pagá en segundos y recibí tus accesos al instante.</p>
      <div className="cta-btns">
        <a href="#catalogo" className="btn-primary btn-lg" style={{ background: accent }}>
          Ver catálogo
          <Icon name="arrow" size={18} />
        </a>
        <a href="https://wa.me/" className="btn-ghost btn-lg">
          <Icon name="wa" size={18} />
          Contactar por WhatsApp
        </a>
      </div>
    </div>
  </section>
);

// ============================================================
// FOOTER
// ============================================================
const Footer = ({ accent }) => (
  <footer className="footer">
    <div className="footer-inner">
      <div className="footer-brand">
        <span className="footer-logo">PixelPlay</span>
        <p>Streaming premium accesible para todos.</p>
        <div className="footer-social">
          <a href="#"><Icon name="ig" size={18} /></a>
          <a href="#"><Icon name="tg" size={18} /></a>
          <a href="#"><Icon name="wa" size={18} /></a>
          <a href="#"><Icon name="mail" size={18} /></a>
        </div>
      </div>
      <div className="footer-links">
        <h4>Servicios</h4>
        <ul>
          {SERVICES.map((s) => <li key={s.id}><a href="#catalogo">{s.name}</a></li>)}
        </ul>
      </div>
      <div className="footer-links">
        <h4>Soporte</h4>
        <ul>
          <li><a href="#faq">Preguntas frecuentes</a></li>
          <li><a href="#">Política de privacidad</a></li>
          <li><a href="#">Términos y condiciones</a></li>
          <li><a href="https://wa.me/">WhatsApp</a></li>
        </ul>
      </div>
    </div>
    <div className="footer-bottom">
      <p>© 2025 PixelPlay · Todos los derechos reservados</p>
    </div>
  </footer>
);

// ============================================================
// CART DRAWER
// ============================================================
const CartDrawer = ({ cart, onRemove, onClose, accent }) => {
  const subtotal = cart.reduce((s, c) => s + c.plan.price, 0);
  const count = cart.length;
  const discount = count >= 4 ? 0.20 : count === 3 ? 0.15 : count === 2 ? 0.10 : 0;
  const total = subtotal * (1 - discount);

  return (
    <>
      <div className="drawer-overlay" onClick={onClose} />
      <div className="drawer">
        <div className="drawer-head">
          <h3>Tu carrito</h3>
          <button onClick={onClose}><Icon name="close" size={20} /></button>
        </div>
        {cart.length === 0 ? (
          <div className="drawer-empty">
            <Icon name="cart" size={40} />
            <p>Tu carrito está vacío</p>
            <button className="btn-primary" style={{ background: accent }} onClick={onClose}>Ver catálogo</button>
          </div>
        ) : (
          <>
            <div className="drawer-items">
              {cart.map((c, i) => (
                <div className="drawer-item" key={i}>
                  <ServiceBadge service={c.service} size={40} />
                  <div className="drawer-item-info">
                    <div className="drawer-item-name">{c.service.name}</div>
                    <div className="drawer-item-plan">{c.plan.label}</div>
                  </div>
                  <div className="drawer-item-price">{formatCOP(c.plan.price)}</div>
                  <button className="drawer-item-remove" onClick={() => onRemove(i)}>
                    <Icon name="close" size={14} />
                  </button>
                </div>
              ))}
            </div>
            {discount > 0 && (
              <div className="drawer-discount">
                <Icon name="bolt" size={16} />
                Combo: {Math.round(discount * 100)}% de descuento aplicado
              </div>
            )}
            <div className="drawer-summary">
              {discount > 0 && (
                <div className="drawer-row">
                  <span>Subtotal</span>
                  <span>{formatCOP(subtotal)}</span>
                </div>
              )}
              {discount > 0 && (
                <div className="drawer-row drawer-saving">
                  <span>Descuento combo</span>
                  <span>-{formatCOP(subtotal * discount)}</span>
                </div>
              )}
              <div className="drawer-row drawer-total">
                <span>Total/mes</span>
                <span>{formatCOP(total)}</span>
              </div>
            </div>
            <button className="btn-primary btn-checkout" style={{ background: accent }}>
              Finalizar compra
              <Icon name="arrow" size={18} />
            </button>
            <button className="btn-ghost btn-wa-checkout" onClick={onClose}>
              <Icon name="wa" size={18} />
              Pedir por WhatsApp
            </button>
          </>
        )}
      </div>
    </>
  );
};

// ============================================================
// ORDER MODAL (post-checkout)
// ============================================================
const OrderModal = ({ cart, total, onClose, accent }) => (
  <div className="modal-overlay" onClick={onClose}>
    <div className="modal" onClick={(e) => e.stopPropagation()}>
      <button className="modal-close" onClick={onClose}><Icon name="close" size={20} /></button>
      <div className="modal-icon" style={{ color: accent }}><Icon name="check" size={48} /></div>
      <h2>¡Pedido recibido!</h2>
      <p>Te contactamos en menos de 5 minutos por WhatsApp para enviarte tus accesos.</p>
      <div className="modal-summary">
        {cart.map((c, i) => (
          <div className="modal-item" key={i}>
            <span>{c.service.name} — {c.plan.label}</span>
            <span>{formatCOP(c.plan.price)}</span>
          </div>
        ))}
        <div className="modal-total">
          <span>Total</span>
          <span>{formatCOP(total)}</span>
        </div>
      </div>
      <a href="https://wa.me/" className="btn-primary" style={{ background: accent, display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'center' }}>
        <Icon name="wa" size={18} />
        Ir a WhatsApp
      </a>
    </div>
  </div>
);

// ============================================================
// APP ROOT
// ============================================================
const App = () => {
  const t = useTweaks({
    accent: '#8b5cf6',
    density: 'comfortable',
    roundness: 'rounded',
    showTestimonials: true,
  });

  const [cart, setCart] = useState([]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [orderDone, setOrderDone] = useState(false);

  const addToCart = (service, plan) => {
    setCart((prev) => [...prev, { service, plan }]);
  };
  const removeFromCart = (idx) => {
    setCart((prev) => prev.filter((_, i) => i !== idx));
  };

  const subtotal = cart.reduce((s, c) => s + c.plan.price, 0);
  const count = cart.length;
  const discount = count >= 4 ? 0.20 : count === 3 ? 0.15 : count === 2 ? 0.10 : 0;
  const total = subtotal * (1 - discount);

  return (
    <div className={`app density-${t.density}`} style={{ '--accent': t.accent }}>
      <Nav cartCount={cart.length} onCartOpen={() => setDrawerOpen(true)} accent={t.accent} />
      <Hero accent={t.accent} />
      <How accent={t.accent} />
      <Catalog onAdd={addToCart} cart={cart} accent={t.accent} />
      <Why accent={t.accent} />
      {t.showTestimonials && <Testimonials />}
      <Faq />
      <FinalCta accent={t.accent} onCartOpen={() => setDrawerOpen(true)} />
      <Footer accent={t.accent} />

      {drawerOpen && (
        <CartDrawer
          cart={cart}
          onRemove={removeFromCart}
          onClose={() => setDrawerOpen(false)}
          accent={t.accent}
        />
      )}
      {orderDone && (
        <OrderModal
          cart={cart}
          total={total}
          onClose={() => { setOrderDone(false); setCart([]); }}
          accent={t.accent}
        />
      )}
      <TweaksPanel />
    </div>
  );
};

ReactDOM.createRoot(document.getElementById('root')).render(<App />);