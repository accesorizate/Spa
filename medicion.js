/* Medición de visitas con Google Analytics 4 — solo con permiso de la persona.
   - Nada de Google Analytics se descarga ni se guarda en el navegador hasta que la persona pulsa «Aceptar».
   - Su elección queda en el almacenamiento local del navegador (clave "medicionVisitas": "si" o "no") y puede cambiarla
     en la política de privacidad (elementos con data-medicion-eleccion y data-medicion-estado).
   - Solo se mide la visita a cada página (page_view). No se envía nada del carrito ni de los datos del pedido.
   - Sin funciones de publicidad: señales de Google y personalización de anuncios desactivadas.
   El ID de la propiedad llega en el atributo data-ga de la etiqueta <script> que carga este archivo (lo escribe construir.js). */
(function () {
  "use strict";
  var etiqueta = document.currentScript;
  var ID = etiqueta && etiqueta.getAttribute("data-ga");
  if (!ID || !/^G-[A-Z0-9]{6,12}$/.test(ID)) return;
  var CLAVE = "medicionVisitas";
  var cargado = false;

  function leer() {
    try { var v = localStorage.getItem(CLAVE); return v === "si" || v === "no" ? v : null; } catch (e) { return null; }
  }
  function guardar(v) {
    try { localStorage.setItem(CLAVE, v); } catch (e) { /* sin almacenamiento: se vuelve a preguntar en la próxima página */ }
  }

  function activar() {
    window["ga-disable-" + ID] = false;
    if (cargado) return;
    cargado = true;
    window.dataLayer = window.dataLayer || [];
    function gtag() { window.dataLayer.push(arguments); }
    gtag("consent", "default", { analytics_storage: "granted", ad_storage: "denied", ad_user_data: "denied", ad_personalization: "denied" });
    gtag("js", new Date());
    gtag("config", ID, { allow_google_signals: false, allow_ad_personalization_signals: false });
    var s = document.createElement("script");
    s.async = true;
    s.src = "https://www.googletagmanager.com/gtag/js?id=" + ID;
    document.head.appendChild(s);
  }

  // Deja de medir y borra las cookies de Analytics de este navegador (_ga y _ga_<ID>), en el dominio y en sus dominios superiores.
  function desactivar() {
    window["ga-disable-" + ID] = true;
    var partes = location.hostname.split("."), dominios = [""];
    for (var i = 0; i < partes.length - 1; i++) dominios.push(partes.slice(i).join("."));
    ["_ga", "_ga_" + ID.slice(2)].forEach(function (nombre) {
      dominios.forEach(function (d) {
        document.cookie = nombre + "=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/" + (d ? "; domain=" + d : "");
      });
    });
  }

  var ESTILOS = ".medicion-aviso{position:fixed;left:12px;right:12px;bottom:12px;z-index:25;max-width:440px;box-sizing:border-box;background:var(--bg,#FBFAF7);color:var(--ink,#201B18);border:1px solid var(--line,rgba(32,27,24,.14));border-radius:12px;box-shadow:0 8px 28px rgba(32,27,24,.22);padding:14px 16px;font-size:.9rem;line-height:1.45}" +
    ".medicion-aviso p{margin:0 0 12px}.medicion-aviso a{color:var(--accent,#8C2F39);text-decoration:underline}" +
    ".medicion-botones{display:flex;gap:10px}" +
    ".medicion-botones button{flex:1;min-height:44px;padding:0 16px;border-radius:8px;border:2px solid var(--accent,#8C2F39);background:var(--bg,#FBFAF7);color:var(--accent,#8C2F39);font:inherit;font-weight:600;cursor:pointer}" +
    ".medicion-botones button[data-medicion-eleccion=si]{background:var(--accent,#8C2F39);color:var(--accent-ink,#FBFAF7)}" +
    "@media(min-width:600px){.medicion-aviso{right:auto;left:16px;bottom:16px;width:440px}}@media print{.medicion-aviso{display:none}}";

  function mostrarAviso() {
    if (document.querySelector(".medicion-aviso")) return;
    var estilo = document.createElement("style");
    estilo.textContent = ESTILOS;
    document.head.appendChild(estilo);
    var aviso = document.createElement("div");
    aviso.className = "medicion-aviso";
    aviso.setAttribute("role", "region");
    aviso.setAttribute("aria-label", "Medición de visitas");
    aviso.innerHTML = '<p>Usamos Google Analytics para saber cuántas personas visitan el sitio y qué páginas ven. Solo se activa si lo aceptas. <a href="/politica-de-privacidad/#medicion">Más información</a></p>' +
      '<div class="medicion-botones"><button type="button" data-medicion-eleccion="no">Rechazar</button><button type="button" data-medicion-eleccion="si">Aceptar</button></div>';
    document.body.appendChild(aviso);
  }
  function quitarAviso() {
    var a = document.querySelector(".medicion-aviso");
    if (a) a.remove();
  }

  // En la política de privacidad: muestra la elección actual y los botones para cambiarla (vienen ocultos en el HTML).
  function pintarEstado() {
    var v = leer(), texto = v === "si" ? "medición permitida" : v === "no" ? "medición no permitida" : "sin elegir";
    [].forEach.call(document.querySelectorAll("[data-medicion-estado]"), function (e) { e.textContent = texto; });
    [].forEach.call(document.querySelectorAll("[data-medicion-eleccion]"), function (b) { b.hidden = false; });
  }

  function elegir(v) {
    guardar(v);
    if (v === "si") activar(); else desactivar();
    quitarAviso();
    var estado = v === "si" ? "medición permitida" : "medición no permitida";
    [].forEach.call(document.querySelectorAll("[data-medicion-estado]"), function (e) { e.textContent = estado; });
  }

  document.addEventListener("click", function (ev) {
    var b = ev.target.closest ? ev.target.closest("[data-medicion-eleccion]") : null;
    if (b) elegir(b.getAttribute("data-medicion-eleccion"));
  });

  var eleccion = leer();
  if (eleccion === "si") activar();
  else if (eleccion === null) mostrarAviso();
  pintarEstado();
})();
