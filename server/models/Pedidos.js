const mongoose = require("mongoose");

const ItemPedidoEsquema = new mongoose.Schema(
	{
		IdProducto: {
			type: String,
			required: true,
		},
		nombreProducto: {
			type: String,
			required: true,
		},
		precio: {
			type: Number,
			required: true,
			min: 0,
		},
		cantidad: {
			type: Number,
			required: true,
			min: 1,
		},
		imagen: {
			type: String,
			required: true,
		},
	},
	{
		_id: false,
	}
);

const DireccionEnvioEsquema = new mongoose.Schema(
	{
		nombreCompleto: {
			type: String,
			required: true,
		},
		direccion: {
			type: String,
			required: true,
		},
		ciudad: {
			type: String,
			required: true,
		},
		region: {
			type: String,
			required: true,
		},
	},
	{
		_id: false,
	}
);

const PedidoEsquema = new mongoose.Schema(
	{
		idUsuario: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Usuario",
			required: true,
		},
		items: [ItemPedidoEsquema],
		totalPedido: {
			type: Number,
			required: true,
			min: 0,
		},
		estado: {
			type: String,
			enum: ["pendiente", "confirmado", "enviado", "entregado", "cancelado"],
			default: "pendiente",
		},
		direccionEnvio: {
			type: DireccionEnvioEsquema,
			required: true,
		},
		metodoPago: {
			type: String,
			required: true,
		},
	},
	{
		timestamps: true,
	}
);

module.exports = mongoose.model("Pedido", PedidoEsquema);
