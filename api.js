/* ============================================================
   PixelPlay — capa de API del cliente (sin build, JS plano).
   Usa @supabase/supabase-js (UMD) cargado desde CDN como `window.supabase`.
   Expone window.PixelPlayAPI:
     · isConfigured()            -> bool (config lista)
     · compressImage(file)       -> { base64, ext, contentType }
     · submitOrder(payload)      -> { ok, order_number } | { ok:false, message }
   ============================================================ */
(function () {
  var cfg = window.PIXELPLAY_CONFIG || {};
  var _client = null;

  function isConfigured() {
    return !!(
      cfg.SUPABASE_URL &&
      cfg.SUPABASE_ANON_KEY &&
      cfg.SUPABASE_URL.indexOf("TU-PROYECTO") === -1 &&
      cfg.SUPABASE_ANON_KEY.indexOf("TU_ANON_KEY") === -1
    );
  }

  // Cliente compartido (también lo usa el panel /admin para auth + lectura).
  function getClient() {
    if (_client) return _client;
    if (!window.supabase || !window.supabase.createClient) {
      throw new Error("supabase-js no cargó (revisá el <script> del CDN).");
    }
    _client = window.supabase.createClient(
      cfg.SUPABASE_URL,
      cfg.SUPABASE_ANON_KEY
    );
    return _client;
  }

  // Comprime/redimensiona la imagen del comprobante antes de enviarla.
  // Mantiene el payload chico (~max 1400px, JPEG 0.82). Devuelve dataURL.
  function compressImage(file) {
    return new Promise(function (resolve, reject) {
      if (!file) return reject(new Error("No hay archivo."));
      var reader = new FileReader();
      reader.onerror = function () {
        reject(new Error("No se pudo leer el archivo."));
      };
      reader.onload = function () {
        var img = new Image();
        img.onerror = function () {
          reject(new Error("El archivo no es una imagen válida."));
        };
        img.onload = function () {
          var MAX = 1400;
          var w = img.width;
          var h = img.height;
          if (w > MAX || h > MAX) {
            if (w >= h) {
              h = Math.round((h * MAX) / w);
              w = MAX;
            } else {
              w = Math.round((w * MAX) / h);
              h = MAX;
            }
          }
          var canvas = document.createElement("canvas");
          canvas.width = w;
          canvas.height = h;
          var ctx = canvas.getContext("2d");
          ctx.fillStyle = "#ffffff";
          ctx.fillRect(0, 0, w, h);
          ctx.drawImage(img, 0, 0, w, h);
          var dataUrl = canvas.toDataURL("image/jpeg", 0.82);
          resolve({ base64: dataUrl, ext: "jpg", contentType: "image/jpeg" });
        };
        img.src = reader.result;
      };
      reader.readAsDataURL(file);
    });
  }

  // Envía el pedido: comprime el comprobante y llama a la edge function.
  async function submitOrder(payload) {
    if (!isConfigured()) {
      return {
        ok: false,
        message:
          "La tienda todavía no está conectada a Supabase. Avisale al equipo.",
      };
    }
    try {
      var shot = await compressImage(payload.file);
      var client = getClient();
      var body = {
        customer: payload.customer,
        paymentMethod: payload.paymentMethod,
        items: payload.items,
        subtotal: payload.subtotal,
        discount: payload.discount,
        total: payload.total,
        screenshot: shot,
      };
      var res = await client.functions.invoke("crear-pedido", { body: body });
      if (res.error) {
        // Intentamos sacar el mensaje real que devolvió la función.
        var msg = "No se pudo registrar el pedido. Intentá de nuevo.";
        try {
          if (res.error.context && typeof res.error.context.json === "function") {
            var j = await res.error.context.json();
            if (j && j.message) msg = j.message;
          }
        } catch (_) {}
        return { ok: false, message: msg };
      }
      if (!res.data || !res.data.ok) {
        return {
          ok: false,
          message: (res.data && res.data.message) || "Error al registrar el pedido.",
        };
      }
      return { ok: true, order_number: res.data.order_number };
    } catch (err) {
      return {
        ok: false,
        message: (err && err.message) || "Error inesperado al enviar el pedido.",
      };
    }
  }

  window.PixelPlayAPI = {
    isConfigured: isConfigured,
    getClient: getClient,
    compressImage: compressImage,
    submitOrder: submitOrder,
  };
})();
