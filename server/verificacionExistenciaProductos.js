const { cargarProductosEjemplo } = require("./cargarProductosEjemplo");
const Producto = require("./models/Productos");
/**
 * Verifica si existen productos en la base de datos
 * Si no existen, carga los productos de ejemplo para poblar de productos a la base de datos y se renderizen en el front
 */
async function verificarYCargarProductos() {
	try {
		const conteoProductos = await Producto.countDocuments();
		if (conteoProductos == 0) {
			console.log("No hay productos en la base de datos.");
			await cargarProductosEjemplo();
		} else {
			console.log(`Existen ${conteoProductos} productos.`);
		}
	} catch (error) {
		console.error("Error de verificacion de productos:", error.message);
	}
}

module.exports = { verificarYCargarProductos };
