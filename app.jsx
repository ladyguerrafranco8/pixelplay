/* global React, ReactDOM, useTweaks, TweaksPanel, TweakSection, TweakColor, TweakRadio, TweakToggle */
const { useState, useEffect, useMemo } = React;

const formatCOP = (n) => '$ ' + n.toLocaleString('es-CO');

const SERVICES = [
  { id: 'netflix', name: 'Netflix', tagline: 'Películas, series y originales', plans: [{ type: 'Pantalla', label: '1 Pantalla · 4K', price: 19900, popular: false }, { type: 'Compartida', label: 'Cuenta Premium', price: 34900, popular: true }], color: '#E50914', logoSlug: 'netflix' },
  { id: 'disney', name: 'Disney+', tagline: 'Marvel, Star Wars, Pixar', plans: [{ type: 'Pantalla', label: '1 Pantalla · 4K', price: 13900, popular: false }, { type: 'Compartida', label: 'Plan Estándar', price: 24900, popular: true }], color: '#1E3A8A', logoSlug: 'disneyplus' },
  { id: 'max', name: 'Max', tagline: 'HBO, Warner, DC Universe', plans: [{ type: 'Pantalla', label: '1 Pantalla · 4K', price: 15900, popular: false }, { type: 'Compartida', label: 'Plan Platino', price: 28900, popular: true }], color: '#7C3AED', logoSlug: 'hbomax' },
  { id: 'prime', name: 'Prime Video', tagline: 'Originales y exclusivas', plans: [{ type: 'Pantalla', label: '1 Pantalla · 4K', price: 11900, popular: false }, { type: 'Compartida', label: 'Cuenta Completa', price: 21900, popular: false }], color: '#0EA5E9', logoSlug: 'primevideo' },
  { id: 'spotify', name: 'Spotify', tagline: 'Música sin anuncios', plans: [{ type: 'Individual', label: 'Premium Individual', price: 9900, popular: true }, { type: 'Familiar', label: 'Premium Familiar', price: 18900, popular: false }], color: '#1DB954', logoSlug: 'spotify' },
  { id: 'paramount', name: 'Paramount+', tagline: 'Series y deportes en vivo', plans: [{ type: 'Pantalla', label: '1 Pantalla · HD', price: 11900, popular: false }, { type: 'Compartida', label: 'Plan Anual', price: 19900, popular: false }], color: '#0064FF', logoSlug: 'paramountplus' },
  { id: 'crunchyroll', name: 'Crunchyroll', tagline: 'Anime sin límites', plans: [{ type: 'Individual', label: 'Mega Fan', price: 11900, popular: false }, { type: 'Compartida', label: 'Ultimate Fan', price: 18900, popular: false }], color: '#F47521', logoSlug: 'crunchyroll' },
  { id: 'youtube', name: 'YouTube Premium', tagline: 'Sin anuncios + Music', plans: [{ type: 'Individual', label: 'Premium Individual', price: 11900, popular: false }, { type: 'Familiar', label: 'Premium Familiar', price: 19900, popular: true }], color: '#FF0000', logoSlug: 'youtube' },
];

const TESTIMONIALS = [
  { name: 'María González', handle: '@mariag', text: 'Llevaba meses pagando precios altísimos. Con PixelPlay ahorro más del 70% al mes y la entrega fue en literalmente 2 minutos por WhatsApp.', rating: 5, avatar: 'MG' },
  { name: 'Carlos Ramírez', handle: '@carlosr', text: 'El soporte 24/7 es real. Tuve un problema con mi cuenta a las 3 AM y me respondieron en menos de 10 minutos. Excelente servicio.', rating: 5, avatar: 'CR' },
  { name: 'Andrea Torres', handle: '@andre.t', text: 'Compré 4 servicios distintos. Todos funcionando perfecto desde hace 5 meses. Por fin algo que cumple lo que promete.', rating: 5, avatar: 'AT' },
  { name: 'Diego Salinas', handle: '@diegos', text: 'Lo que más valoro: precios transparentes, sin sorpresas. La garantía me dio mucha tranquilidad para probar.', rating: 5, avatar: 'DS' },
  { name: 'Valentina López', handle: '@valelo', text: 'Recomendado al 100%. Pasé de pagar más de 40$ al mes en suscripciones a solo 12$ por todo lo que veo.', rating: 5, avatar: 'VL' },
  { name: 'Roberto Mendoza', handle: '@robertom', text: 'Atención cercana, pago fácil por transferencia o tarjeta, y siempre tienen stock. No me cambio por nada.', rating: 5, avatar: 'RM' },
];

const FAQ = [
  { q: '¿Son cuentas legales y seguras?', a: 'Sí. Trabajamos con licencias autorizadas y métodos de distribución verificados. Tus datos de pago están protegidos con cifrado bancario y nunca compartimos información con terceros.' },
  { q: '¿Cuánto tarda la entrega de mi cuenta?', a: 'La entrega es inmediata: entre 1 y 5 minutos después de confirmar tu pago. Recibes los accesos directamente por WhatsApp o correo electrónico, lo que prefieras.' },
  { q: '¿Qué pasa si mi cuenta deja de funcionar?', a: 'Tienes garantía durante toda la duración de tu plan. Si por cualquier motivo tu acceso falla, lo reemplazamos en menos de 1 hora sin costo adicional. Cero preguntas.' },
  { q: '¿Puedo cambiar de servicio durante mi suscripción?', a: 'Por supuesto. Desde tu panel de cliente puedes cambiar entre servicios disponibles, pausar tu plan o renovar con un clic. Sin permanencias.' },
  { q: '¿Qué métodos de pago aceptan?', a: 'Aceptamos tarjeta de crédito y débito (Visa, Mastercard, Amex), PayPal, transferencia bancaria, criptomonedas y pago en efectivo a través de OXXO y otros puntos físicos.' },
  { q: '¿Puedo cambiar mi PIN o perfil?', a: 'En las cuentas compartidas, tienes asignado un perfil específico con tu propio PIN. Puedes personalizar tu perfil pero por respeto a otros usuarios no puedes modificar los datos principales de la cuenta.' },
  { q: '¿Hay descuento si compro varios servicios?', a: 'Sí. Al añadir 2 servicios al carrito obtienes 10% de descuento, con 3 servicios un 15%, y con 4 o más un 20% de descuento sobre el total. El descuento se aplica automáticamente.' },
  { q: '¿Cómo funciona la renovación?', a: 'Te recordamos por WhatsApp 3 días antes del vencimiento. Puedes renovar manualmente o activar la renovación automática desde tu panel. Nunca te cobramos sin avisarte.' },
];

const WHY = [
  { icon: 'price', title: 'Hasta 80% de ahorro', body: 'Pagás una fracción de lo que costaría cada servicio por separado. Sin letra chica, sin sorpresas en la factura.' },
  { icon: 'bolt', title: 'Entrega en minutos', body: 'Tu cuenta llega directo a tu WhatsApp o correo en menos de 5 minutos tras confirmar el pago. Automatizado.' },
  { icon: 'shield', title: 'Garantía total', body: 'Si tu cuenta falla durante el plan, la reemplazamos en menos de 1 hora. Sin trámites, sin excusas.' },
  { icon: 'chat', title: 'Soporte 24/7 real', body: 'Humanos respondiendo, no bots. Cualquier día, cualquier hora. Promedio de respuesta: 8 minutos.' },
  { icon: 'check', title: 'Stock siempre disponible', body: 'Inventario actualizado en tiempo real. Si lo ves disponible, lo tenés. Sin esperas.' },
  { icon: 'card', title: 'Pago como tú quieras', body: 'Tarjeta, PayPal, transferencia, cripto o efectivo. Adaptados a tu forma de pagar, no al revés.' },
];

const STEPS = [
  { n: '01', title: 'Elegí tu servicio', body: 'Explorá el catálogo y seleccioná el plan que se ajusta a vos. Podés combinar varios servicios y obtener descuentos automáticos.' },
  { n: '02', title: 'Pagá en segundos', body: 'Tarjeta, PayPal, transferencia o cripto. Checkout seguro, sin crear cuenta si no querés. Confirmación inmediata.' },
  { n: '03', title: 'Recibí y disfrutá', body: 'En menos de 5 minutos recibís tus accesos por WhatsApp o correo. Acceso completo desde cualquier dispositivo.' },
];

const Icon = ({ name, size = 20 }) => {
  const p = { width: size, height: size, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.6, strokeLinecap: 'round', strokeLinejoin: 'round' };
  switch (name) {
    case 'cart': return <svg {...p}><path d="M3 4h2l2.4 12.2a2 2 0 002 1.6h8.7a2 2 0 002-1.6L21 8H6"/><circle cx="9" cy="21" r="1.2"/><circle cx="18" cy="21" r="1.2"/></svg>;
    case 'price': return <svg {...p}><path d="M20 12V7a2 2 0 00-2-2H7l-4 4v8a2 2 0 002 2h6"/><circle cx="9" cy="10" r="1.5"/><path d="M16 18l2 2 4-4"/></svg>;
    case 'bolt': return <svg {...p}><path d="M13 2L4 14h7l-1 8 9-12h-7l1-8z"/></svg>;
    case 'shield': return <svg {...p}><path d="M12 2l8 4v6c0 5-3.5 9-8 10-4.5-1-8-5-8-10V6l8-4z"/><path d="M9 12l2 2 4-4"/></svg>;
    case 'chat': return <svg {...p}><path d="M21 12a8 8 0 01-12.4 6.7L3 21l1.6-4.4A8 8 0 1121 12z"/></svg>;
    case 'check': return <svg {...p}><circle cx="12" cy="12" r="9"/><path d="M8 12l3 3 5-6"/></svg>;
    case 'card': return <svg {...p}><rect x="2.5" y="5.5" width="19" height="13" rx="2"/><path d="M2.5 10h19M6 15h3"/></svg>;
    case 'wa': return <svg {...p}><path d="M21 11.5a8.5 8.5 0 01-13 7.2L3 20l1.4-4.7A8.5 8.5 0 1121 11.5z"/><path d="M8.5 9.5c0 4 3 7 7 7l1.5-1.7-2.2-1.3-1.2 1c-1.5-.7-2.7-1.9-3.3-3.3l1-1.2L10 7.8 8.5 9.5z" fill="currentColor"/></svg>;
    case 'arrow': return <svg {...p}><path d="M5 12h14M13 5l7 7-7 7"/></svg>;
    case 'plus': return <svg {...p}><path d="M12 5v14M5 12h14"/></svg>;
    case 'minus': return <svg {...p}><path d="M5 12h14"/></svg>;
    case 'close': return <svg {...p}><path d="M6 6l12 12M18 6L6 18"/></svg>;
    case 'star': return <svg {...p} fill="currentColor" stroke="none"><path d="M12 2l3 6.5 7 1-5 5 1.2 7-6.2-3.3L5.8 21 7 14l-5-5 7-1z"/></svg>;
    case 'lock': return <svg {...p}><rect x="4" y="11" width="16" height="10" rx="2"/><path d="M8 11V7a4 4 0 018 0v4"/></svg>;
    case 'tg': return <svg {...p}><path d="M22 4L2 11l6 2 2 7 4-4 5 4 3-16z"/></svg>;
    case 'ig': return <svg {...p}><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="0.8" fill="currentColor"/></svg>;
    case 'mail': return <svg {...p}><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/></svg>;
    default: return null;
  }
};

const ServiceBadge = ({ service, size = 64 }) => {
  const logoSize = Math.round(size * 0.55);
  return (
    <div className="svc-badge" style={{ width: size, height: size, background: `linear-gradient(135deg, ${service.color}, ${service.color}cc)`, boxShadow: `0 8px 24px -8px ${service.color}80, inset 0 1px 0 rgba(255,255,255,0.2)` }}>
      <img src={`https://cdn.simpleicons.org/${service.logoSlug}/ffffff`} alt={service.name} width={logoSize} height={logoSize}
        style={{ objectFit: 'contain', filter: 'drop-shadow(0 1px 3px rgba(0,0,0,0.3))' }}
        onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }} />
      <div className="svc-glyph-fallback" style={{ fontSize: size * 0.42, display: 'none' }}>{service.name[0]}</div>
    </div>
  );
};

const Nav = ({ cartCount, onCartOpen, accent }) => {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => { const f = () => setScrolled(window.scrollY > 20); window.addEventListener('scroll', f); return () => window.removeEventListener('scroll', f); }, []);
  return (
    <nav className={`nav ${scrolled ? 'nav-scrolled' : ''}`}>
      <div className="nav-inner">
        <a href="#top" className="logo">
          <span className="logo-mark" style={{ background: `linear-gradient(135deg, ${accent}, #3b82f6)` }} />
          <span className="logo-text">PixelPlay</span>
        </a>
        <div className="nav-links">
          {[['Catálogo','#catalogo'],['Por qué nosotros','#porque'],['Cómo funciona','#como'],['FAQ','#faq']].map(([l,h]) => <a key={h} href={h} className="nav-link">{l}</a>)}
        </div>
        <div className="nav-actions">
          <button className="btn-ghost cart-btn" onClick={onCartOpen}>
            <Icon name="cart" size={18} /><span className="cart-label">Carrito</span>
            {cartCount > 0 && <span className="cart-bubble" style={{ background: accent }}>{cartCount}</span>}
          </button>
          <a href="#catalogo" className="btn-primary" style={{ background: accent }}>Empezar</a>
        </div>
      </div>
    </nav>
  );
};

const Hero = ({ accent }) => (
  <section className="hero" id="top">
    <div className="hero-grid-bg" />
    <div className="hero-glow" style={{ background: `radial-gradient(closest-side, ${accent}40, transparent)` }} />
    <div className="hero-glow hero-glow-2" />
    <div className="hero-inner">
      <div className="hero-eyebrow"><span className="dot" style={{ background: '#10B981' }} /><span>+12.480 clientes activos · stock disponible ahora</span></div>
      <h1 className="hero-title">Todo el <span className="title-accent" style={{ color: accent }}>streaming</span><br/>que <em>de verdad</em> ves,<br/>a una fracción del precio.</h1>
      <p className="hero-sub">Cuentas premium de Netflix, Disney+, Max, Prime Video, Spotify y más. Entrega en menos de 5 minutos, garantía durante todo tu plan, soporte humano 24/7.</p>
      <div className="hero-cta">
        <a href="#catalogo" className="btn-primary btn-lg" style={{ background: accent }}>Ver catálogo <Icon name="arrow" size={18} /></a>
        <a href="#como" className="btn-secondary btn-lg">¿Cómo funciona?</a>
      </div>
      <div className="hero-trust">
        <div className="trust-item"><Icon name="lock" size={16} /><span>Pago seguro</span></div>
        <div className="trust-divider" />
        <div className="trust-item"><Icon name="bolt" size={16} /><span>Entrega inmediata</span></div>
        <div className="trust-divider" />
        <div className="trust-item"><Icon name="shield" size={16} /><span>Garantía total</span></div>
      </div>
      <div className="hero-services-strip">
        <div className="strip-label">DISPONIBLES AHORA</div>
        <div className="strip-badges">{SERVICES.map(s => <div key={s.id} className="strip-badge" title={s.name}><ServiceBadge service={s} size={44} /></div>)}</div>
      </div>
    </div>
  </section>
);

const ServiceCard = ({ service, onAdd, inCart, accent }) => {
  const [planIdx, setPlanIdx] = useState(Math.max(0, service.plans.findIndex(p => p.popular)));
  const plan = service.plans[planIdx];
  return (
    <article className="svc-card">
      <div className="svc-card-top"><ServiceBadge service={service} size={56} /><div className="svc-card-meta"><h3>{service.name}</h3><p>{service.tagline}</p></div></div>
      <div className="svc-plans">{service.plans.map((p, i) => <button key={i} className={`plan-pill ${planIdx===i?'active':''}`} onClick={() => setPlanIdx(i)} style={planIdx===i?{borderColor:accent,color:'#fff'}:{}}>{p.type}{p.popular&&<span className="popular-dot" style={{background:accent}}/>}</button>)}</div>
      <div className="svc-plan-label">{plan.label}</div>
      <div className="svc-card-bottom">
        <div className="svc-price"><span className="svc-price-num">{formatCOP(plan.price)}</span><span className="svc-price-per">/mes</span></div>
        <button className={`btn-buy ${inCart?'in-cart':''}`} onClick={() => onAdd(service, plan)} style={!inCart?{background:accent}:{}}>
          {inCart ? <><Icon name="check" size={16}/> Agregado</> : <>Agregar <Icon name="plus" size={16}/></>}
        </button>
      </div>
    </article>
  );
};

const Catalog = ({ onAdd, cart, accent }) => {
  const [filter, setFilter] = useState('all');
  const filtered = useMemo(() => {
    if (filter==='video') return SERVICES.filter(s=>['netflix','disney','max','prime','paramount','crunchyroll'].includes(s.id));
    if (filter==='music') return SERVICES.filter(s=>['spotify','youtube'].includes(s.id));
    return SERVICES;
  }, [filter]);
  return (
    <section className="catalog" id="catalogo">
      <div className="section-head"><span className="section-eyebrow">CATÁLOGO</span><h2 className="section-title">Elegí lo que <em>realmente</em> vas a ver.</h2><p className="section-sub">Todos los servicios. Sin paquetes obligatorios. Combina y ahorra.</p></div>
      <div className="catalog-filters">
        {[['all','Todos'],['video','Video'],['music','Música']].map(([k,l]) => <button key={k} className={`filter-chip ${filter===k?'active':''}`} onClick={()=>setFilter(k)} style={filter===k?{background:accent,borderColor:accent}:{}}>{l}</button>)}
        <div className="catalog-bundle-tip"><Icon name="bolt" size={14}/> Llevá 3 servicios y obtené <strong>15% off</strong></div>
      </div>
      <div className="svc-grid">{filtered.map(s=><ServiceCard key={s.id} service={s} onAdd={onAdd} inCart={cart.some(c=>c.id===s.id)} accent={accent}/>)}</div>
    </section>
  );
};

const Why = ({ accent }) => (
  <section className="why" id="porque">
    <div className="section-head"><span className="section-eyebrow">POR QUÉ PIXELPLAY</span><h2 className="section-title">Precio justo,<br/>servicio <em>premium</em>.</h2><p className="section-sub">Más de 4 años operando, +12.000 clientes activos, 99.2% de retención mensual.</p></div>
    <div className="why-grid">{WHY.map((w,i)=><div key={i} className="why-card"><div className="why-icon" style={{color:accent,borderColor:`${accent}40`}}><Icon name={w.icon} size={22}/></div><h3>{w.title}</h3><p>{w.body}</p></div>)}</div>
  </section>
);

const How = ({ accent }) => (
  <section className="how" id="como">
    <div className="section-head"><span className="section-eyebrow">CÓMO FUNCIONA</span><h2 className="section-title">De carrito a Netflix<br/>en <em>menos de 5 minutos</em>.</h2></div>
    <div className="how-grid">{STEPS.map((s,i)=><div key={i} className="how-card"><div className="how-num" style={{color:accent}}>{s.n}</div><h3>{s.title}</h3><p>{s.body}</p>{i<STEPS.length-1&&<div className="how-arrow"><Icon name="arrow" size={18}/></div>}</div>)}</div>
  </section>
);

const Testimonials = ({ accent }) => (
  <section className="testimonials">
    <div className="section-head"><span className="section-eyebrow">TESTIMONIOS</span><h2 className="section-title">+12.000 clientes <em>que repiten</em>.</h2>
      <div className="rating-summary"><div className="stars" style={{color:'#FBBF24'}}>{[...Array(5)].map((_,i)=><Icon key={i} name="star" size={18}/>)}</div><span className="rating-num">4.9 / 5</span><span className="rating-meta">basado en 3.214 reseñas</span></div></div>
    <div className="testi-marquee"><div className="testi-track">{[...TESTIMONIALS,...TESTIMONIALS].map((t,i)=><div key={i} className="testi-card"><div className="testi-stars" style={{color:'#FBBF24'}}>{[...Array(t.rating)].map((_,j)=><Icon key={j} name="star" size={13}/>)}</div><p className="testi-text">{t.text}</p><div className="testi-author"><div className="testi-avatar" style={{background:`linear-gradient(135deg,${accent},#3b82f6)`}}>{t.avatar}</div><div><div className="testi-name">{t.name}</div><div className="testi-handle">{t.handle}</div></div></div></div>)}</div></div>
  </section>
);

const Faq = ({ accent }) => {
  const [open, setOpen] = useState(0);
  return (
    <section className="faq" id="faq">
      <div className="section-head"><span className="section-eyebrow">PREGUNTAS FRECUENTES</span><h2 className="section-title">Resolvemos tus dudas <em>antes</em><br/>de que las tengas.</h2></div>
      <div className="faq-list">{FAQ.map((f,i)=><button key={i} className={`faq-item ${open===i?'open':''}`} onClick={()=>setOpen(open===i?-1:i)} style={open===i?{borderColor:`${accent}50`}:{}}><div className="faq-q"><span>{f.q}</span><span className="faq-toggle" style={open===i?{background:accent,color:'#fff',borderColor:accent}:{}}><Icon name={open===i?'minus':'plus'} size={16}/></span></div><div className="faq-a-wrap"><div className="faq-a">{f.a}</div></div></button>)}</div>
    </section>
  );
};

const FinalCta = ({ accent }) => (
  <section className="final-cta">
    <div className="final-cta-inner" style={{background:`linear-gradient(135deg,${accent}25,#3b82f615)`,borderColor:`${accent}40`}}>
      <h2>¿Listo para dejar de pagar de más?</h2>
      <p>Activá tu primer servicio hoy. Si no te convence, te devolvemos cada peso en las primeras 24 horas.</p>
      <div className="final-cta-actions">
        <a href="#catalogo" className="btn-primary btn-lg" style={{background:accent}}>Ver catálogo <Icon name="arrow" size={18}/></a>
        <a href="#" className="btn-wa"><Icon name="wa" size={18}/> Hablar por WhatsApp</a>
      </div>
    </div>
  </section>
);

const Footer = ({ accent }) => (
  <footer className="footer">
    <div className="footer-inner">
      <div className="footer-brand">
        <a href="#top" className="logo"><span className="logo-mark" style={{background:`linear-gradient(135deg,${accent},#3b82f6)`}}/><span className="logo-text">PixelPlay</span></a>
        <p>Streaming premium accesible.<br/>Soporte humano, garantía real.</p>
        <div className="footer-socials"><a href="#" className="social-btn"><Icon name="wa" size={18}/></a><a href="#" className="social-btn"><Icon name="ig" size={18}/></a><a href="#" className="social-btn"><Icon name="tg" size={18}/></a><a href="#" className="social-btn"><Icon name="mail" size={18}/></a></div>
      </div>
      <div className="footer-col"><h4>Producto</h4><a href="#catalogo">Catálogo</a><a href="#porque">Por qué nosotros</a><a href="#como">Cómo funciona</a><a href="#faq">FAQ</a></div>
      <div className="footer-col"><h4>Soporte</h4><a href="#">Centro de ayuda</a><a href="#">Garantía y reembolsos</a><a href="#">Estado del servicio</a><a href="#">Reportar problema</a></div>
      <div className="footer-col"><h4>Contacto</h4><a href="#"><Icon name="wa" size={14}/> WhatsApp</a><a href="#"><Icon name="mail" size={14}/> hola@pixelplay.shop</a><a href="#"><Icon name="tg" size={14}/> @pixelplay_oficial</a><a href="#"><Icon name="ig" size={14}/> @pixelplay.shop</a></div>
    </div>
    <div className="footer-bottom"><div>© 2026 PixelPlay. Todos los derechos reservados.</div><div className="footer-legal"><a href="#">Términos</a><a href="#">Privacidad</a><a href="#">Cookies</a></div></div>
  </footer>
);

const CartDrawer = ({ open, onClose, cart, setCart, accent, onCheckout }) => {
  const subtotal = cart.reduce((s,c)=>s+c.plan.price,0);
  const dr = cart.length>=4?0.20:cart.length>=3?0.15:cart.length>=2?0.10:0;
  const discount = subtotal*dr;
  const total = subtotal-discount;
  return (
    <>
      <div className={`drawer-backdrop ${open?'open':''}`} onClick={onClose}/>
      <aside className={`drawer ${open?'open':''}`}>
        <div className="drawer-head"><div><div className="drawer-title">Tu carrito</div><div className="drawer-sub">{cart.length} {cart.length===1?'servicio':'servicios'}</div></div><button className="icon-btn" onClick={onClose}><Icon name="close" size={20}/></button></div>
        <div className="drawer-body">
          {cart.length===0?(<div className="cart-empty"><div className="cart-empty-icon"><Icon name="cart" size={28}/></div><h3>Tu carrito está vacío</h3><p>Explorá el catálogo y empezá a armar tu combo.</p><button className="btn-primary" style={{background:accent}} onClick={onClose}>Ver catálogo</button></div>)
          :(<div className="cart-items">{cart.map((c,i)=><div key={i} className="cart-item"><ServiceBadge service={c} size={48}/><div className="cart-item-meta"><div className="cart-item-name">{c.name}</div><div className="cart-item-plan">{c.plan.label}</div></div><div className="cart-item-right"><div className="cart-item-price">{formatCOP(c.plan.price)}</div><button className="cart-remove" onClick={()=>setCart(cart.filter((_,j)=>j!==i))}><Icon name="close" size={14}/></button></div></div>)}</div>)}
        </div>
        {cart.length>0&&(<div className="drawer-foot">
          <div className="totals">
            <div className="total-row"><span>Subtotal</span><span>{formatCOP(subtotal)}</span></div>
            {dr>0&&<div className="total-row discount"><span>Descuento combo ({(dr*100).toFixed(0)}%)</span><span>-{formatCOP(Math.round(discount))}</span></div>}
            <div className="total-row total-final"><span>Total mensual</span><span>{formatCOP(Math.round(total))}</span></div>
          </div>
          <button className="btn-primary btn-lg btn-block" style={{background:accent}} onClick={onCheckout}><Icon name="lock" size={16}/> Pagar ahora · {formatCOP(Math.round(total))}</button>
          <div className="drawer-trust"><Icon name="shield" size={13}/> Pago cifrado · Entrega en minutos · Garantía total</div>
        </div>)}
      </aside>
    </>
  );
};

const CheckoutModal = ({ open, onClose, total, accent }) => {
  const [step, setStep] = useState(0);
  const [method, setMethod] = useState('card');
  if (!open) return null;
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={e=>e.stopPropagation()}>
        {step===0?(
          <><div className="modal-head"><div className="modal-title">Confirmar pago</div><button className="icon-btn" onClick={onClose}><Icon name="close" size={18}/></button></div>
          <div className="modal-body">
            <div className="pay-methods">{[['card','Tarjeta'],['paypal','PayPal'],['crypto','Cripto'],['transfer','Transferencia']].map(([k,l])=><button key={k} className={`pay-method ${method===k?'active':''}`} onClick={()=>setMethod(k)} style={method===k?{borderColor:accent,background:`${accent}15`}:{}}>{l}</button>)}</div>
            {method==='card'&&<div className="pay-fields"><label>Número de tarjeta<input type="text" placeholder="4242 4242 4242 4242"/></label><div className="pay-row"><label>Vencimiento<input type="text" placeholder="MM / AA"/></label><label>CVV<input type="text" placeholder="123"/></label></div><label>Email<input type="email" placeholder="tu@email.com"/></label><label>WhatsApp (opcional)<input type="tel" placeholder="+57 300 000 0000"/></label></div>}
            {method!=='card'&&<div className="pay-alt"><div className="pay-alt-icon"><Icon name="lock" size={28}/></div><p>Te redirigiremos a la pasarela segura de <strong>{method==='paypal'?'PayPal':method==='crypto'?'pago en cripto':'transferencia bancaria'}</strong> para completar tu compra.</p></div>}
            <button className="btn-primary btn-lg btn-block" style={{background:accent,marginTop:18}} onClick={()=>setStep(1)}><Icon name="lock" size={16}/> Pagar {formatCOP(Math.round(total))}</button>
            <div className="modal-trust">Pago cifrado SSL · No guardamos datos de tarjeta</div>
          </div></>
        ):(
          <div className="checkout-success"><div className="success-ring" style={{borderColor:accent}}><Icon name="check" size={36}/></div><h3>¡Pago confirmado!</h3><p>Estás recibiendo tus accesos por WhatsApp y correo en los próximos minutos.</p><button className="btn-primary" style={{background:accent}} onClick={onClose}>Listo</button></div>
        )}
      </div>
    </div>
  );
};

const FloatingWA = () => <a href="#" className="float-wa" aria-label="WhatsApp"><Icon name="wa" size={26}/><span className="float-wa-pulse"/></a>;

const DEFAULTS = {"accent":"#8b5cf6","density":"comfortable","showFloatingWA":true};

function App() {
  const [t, setTweak] = useTweaks(DEFAULTS);
  const [cart, setCart] = useState([]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const addToCart = (service, plan) => {
    if (cart.some(c=>c.id===service.id)) setCart(cart.filter(c=>c.id!==service.id));
    else setCart([...cart,{...service,plan}]);
  };
  const subtotal = cart.reduce((s,c)=>s+c.plan.price,0);
  const dr = cart.length>=4?0.20:cart.length>=3?0.15:cart.length>=2?0.10:0;
  const total = subtotal*(1-dr);
  return (
    <div className={`app density-${t.density}`} style={{'--accent':t.accent}}>
      <Nav cartCount={cart.length} onCartOpen={()=>setDrawerOpen(true)} accent={t.accent}/>
      <Hero accent={t.accent}/>
      <How accent={t.accent}/>
      <Catalog onAdd={addToCart} cart={cart} accent={t.accent}/>
      <Why accent={t.accent}/>
      <Testimonials accent={t.accent}/>
      <Faq accent={t.accent}/>
      <FinalCta accent={t.accent}/>
      <Footer accent={t.accent}/>
      <CartDrawer open={drawerOpen} onClose={()=>setDrawerOpen(false)} cart={cart} setCart={setCart} accent={t.accent} onCheckout={()=>{setDrawerOpen(false);setCheckoutOpen(true);}}/>
      <CheckoutModal open={checkoutOpen} onClose={()=>setCheckoutOpen(false)} total={total} accent={t.accent}/>
      {t.showFloatingWA&&<FloatingWA/>}
      <TweaksPanel title="Tweaks">
        <TweakSection title="Color de acento"><TweakColor value={t.accent} onChange={v=>setTweak('accent',v)} options={['#8b5cf6','#3b82f6','#06b6d4','#ec4899','#f59e0b','#10b981']}/></TweakSection>
        <TweakSection title="Densidad"><TweakRadio value={t.density} onChange={v=>setTweak('density',v)} options={[['comfortable','Cómoda'],['compact','Compacta']]}/></TweakSection>
        <TweakSection title="Botón WhatsApp"><TweakToggle value={t.showFloatingWA} onChange={v=>setTweak('showFloatingWA',v)}/></TweakSection>
      </TweaksPanel>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App/>);