const mongoose = require("mongoose");

const { validaPassword, esPasswordHash } = require("../utilidades/password.js");
const { randomUUID } = require("crypto");

const direccionEsquema = new mongoose.Schema(
	{
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
		esPrincipal: {
			type: Boolean,
			default: false,
		},
	},
	{
		timestamps: true,
	}
);

const usuarioEsquema = new mongoose.Schema(
	{
		email: {
			type: String,
			required: true,
			index: true,
			unique: true,
			lowercase: true,
		},
		password: {
			type: String,
			required: true,
			validate: { validator: esPasswordHash, message: "Hash de contraseña inválido" },
		},
		nombre: {
			type: String,
			default: "",
		},
		rol: {
			type: String,
			default: "usuario",
		},
		telefono: {
			type: String,
			default: "",
		},
		direcciones: [direccionEsquema],
		fechaCreacion: {
			type: Date,
			default: Date.now,
			immutable: true,
		},
		ultimoLogin: {
			type: Date,
			default: Date.now,
		},
		esActivo: {
			type: Boolean,
			default: true,
		},
		TokenRefresh: {
			type: String,
			unique: true,
			index: true,
			default: () => randomUUID(),
		},
	},
	{
		versionKey: false,
	}
);

const Usuario = mongoose.model("Usuario", usuarioEsquema);

module.exports = Usuario;
