// ===========================================================
// 0) ATAJOS PARA NO REPETIR CÓDIGO (ver la guía, puntos 19 y 20)
// ===========================================================

// rango(1, 12) -> ["1","2","3", ... ,"12"]
const rango = (desde, hasta) =>
  Array.from({ length: hasta - desde + 1 }, (_, i) => String(desde + i));

// Todos los cuadros personalizados comparten precios, tamaños y colores de marco.
//   - "disenos": cuántos números de diseño tiene (por defecto 4).
//   - "imagen": su foto de portada (una ruta, o un arreglo de rutas).
const PRECIOS_CUADRO_PERSONALIZADO = { "21x29":9990, "33x48":16990 };
function crearCuadroPersonalizado({ id, nombre, descripcion, imagen = "", disenos = 4, ...extra }) {
  return {
    id, categoria:"Cuadros personalizados", nombre, descripcion, imagen,
    grupoPrecio:"Tamaño", precios:PRECIOS_CUADRO_PERSONALIZADO,
    opciones:[
      { nombre:"Tamaño", valores:["21x29","33x48"] },
      { nombre:"Color del marco", valores:["Café","Blanco","Negro"] },
      { nombre:"Número de diseño", valores:rango(1, disenos) }
    ],
    personalizable:true,
    ...extra
  };
}

// Encendedores temáticos: la portada sale sola del nombre del slug.
function crearEncendedor(slug, nombre, disenos = 12, extra = {}) {
  return {
    id:`encendedor-${slug}`, categoria:"Encendedores", nombre:`Encendedor ${nombre}`,
    descripcion:"Elige el número de diseño.",
    imagen:`imagenes/publiencendedor${slug}.png`, precioBase:500,
    opciones:[ { nombre:"Diseño", valores:rango(1, disenos) } ],
    personalizable:false,
    ...extra
  };
}

// Lista de encendedores temáticos: [slug, nombre, cantidad de diseños (12 si no), extras].
const ENCENDEDORES_TEMATICOS = [
  ["pokemon", "Pokémon", 24],
  ["demonslayer", "Demon Slayer", 24],
  ["mbappe", "Mbappé"],
  ["messi", "Messi"],
  ["ironman", "Iron Man"],
  ["simpsons", "Los Simpson"],
  ["cr7", "Cr7"],
  ["billieeilish", "Billie Eilish"],
  ["naruto", "Naruto", 24],
  ["dragonball", "Dragon Ball"],
  ["spiderman", "Spider-Man"],
  ["onepiece", "One Piece"],
  ["inuyasha", "Inuyasha"],
  ["bleach", "Bleach"],
  ["deathnote", "Death Note"],
  ["hxh", "HxH"],
  ["bobesponja", "Bob Esponja"],
  ["rickymorty", "Rick y Morty"],
  ["horadeaventura", "Hora de Aventura"],
  ["southpark", "South Park"],
  ["futurama", "Futurama"],
  ["scoobydoo", "Scooby Doo"],
  ["harrypotter", "Harry Potter"],
  ["lanadelrey", "Lana del Rey"],
  ["ataquetitanes", "Ataque de los Titanes"],
  ["sailormoon", "Sailor Moon"],
  ["tokyoghoul", "Tokyo Ghoul"],
  ["starwars", "Star Wars"],
  ["tomyjerry", "Tom y Jerry"],
  ["thor", "Thor"],
];

// Stickers personalizados (con tu logo o imagen): 3 packs por medida.
// CANTIDADES: cuántos stickers trae cada pack en cada medida, en este orden: [pack 1, pack 2, pack 3].
// PRECIOS: lo que cuesta cada pack según el acabado. Es el mismo precio para todas las medidas.
// Para cambiar una cantidad o un precio, cambia el número aquí; el resto de la tienda se arma sola.
const STICKERS_PERSONALIZADOS_CANTIDADES = {
  "3x3 cm": [120, 240, 480],
  "4x4 cm": [70, 140, 280],
  "5x5 cm": [45, 90, 180],
  "6x6 cm": [35, 70, 140],
  "7x7 cm": [24, 48, 90],
  "8x8 cm": [18, 36, 70],
  "9x9 cm": [18, 36, 70]
};
const STICKERS_PERSONALIZADOS_PRECIOS = [
  { "Troquelado": 4500,  "Sin troquelar": 3000 },
  { "Troquelado": 7500,  "Sin troquelar": 6000 },
  { "Troquelado": 13500, "Sin troquelar": 12000 }
];
function crearStickersPersonalizados() {
  const medidas = Object.keys(STICKERS_PERSONALIZADOS_CANTIDADES);
  const acabados = Object.keys(STICKERS_PERSONALIZADOS_PRECIOS[0]);
  const valoresPorPadre = {}, preciosPorCombinacion = {};
  medidas.forEach(medida => {
    const cantidades = STICKERS_PERSONALIZADOS_CANTIDADES[medida];
    valoresPorPadre[medida] = cantidades.map(n => `${n} unidades`);
    cantidades.forEach((n, pack) => acabados.forEach(acabado => {
      preciosPorCombinacion[`${medida}|${n} unidades|${acabado}`] = STICKERS_PERSONALIZADOS_PRECIOS[pack][acabado];
    }));
  });
  return {
    id:"stickers-personalizados", categoria:"Stickers personalizados", nombre:"Stickers personalizados con tu logo o imagen",
    descripcion:"Para packaging, bolsas y regalos. Elige la forma, la medida, el pack y el acabado: troquelado (cortado en la forma que elijas) o sin troquelar. Para otra medida, mira Stickers con medida personalizada.",
    imagen:["imagenes/stickers-personalizados-negocio.webp","imagenes/stickers-personalizados-3-a-6-cm.webp","imagenes/stickers-personalizados-7-a-9-cm.webp"],
    alt:"Caja de envío blanca con tres stickers con logo pegados: uno triangular, uno redondo blanco y uno redondo celeste",
    opciones:[
      { nombre:"Forma", valores:["Circular","Cuadrado"] },
      { nombre:"Tamaño", valores:medidas },
      { nombre:"Cantidad", dependeDe:"Tamaño", valoresPorPadre },
      { nombre:"Acabado", valores:acabados }
    ],
    combinacionPrecio:["Tamaño","Cantidad","Acabado"],
    preciosPorCombinacion,
    personalizable:true
  };
}

// ===========================================================
// 1) TUS PRODUCTOS — edita nombres, precios (CLP), imágenes y opciones aquí.
// ===========================================================
// Aquí están TODOS tus productos, también los que hoy no tienes. Para ocultar
// alguno por falta de stock NO lo borres: escríbelo en PRODUCTOS_OCULTOS, en
// el archivo ocultos.js.
// Campo opcional "alt": texto alternativo de la foto principal (lo leen los lectores de pantalla y Google Imágenes).
// Si no lo pones, se usa el nombre del producto.
const TODOS_LOS_PRODUCTOS = [

  { id:"cuadro-foto", categoria:"Cuadros", nombre:"Cuadro + foto",
    descripcion:"Imprimimos tu fotografía en un cuadro de madera. Elige el tamaño y el marco.",
    imagen:"imagenes/publicuadros.webp",
    alt:"Tres cuadros de madera con fotos impresas, en distintos tamaños y marcos",
    grupoPrecio:"Tamaño",
    precios:{ "10x15":3500, "13x18":4500, "15x20":5500, "18x24":6000 },
    opciones:[
      { nombre:"Tamaño", valores:["10x15","13x18","15x20","18x24"] },
      { nombre:"Color del marco", dependeDe:"Tamaño", valoresPorPadre:{
          "10x15":["Café con blanco (diseño 1)","Café con blanco (diseño 2)"],
          "13x18":["Café con blanco","Café"],
          "15x20":["Café con blanco"],
          "18x24":["Café"]
        }
      }
    ],
    combinacionImagen:["Tamaño","Color del marco"],
    imagenesPorCombinacion:{
      "10x15|Café con blanco (diseño 1)":["imagenes/cuadro10x15cafeconblanco1.png","imagenes/cuadro10x15cafeconblancotras.png"],
      "10x15|Café con blanco (diseño 2)":["imagenes/cuadro10x15cafeconblanco2.png","imagenes/cuadro10x15cafeconblanco2tras.png"],
      "13x18|Café con blanco":["imagenes/cuadro10x15cafeconblanco1.png","imagenes/cuadro10x15cafeconblancotras.png"],
      "15x20|Café con blanco":["imagenes/cuadro10x15cafeconblanco1.png","imagenes/cuadro10x15cafeconblancotras.png"],
      "13x18|Café":["imagenes/cuadro10x15cafe.png","imagenes/cuadro10x15cafetras.png"],
      "18x24|Café":["imagenes/cuadro10x15cafe.png","imagenes/cuadro10x15cafetras.png"]
    },
    personalizable:true },

  // --- Cuadros personalizados ---
  crearCuadroPersonalizado({ id:"cuadro-navideno", nombre:"Cuadro personalizado navideño",
    descripcion:"Cuadro grande con tu diseño navideño personalizado.",
    imagen:["imagenes/publicuadronavidad1.png","imagenes/navidad1a12.png"],
    disenos:12,
    imagenPlantilla:"imagenes/naviidad{Número de diseño}.png"}),

  crearCuadroPersonalizado({ id:"cuadro-enamorados", nombre:"Cuadro personalizado enamorados",
    descripcion:"Cuadro grande con tu diseño personalizado para tu pareja.",
    imagen:"imagenes/publicuadroenamorados1.png",
    disenos:12,
    imagenPlantilla:"imagenes/enamorado{Número de diseño}.png" }),

  crearCuadroPersonalizado({ id:"cuadro-sanvalentin", nombre:"Cuadro personalizado San Valentín",
    descripcion:"Cuadro grande con tu diseño personalizado para San Valentín.",
    imagen:"imagenes/publicuadrovalentin1.png",
    disenos:12,
    imagenPlantilla:"imagenes/valentin{Número de diseño}.png" }),

  crearCuadroPersonalizado({ id:"cuadro-diamadre", nombre:"Cuadro personalizado Día de la Madre",
    descripcion:"Cuadro grande con tu diseño personalizado para el Día de la Madre.",
    imagen:"imagenes/publicuadromama1.png",
    disenos:12,
    imagenPlantilla:"imagenes/madre{Número de diseño}.png" }),

  crearCuadroPersonalizado({ id:"cuadro-diapadre", nombre:"Cuadro personalizado Día del Padre",
    descripcion:"Cuadro grande con tu diseño personalizado para el Día del Padre.",
    imagen:["imagenes/publicuadropapa1.jpg","imagenes/papa1a12.png","imagenes/papa13a17.png"],
    disenos:17,
    imagenPlantilla:"imagenes/papa{Número de diseño}.png" }),

  crearCuadroPersonalizado({ id:"cuadro-spotify", nombre:"Cuadro personalizado Spotify",
    descripcion:"Cuadro grande con tu canción favorita en formato placa Spotify.",
    imagen:"imagenes/publicuadrospotify1.png",
    disenos:12,
    imagenPlantilla:"imagenes/spotify{Número de diseño}.png" }),

  crearCuadroPersonalizado({ id:"cuadro-nacimiento", nombre:"Cuadro personalizado nacimiento",
    descripcion:"Cuadro grande para anunciar o recordar el nacimiento de tu bebé.",
    imagen:["imagenes/publicuadronacimiento1.png","imagenes/nacidos1a12.png","imagenes/nacidos13a15.png"],
    disenos:15,
    imagenPlantilla:"imagenes/nacidos{Número de diseño}.png" }),

  crearCuadroPersonalizado({ id:"cuadro-dianino", nombre:"Cuadro personalizado Día del Niño",
    descripcion:"Cuadro grande con tu diseño personalizado para el Día del Niño.",
    imagen:"imagenes/publicuadrodianino.png",
    disenos:12,
    imagenPlantilla:"imagenes/nino{Número de diseño}.png" }),

  crearCuadroPersonalizado({ id:"cuadro-funebre", nombre:"Cuadro personalizado fúnebre",
    descripcion:"Cuadro grande como homenaje o recuerdo para un ser querido.",
    imagen:"imagenes/publicuadrofunebre.png",
    disenos:12,
    imagenPlantilla:"imagenes/funebre{Número de diseño}.png" }),

  // Solo cotiza por WhatsApp: no pasa por el carrito ni muestra precio.
  { id:"cuadro-graduacion", categoria:"Cuadros personalizados", nombre:"Cuadro personalizado graduación",
    descripcion:"Cuadro para celebrar una graduación. Escríbenos para cotizar tu diseño.",
    imagen:"imagenes/publicuadrograduacion1.png",
    opciones:[],
    accionPersonalizada:{
      tipo:"whatsapp",
      mensaje:"Hola! Estoy interesad@ en cotizar un cuadro para la graduación de mi hij@."
    },
    sinPrecio:true,
    personalizable:false },

  { id:"stickers-anime", categoria:"Stickers", nombre:"Set de stickers anime",
    descripcion:"Elige el tamaño (con su cantidad aproximada) y el diseño.",
    // Portada con una foto adicional (el set completo); al elegir un diseño se muestra la foto de ese diseño.
    imagen:["imagenes/publisticker2.webp","imagenes/sticker-anime-set.webp"],
    alt:"Set de stickers anime en bolsa, con stickers sueltos alrededor", grupoPrecio:"Tamaño / cantidad",
    precios:{ "5cm (15-20 unidades)":1000, "8cm (7-8 unidades)":1000, "12cm (5 unidades)":1500 },
    opciones:[
      { nombre:"Tamaño / cantidad", valores:["5cm (15-20 unidades)","8cm (7-8 unidades)","12cm (5 unidades)"] },
      { nombre:"Diseño", valores:["1","2","3","4","5","6","7"] }
    ],
    imagenesPorOpcion:{ "Diseño":{
      "1":"imagenes/sticker-anime-diseno-1.webp", "2":"imagenes/sticker-anime-diseno-2.webp",
      "3":"imagenes/sticker-anime-diseno-3.webp", "4":"imagenes/sticker-anime-diseno-4.webp",
      "5":"imagenes/sticker-anime-diseno-5.webp", "6":"imagenes/sticker-anime-diseno-6.webp",
      "7":"imagenes/sticker-anime-diseno-7.webp"
    } },
    personalizable:false },

  { id:"stickers-caricaturas", categoria:"Stickers", nombre:"Set de stickers caricaturas",
    descripcion:"Elige el tamaño (con su cantidad aproximada) y el diseño.",
    imagen:["imagenes/publisticker3.png","imagenes/sticker-caricaturas-set.webp"], grupoPrecio:"Tamaño / cantidad",
    precios:{ "5cm (15-20 unidades)":1000, "8cm (7-8 unidades)":1000, "12cm (5 unidades)":1500 },
    opciones:[
      { nombre:"Tamaño / cantidad", valores:["5cm (15-20 unidades)","8cm (7-8 unidades)","12cm (5 unidades)"] },
      { nombre:"Diseño", valores:["1","2","3"] }
    ],
    imagenesPorOpcion:{ "Diseño":{
      "1":"imagenes/sticker-caricaturas-diseno-1.webp", "2":"imagenes/sticker-caricaturas-diseno-2.webp",
      "3":"imagenes/sticker-caricaturas-diseno-3.webp"
    } },
    personalizable:false },

  { id:"stickers-animales", categoria:"Stickers", nombre:"Set de stickers animales",
    descripcion:"Elige el tamaño (con su cantidad aproximada) y el diseño.",
    imagen:["imagenes/publisticker1.png","imagenes/sticker-animales-set.webp"], grupoPrecio:"Tamaño / cantidad",
    precios:{ "5cm (15-20 unidades)":1000, "8cm (7-8 unidades)":1000, "12cm (5 unidades)":1500 },
    opciones:[
      { nombre:"Tamaño / cantidad", valores:["5cm (15-20 unidades)","8cm (7-8 unidades)","12cm (5 unidades)"] },
      { nombre:"Diseño", valores:["Gatitos","Dinosaurios"] }
    ],
    imagenesPorOpcion:{ "Diseño":{
      "Gatitos":"imagenes/sticker-animales-gatitos.webp", "Dinosaurios":"imagenes/sticker-animales-dinosaurios.webp"
    } },
    personalizable:false },

  // Stickers de temporada: hoy Halloween. Tiene los mismos tamaños y precios que los otros sets.
  // Cuando tengas Navidad, duplica este bloque (otro id, nombre y foto) o cambia la foto y el nombre.
  { id:"stickers-halloween", categoria:"Stickers", nombre:"Set de stickers de Halloween",
    descripcion:"Set de stickers de temporada con diseños de Halloween. Elige el tamaño (con su cantidad aproximada).",
    imagen:"imagenes/sticker-temporada-halloween.webp",
    alt:"Set de stickers de Halloween en bolsa, con calabazas, gatos y fantasmas", grupoPrecio:"Tamaño / cantidad",
    precios:{ "5cm (15-20 unidades)":1000, "8cm (7-8 unidades)":1000, "12cm (5 unidades)":1500 },
    opciones:[
      { nombre:"Tamaño / cantidad", valores:["5cm (15-20 unidades)","8cm (7-8 unidades)","12cm (5 unidades)"] }
    ],
    personalizable:false },

  // Stickers con tu logo: precios por medida, pack y acabado (tablas al comienzo de este archivo).
  crearStickersPersonalizados(),

  // Medida personalizada: se cotiza por WhatsApp (sin precio ni carrito).
  { id:"stickers-medida-personalizada", categoria:"Stickers personalizados", nombre:"Stickers con medida personalizada",
    descripcion:"¿Necesitas otra medida? Cuéntanos el tamaño y la cantidad por WhatsApp y te cotizamos.",
    imagen:["imagenes/stickers-personalizados-3-a-6-cm.webp","imagenes/stickers-personalizados-7-a-9-cm.webp"],
    alt:"Hojas de stickers circulares con un logo de ejemplo, en tamaños de 3x3 a 9x9 cm",
    opciones:[
      { nombre:"Forma", valores:["Circular","Cuadrado"] },
      { nombre:"Acabado", valores:["Troquelado","Sin troquelar"] }
    ],
    accionPersonalizada:{
      tipo:"whatsapp",
      mensaje:"Hola! Quiero cotizar stickers con una medida personalizada."
    },
    sinPrecio:true,
    personalizable:false },

  { id:"posters", categoria:"Posters", nombre:"Poster",
    descripcion:"Elige tamaño y acabado.",
    imagen:"imagenes/publiposters.webp",
    alt:"Posters personalizados de anime, K-pop y fútbol en distintos tamaños",
    opciones:[
      { nombre:"Tamaño", valores:["21x29","29x42","33x48"] },
      { nombre:"Acabado", dependeDe:"Tamaño", valoresPorPadre:{
          "21x29":["Sin acabado","Laminado","Plastificado"],
          "29x42":["Sin acabado","Laminado","Plastificado"],
          "33x48":["Sin acabado"]
        }
      }
    ],
    combinacionPrecio:["Tamaño","Acabado"],
    preciosPorCombinacion:{
      "21x29|Sin acabado":1000,
      "21x29|Laminado":2000,
      "21x29|Plastificado":2000,
      "29x42|Sin acabado":1500,
      "29x42|Laminado":3000,
      "29x42|Plastificado":3000,
      "33x48|Sin acabado":2000
    },
    personalizable:true },

  // Precio por foto: 10x15 = $500 y 21x29 = $1.000. Descuento por cantidad: 5 → 5%, 10 → 10%, 20 → 20%, 50 → 25%.
  // (Cambia aquí cualquier precio: cada combinación de Tamaño y Cantidad tiene el suyo.)
  { id:"fotografias", categoria:"Fotografías", nombre:"Impresión de fotografías",
    descripcion:"Elige tamaño y cantidad de copias. Mientras más fotos, más descuento.",
    imagen:"imagenes/impresion-de-fotografias.webp",
    alt:"Fotografía impresa de un gato atigrado sentado, sostenida con las dos manos",
    opciones:[
      { nombre:"Tamaño", valores:["10x15","21x29"] },
      { nombre:"Cantidad", valores:["5 unidades","10 unidades","20 unidades","50 unidades"] }
    ],
    combinacionPrecio:["Tamaño","Cantidad"],
    preciosPorCombinacion:{
      "10x15|5 unidades":2375,
      "10x15|10 unidades":4500,
      "10x15|20 unidades":8000,
      "10x15|50 unidades":18750,
      "21x29|5 unidades":4750,
      "21x29|10 unidades":9000,
      "21x29|20 unidades":16000,
      "21x29|50 unidades":37500
    },
    personalizable:true },

  { id:"polaroid", categoria:"Fotografías Polaroid", nombre:"Foto estilo Polaroid",
    descripcion:"Formato 5x8. Elige el acabado y la cantidad.",
    imagen:["imagenes/fotos-polaroid-portada.webp","imagenes/publipolaroid.webp"],
    alt:"Fotos estilo Polaroid colgadas de un cordel con un gancho de madera, sobre una pila de fotos",
    opciones:[
      { nombre:"Acabado", valores:["Normal","Laminada","Laminada imantada"] },
      { nombre:"Cantidad", dependeDe:"Acabado", valoresPorPadre:{
          "Normal":["10 unidades","35 unidades","50 unidades","100 unidades"],
          "Laminada":["25 unidades","50 unidades","100 unidades"],
          "Laminada imantada":["20 unidades","60 unidades","100 unidades"]
        }
      }
    ],
    combinacionPrecio:["Acabado","Cantidad"],
    preciosPorCombinacion:{
      "Normal|10 unidades":1990,
      "Normal|35 unidades":5990,
      "Normal|50 unidades":7990,
      "Normal|100 unidades":11990,
      "Laminada|25 unidades":5990,
      "Laminada|50 unidades":9990,
      "Laminada|100 unidades":16950,
      "Laminada imantada|20 unidades":6990,
      "Laminada imantada|60 unidades":19800,
      "Laminada imantada|100 unidades":26990
    },
    personalizable:true },

  { id:"encendedores", categoria:"Encendedores", nombre:"Encendedor personalizado",
    descripcion:"Mándanos tu diseño (imagen cuadrada de 6x6 cm) y lo imprimimos tal cual.",
    imagen:"imagenes/publiencendedorpersonalizado.png", precioBase:500,
    opciones:[],
    personalizable:true },

  // --- Encendedores temáticos ---
  ...ENCENDEDORES_TEMATICOS.map(([slug, nombre, disenos, extra]) => crearEncendedor(slug, nombre, disenos, extra)),

  { id:"calendario", categoria:"Calendarios", nombre:"Calendario 2027 personalizado",
    descripcion:"Elige el tipo de calendario.",
    imagen:"imagenes/calendario-2027-personalizado.webp",
    alt:"Calendario de pared de enero 2027 con una ilustración de gatita blanca con lazo rosa, mini calendarios de diciembre y febrero y espacio para notas",
    grupoPrecio:"Tipo",
    precios:{ "Normal":2000, "Imantado":2500 },
    opciones:[
      { nombre:"Tipo", valores:["Normal","Imantado"] }
    ],
    personalizable:true },

  // Imanes: imán solo (7x7 o 5x5 cm) e imán de 7x7 con mini calendario. Cada uno se vende por pack de unidades.
  { id:"imanes", categoria:"Imanes", nombre:"Imanes personalizados",
    descripcion:"Imanes con tu foto o diseño, de 7x7 cm o de 5x5 cm. Elige la medida y la cantidad. Envíanos tu imagen después de pagar.",
    imagen:"imagenes/imanes-personalizados.webp",
    alt:"Imán cuadrado personalizado con logo, código QR y datos de contacto, junto a su parte trasera imantada de color negro",
    opciones:[
      { nombre:"Medida", valores:["7x7 cm","5x5 cm"] },
      { nombre:"Cantidad", dependeDe:"Medida", valoresPorPadre:{
          "7x7 cm":["10 unidades","50 unidades","100 unidades"],
          "5x5 cm":["10 unidades","40 unidades","100 unidades"]
        }
      }
    ],
    combinacionPrecio:["Medida","Cantidad"],
    preciosPorCombinacion:{
      "7x7 cm|10 unidades":3200,
      "7x7 cm|50 unidades":15300,
      "7x7 cm|100 unidades":24000,
      "5x5 cm|10 unidades":2070,
      "5x5 cm|40 unidades":5175,
      "5x5 cm|100 unidades":10350
    },
    personalizable:true },

  { id:"calendario-imantado", categoria:"Imanes", nombre:"Calendario imantado",
    descripcion:"Imagen de 7x7 cm en formato imán, más un mini calendario de 7,5 x 5,5 cm. Elige la cantidad. Envíanos tu imagen después de pagar.",
    imagen:"imagenes/imanes-con-calendario.webp",
    alt:"Mano sosteniendo varios imanes con un mini calendario de enero 2027, logo, código QR y datos de contacto, con una pila de imanes al fondo",
    grupoPrecio:"Cantidad",
    precios:{ "10 unidades":4960, "50 unidades":19900, "100 unidades":32500 },
    opciones:[
      { nombre:"Cantidad", valores:["10 unidades","50 unidades","100 unidades"] }
    ],
    personalizable:true },

  // Marcapáginas: tres productos. Todos miden 4 cm de ancho por 14 cm de alto.
  //  - "marcapaginas": personalizado (el cliente envía su foto o diseño).
  //  - "marcapaginas-imantado": personalizado, con imán.
  //  - "marcapaginas-princesas": diseños ya hechos, numerados del 1 al 18 (se elige uno por unidad).
  { id:"marcapaginas", categoria:"Marcapáginas", nombre:"Marcapáginas personalizado",
    descripcion:"Marcapáginas de 4 cm de ancho por 14 cm de alto con tu foto o tu diseño. Elige la cantidad y envíanos tu imagen después de pagar.",
    imagen:"imagenes/marcapaginas-personalizados.webp",
    alt:"Abanico de marcapáginas plastificados con distintos diseños, sostenido en una mano",
    grupoPrecio:"Cantidad",
    precios:{ "1 unidad":400, "3 unidades":1000 },
    opciones:[
      { nombre:"Cantidad", valores:["1 unidad","3 unidades"] }
    ],
    personalizable:true },

  { id:"marcapaginas-imantado", categoria:"Marcapáginas", nombre:"Marcapáginas imantado personalizado",
    descripcion:"Marcapáginas imantado de 4 cm de ancho por 14 cm de alto con tu foto o tu diseño. Envíanos tu imagen después de pagar.",
    imagen:"", precioBase:500,
    opciones:[],
    personalizable:true },

  { id:"marcapaginas-princesas", categoria:"Marcapáginas", nombre:"Marcapáginas princesas",
    descripcion:"Marcapáginas de 4 cm de ancho por 14 cm de alto con diseños de princesas, numerados del 1 al 18. Elige la cantidad y el diseño (uno por unidad si llevas más de 1).",
    imagen:"imagenes/marcapaginas-princesas-disenos-1-18.webp",
    alt:"Hoja con 18 diseños de marcapáginas de princesas, numerados del 1 al 18",
    grupoPrecio:"Cantidad",
    precios:{ "1 unidad":400, "3 unidades":1000 },
    opciones:[
      { nombre:"Cantidad", valores:["1 unidad","3 unidades"] },
      { nombre:"Diseño", multiplePorCantidad:"Cantidad", valores:["1","2","3","4","5","6","7","8","9","10","11","12","13","14","15","16","17","18"] }
    ],
    personalizable:false },

  // Libretas: por ahora son personalizadas (el cliente envía su foto o diseño para la tapa).
  // Cuando haya libretas con diseños ya listos, se agregan como productos aparte (con su selector de diseño numerado).
  { id:"libretas", categoria:"Libretas", nombre:"Libreta personalizada",
    descripcion:"Libreta de 10 cm de ancho por 14 cm de alto, con 20 hojas en blanco. Lleva tu foto o tu diseño en la tapa: envíanoslo después de pagar.",
    imagen:"imagenes/libreta-personalizada.webp",
    alt:"Libreta con una tapa de ilustraciones de cómic, sobre una mesa junto a una taza de café",
    precioBase:500,
    opciones:[],
    personalizable:true },

  // Papel de regalo: 1 unidad o 2 unidades (la de 2 cuesta menos por unidad). Los diseños (10) se agregan más adelante como opción "Diseño".
  { id:"papel-regalo", categoria:"Envoltorio de regalo", nombre:"Papel de regalo",
    descripcion:"Papel para envolver tus regalos. Si llevas 2 unidades, el valor por unidad baja.",
    imagen:"imagenes/papel-de-regalo.webp",
    alt:"Rollo de papel de regalo rosado con diseños navideños de gatitas, estrellas y copos de nieve, a medio desenrollar",
    grupoPrecio:"Cantidad",
    precios:{ "1 unidad":300, "2 unidades":500 },
    opciones:[
      { nombre:"Cantidad", valores:["1 unidad","2 unidades"] }
    ],
    personalizable:false },

  // Servicio de envoltorio: se cobra por regalo, aparte del papel. Solo se puede agregar si el pedido ya tiene papel de regalo
  // ("requiere"). Si el papel está en ocultos.js, el servicio tampoco se muestra; si el cliente saca el papel del carrito, se saca el servicio.
  { id:"envoltorio-regalo", categoria:"Envoltorio de regalo", nombre:"Servicio de envoltorio de regalo",
    descripcion:"Nos encargamos de envolver tu regalo. Para pedirlo, agrega primero papel de regalo a tu pedido. Se cobra por regalo y por separado del papel.",
    imagen:"imagenes/servicio-de-envoltorio-de-regalo.webp",
    alt:"Regalo envuelto en papel rosado con motivos navideños y un gran lazo rojo de cinta",
    precioBase:500,
    requiere:"papel-regalo",
    requiereAviso:"Para pedir el servicio de envoltorio, agrega primero papel de regalo a tu pedido.",
    opciones:[],
    personalizable:false },

  { id:"etiqueta-cortada", categoria:"Etiquetas navideñas", nombre:"Etiqueta navideña (ya cortada)",
    descripcion:"Etiqueta navideña individual de 7x7 cm, ya cortada y lista para pegar en el regalo. Elige el diseño, del 1 al 24 (uno por unidad si llevas más de 1).",
    imagen:["imagenes/etiqueta-navidena-personalizada.webp","imagenes/etiquetas-navidenas-disenos-1-24.webp"],
    alt:"Etiqueta navideña verde con un muñeco de jengibre y espacios para De y Para, pegada en un regalo de papel kraft con lazo rojo",
    grupoPrecio:"Cantidad",
    precios:{ "1 unidad":300, "2 unidades":500 },
    opciones:[
      { nombre:"Cantidad", valores:["1 unidad","2 unidades"] },
      { nombre:"Diseño", multiplePorCantidad:"Cantidad", valores:["1","2","3","4","5","6","7","8","9","10","11","12","13","14","15","16","17","18","19","20","21","22","23","24"] }
    ],
    personalizable:false },

  { id:"etiquetas", categoria:"Etiquetas navideñas", nombre:"Set de etiquetas navideñas (tira sin cortar)",
    descripcion:"Tira sin cortar con 6 etiquetas navideñas de 7x7 cm. Elige el diseño de tira, del 1 al 4.",
    imagen:["imagenes/etiqueta-navidena-personalizada.webp","imagenes/etiquetas-navidenas-tiras-1-4.webp"],
    alt:"Etiqueta navideña verde con un muñeco de jengibre y espacios para De y Para, pegada en un regalo de papel kraft con lazo rojo",
    precioBase:1000,
    unidades:6, // la tira trae 6 etiquetas: con esto la tarjeta muestra cuánto sale cada una
    opciones:[
      { nombre:"Diseño", valores:["1","2","3","4"] }
    ],
    personalizable:false },

  { id:"pizarra", categoria:"Pizarra infantil", nombre:"Pizarra infantil + plumones",
    descripcion:"Elige el número de diseño.",
    imagen:"", precioBase:3000,
    opciones:[
      { nombre:"Diseño", valores:["1","2","3","4","5"] }
    ],
    personalizable:false },

  { id:"llavero", categoria:"Llaveros", nombre:"Llavero personalizado",
    descripcion:"Envía tu foto y te lo hacemos a medida.",
    imagen:"imagenes/llaveros-personalizados-portada.webp",
    alt:"Tres llaveros acrílicos con fotos y diseños personalizados",
    precioBase:1290,
    opciones:[],
    personalizable:true },

  { id:"tarjetas-presentacion", categoria:"Tarjetas de presentación", nombre:"Tarjetas de presentación personalizadas",
    descripcion:"Pack de 100 tarjetas de presentación de 9 x 5,5 cm, impresas por una cara en papel fotográfico glossy de 230 gr, con tu diseño para tu negocio o tu marca personal.",
    imagen:"imagenes/tarjetas-de-presentacion-portada.webp",
    alt:"Tarjetas de presentación personalizadas, una negra y una blanca con logo y código QR, apiladas sobre fondo gris",
    precioBase:7990,
    unidades:100, // pack de 100 tarjetas: la tarjeta muestra cuánto sale cada una
    opciones:[],
    personalizable:true },

  { id:"photocards", categoria:"Photocards", nombre:"Photocards",
    descripcion:"Elige el número de diseño y el acabado.",
    imagen:"imagenes/photocards-personalizadas.webp",
    alt:"Photocards con retratos de jóvenes con camisa y corbata, una sostenida en la mano y varias apiladas",
    precioBase:500,
    opciones:[
      { nombre:"Diseño", valores:["1","2","3","4","5"] },
      { nombre:"Acabado", valores:["Laminada","Plastificada"] }
    ],
    personalizable:true },

  { id:"album", categoria:"Álbum fotográfico", nombre:"Álbum fotográfico personalizado",
    descripcion:"Envía tus fotos y armamos tu álbum.",
    imagen:"", precioBase:19950,
    opciones:[
      { nombre:"Diseño de tapa", valores:["1","2","3","4","5"] }
    ],
    personalizable:true },

];

// ===========================================================
// 2) PÁGINAS DE CATEGORÍA
// Cada categoría que tiene su propia página (con su propia dirección en Google)
// va aquí:   "Nombre de la categoría": "carpeta/"
// Las categorías que aún no tienen página propia van a la sección de la portada donde se muestran
// (por ejemplo "pymes/#imanes"). Con esto la búsqueda y los enlaces de la tienda saben a dónde llevar.
// ===========================================================
const PAGINAS_DE_CATEGORIA = {
  "Calendarios": "calendarios-personalizados/",
  "Etiquetas navideñas": "etiquetas-navidenas/",
  "Cuadros": "cuadros-con-foto/",
  "Cuadros personalizados": "cuadros-personalizados/por-ocasion/",
  "Fotografías": "impresion-de-fotos/",
  "Fotografías Polaroid": "fotos-polaroid/",
  "Posters": "posters-personalizados/",
  "Stickers": "stickers-troquelados/",
  "Stickers personalizados": "stickers-personalizados/",
  "Llaveros": "llaveros-personalizados/",
  "Marcapáginas": "marcapaginas-personalizados/",
  "Libretas": "libretas/",
  "Photocards": "photocards-personalizadas/",
  "Tarjetas de presentación": "tarjetas-de-presentacion/",
  "Imanes": "pymes/#imanes",
  "Envoltorio de regalo": "regalos-personalizados/#papel-y-envoltorio",
  "Pizarra infantil": "regalos-personalizados/#mas-regalos",
  "Álbum fotográfico": "regalos-personalizados/#mas-regalos",
  "Encendedores": "regalos-personalizados/#mas-regalos",
};

// ===========================================================
// 2a) SECCIONES PRINCIPALES
// Son las 5 secciones grandes de la tienda: salen en el menú de arriba y como tarjetas en el inicio.
// Cada una abre su portada. El "Desde $" lo calcula la tienda sola con el precio más bajo de los productos de las
// categorías de esa sección (los ocultos y los que se cotizan por WhatsApp no cuentan), así que no hay que escribirlo.
//   nombre: lo que se ve · href: la portada · categorias: las categorías que cuentan para el "Desde"
//   imagen / alt: la foto cuadrada (1:1) de la tarjeta del inicio y su descripción
// Si una sección se queda sin productos disponibles, desaparece sola del menú y del inicio.
// ===========================================================
const SECCIONES_PRINCIPALES = [
  { id:"cuadros", nombre:"Cuadros", href:"cuadros-personalizados/",
    categorias:["Cuadros","Cuadros personalizados"],
    imagen:"imagenes/cuadro-con-foto-portada.webp", alt:"Cuadro de madera con la foto de una pareja sentada frente a un lago al atardecer" },
  { id:"stickers", nombre:"Stickers", href:"stickers/",
    categorias:["Stickers","Stickers personalizados"],
    imagen:"imagenes/stickers-anime-portada.webp", alt:"Dos sets de stickers de anime y varios stickers troquelados sueltos" },
  { id:"fotografias", nombre:"Fotografías", href:"fotografias/",
    categorias:["Fotografías","Fotografías Polaroid"],
    imagen:"imagenes/fotos-polaroid-portada.webp", alt:"Fotos estilo Polaroid colgadas de un cordel con un gancho de madera, sobre una pila de fotos" },
  { id:"regalos", nombre:"Regalos", href:"regalos-personalizados/",
    categorias:["Libretas","Posters","Calendarios","Marcapáginas","Llaveros","Photocards","Envoltorio de regalo","Etiquetas navideñas","Pizarra infantil","Álbum fotográfico","Encendedores"],
    imagen:"imagenes/llaveros-personalizados-portada.webp", alt:"Tres llaveros acrílicos con fotos y diseños personalizados" },
  { id:"pymes", nombre:"Pymes", href:"pymes/",
    categorias:["Stickers personalizados","Imanes","Tarjetas de presentación"],
    imagen:"imagenes/tarjetas-de-presentacion-portada.webp", alt:"Tarjetas de presentación personalizadas con logo" },
];

// ===========================================================
// 2b) PÁGINAS DE PRODUCTO
// Productos que tienen su propia página (una "ficha"). En el inicio y en la página de cuadros,
// la foto y el nombre de esa tarjeta llevan a la ficha:   "id del producto": "carpeta/"
// ===========================================================
const PAGINAS_DE_PRODUCTO = {
  "cuadro-navideno": "cuadros-personalizados/navidad/",
  "cuadro-enamorados": "cuadros-personalizados/san-valentin/",
  "cuadro-sanvalentin": "cuadros-personalizados/san-valentin/",
  "cuadro-spotify": "cuadros-personalizados/spotify/",
};
