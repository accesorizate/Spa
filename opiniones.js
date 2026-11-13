/* ===========================================================
     PEDIDOS REALES Y OPINIONES DE CLIENTES
     Este archivo es tuyo: aquí agregas las fotos de pedidos y las opiniones que quieres mostrar.
     Se ven en accesorizate.cl/pedidos-reales/ y, en el inicio, en la sección "Pedidos reales de nuestros clientes".
     Mientras no escribas nada, esas secciones no muestran fotos ni opiniones (y en el inicio la sección se oculta sola).

     CÓMO AGREGAR UNA FOTO DE UN PEDIDO REAL
       1) Sube la foto a la carpeta imagenes/pedidos/ (cuadrada, 1:1, formato .webp o .jpg, de unos 800 x 800 px).
       2) Escribe una línea debajo de PEDIDOS_REALES_TEXTO con este orden, separado por |
            ruta de la foto | qué se ve en la foto | producto
          Ejemplo:
            imagenes/pedidos/cuadro-pareja.webp | Cuadro personalizado con una foto de pareja | Cuadro personalizado
          La segunda parte (qué se ve) la leen los lectores de pantalla y Google Imágenes: descríbela con tus palabras.
          El producto es opcional.
       3) Las primeras líneas se ven primero. Para sacar una foto, borra la línea (o ponle # al comienzo).

     CÓMO AGREGAR UNA OPINIÓN
       Los clientes envían su opinión por WhatsApp o por correo desde la página (tú la lees y decides si la publicas).
       Para publicarla, escribe una línea debajo de OPINIONES_TEXTO con este orden, separado por |
            estrellas | nombre | producto | opinión
       Las estrellas van de 1 a 5, y puedes usar medias estrellas con punto: 1, 1.5, 2, 2.5 ... 5.
       Ejemplo:
            4.5 | María P. | Cuadro personalizado | Quedó precioso y llegó rápido.
       Publica la opinión tal como la escribió el cliente (puedes corregir ortografía), con su nombre y con su autorización.
       Las más nuevas van arriba: escribe cada nueva opinión en la primera línea.

     Todo lo que empiece con # se ignora. No uses comillas ni comas especiales: solo separa con |
     Si una línea queda mal escrita (por ejemplo, estrellas fuera de 1 a 5), simplemente no se muestra.
     =========================================================== */

const PEDIDOS_REALES_TEXTO = `
# ----------------------------------------------------------------
# Escribe aquí, una línea por foto (después de este comentario).
# ----------------------------------------------------------------
imagenes/pedidos/pedido-real-01.webp | Pedido de Accesorizate en una bolsa de envío blanca con su etiqueta, sostenido frente a un portón
imagenes/pedidos/pedido-real-02.webp | Pedido grande de Accesorizate en una bolsa de envío blanca, sostenido con las dos manos
imagenes/pedidos/pedido-real-03.webp | Persona recibiendo su pedido de Accesorizate en una bolsa blanca, junto a una camioneta blanca
imagenes/pedidos/pedido-real-04.webp | Pedido de Accesorizate en una bolsa de envío blanca, entregado frente a una pared verde
imagenes/pedidos/pedido-real-05.webp | Pedido de Accesorizate en una bolsa de envío gris azulada, sostenido frente a una reja
imagenes/pedidos/pedido-real-06.webp | Dos paquetes de Accesorizate apilados, uno con una etiqueta roja de frágil, recibidos en una puerta
imagenes/pedidos/pedido-real-07.webp | Pedido de Accesorizate en una bolsa de envío lila, entregado en la calle
imagenes/pedidos/pedido-real-08.webp | Persona sosteniendo su pedido de Accesorizate en una bolsa blanca, en la calle frente a su casa
imagenes/pedidos/pedido-real-09.webp | Pedido grande de Accesorizate en una bolsa blanca, recibido a la entrada de una casa
imagenes/pedidos/pedido-real-10.webp | Cliente mostrando su pedido de Accesorizate en una bolsa de envío blanca, tras la reja de su casa
imagenes/pedidos/pedido-real-11.webp | Pedido de Accesorizate en una bolsa de envío blanca, entregado al anochecer en la calle
imagenes/pedidos/pedido-real-12.webp | Persona mostrando su pedido de Accesorizate en una bolsa blanca a través de una reja
imagenes/pedidos/pedido-real-13.webp | Pedido de Accesorizate en una bolsa blanca, visto a través de una reja
imagenes/pedidos/pedido-real-14.webp | Persona recibiendo su pedido de Accesorizate en una bolsa de envío blanca grande
imagenes/pedidos/pedido-real-15.webp | Pedido de Accesorizate en una bolsa de envío plateada, entregado de noche en la calle
`;

const OPINIONES_TEXTO = `
# ----------------------------------------------------------------
# Escribe aquí, una línea por opinión (después de este comentario).
# ----------------------------------------------------------------
 4.5 | María P. | Cuadro personalizado | Quedó precioso y llegó rápido.
`;
