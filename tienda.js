// ===========================================================
// PRODUCTOS OCULTOS
// La lista se escribe al comienzo del archivo (PRODUCTOS_OCULTOS). Aquí solo
// se lee y se deja fuera de la tienda lo que hoy no está disponible.
// Si esa lista tuviera un error de escritura, la tienda muestra todo (no se rompe).
// ===========================================================
function normalizarTexto(s) {
  return String(s ?? "").normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().replace(/\s+/g, " ").trim();
}

// "15-12-2026", "15/12/2026" o "2026-12-15" -> Date a las 00:00 de ese día; null si no se entiende.
function leerFecha(texto) {
  const m = /^(\d{1,4})[-/.](\d{1,2})[-/.](\d{1,4})$/.exec(String(texto).trim());
  if (!m) return null;
  const [anio, mes, dia] = m[1].length === 4 ? [+m[1], +m[2], +m[3]] : [+m[3], +m[2], +m[1]];
  const f = new Date(anio, mes - 1, dia);
  return f.getFullYear() === anio && f.getMonth() === mes - 1 && f.getDate() === dia ? f : null;
}

function leerReglasOcultos(texto) {
  return String(texto || "").split("\n").map(l => l.trim()).filter(l => l && !l.startsWith("#")).map(linea => {
    const partes = linea.split("|");
    let nombre = partes[0].trim();
    const esCategoria = /^categor[ií]a\s*:/i.test(nombre);
    if (esCategoria) nombre = nombre.replace(/^categor[ií]a\s*:/i, "").trim();
    const resto = partes.slice(1).join("|").trim();
    const vuelve = resto ? leerFecha(resto.replace(/^(vuelve|hasta)\s+(el\s+)?/i, "")) : null;
    return { linea, clave: normalizarTexto(nombre), esCategoria, vuelve, fechaNoEntendida: !!resto && !vuelve };
  });
}

const REGLAS_OCULTOS = leerReglasOcultos(typeof PRODUCTOS_OCULTOS === "string" ? PRODUCTOS_OCULTOS : "");

// ¿La línea de la lista apunta a este producto? (por nombre, por código o por categoría)
function reglaCoincide(regla, prod) {
  if (!regla.clave) return false;
  return regla.esCategoria
    ? normalizarTexto(prod.categoria) === regla.clave
    : normalizarTexto(prod.id) === regla.clave || normalizarTexto(prod.nombre) === regla.clave;
}

// Oculta hasta que llegue el día de regreso; sin fecha, hasta que se borre la línea.
function reglaVigente(regla) {
  if (!regla.vuelve) return true;
  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);
  return hoy < regla.vuelve;
}

// Desde aquí, toda la tienda trabaja solo con los productos que sí están disponibles.
const productos = TODOS_LOS_PRODUCTOS.filter(p => !REGLAS_OCULTOS.some(r => reglaVigente(r) && reglaCoincide(r, p)));

REGLAS_OCULTOS.forEach(r => {
  if (!TODOS_LOS_PRODUCTOS.some(p => reglaCoincide(r, p))) {
    console.warn(`[Productos ocultos] La línea "${r.linea}" no coincide con ningún producto. Revisa cómo está escrita.`);
  }
});

// ===========================================================
// 2) A partir de aquí es el motor de la tienda. No hace falta tocarlo.
// ===========================================================
const formatoCLP = n => n.toLocaleString("es-CL", { style: "currency", currency: "CLP", maximumFractionDigits: 0 });

function cantidadNumerica(valor) {
  const match = /^(\d+)/.exec(valor || "");
  return match ? parseInt(match[1], 10) : 1;
}

function leerSeleccionDeCard(card) {
  const seleccion = {};
  card.querySelectorAll("select[data-opcion]").forEach(s => {
    const nombre = s.dataset.opcion;
    if (!(nombre in seleccion)) {
      seleccion[nombre] = s.value;
    } else if (Array.isArray(seleccion[nombre])) {
      seleccion[nombre].push(s.value);
    } else {
      seleccion[nombre] = [seleccion[nombre], s.value];
    }
  });
  return seleccion;
}

function formatoValorSeleccion(v) {
  return Array.isArray(v) ? v.join(", ") : v;
}

function precioProducto(prod, seleccion) {
  if (prod.combinacionPrecio && prod.preciosPorCombinacion) {
    const clave = prod.combinacionPrecio.map(opcionNombre => seleccion[opcionNombre]).join("|");
    const precio = prod.preciosPorCombinacion[clave];
    if (precio !== undefined) return precio;
  }
  if (prod.grupoPrecio) return prod.precios[seleccion[prod.grupoPrecio]] ?? 0;
  return prod.precioBase ?? 0;
}

function precioDesde(prod) {
  if (prod.preciosPorCombinacion) return Math.min(...Object.values(prod.preciosPorCombinacion));
  if (prod.grupoPrecio) return Math.min(...Object.values(prod.precios));
  return prod.precioBase ?? 0;
}

function rutaDesdePlantilla(plantilla, seleccion) {
  let completa = true;
  const ruta = plantilla.replace(/\{([^}]+)\}/g, (_, nombre) => {
    const valor = seleccion[nombre];
    if (valor === undefined || Array.isArray(valor)) { completa = false; return ""; }
    return valor;
  });
  return completa ? ruta : null;
}

function imagenRespaldo(prod) {
  const portada = Array.isArray(prod.imagen) ? prod.imagen[0] : prod.imagen;
  return portada || "imagenes/logo.png";
}

function imagenProducto(prod, seleccion, { priorizarPortada = false } = {}) {
  if (priorizarPortada && prod.imagen) return prod.imagen;

  if (prod.combinacionImagen && prod.imagenesPorCombinacion) {
    const clave = prod.combinacionImagen.map(opcionNombre => seleccion[opcionNombre]).join("|");
    const ruta = prod.imagenesPorCombinacion[clave];
    if (ruta) return ruta;
  }
  if (prod.imagenPlantilla) {
    const ruta = rutaDesdePlantilla(prod.imagenPlantilla, seleccion);
    if (ruta) return ruta;
  }
  if (prod.imagenesPorOpcion) {
    for (const opcionNombre in prod.imagenesPorOpcion) {
      const valorElegido = seleccion[opcionNombre];
      const ruta = prod.imagenesPorOpcion[opcionNombre]?.[valorElegido];
      if (ruta) return ruta;
    }
  }
  return prod.imagen || "imagenes/logo.png";
}

function listaImagenesProducto(prod, seleccion, opciones) {
  const resultado = imagenProducto(prod, seleccion, opciones);
  return Array.isArray(resultado) ? resultado : [resultado];
}

document.addEventListener("error", e => {
  const img = e.target;
  if (!(img instanceof HTMLImageElement) || !img.dataset.respaldo) return;
  const aUrl = ruta => new URL(ruta, document.baseURI).href;
  const logo = "imagenes/logo.png";
  if (img.src === aUrl(logo)) return;
  img.src = img.src === aUrl(img.dataset.respaldo) ? logo : img.dataset.respaldo;
}, true);

// -- Render del catálogo, agrupado por categoría --
// Cada página propia define window.CONFIG_PAGINA para mostrar solo lo suyo. En el inicio no existe y se muestra todo.
//   Página de categoría:  { categorias: [...], tituloSeccion: ... }
//   Página de producto:   { productos: ["id-del-producto", ...], tituloSeccion: "...", categoriaActiva: "Cuadros" }
//     (categoriaActiva = categoría que se marca en el menú, porque el producto vive dentro de esa categoría).
//   Guía o página de ideas (carpeta /ideas/): { guia: true }. No muestra catálogo; solo el menú, el carrito y el texto de la página.
const PAGINA = window.CONFIG_PAGINA || {};
const esPaginaPropia = !!(PAGINA.categorias || PAGINA.productos || PAGINA.guia);

// En las páginas de categoría, solo la primera foto se pide de inmediato y con prioridad alta (es lo primero que
// ve el cliente); las demás esperan y van con prioridad baja para no quitarle velocidad a la primera.
// En el inicio todas cargan al acercarse.
let fotosConPrioridad = esPaginaPropia ? 1 : 0;
const categorias = [...new Set(productos.map(p => p.categoria))];
const categoriasDeLaPagina = PAGINA.categorias ? categorias.filter(c => PAGINA.categorias.includes(c)) : (PAGINA.productos || PAGINA.guia ? [] : categorias);
const catalogoEl = document.getElementById("catalogo");
const navEl = document.getElementById("catNav");
const chipsEl = document.getElementById("catNavChips");

function slugDeCategoria(cat) { return cat.toLowerCase().replace(/[^a-z0-9]+/g, "-"); }

// A dónde lleva una categoría en el menú: a su página si tiene (ver PAGINAS_DE_CATEGORIA
// en catalogo.js) o a su sección dentro del inicio.
function enlaceDeCategoria(cat) {
  if (typeof PAGINAS_DE_CATEGORIA !== "undefined" && PAGINAS_DE_CATEGORIA[cat]) return PAGINAS_DE_CATEGORIA[cat];
  return (esPaginaPropia ? "/" : "") + "#" + slugDeCategoria(cat);
}

function tituloDeSeccion(cat) {
  const t = PAGINA.tituloSeccion;
  return (t && typeof t === "object" ? t[cat] : t) || cat;
}

// Menú: una sola entrada por dirección (si dos categorías comparten página, se muestra la primera).
// El menú ya viene escrito en el HTML de cada página; aquí se vuelve a armar con lo que hay disponible
// hoy, así que si coincide no se mueve nada.
const direccionesDelMenu = new Set();
let menuHtml = "";
categorias.forEach(cat => {
  const href = enlaceDeCategoria(cat);
  if (direccionesDelMenu.has(href)) return;
  direccionesDelMenu.add(href);
  const esLaPagina = !!(PAGINA.categorias && PAGINA.categorias.includes(cat));
  const esLaSeccion = !esLaPagina && !!PAGINA.categoriaActiva && enlaceDeCategoria(PAGINA.categoriaActiva) === href;
  menuHtml += `<a href="${href}"${esLaPagina ? ' class="activa" aria-current="page"' : esLaSeccion ? ' class="activa"' : ""}>${cat}</a>`;
});
navEl.innerHTML = menuHtml;
if (chipsEl) chipsEl.innerHTML = menuHtml;

// Página de producto: una sola sección con los productos que ella nombra (los ocultos no aparecen).
const productosDeLaPagina = PAGINA.productos ? PAGINA.productos.map(id => productos.find(p => p.id === id)).filter(Boolean) : [];
if (productosDeLaPagina.length) {
  const seccion = document.createElement("section");
  seccion.className = "categoria";
  seccion.id = "productos";
  seccion.innerHTML = `<div class="wrap"><h2>${tituloDeSeccion("")}</h2><div class="grid">${productosDeLaPagina.map(renderCard).join("")}</div></div>`;
  catalogoEl.appendChild(seccion);
}

categoriasDeLaPagina.forEach(cat => {
  const slug = slugDeCategoria(cat);
  const seccion = document.createElement("section");
  seccion.className = "categoria";
  seccion.id = slug;
  seccion.innerHTML = `<div class="wrap"><h2>${tituloDeSeccion(cat)}</h2><div class="grid">${
    productos.filter(p => p.categoria === cat).map(renderCard).join("")
  }</div></div>`;
  catalogoEl.appendChild(seccion);
});

// Página de categoría cuyos productos están todos ocultos por ahora.
if ((PAGINA.categorias && !categoriasDeLaPagina.length) || (PAGINA.productos && !productosDeLaPagina.length)) {
  catalogoEl.innerHTML = `<p class="sin-productos">Por ahora no tenemos productos disponibles en esta categoría. <a href="/">Volver al inicio</a>.</p>`;
}

// -- Categoría activa mientras se scrollea --
const seccionesCategoria = document.querySelectorAll("section.categoria");
const headerEl = document.querySelector("header");

function actualizarCategoriaActiva() {
  if (esPaginaPropia) return; // en una página de categoría o de producto el menú ya marca dónde estás
  const limite = headerEl.offsetHeight + 12;
  let activa = null;
  seccionesCategoria.forEach(seccion => {
    if (seccion.getBoundingClientRect().top <= limite) {
      activa = seccion.id;
    }
  });
  document.querySelectorAll("#catNav a, #catNavChips a").forEach(enlace => {
    enlace.classList.toggle("activa", activa !== null && enlace.getAttribute("href") === `#${activa}`);
  });
}

let categoriaActivaEnEspera = false;
window.addEventListener("scroll", () => {
  if (categoriaActivaEnEspera) return;
  categoriaActivaEnEspera = true;
  requestAnimationFrame(() => {
    actualizarCategoriaActiva();
    categoriaActivaEnEspera = false;
  });
});
actualizarCategoriaActiva();

// ---- Opciones de un producto ----
// Las usan la tarjeta del catálogo y el editor del carrito, así ambos se
// comportan igual (opciones que dependen de otra, un diseño por unidad, etc.).
function htmlOpciones(valores, elegido) {
  return valores.map(v => `<option value="${v}"${v === elegido ? " selected" : ""}>${v}</option>`).join("");
}

// "etiqueta" es el nombre que leen los lectores de pantalla (aria-label): la etiqueta visible no está unida al select.
function selectOpcionHtml(attrId, nombre, valores, elegido, dependeDe, etiqueta) {
  return `
    <select ${attrId} data-opcion="${nombre}" aria-label="${etiqueta || nombre}"${dependeDe ? ` data-depende-de="${dependeDe}"` : ""}>
      ${htmlOpciones(valores, elegido)}
    </select>
  `;
}

function etiquetaMultiple(op, n) {
  return `${op.nombre} (${n === 1 ? "elige 1 diseño" : `elige ${n} diseños, uno por unidad`})`;
}

// attrId marca de quién es cada select: en la tarjeta es data-prod="id",
// en el editor del carrito es data-edit="lineaId".
function opcionesHtmlDe(prod, seleccion, attrId) {
  return prod.opciones.map(op => {
    if (op.multiplePorCantidad) {
      const n = cantidadNumerica(seleccion[op.multiplePorCantidad]);
      const elegidos = [].concat(seleccion[op.nombre] ?? []);
      const selectsHtml = Array.from({ length: n }, (_, i) =>
        selectOpcionHtml(attrId, op.nombre, op.valores, elegidos[i] ?? op.valores[0], undefined, `${op.nombre} de ${prod.nombre}, unidad ${i + 1}`)
      ).join("");
      return `
        <div class="opcion opcion-multiple" data-opcion-multiple="${op.nombre}">
          <label>${etiquetaMultiple(op, n)}</label>
          <div class="opcion-multiple-selects">${selectsHtml}</div>
        </div>
      `;
    }
    const valores = op.dependeDe ? (op.valoresPorPadre?.[seleccion[op.dependeDe]] || []) : op.valores;
    return `
      <div class="opcion">
        <label>${op.nombre}</label>
        ${selectOpcionHtml(attrId, op.nombre, valores, seleccion[op.nombre], op.dependeDe, `${op.nombre} de ${prod.nombre}`)}
      </div>
    `;
  }).join("");
}

function renderCard(prod) {
  const seleccionInicial = valoresPorDefecto(prod);
  // Si el producto tiene su propia página (PAGINAS_DE_PRODUCTO en catalogo.js), la foto y el nombre llevan a ella.
  // Dentro de esa misma página no se enlaza a sí misma.
  const fichaDelProducto = typeof PAGINAS_DE_PRODUCTO !== "undefined" && PAGINAS_DE_PRODUCTO[prod.id];
  const enlazarFicha = fichaDelProducto && !(PAGINA.productos && PAGINA.productos.includes(prod.id));

  let cargaFoto = esPaginaPropia ? 'loading="lazy" fetchpriority="low"' : 'loading="lazy"';
  if (fotosConPrioridad > 0) {
    fotosConPrioridad--;
    cargaFoto = 'loading="eager" fetchpriority="high"';
  }

  const opcionesHtml = opcionesHtmlDe(prod, seleccionInicial, `data-prod="${prod.id}"`);

  const notaHtml = prod.personalizable
    ? `<p class="nota-personalizada">Después de comprar, envíanos tu foto o diseño a <strong>venta.accesorizate@gmail.com</strong> indicando tu número de pedido.</p>`
    : "";

  const imagenesIniciales = listaImagenesProducto(prod, seleccionInicial, { priorizarPortada: true });
  const dotsHtml = imagenesIniciales.length > 1
    ? `<div class="card-media-dots">${imagenesIniciales.map((_, i) =>
        `<button type="button" class="media-dot${i === 0 ? " active" : ""}" data-indice="${i}" aria-label="Ver foto ${i + 1}"></button>`
      ).join("")}</div>`
    : "";
  const media = `
    <div class="card-media" data-media-de="${prod.id}" data-imagenes='${JSON.stringify(imagenesIniciales)}'>
      <img data-imagen-de="${prod.id}" src="${imagenesIniciales[0]}" data-respaldo="${imagenRespaldo(prod)}" alt="${prod.alt || prod.nombre}" ${cargaFoto} decoding="async">
      ${enlazarFicha ? `<a class="card-media-link" href="${fichaDelProducto}" tabindex="-1" aria-hidden="true"></a>` : ""}
      ${dotsHtml}
    </div>
  `;

  const botonHtml = prod.accionPersonalizada?.tipo === "whatsapp"
    ? `<button type="button" class="add-btn" onclick="cotizarPorWhatsapp('${prod.id}')">Cotizar por WhatsApp</button>`
    : `<button type="button" class="add-btn" onclick="agregarAlCarrito('${prod.id}')">Agregar</button>`;

  const precioHtml = prod.sinPrecio
    ? ""
    : `<span class="price" data-precio-de="${prod.id}">${formatoCLP(precioProducto(prod, seleccionInicial))}</span>`;

  return `
    <article class="card" data-card-id="${prod.id}">
      ${media}
      <div class="card-body">
        <h3>${enlazarFicha ? `<a class="card-titulo-link" href="${fichaDelProducto}">${prod.nombre}</a>` : prod.nombre}</h3>
        <p class="desc">${prod.descripcion}</p>
        ${enlazarFicha ? `<a class="ver-detalles" href="${fichaDelProducto}" aria-label="Ver detalles de ${prod.nombre}">Ver detalles</a>` : ""}
        ${opcionesHtml}
        ${notaHtml}
        <div class="card-foot${prod.sinPrecio ? " sin-precio" : ""}">
          ${precioHtml}
          ${botonHtml}
        </div>
      </div>
    </article>
  `;
}

function valoresPorDefecto(prod) {
  const sel = {};
  prod.opciones.forEach(op => {
    if (op.multiplePorCantidad) {
      const n = cantidadNumerica(sel[op.multiplePorCantidad]);
      sel[op.nombre] = Array.from({ length: n }, () => op.valores[0]);
    } else if (op.dependeDe) {
      const lista = op.valoresPorPadre?.[sel[op.dependeDe]] || [];
      sel[op.nombre] = lista[0] || "";
    } else {
      sel[op.nombre] = op.valores[0];
    }
  });
  return sel;
}

// -- Destacados --
const destacadosGrid = document.getElementById("destacadosGrid");
if (destacadosGrid) {
  const idsDestacados = ["stickers-anime", "libretas", "llavero", "cuadro-foto", "photocards"];
  const listaDestacados = idsDestacados
    .map(id => productos.find(p => p.id === id))
    .filter(Boolean);

  // Si todos los destacados están ocultos, no se muestra la sección vacía.
  if (!listaDestacados.length) destacadosGrid.closest("section").style.display = "none";

  const destacadosCardsHtml = listaDestacados.map(prod => {
    const media = `<img src="${listaImagenesProducto(prod, valoresPorDefecto(prod), { priorizarPortada: true })[0]}" data-respaldo="${imagenRespaldo(prod)}" alt="${prod.alt || prod.nombre}" loading="lazy" decoding="async">`;
    return `
      <a class="destacado-card" href="${enlaceDeCategoria(prod.categoria)}">
        <div class="destacado-media">${media}</div>
        <div class="destacado-body">
          <h3>${prod.nombre}</h3>
          <span class="desde">Desde ${formatoCLP(precioDesde(prod))}</span>
        </div>
      </a>
    `;
  }).join("");

  destacadosGrid.innerHTML = `
    <div class="destacados-set">${destacadosCardsHtml}</div>
    <div class="destacados-set" aria-hidden="true">${destacadosCardsHtml}</div>
  `;
}

// -- Datos estructurados (Schema.org) del producto, para buscadores --
// Solo en páginas que muestran UN producto con precio (Google pide el marcado de producto en páginas de un solo
// producto, no en listados). Se arman desde el mismo catálogo que dibuja la tarjeta, así que el precio es el que
// el cliente ve al abrir la página (el de las opciones que vienen marcadas) y, si un producto está oculto, no se escribe nada.
// Los cotizados por WhatsApp (sinPrecio) no llevan precio, por lo tanto tampoco llevan este marcado.
function datosEstructuradosDeProducto() {
  if (!esPaginaPropia) return;
  const visibles = PAGINA.productos ? productosDeLaPagina : productos.filter(p => categoriasDeLaPagina.includes(p.categoria));
  if (visibles.length !== 1 || visibles[0].sinPrecio) return;
  const prod = visibles[0];
  const precio = precioProducto(prod, valoresPorDefecto(prod));
  if (!(precio > 0)) return;
  const dominio = "https://accesorizate.cl/";
  const canonica = (document.querySelector('link[rel="canonical"]') || {}).href || dominio;
  const meta = document.querySelector('meta[name="description"]');
  const portada = Array.isArray(prod.imagen) ? prod.imagen[0] : prod.imagen;
  const dato = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": prod.nombre,
    "description": (meta && meta.content) || prod.descripcion,
    "sku": prod.id,
    "brand": { "@type": "Brand", "name": "Accesorizate" },
    "offers": {
      "@type": "Offer",
      "url": canonica,
      "price": precio,
      "priceCurrency": "CLP",
      "availability": "https://schema.org/InStock",
      "itemCondition": "https://schema.org/NewCondition",
      "seller": { "@type": "Organization", "name": "Accesorizate" }
    }
  };
  if (portada) dato.image = new URL(portada, dominio).href;
  let el = document.getElementById("ld-producto");
  if (!el) {
    el = document.createElement("script");
    el.type = "application/ld+json";
    el.id = "ld-producto";
    document.head.appendChild(el);
  }
  el.textContent = JSON.stringify(dato).replace(/</g, "\\u003c");
}
datosEstructuradosDeProducto();

// Catálogo y destacados ya están armados: se muestra lo que iba debajo (ver .esperar-catalogo en tienda.css).
document.body.classList.add("tienda-lista");

// Cuando cambia una opción, actualiza las que dependen de ella: la lista de
// valores de una opción "dependeDe" y la cantidad de selects de un "uno por
// unidad". Es recursivo (Tipo -> Cantidad -> Diseño). "contenedor" es la
// tarjeta del catálogo o el editor del carrito.
function actualizarOpcionesDependientes(prod, contenedor, opcionCambiada, valorCambiado, attrId) {
  prod.opciones.filter(op => op.dependeDe === opcionCambiada).forEach(op => {
    const sel = contenedor.querySelector(`select[data-opcion="${op.nombre}"]`);
    if (!sel) return;
    const valorPrevio = sel.value;
    sel.innerHTML = htmlOpciones(op.valoresPorPadre?.[valorCambiado] || [], valorPrevio);
    actualizarOpcionesDependientes(prod, contenedor, op.nombre, sel.value, attrId);
  });

  prod.opciones.filter(op => op.multiplePorCantidad === opcionCambiada).forEach(op => {
    const cont = contenedor.querySelector(`[data-opcion-multiple="${op.nombre}"]`);
    if (!cont) return;
    const previos = [...cont.querySelectorAll("select")].map(s => s.value);
    const n = cantidadNumerica(valorCambiado);
    cont.querySelector(".opcion-multiple-selects").innerHTML = Array.from({ length: n }, (_, i) =>
      selectOpcionHtml(attrId, op.nombre, op.valores, previos[i] || op.valores[0], undefined, `${op.nombre} de ${prod.nombre}, unidad ${i + 1}`)
    ).join("");
    const label = cont.querySelector("label");
    if (label) label.textContent = etiquetaMultiple(op, n);
  });
}

document.addEventListener("change", e => {
  if (e.target.matches("select[data-edit]")) { alCambiarOpcionEnEditor(e.target); return; }
  if (!e.target.matches("select[data-prod]")) return;
  const id = e.target.dataset.prod;
  const prod = productos.find(p => p.id === id);
  const card = e.target.closest(".card");

  actualizarOpcionesDependientes(prod, card, e.target.dataset.opcion, e.target.value, `data-prod="${id}"`);

  const seleccion = leerSeleccionDeCard(card);
  if (!prod.sinPrecio) {
    card.querySelector(`[data-precio-de="${id}"]`).textContent = formatoCLP(precioProducto(prod, seleccion));
  }

  const mediaEl = card.querySelector(`[data-media-de="${id}"]`);
  if (mediaEl) {
    const imagenes = listaImagenesProducto(prod, seleccion);
    mediaEl.dataset.imagenes = JSON.stringify(imagenes);
    const imgEl = mediaEl.querySelector("img");
    if (imgEl) imgEl.src = imagenes[0];
    const dotsPrevios = mediaEl.querySelector(".card-media-dots");
    if (dotsPrevios) dotsPrevios.remove();
    if (imagenes.length > 1) {
      mediaEl.insertAdjacentHTML("beforeend", `
        <div class="card-media-dots">${imagenes.map((_, i) =>
          `<button type="button" class="media-dot${i === 0 ? " active" : ""}" data-indice="${i}" aria-label="Ver foto ${i + 1}"></button>`
        ).join("")}</div>
      `);
    }
  }
});

document.addEventListener("click", e => {
  const punto = e.target.closest(".media-dot");
  if (!punto) return;
  const contenedor = punto.closest("[data-media-de]");
  if (!contenedor) return;
  const imagenes = JSON.parse(contenedor.dataset.imagenes || "[]");
  const indice = Number(punto.dataset.indice);
  const imgEl = contenedor.querySelector("img");
  if (imgEl && imagenes[indice]) imgEl.src = imagenes[indice];
  contenedor.querySelectorAll(".media-dot").forEach((d, i) => d.classList.toggle("active", i === indice));
});

function cotizarPorWhatsapp(id) {
  const prod = productos.find(p => p.id === id);
  const card = document.querySelector(`.card[data-card-id="${id}"]`);
  const seleccion = leerSeleccionDeCard(card);
  const detalle = Object.entries(seleccion).map(([k, v]) => `${k}: ${formatoValorSeleccion(v)}`).join(" · ");

  let mensaje = prod.accionPersonalizada.mensaje;
  if (detalle) mensaje += `\n\nDetalle: ${detalle}`;

  window.open(`https://wa.me/56920635715?text=${encodeURIComponent(mensaje)}`, "_blank");
}

// -- Carrito --
let carrito = JSON.parse(localStorage.getItem("carrito") || "[]");
// Mientras el cliente edita un producto del carrito: { lineaId, seleccion } con lo que va eligiendo.
let edicion = null;

// Si un producto que el cliente tenía en el carrito pasó a estar oculto (sin stock),
// se quita del carrito y se le explica la próxima vez que lo abra.
function leerAvisosCarrito() {
  try { return JSON.parse(localStorage.getItem("avisoCarrito") || "[]"); } catch (e) { return []; }
}
function guardarAvisosCarrito(lista) {
  try { localStorage.setItem("avisoCarrito", JSON.stringify(lista)); } catch (e) { /* sin almacenamiento: no pasa nada */ }
}
{
  const idsVisibles = new Set(productos.map(p => p.id));
  const quitadas = carrito.filter(l => !idsVisibles.has(l.id));
  if (quitadas.length) {
    carrito = carrito.filter(l => idsVisibles.has(l.id));
    localStorage.setItem("carrito", JSON.stringify(carrito));
    guardarAvisosCarrito([...new Set([...leerAvisosCarrito(), ...quitadas.map(l => l.nombre)])]);
  }
}

function agregarAlCarrito(id) {
  const prod = productos.find(p => p.id === id);
  const card = document.querySelector(`.card[data-card-id="${id}"]`);
  const seleccion = leerSeleccionDeCard(card);
  const precio = precioProducto(prod, seleccion);
  // Foto que el cliente está viendo en la tarjeta (la de la variante elegida).
  const imgCard = card.querySelector(".card-media img");
  const imagen = (imgCard && imgCard.getAttribute("src")) || imagenRespaldo(prod);
  const lineaId = Date.now() + Math.random();

  carrito.push({
    lineaId,
    id, nombre: prod.nombre, seleccion, precio, cantidad: 1, imagen
  });
  guardarYRenderizarCarrito();
  abrirCarrito();
  resaltarLinea(lineaId);
}

// Marca la línea recién agregada y, si queda fuera de vista, la trae a la pantalla.
function resaltarLinea(lineaId) {
  const el = document.querySelector(`.cart-line[data-linea="${lineaId}"]`);
  if (!el) return;
  el.classList.add("nueva");
  traerALaVista(el);
}

// Desplaza la lista del carrito lo justo para que "el" quede a la vista.
// Si es más alto que la zona visible, deja visible su parte de arriba.
function traerALaVista(el) {
  const cont = document.getElementById("cartScroll");
  const r = el.getBoundingClientRect();
  const c = cont.getBoundingClientRect();
  if (r.height > c.height || r.top < c.top) cont.scrollTop += r.top - c.top - 8;
  else if (r.bottom > c.bottom) cont.scrollTop += r.bottom - c.bottom + 12;
}

// ---- Editar un producto que ya está en el carrito ----
function mismaSeleccion(a, b) {
  return JSON.stringify(a) === JSON.stringify(b);
}

// Foto de la línea: la que ya tenía mientras no cambien las opciones; si las
// cambian, la de la nueva variante.
function fotoDeLinea(prod, linea, seleccion) {
  return mismaSeleccion(seleccion, linea.seleccion)
    ? (linea.imagen || imagenRespaldo(prod))
    : listaImagenesProducto(prod, seleccion)[0];
}

function editarLinea(lineaId) {
  const l = carrito.find(x => x.lineaId === lineaId);
  if (!l) return;
  edicion = { lineaId, seleccion: JSON.parse(JSON.stringify(l.seleccion)) };
  renderizarCarrito();
  const el = document.querySelector(`.cart-line[data-linea="${lineaId}"]`);
  if (el) traerALaVista(el);
}

function cancelarEdicion() {
  if (!edicion) return;
  const lineaId = edicion.lineaId;
  edicion = null;
  renderizarCarrito();
  const el = document.querySelector(`.cart-line[data-linea="${lineaId}"]`);
  if (el) traerALaVista(el);
}

function guardarEdicion() {
  if (!edicion) return;
  const lineaId = edicion.lineaId;
  const l = carrito.find(x => x.lineaId === lineaId);
  const prod = l && productos.find(p => p.id === l.id);
  if (l && prod) {
    const editor = document.querySelector(`.cart-line-editor[data-editor="${lineaId}"]`);
    const nueva = editor ? leerSeleccionDeCard(editor) : edicion.seleccion;
    if (!mismaSeleccion(nueva, l.seleccion)) {
      l.imagen = fotoDeLinea(prod, l, nueva);
      l.seleccion = nueva;
      l.precio = precioProducto(prod, nueva);
    }
  }
  edicion = null;
  guardarYRenderizarCarrito();
  resaltarLinea(lineaId);
}

// Al cambiar una opción en el editor: actualiza opciones dependientes, precio y foto.
function alCambiarOpcionEnEditor(select) {
  if (!edicion) return;
  const l = carrito.find(x => x.lineaId === edicion.lineaId);
  const prod = l && productos.find(p => p.id === l.id);
  const editor = select.closest(".cart-line-editor");
  if (!prod || !editor) return;

  actualizarOpcionesDependientes(prod, editor, select.dataset.opcion, select.value, `data-edit="${edicion.lineaId}"`);

  const seleccion = leerSeleccionDeCard(editor);
  edicion.seleccion = seleccion;
  editor.querySelector("[data-editor-precio]").textContent = formatoCLP(precioProducto(prod, seleccion));
  const foto = editor.closest(".cart-line").querySelector(".cart-line-thumb");
  if (foto) foto.src = fotoDeLinea(prod, l, seleccion);
}

function cambiarCantidad(lineaId, delta) {
  const linea = carrito.find(l => l.lineaId === lineaId);
  if (!linea) return;
  linea.cantidad += delta;
  if (linea.cantidad <= 0) carrito = carrito.filter(l => l.lineaId !== lineaId);
  guardarYRenderizarCarrito();
}

function eliminarLinea(lineaId) {
  carrito = carrito.filter(l => l.lineaId !== lineaId);
  guardarYRenderizarCarrito();
}

function guardarYRenderizarCarrito() {
  localStorage.setItem("carrito", JSON.stringify(carrito));
  renderizarCarrito();
}

// Costo del método de envío elegido. "Periferia" y "Retiro" son $0 en el sitio.
function costoEnvioActual() {
  const radio = document.querySelector('input[name="metodoEnvio"]:checked');
  return radio ? Number(radio.dataset.costo) : 0;
}

// Describe el método de envío elegido para el mensaje de WhatsApp.
function envioDescripcionActual() {
  const radio = document.querySelector('input[name="metodoEnvio"]:checked');
  if (!radio) return "";
  if (radio.value === "retiro") {
    return "Retiro en domicilio — Psje Tirteo 2769, Maipú (gratis)";
  }
  if (radio.value === "regiones") {
    const transportista = document.getElementById("selectTransportista").value;
    return `Periferia / regiones — ${transportista} (envío por pagar al recibir)`;
  }
  return "Estándar (Santiago)";
}

// Si el método elegido es "Retiro en domicilio".
function esRetiro() {
  const radio = document.querySelector('input[name="metodoEnvio"]:checked');
  return !!radio && radio.value === "retiro";
}

// Muestra el selector de transportista solo en "Periferia / regiones", muestra
// la dirección de retiro solo en "Retiro en domicilio", y oculta los campos
// de dirección de envío cuando se retira.
function actualizarSeccionEnvio() {
  const radio = document.querySelector('input[name="metodoEnvio"]:checked');
  document.getElementById("envioTransportista").classList.toggle("visible", !!radio && radio.value === "regiones");
  const retiro = esRetiro();
  document.getElementById("retiroInfo").classList.toggle("visible", retiro);
  document.querySelectorAll(".campo-direccion").forEach(campo => {
    campo.style.display = retiro ? "none" : "";
  });
}

document.querySelectorAll('input[name="metodoEnvio"]').forEach(radio => {
  radio.addEventListener("change", () => {
    actualizarSeccionEnvio();
    renderizarCarrito();
  });
});

const ICONO_LAPIZ = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>`;

// HTML de un producto del carrito: normal, o con el editor abierto si es el que se está editando.
function htmlLineaCarrito(l) {
  const prod = productos.find(p => p.id === l.id);
  const respaldo = prod ? imagenRespaldo(prod) : "imagenes/logo.png";

  if (prod && edicion && edicion.lineaId === l.lineaId) {
    return `
      <div class="cart-line editando" data-linea="${l.lineaId}">
        <img class="cart-line-thumb" src="${fotoDeLinea(prod, l, edicion.seleccion)}" data-respaldo="${respaldo}" alt="${l.nombre}" decoding="async">
        <div class="cart-line-info">
          <h4>${l.nombre}</h4>
          <span class="cart-line-estado">Editando</span>
          <span class="cart-line-cant">Cantidad: ${l.cantidad}</span>
        </div>
        <div class="cart-line-editor" data-editor="${l.lineaId}">
          ${opcionesHtmlDe(prod, edicion.seleccion, `data-edit="${l.lineaId}"`)}
          <div class="editor-precio"><span>Precio por unidad</span><b data-editor-precio>${formatoCLP(precioProducto(prod, edicion.seleccion))}</b></div>
          <div class="editor-acciones">
            <button type="button" class="btn-guardar" onclick="guardarEdicion()">Guardar cambios</button>
            <button type="button" class="btn-cancelar" onclick="cancelarEdicion()">Cancelar</button>
          </div>
        </div>
      </div>
    `;
  }

  const detalle = Object.entries(l.seleccion)
    .map(([k, v]) => `<li><b>${k}:</b> ${formatoValorSeleccion(v)}</li>`).join("");
  const puedeEditar = !!prod && prod.opciones.length > 0;
  return `
      <div class="cart-line" data-linea="${l.lineaId}">
        <img class="cart-line-thumb" src="${l.imagen || respaldo}" data-respaldo="${respaldo}" alt="${l.nombre}" decoding="async">
        <div class="cart-line-info">
          <div class="cart-line-top">
            <h4>${l.nombre}</h4>
            <div class="cart-line-acciones">
              ${puedeEditar ? `<button type="button" class="edit-line" onclick="editarLinea(${l.lineaId})" aria-label="Editar opciones de ${l.nombre}">${ICONO_LAPIZ}Editar</button>` : ""}
              <button class="remove-line" onclick="eliminarLinea(${l.lineaId})">Quitar</button>
            </div>
          </div>
          ${detalle ? `<ul class="cart-line-detalle">${detalle}</ul>` : ""}
          <div class="cart-line-bottom">
            <div class="qty">
              <button onclick="cambiarCantidad(${l.lineaId}, -1)" aria-label="Quitar una unidad">−</button>
              <span>${l.cantidad}</span>
              <button onclick="cambiarCantidad(${l.lineaId}, 1)" aria-label="Agregar una unidad">+</button>
            </div>
            <div class="cart-line-precio">
              <span>${formatoCLP(l.precio * l.cantidad)}</span>
              ${l.cantidad > 1 ? `<small>${formatoCLP(l.precio)} c/u</small>` : ""}
            </div>
          </div>
        </div>
      </div>
    `;
}

function renderizarCarrito() {
  const cont = document.getElementById("cartItems");

  // Si el cliente está editando, conserva lo que ya eligió aunque el carrito se
  // vuelva a dibujar (por ejemplo al cambiar el envío o la cantidad de otro producto).
  if (edicion) {
    const editorAbierto = cont.querySelector(".cart-line-editor");
    if (editorAbierto && editorAbierto.dataset.editor === String(edicion.lineaId)) {
      edicion.seleccion = leerSeleccionDeCard(editorAbierto);
    }
    if (!carrito.some(l => l.lineaId === edicion.lineaId)) edicion = null;
  }

  // Aviso de productos que se quitaron del carrito por no estar disponibles.
  const avisoEl = document.getElementById("cartAviso");
  const avisos = leerAvisosCarrito();
  avisoEl.hidden = avisos.length === 0;
  avisoEl.textContent = avisos.length === 1
    ? `«${avisos[0]}» ya no está disponible por ahora, así que lo quitamos de tu pedido.`
    : avisos.length > 1
      ? `Estos productos ya no están disponibles por ahora y los quitamos de tu pedido: ${avisos.map(n => `«${n}»`).join(", ")}.`
      : "";

  const totalCantidad = carrito.reduce((s, l) => s + l.cantidad, 0);
  document.getElementById("cartCount").textContent = totalCantidad;
  document.getElementById("cartPedidoResumen").textContent =
    `${totalCantidad} ${totalCantidad === 1 ? "producto" : "productos"}`;

  if (!carrito.length) {
    cont.innerHTML = `<p class="cart-empty">Tu carrito está vacío.</p>`;
  } else {
    cont.innerHTML = carrito.map(htmlLineaCarrito).join("");
  }

  const subtotal = carrito.reduce((s, l) => s + l.precio * l.cantidad, 0);
  const envio = carrito.length ? costoEnvioActual() : 0;
  document.getElementById("cartSubtotal").textContent = formatoCLP(subtotal);
  document.getElementById("cartEnvio").textContent = formatoCLP(envio);
  document.getElementById("cartTotal").textContent = formatoCLP(subtotal + envio);
  document.getElementById("checkoutBtn").disabled = carrito.length === 0;
}

function abrirCarrito() {
  document.getElementById("cartPanel").classList.add("open");
  document.getElementById("overlay").classList.add("open");
}
function cerrarCarrito() {
  document.getElementById("cartPanel").classList.remove("open");
  document.getElementById("overlay").classList.remove("open");
  // Un cambio sin guardar no queda "a medias" al volver a abrir el carrito, y el
  // aviso de productos quitados se muestra una sola vez.
  const habiaAviso = leerAvisosCarrito().length > 0;
  if (habiaAviso) guardarAvisosCarrito([]);
  if (edicion || habiaAviso) { edicion = null; renderizarCarrito(); }
}

document.getElementById("cartToggle").addEventListener("click", abrirCarrito);
document.getElementById("cartClose").addEventListener("click", cerrarCarrito);
document.getElementById("overlay").addEventListener("click", cerrarCarrito);

// -- Newsletter (solo interfaz: no hay backend conectado todavía) --
const formNewsletter = document.getElementById("formNewsletter");
if (formNewsletter) {
  formNewsletter.addEventListener("submit", e => {
    e.preventDefault();
    document.getElementById("newsletterMsg").style.display = "block";
    formNewsletter.reset();
  });
}

// Arma el mensaje de WhatsApp con el resumen del pedido, el envío elegido
// y los datos del cliente (con la dirección de envío solo si no es retiro).
function mensajePedidoParaWhatsapp() {
  const lineas = carrito.map(l =>
    `• ${l.cantidad} x ${l.nombre} (${Object.values(l.seleccion).map(formatoValorSeleccion).join(", ")}) — ${formatoCLP(l.precio * l.cantidad)}`
  ).join("\n");
  const subtotal = carrito.reduce((s, l) => s + l.precio * l.cantidad, 0);
  const envio = costoEnvioActual();
  const nota = document.getElementById("notaPedido").value.trim();
  const retiro = esRetiro();

  const datosEnvio = [
    `Nombre: ${document.getElementById("envioNombre").value.trim()}`,
    `RUT: ${document.getElementById("envioRut").value.trim()}`
  ];
  if (!retiro) {
    datosEnvio.push(
      `Ciudad: ${document.getElementById("envioCiudad").value.trim()}`,
      `Comuna: ${document.getElementById("envioComuna").value.trim()}`,
      `Dirección: ${document.getElementById("envioDireccion").value.trim()}`
    );
    const codigoPostal = document.getElementById("envioCodigoPostal").value.trim();
    if (codigoPostal) datosEnvio.push(`Código postal: ${codigoPostal}`);
  }

  const tituloDatos = retiro ? "Datos de quien retira:" : "Datos de envío:";
  let mensaje = `Hola! Quiero confirmar mi pedido y enviar el comprobante de la transferencia:\n\n${lineas}\n\nEnvío: ${envioDescripcionActual()} — ${formatoCLP(envio)}\nTotal: ${formatoCLP(subtotal + envio)}\n\n${tituloDatos}\n${datosEnvio.join("\n")}`;
  if (nota) mensaje += `\n\nNota: ${nota}`;
  return encodeURIComponent(mensaje);
}

// -- Pago por transferencia bancaria, derivado a WhatsApp --
document.getElementById("checkoutBtn").addEventListener("click", () => {
  // No se envía el pedido con un producto a medio editar: el cliente debe guardar o cancelar.
  if (edicion) {
    alert("Estás editando un producto del carrito. Presiona «Guardar cambios» (o «Cancelar») antes de enviar el comprobante.");
    const enEdicion = document.querySelector(".cart-line.editando");
    if (enEdicion) traerALaVista(enEdicion);
    return;
  }

  const camposObligatorios = [
    ["envioNombre", "el nombre"],
    ["envioRut", "el RUT"]
  ];
  if (!esRetiro()) {
    camposObligatorios.push(
      ["envioCiudad", "la ciudad"],
      ["envioComuna", "la comuna"],
      ["envioDireccion", "la dirección"]
    );
  }
  for (const [idCampo, etiqueta] of camposObligatorios) {
    const campo = document.getElementById(idCampo);
    if (!campo.value.trim()) {
      alert(`Completa ${etiqueta} antes de continuar.`);
      campo.focus();
      return;
    }
  }

  const urlWhatsapp = `https://wa.me/56920635715?text=${mensajePedidoParaWhatsapp()}`;
  window.open(urlWhatsapp, "_blank");
});

// -- Buscador: filtra las tarjetas del catálogo por nombre o descripción --
const btnBuscar = document.getElementById("btnBuscar");
const searchBar = document.getElementById("searchBar");
const inputBuscar = document.getElementById("inputBuscar");
const searchEmptyMsg = document.getElementById("searchEmptyMsg");

btnBuscar.addEventListener("click", () => {
  const abierto = searchBar.classList.toggle("open");
  btnBuscar.setAttribute("aria-expanded", abierto ? "true" : "false");
  if (abierto) {
    inputBuscar.focus();
  } else {
    inputBuscar.value = "";
    filtrarCatalogoPorBusqueda("");
  }
});

inputBuscar.addEventListener("input", () => {
  filtrarCatalogoPorBusqueda(inputBuscar.value);
});

function filtrarCatalogoPorBusqueda(termino) {
  const busqueda = termino.trim().toLowerCase();
  let hayResultados = !busqueda;

  document.querySelectorAll("section.categoria").forEach(seccion => {
    let seccionTieneCoincidencia = false;
    seccion.querySelectorAll(".card").forEach(card => {
      const nombre = card.querySelector(".card-body h3")?.textContent.toLowerCase() || "";
      const desc = card.querySelector(".card-body .desc")?.textContent.toLowerCase() || "";
      const coincide = !busqueda || nombre.includes(busqueda) || desc.includes(busqueda);
      card.style.display = coincide ? "" : "none";
      if (coincide) seccionTieneCoincidencia = true;
    });
    seccion.style.display = seccionTieneCoincidencia ? "" : "none";
    if (seccionTieneCoincidencia) hayResultados = true;
  });

  searchEmptyMsg.classList.toggle("visible", busqueda !== "" && !hayResultados);
}

// -- Revisión de productos ocultos: solo aparece si abres la tienda con ?ocultos --
if (new URLSearchParams(location.search).has("ocultos")) {
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const dosDigitos = n => String(n).padStart(2, "0");
  const fechaTexto = f => `${dosDigitos(f.getDate())}-${dosDigitos(f.getMonth() + 1)}-${f.getFullYear()}`;
  const filas = REGLAS_OCULTOS.map(r => {
    const n = TODOS_LOS_PRODUCTOS.filter(p => reglaCoincide(r, p)).length;
    let estado;
    if (n === 0) estado = "⚠ No coincide con ningún producto: revisa cómo lo escribiste.";
    else if (!reglaVigente(r)) estado = `Ya llegó la fecha de regreso (${fechaTexto(r.vuelve)}): se está mostrando. Puedes borrar esta línea.`;
    else if (r.vuelve) estado = `Oculto hasta que llegue el ${fechaTexto(r.vuelve)}; ese día reaparece solo.`;
    else estado = "Oculto hasta que borres la línea.";
    if (r.fechaNoEntendida) estado += " ⚠ No entendí la fecha (escríbela así: | vuelve 15-12-2026); por ahora queda oculto hasta que borres la línea.";
    return `<li><b>${esc(r.linea)}</b> — ${n} ${n === 1 ? "producto" : "productos"}. ${estado}</li>`;
  }).join("");
  document.body.insertAdjacentHTML("afterbegin", `
    <div class="aviso-ocultos" role="status">
      <strong>Revisión de productos ocultos</strong>
      <span>(solo lo ves tú, porque abriste la tienda con ?ocultos)</span>
      ${REGLAS_OCULTOS.length ? `<ul>${filas}</ul>` : `<p>La lista está vacía: se muestran todos los productos.</p>`}
      <p>Se muestran ${productos.length} de ${TODOS_LOS_PRODUCTOS.length} productos.</p>
    </div>
  `);
}

actualizarSeccionEnvio();
renderizarCarrito();
