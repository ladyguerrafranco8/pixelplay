/* global React, ReactDOM */
const { useState, useEffect, useCallback } = React;

const CFG = window.PIXELPLAY_CONFIG || {};
const formatCOP = (n) => '$ ' + Math.round(Number(n) || 0).toLocaleString('es-CO');
const fmtDate = (iso) => {
  try {
    return new Date(iso).toLocaleString('es-CO', {
      day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit',
    });
  } catch (_) { return iso; }
};

const STATUSES = ['pendiente', 'pagado', 'entregado', 'cancelado'];
const STATUS_LABEL = { pendiente: 'Pendiente', pagado: 'Pagado', entregado: 'Entregado', cancelado: 'Cancelado' };

const I = ({ d, size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">{d}</svg>
);
const IconCheck = (p) => <I {...p} d={<><circle cx="12" cy="12" r="9" /><path d="M8 12l3 3 5-6" /></>} />;
const IconArrow = (p) => <I {...p} d={<path d="M5 12h14M13 5l7 7-7 7" />} />;
const IconEye = (p) => <I {...p} d={<><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z" /><circle cx="12" cy="12" r="3" /></>} />;
const IconX = (p) => <I {...p} d={<path d="M6 6l12 12M18 6L6 18" />} />;
const IconOut = (p) => <I {...p} d={<><path d="M16 17l5-5-5-5" /><path d="M21 12H9" /><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" /></>} />;
const IconRefresh = (p) => <I {...p} d={<><path d="M21 12a9 9 0 11-3-6.7L21 8" /><path d="M21 3v5h-5" /></>} />;

// ============================================================
// LOGIN
// ============================================================
function Login({ onLoggedIn }) {
  const [user, setUser] = useState('');
  const [pass, setPass] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError(''); setBusy(true);
    const domain = CFG.ADMIN_EMAIL_DOMAIN || 'pixelplay.local';
    const u = user.trim();
    const email = u.includes('@') ? u : `${u}@${domain}`;
    try {
      const sb = window.PixelPlayAPI.getClient();
      const { data, error } = await sb.auth.signInWithPassword({ email, password: pass });
      setBusy(false);
      if (error) { setError('Usuario o clave incorrectos.'); return; }
      onLoggedIn(data.session);
    } catch (err) {
      setBusy(false);
      setError(err.message || 'No se pudo iniciar sesión.');
    }
  };

  return (
    <div className="adm-login">
      <form className="adm-login-card" onSubmit={submit}>
        <div className="adm-brand"><span className="logo-mark" /> PixelPlay</div>
        <div className="adm-login-title">Panel de pedidos</div>
        <div className="adm-login-sub">Ingresá con tu usuario y clave de administradora.</div>
        <div className="adm-field">
          <label>Usuario</label>
          <input type="text" value={user} autoComplete="username"
            onChange={(e) => setUser(e.target.value)} placeholder="ladyguerrafranco" />
        </div>
        <div className="adm-field">
          <label>Clave</label>
          <input type="password" value={pass} autoComplete="current-password"
            onChange={(e) => setPass(e.target.value)} placeholder="••••••••" />
        </div>
        {error && <div className="adm-error">{error}</div>}
        <button type="submit" className="btn-primary btn-lg btn-block" disabled={busy} style={{ marginTop: 8 }}>
          {busy ? 'Entrando…' : 'Iniciar sesión'}
        </button>
      </form>
    </div>
  );
}

// ============================================================
// ORDER CARD
// ============================================================
function OrderCard({ order, sb, onStatus, onViewShot }) {
  const [busy, setBusy] = useState(false);
  const items = Array.isArray(order.items) ? order.items : [];

  const setStatus = async (status) => {
    setBusy(true);
    await onStatus(order.id, status);
    setBusy(false);
  };

  return (
    <div className="adm-order">
      <div className="adm-order-head">
        <div>
          <div className="adm-order-num">Pedido #{order.order_number}</div>
          <div className="adm-order-date">{fmtDate(order.created_at)}</div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div className="adm-order-total">{formatCOP(order.total)}</div>
          <span className={`adm-badge ${order.status}`}>{STATUS_LABEL[order.status] || order.status}</span>
        </div>
      </div>

      <div className="adm-cust">
        <span><strong>{order.customer_name}</strong></span>
        <a href={`mailto:${order.customer_email}`}>{order.customer_email}</a>
        {order.customer_whatsapp && (
          <a href={`https://wa.me/${String(order.customer_whatsapp).replace(/[^0-9]/g, '')}`} target="_blank" rel="noreferrer">
            WhatsApp: {order.customer_whatsapp}
          </a>
        )}
        {order.payment_method && <span style={{ color: 'var(--text-3)' }}>Pago por {order.payment_method}</span>}
      </div>

      {items.length > 0 && (
        <div className="adm-items">
          {items.map((it, i) => (
            <div key={i} className="adm-item">
              <span>{it.name}{it.planLabel ? ` · ${it.planLabel}` : ''}</span>
              <span>{formatCOP(it.price)}</span>
            </div>
          ))}
          {order.discount > 0 && (
            <div className="adm-item" style={{ color: '#34d399' }}>
              <span>Descuento combo</span><span>-{formatCOP(order.discount)}</span>
            </div>
          )}
        </div>
      )}

      <div className="adm-order-foot">
        {order.screenshot_path ? (
          <button className="adm-btn adm-btn-shot" disabled={busy} onClick={() => onViewShot(order)}>
            <IconEye size={15} /> Ver comprobante
          </button>
        ) : <span style={{ fontSize: 12, color: 'var(--text-3)' }}>Sin comprobante</span>}

        <div className="adm-actions">
          {order.status === 'pendiente' && (
            <button className="adm-btn adm-btn-ok" disabled={busy} onClick={() => setStatus('pagado')}>
              <IconCheck size={15} /> Marcar pagado
            </button>
          )}
          {order.status === 'pagado' && (
            <button className="adm-btn adm-btn-go" disabled={busy} onClick={() => setStatus('entregado')}>
              <IconArrow size={15} /> Marcar entregado
            </button>
          )}
          {order.status === 'cancelado' && (
            <button className="adm-btn" disabled={busy} onClick={() => setStatus('pendiente')}>
              Reactivar
            </button>
          )}
          {order.status !== 'cancelado' && order.status !== 'entregado' && (
            <button className="adm-btn adm-btn-cancel" disabled={busy} onClick={() => setStatus('cancelado')}>
              <IconX size={14} /> Cancelar
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ============================================================
// DASHBOARD
// ============================================================
function Dashboard({ session, onLogout }) {
  const sb = window.PixelPlayAPI.getClient();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [tab, setTab] = useState('all');
  const [shot, setShot] = useState(null); // signed url for lightbox

  const load = useCallback(async () => {
    setLoading(true); setError('');
    const { data, error } = await sb
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });
    setLoading(false);
    if (error) { setError('No se pudieron cargar los pedidos: ' + error.message); return; }
    setOrders(data || []);
  }, [sb]);

  useEffect(() => { load(); }, [load]);

  const updateStatus = async (id, status) => {
    const { error } = await sb.from('orders').update({ status }).eq('id', id);
    if (error) { setError('No se pudo actualizar: ' + error.message); return; }
    setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status } : o)));
  };

  const viewShot = async (order) => {
    const { data, error } = await sb.storage
      .from('comprobantes')
      .createSignedUrl(order.screenshot_path, 3600);
    if (error || !data) { setError('No se pudo abrir el comprobante: ' + (error?.message || '')); return; }
    setShot(data.signedUrl);
  };

  const logout = async () => { await sb.auth.signOut(); onLogout(); };

  const counts = STATUSES.reduce((acc, s) => {
    acc[s] = orders.filter((o) => o.status === s).length; return acc;
  }, {});
  const filtered = tab === 'all' ? orders : orders.filter((o) => o.status === tab);

  return (
    <div className="adm-wrap">
      <div className="adm-nav">
        <div className="adm-brand">
          <span className="logo-mark" /> PixelPlay <small>· Pedidos</small>
        </div>
        <div className="adm-nav-actions">
          <button className="adm-logout" onClick={load} title="Actualizar"><IconRefresh size={15} /> Actualizar</button>
          <button className="adm-logout" onClick={logout}><IconOut size={15} /> Salir</button>
        </div>
      </div>

      <div className="adm-stats">
        <div className="adm-stat"><div className="adm-stat-num">{orders.length}</div><div className="adm-stat-lbl">Pedidos totales</div></div>
        <div className="adm-stat"><div className="adm-stat-num" style={{ color: '#fbbf24' }}>{counts.pendiente}</div><div className="adm-stat-lbl">Pendientes</div></div>
        <div className="adm-stat"><div className="adm-stat-num" style={{ color: '#60a5fa' }}>{counts.pagado}</div><div className="adm-stat-lbl">Pagados</div></div>
        <div className="adm-stat"><div className="adm-stat-num" style={{ color: '#34d399' }}>{counts.entregado}</div><div className="adm-stat-lbl">Entregados</div></div>
      </div>

      <div className="adm-tabs">
        <button className={`adm-tab ${tab === 'all' ? 'active' : ''}`} onClick={() => setTab('all')}>Todos ({orders.length})</button>
        {STATUSES.map((s) => (
          <button key={s} className={`adm-tab ${tab === s ? 'active' : ''}`} onClick={() => setTab(s)}>
            {STATUS_LABEL[s]} ({counts[s]})
          </button>
        ))}
      </div>

      {error && <div className="adm-error">{error}</div>}

      {loading ? (
        <div className="adm-loading">Cargando pedidos…</div>
      ) : filtered.length === 0 ? (
        <div className="adm-empty">No hay pedidos {tab !== 'all' ? `en "${STATUS_LABEL[tab]}"` : 'todavía'}.</div>
      ) : (
        <div className="adm-orders">
          {filtered.map((o) => (
            <OrderCard key={o.id} order={o} sb={sb} onStatus={updateStatus} onViewShot={viewShot} />
          ))}
        </div>
      )}

      {shot && (
        <div className="adm-shot-backdrop" onClick={() => setShot(null)}>
          <button className="adm-shot-close" onClick={() => setShot(null)}><IconX size={26} /></button>
          <img src={shot} alt="Comprobante de pago" onClick={(e) => e.stopPropagation()} />
        </div>
      )}
    </div>
  );
}

// ============================================================
// ROOT
// ============================================================
function AdminApp() {
  const configured = window.PixelPlayAPI && window.PixelPlayAPI.isConfigured();
  const [session, setSession] = useState(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    if (!configured) { setChecking(false); return; }
    const sb = window.PixelPlayAPI.getClient();
    sb.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setChecking(false);
    });
    const { data: sub } = sb.auth.onAuthStateChange((_e, s) => setSession(s));
    return () => { sub.subscription.unsubscribe(); };
  }, [configured]);

  if (!configured) {
    return (
      <div className="adm-login">
        <div className="adm-login-card">
          <div className="adm-brand"><span className="logo-mark" /> PixelPlay</div>
          <div className="adm-notice">
            El panel todavía no está conectado a Supabase. Completá <code>config.js</code> con
            la URL y la clave anon del proyecto y volvé a entrar.
          </div>
        </div>
      </div>
    );
  }

  if (checking) return <div className="adm-loading" style={{ paddingTop: 120 }}>Cargando…</div>;
  if (!session) return <Login onLoggedIn={setSession} />;
  return <Dashboard session={session} onLogout={() => setSession(null)} />;
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<AdminApp />);
