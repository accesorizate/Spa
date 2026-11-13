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
imagenes/pedido-real-01.webp | Pedido de Accesorizate en una bolsa de envío blanca con su etiqueta, sostenido frente a un portón
imagenes/pedido-real-02.webp | Pedido grande de Accesorizate en una bolsa de envío blanca, sostenido con las dos manos
imagenes/pedido-real-03.webp | Persona recibiendo su pedido de Accesorizate en una bolsa blanca, junto a una camioneta blanca
imagenes/pedido-real-04.webp | Pedido de Accesorizate en una bolsa de envío blanca, entregado frente a una pared verde
imagenes/pedido-real-05.webp | Pedido de Accesorizate en una bolsa de envío gris azulada, sostenido frente a una reja
imagenes/pedido-real-06.webp | Dos paquetes de Accesorizate apilados, uno con una etiqueta roja de frágil, recibidos en una puerta
imagenes/pedido-real-07.webp | Pedido de Accesorizate en una bolsa de envío lila, entregado en la calle
imagenes/pedido-real-08.webp | Persona sosteniendo su pedido de Accesorizate en una bolsa blanca, en la calle frente a su casa
imagenes/pedido-real-09.webp | Pedido grande de Accesorizate en una bolsa blanca, recibido a la entrada de una casa
imagenes/pedido-real-10.webp | Cliente mostrando su pedido de Accesorizate en una bolsa de envío blanca, tras la reja de su casa
imagenes/pedido-real-11.webp | Pedido de Accesorizate en una bolsa de envío blanca, entregado al anochecer en la calle
imagenes/pedido-real-12.webp | Persona mostrando su pedido de Accesorizate en una bolsa blanca a través de una reja
imagenes/pedido-real-13.webp | Pedido de Accesorizate en una bolsa blanca, visto a través de una reja
imagenes/pedido-real-14.webp | Persona recibiendo su pedido de Accesorizate en una bolsa de envío blanca grande
imagenes/pedido-real-15.webp | Pedido de Accesorizate en una bolsa de envío plateada, entregado de noche en la calle
imagenes/pedido-real-16.webp | Pedido de Accesorizate en una bolsa de envío lila con su etiqueta, entregado en mano
imagenes/pedido-real-17.webp | Pedido de Accesorizate en una bolsa de envío gris, sostenido frente a una reja negra
imagenes/pedido-real-18.webp | Pedido de Accesorizate en una bolsa de envío lila, entregado a través de una puerta
imagenes/pedido-real-19.webp | Pedido de Accesorizate en una bolsa de envío lila, sostenido con las dos manos frente a un muro con grafitis
imagenes/pedido-real-20.webp | Cuadro envuelto en plástico burbuja con la etiqueta de Accesorizate, recibido en un portón | Cuadro personalizado
imagenes/pedido-real-21.webp | Persona mostrando su cuadro envuelto en plástico burbuja, dentro de un local comercial | Cuadro personalizado
imagenes/pedido-real-22.webp | Persona mostrando su lámina de stickers redondos, de pie en la calle | Lámina de stickers
imagenes/pedido-real-23.webp | Pedido de Accesorizate en una bolsa de envío lila, sostenido a través de una reja negra
imagenes/pedido-real-24.webp | Cliente recibiendo su pedido de Accesorizate en una bolsa de envío lila, junto a un portón de fierro
imagenes/pedido-real-25.webp | Pedido de Accesorizate en una bolsa de envío blanca, sostenido tras una reja en un antejardín
imagenes/pedido-real-26.webp | Pedido de Accesorizate en una bolsa de envío lila grande, entregado en la entrada de una casa
imagenes/pedido-real-27.webp | Cliente con su pedido de Accesorizate en una bolsa de envío lila, junto a una bicicleta
imagenes/pedido-real-28.webp | Persona mostrando su pedido de Accesorizate en una bolsa de envío blanca, junto a un auto rojo
imagenes/pedido-real-29.webp | Pedido de Accesorizate en una bolsa de envío blanca, recibido tras una reja turquesa de un local
imagenes/pedido-real-30.webp | Pedido de Accesorizate en una bolsa de envío gris, entregado sobre un mesón de recepción
`;

const OPINIONES_TEXTO = `
# ----------------------------------------------------------------
# Escribe aquí, una línea por opinión (después de este comentario).
# ----------------------------------------------------------------
5.0 | Camila R. | Stickers personalizados | Me encantaron, quedaron preciosos y los colores son tal cual los esperaba. ¡Volvería a comprar sin duda!
5.0 | Sebastián M. | Tarjetas de presentación | Excelente calidad, se ven muy profesionales y llegaron perfectamente empaquetadas.
5.0 | Fernanda C. | Stickers para pyme | Quedaron maravillosos. Mis clientes los aman y le dan un toque especial a mis pedidos.
4.0 | Valentina P. | Stickers personalizados | Muy lindos los stickers, buena calidad y excelente impresión. Me gustó mucho el resultado.
5.0 | Daniela S. | Cuadro personalizado Día de la Madre | Fue un regalo hermoso. Mi mamá quedó emocionada, sin duda una linda experiencia.
5.0 | Carolina T. | Tarjetas de presentación | Me encantó la atención y el resultado final. Las tarjetas quedaron exactamente como las diseñé.
4.0 | Nicolás F. | Stickers para pyme | Buen servicio y productos de calidad. Los stickers para mi emprendimiento quedaron muy bonitos.
5.0 | Javiera M. | Stickers personalizados | Son preciosos, tienen excelente adhesión y muy buena calidad de impresión. ¡Recomendadísimos!
4.0 | Francisca L. | Cuadro personalizado Navidad | Quedó muy bonito. Fue un regalo diferente y especial para mi familia.
5.0 | Constanza A. | Stickers personalizados | Me encantó todo, desde la atención hasta el producto. Los detalles quedaron perfectos.
4.0 | Antonia V. | Stickers para pyme | Muy buena experiencia. Pedí stickers para mi emprendimiento y quedaron tal como los necesitaba.
5.0 | Paula G. | Cuadro personalizado Día del Padre | Quedó hermoso. Se nota la dedicación que ponen en cada trabajo.
3.0 | Macarena D. | Stickers personalizados | Al principio hubo una confusión con mi pedido y recibí un diseño diferente. Me comuniqué y me solucionaron el problema.
5.0 | Andrea B. | Stickers personalizados | Superaron mis expectativas. Los colores son hermosos y la terminación es excelente.
4.0 | Catalina E. | Tarjetas de presentación | Muy bonitos los productos. Las tarjetas quedaron súper profesionales. Sin duda volveré a encargar.
5.0 | María José R. | Cuadro personalizado Día de la Madre | Fue un regalo perfecto para mi mamá. Quedó muy delicado y especial.
4.0 | Francisca P. | Stickers para pyme | Buena calidad y excelente presentación. Llegaron bien protegidos y se ven preciosos.
5.0 | Isidora N. | Stickers para pyme | Me encantó cómo quedaron. Le dieron una imagen mucho más bonita a los empaques de mi emprendimiento.
4.0 | Belén O. | Cuadro personalizado Navidad | Me gustó muchísimo. Es un lindo recuerdo para toda la familia.
5.0 | Claudia F. | Tarjetas de presentación | Excelente trabajo, las tarjetas quedaron hermosas y con una impresión muy nítida.
4.0 | Daniela V. | Stickers personalizados | Quedaron muy lindos y llegaron en buenas condiciones. Buena relación entre precio y calidad.
5.0 | Romina H. | Cuadro personalizado Día de la Madre | Fue un éxito. Un regalo muy emotivo y personalizado.
3.0 | Paula M. | Tarjetas de presentación | Mi pedido llegó con un pequeño error en la personalización, pero me comuniqué y me dieron una solución. Agradezco que respondieran.
5.0 | Nicole C. | Stickers para pyme | Quedaron muy profesionales y son perfectos para decorar los empaques de mis productos.
4.0 | Alejandra S. | Cuadro personalizado Día del Padre | Quedó precioso y fue un regalo muy especial para mi papá.
5.0 | Camila D. | Stickers personalizados | Todo hermoso, los detalles y colores quedaron increíbles. Definitivamente compraré nuevamente.
4.0 | Francisca T. | Tarjetas de presentación | Quedaron muy bonitas. Buena calidad de papel y excelente terminación.
5.0 | Valeria J. | Stickers personalizados | Quedé feliz con el resultado. Se nota el cariño que ponen en los detalles.
3.0 | Carolina M. | Stickers para pyme | Hubo una equivocación con parte de mi pedido, pero me respondieron y resolvieron el inconveniente. Valoro mucho la atención.
5.0 | Florencia R. | Cuadro personalizado Navidad | Quedó incluso más lindo de lo que imaginaba. ¡Una excelente opción para regalar!
`;
