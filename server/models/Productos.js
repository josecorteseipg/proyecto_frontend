const mongoose = require("mongoose");

const productoEsquema = new mongoose.Schema(
	{
		nombreProducto: {
			type: String,
			required: true,
			trim: true,
			maxlength: 200,
		},
		descripcionProducto: {
			type: String,
			required: true,
			maxlength: 2000,
		},
		precio: {
			type: Number,
			required: true,
			min: 0,
		},
		imagen: {
			type: String,
			required: true,
		},
		imagenes: [
			{
				type: String,
			},
		],
		categoria: {
			type: String,
			required: true,
			trim: true,
		},
		calificacion: {
			type: Number,
			default: 0,
			min: 0,
			max: 5,
		},
		tieneStock: {
			type: Boolean,
			default: true,
		},
		especificaciones: {
			type: Map,
			of: String,
			default: new Map(),
		},
		creadoPor: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Usuario",
			required: true,
		},
	},
	{
		timestamps: true,
	}
);

// Índice para funcionalidad de búsqueda
productoEsquema.index({ nombre: "text", descripcionProducto: "text" });
productoEsquema.index({ categoria: 1 });
productoEsquema.index({ precio: 1 });
productoEsquema.index({ calificacion: -1 });

module.exports = mongoose.model("Producto", productoEsquema);
