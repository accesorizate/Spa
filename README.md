# Papelería Río — Tienda online

## Qué hay en esta carpeta
- `index.html` → tu página completa (catálogo, carrito, checkout).
- `imagenes/` → poné acá las fotos de tus productos.
- `netlify/functions/crear-preferencia.js` → función que genera el pago en Mercado Pago.
- `netlify.toml` → le dice a Netlify dónde están las funciones.

## Pasos para dejarlo funcionando
1. Subí todo esto a un repositorio de GitHub.
2. En Netlify: "Add new site" → "Import an existing project" → elegí ese repositorio de GitHub (en vez de arrastrar el archivo a mano).
3. Creá tu cuenta en Mercado Pago Developers (mercadopago.cl → sección desarrolladores) y sacá tus credenciales de **prueba** primero.
4. En Netlify: Site settings → Environment variables → agregá `MP_ACCESS_TOKEN` con tu Access Token.
5. Volvé a hacer deploy (Netlify lo hace solo cada vez que subís cambios a GitHub).
6. Probá una compra completa con las tarjetas de prueba de Mercado Pago.
7. Cuando todo funcione, reemplazá el Access Token de prueba por el de producción.

Ver la guía completa paso a paso en el chat de Claude.
