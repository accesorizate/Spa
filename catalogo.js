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
    // Tamaño "18x24" con precio de ejemplo ($6.500): cambialo por el real.
    grupoPrecio:"Tamaño",
    precios:{ "10x15":3500, "13x18":4500, "15x20":5500, "18x24":6500 },
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
    imagen:"imagenes/publisticker2.webp",
    alt:"Set de stickers anime en bolsa, con stickers sueltos alrededor", grupoPrecio:"Tamaño / cantidad",
    precios:{ "5cm (15-20 unidades)":1000, "8cm (7-8 unidades)":1000, "12cm (5 unidades)":1500 },
    opciones:[
      { nombre:"Tamaño / cantidad", valores:["5cm (15-20 unidades)","8cm (7-8 unidades)","12cm (5 unidades)"] },
      { nombre:"Diseño", valores:["1","2","3","4"] }
    ],
    personalizable:false },

  { id:"stickers-caricaturas", categoria:"Stickers", nombre:"Set de stickers caricaturas",
    descripcion:"Elige el tamaño (con su cantidad aproximada) y el diseño.",
    imagen:"imagenes/publisticker3.png", grupoPrecio:"Tamaño / cantidad",
    precios:{ "5cm (15-20 unidades)":1000, "8cm (7-8 unidades)":1000, "12cm (5 unidades)":1500 },
    opciones:[
      { nombre:"Tamaño / cantidad", valores:["5cm (15-20 unidades)","8cm (7-8 unidades)","12cm (5 unidades)"] },
      { nombre:"Diseño", valores:["1","2","3","4"] }
    ],
    personalizable:false },

  { id:"stickers-animales", categoria:"Stickers", nombre:"Set de stickers animales",
    descripcion:"Elige el tamaño (con su cantidad aproximada) y el diseño.",
    imagen:"imagenes/publisticker1.png", grupoPrecio:"Tamaño / cantidad",
    precios:{ "5cm (15-20 unidades)":1000, "8cm (7-8 unidades)":1000, "12cm (5 unidades)":1500 },
    opciones:[
      { nombre:"Tamaño / cantidad", valores:["5cm (15-20 unidades)","8cm (7-8 unidades)","12cm (5 unidades)"] },
      { nombre:"Diseño", valores:["Gatitos","Dinosaurios"] }
    ],
    personalizable:false },

  // Stickers a medida: se cotizan por WhatsApp (sin precio ni carrito) hasta que tengas precios y cantidades.
  // Forma y Tamaño que elige el cliente viajan en el mensaje de WhatsApp. Cuando tengas precios,
  // quita "accionPersonalizada" y "sinPrecio" y agrega "combinacionPrecio" + "preciosPorCombinacion".
  { id:"stickers-personalizados", categoria:"Stickers personalizados", nombre:"Stickers personalizados con tu logo o imagen",
    descripcion:"Para packaging, bolsas y regalos. Elige forma y tamaño y cuéntanos tu idea por WhatsApp: te cotizamos.",
    imagen:"",
    opciones:[
      { nombre:"Forma", valores:["Circular","Cuadrado"] },
      { nombre:"Tamaño", valores:["3x3 cm","4x4 cm","5x5 cm","6x6 cm","7x7 cm","8x8 cm","9x9 cm","Medida personalizada"] }
    ],
    accionPersonalizada:{
      tipo:"whatsapp",
      mensaje:"Hola! Quiero cotizar stickers personalizados con mi logo o imagen."
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
    imagen:"",
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
    imagen:"imagenes/publipolaroid.webp",
    alt:"Fotos estilo Polaroid personalizadas en acabado normal, laminado e imantado",
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
    imagen:"", grupoPrecio:"Tipo",
    precios:{ "Normal":2000, "Imantado":2500 },
    opciones:[
      { nombre:"Tipo", valores:["Normal","Imantado"] }
    ],
    personalizable:true },

  { id:"marcapaginas", categoria:"Marcapáginas", nombre:"Marcapáginas",
    descripcion:"Elige el tipo, la cantidad y el diseño (uno por unidad si llevas más de 1).",
    imagen:"",
    opciones:[
      { nombre:"Tipo", valores:["Normal","Imantado"] },
      { nombre:"Cantidad", dependeDe:"Tipo", valoresPorPadre:{
          "Normal":["1 unidad","3 unidades"],
          "Imantado":["1 unidad"]
        }
      },
      { nombre:"Diseño", multiplePorCantidad:"Cantidad", valores:["1","2","3","4","5"] }
    ],
    combinacionPrecio:["Tipo","Cantidad"],
    preciosPorCombinacion:{
      "Normal|1 unidad":400,
      "Normal|3 unidades":1000,
      "Imantado|1 unidad":500
    },
    personalizable:true },

  { id:"libretas", categoria:"Libretas", nombre:"Libreta",
    descripcion:"Elige el número de diseño de tapa.",
    imagen:"", precioBase:500,
    opciones:[
      { nombre:"Diseño", valores:["1","2","3","4","5"] }
    ],
    personalizable:false },

  { id:"papel-regalo", categoria:"Papel de regalo", nombre:"Papel de regalo",
    descripcion:"Elige el número de diseño.",
    imagen:"", precioBase:2500,
    opciones:[
      { nombre:"Diseño", valores:["1","2","3","4","5"] }
    ],
    personalizable:false },

  { id:"etiqueta-cortada", categoria:"Etiquetas navideñas", nombre:"Etiqueta navideña (ya cortada)",
    descripcion:"Etiqueta individual, ya cortada y lista para pegar en el regalo. Elige el diseño (uno por unidad si llevas más de 1).",
    imagen:"", grupoPrecio:"Cantidad",
    precios:{ "1 unidad":300, "2 unidades":500 },
    opciones:[
      { nombre:"Cantidad", valores:["1 unidad","2 unidades"] },
      { nombre:"Diseño", multiplePorCantidad:"Cantidad", valores:["1","2","3","4","5"] }
    ],
    personalizable:false },

  { id:"etiquetas", categoria:"Etiquetas navideñas", nombre:"Set de etiquetas navideñas (tira sin cortar)",
    descripcion:"Tira sin cortar con diseños surtidos (no se elige diseño individual).",
    imagen:"", precioBase:1000,
    opciones:[],
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
    imagen:"", precioBase:1290,
    opciones:[],
    personalizable:true },

  { id:"photocards", categoria:"Photocards", nombre:"Photocards",
    descripcion:"Elige el número de diseño y el acabado.",
    imagen:"", precioBase:500,
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
// El menú y los enlaces de la tienda llevan a esas páginas. Si una categoría no
// está en esta lista, el menú la lleva a su sección dentro del inicio.
// ===========================================================
const PAGINAS_DE_CATEGORIA = {
  "Calendarios": "calendarios-personalizados/",
  "Etiquetas navideñas": "etiquetas-navidenas/",
  "Cuadros": "cuadros-personalizados/",
  "Cuadros personalizados": "cuadros-personalizados/",
  "Fotografías": "impresion-de-fotos/",
  "Fotografías Polaroid": "fotos-polaroid/",
  "Posters": "posters-personalizados/",
  "Stickers": "stickers/",
  "Stickers personalizados": "stickers-personalizados/",
  "Llaveros": "llaveros-personalizados/",
  "Marcapáginas": "marcapaginas-personalizados/",
  "Libretas": "libretas/",
  "Photocards": "photocards-personalizadas/",
};

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
