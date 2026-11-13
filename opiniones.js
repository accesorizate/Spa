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
imagenes/pedidos/pedido-real-01.webp | Me encantaron los stickers personalizados, quedaron preciosos y los colores son tal cual los esperaba. ¡Volvería a comprar sin duda!
`;

const OPINIONES_TEXTO = `
# ----------------------------------------------------------------
# Escribe aquí, una línea por opinión (después de este comentario).
# ----------------------------------------------------------------

`;
