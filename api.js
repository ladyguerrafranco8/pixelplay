(function () {
  const cfg = window.PIXELPLAY_CONFIG || {};
  const url = cfg.SUPABASE_URL || '';
  const key = cfg.SUPABASE_ANON_KEY || '';

  let client = null;
  if (url && key && !url.includes('TU-PROYECTO')) {
    client = window.supabase.createClient(url, key);
  }

  window.PixelPlayAPI = {
    isConfigured: () => !!client,
    getClient: () => client,
  };
})();
