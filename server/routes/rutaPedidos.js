const express = require("express");
const PedidosServicio = require("../servicios/pedidos.js");
const { requiereUsuario } = require("./middleware/autenticacion.js");

const router = express.Router();
//RUTA POST, recibe datos para guardar o consultar
router.post("/", requiereUsuario, async (req, res) => {
	try {
		const datosPedido = req.body;
		console.log("Datos del pedido:", JSON.stringify(datosPedido, null, 2));
		const pedido = await PedidosServicio.crearPedido(datosPedido, req.user._id);

		res.status(201).json({
			success: true,
			message: "Pedido creado correctamente",
			pedido,
		});
	} catch (error) {
		console.error(`Error creando pedido: ${error.message}`);
		res.status(400).json({
			success: false,
			error: error.message,
		});
	}
});
//RUTA GET, solicita datos y retorna resultado
router.get("/", requiereUsuario, async (req, res) => {
	try {
		console.log("Obteniendo pedidos para usuario:", req.user._id);

		const pedidos = await PedidosServicio.obtienePedidosUsuario(req.user._id);
		res.json({
			success: true,
			pedidos,
		});
	} catch (error) {
		console.error(`Error obteniendo pedidos: ${error.message}`);
		res.status(500).json({
			success: false,
			error: error.message,
		});
	}
});

router.get("/:id", requiereUsuario, async (req, res) => {
	try {
		const pedidoId = req.params.id;

		console.log("Obteniendo pedido por ID:", pedidoId, "para usuario:", req.user._id);
		const pedido = await PedidosServicio.obtienePedidoId(pedidoId, req.user._id);
		res.json({
			success: true,
			pedido,
		});
	} catch (error) {
		console.error(`Error obteniendo pedido por ID: ${error.message}`);
		if (error.message === "Pedido no encontrado") {
			res.status(404).json({
				success: false,
				error: "Pedido no encontrado",
			});
		} else {
			res.status(500).json({
				success: false,
				error: error.message,
			});
		}
	}
});

module.exports = router;
