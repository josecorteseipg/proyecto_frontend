const express = require("express");
const ServicioProducto = require("../servicios/productos");

const router = express.Router();
router.get("/", async (req, res) => {
	try {
		const filtros = {
			pagina: req.query.pagina,
			limite: req.query.limite,
			categoria: req.query.categoria,
			busqueda: req.query.busqueda,
			minprecio: req.query.minprecio,
			maxprecio: req.query.maxprecio,
			ordernarPor: req.query.ordernarPor,
		};

		const resultado = await ServicioProducto.obtenerProductos(filtros);

		console.log("Productos encontrados:", resultado.productosEncontrados.length);

		res.json({
			success: true,
			data: resultado,
		});
	} catch (error) {
		console.error("Error obteniendo productos:", error);
		res.status(500).json({
			success: false,
			error: error.message,
		});
	}
});

router.get("/:id", async (req, res) => {
	try {
		console.log("rescatando producto por ID:", req.params.id);

		const productoEncontrado = await ServicioProducto.obtenerProductosId(req.params.id);

		console.log("Producto encontrado:", productoEncontrado.nombreProducto);

		res.json({
			success: true,
			data: { productoEncontrado },
		});
	} catch (error) {
		console.error("Error obteniendo producto:", error);
		res.status(404).json({
			success: false,
			error: error.message,
		});
	}
});

router.get("/categorias/lista", async (req, res) => {
	try {
		const categorias = await ServicioProducto.obtenerCategorias();

		res.json({
			success: true,
			data: { categorias },
		});
	} catch (error) {
		console.error("Error obteniendo categorías:", error);
		res.status(500).json({
			success: false,
			error: error.message,
		});
	}
});

module.exports = router;
