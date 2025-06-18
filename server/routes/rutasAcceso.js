const express = require("express");
const jwt = require("jsonwebtoken");
const Usuario = require("../models/Usuario");
const ServicioUsuario = require("../servicios/usuarios");
const { generaPasswordHash } = require("../utilidades/password");
const { generaTokenAcceso, generaTokenRefresh } = require("../utilidades/autenticacion");

const router = express.Router();

// Endpoint de inicio de sesión
router.post("/iniciar-sesion", async (req, res) => {
	try {
		const { email, password } = req.body;

		console.log("Intento de inicio de sesión para email:", email);

		if (!email || !password) {
			return res.status(400).json({
				success: false,
				error: "Email y password son requeridos",
			});
		}
		const usuario_db = await ServicioUsuario.autenticacionPassword(email, password);

		if (!usuario_db) {
			console.log("Autenticación falló para usuario:", email);
			return res.status(401).json({
				success: false,
				error: "Email o contraseña inválidos",
			});
		}
		// Generar tokens con datos del usuario
		const dataUsuario = {
			nombre: usuario_db.nombre,
			email: usuario_db.email,
		};

		const tokenAcceso = generaTokenAcceso(usuario_db._id, dataUsuario);
		const tokenRefresh = generaTokenRefresh(usuario_db._id);
		// Actualiza token refresh del usuario y la fecha del ultimo login valido
		usuario_db.TokenRefresh = tokenRefresh;
		usuario_db.ultimoLogin = new Date();
		await usuario_db.save();

		// Retorna los datos del usuario y tokens
		res.json({
			success: true,
			data: {
				usuario: {
					id: usuario_db._id,
					nombre: usuario_db.nombre,
					email: usuario_db.email,
					rol: usuario_db.rol,
				},
				tokenAcceso,
				tokenRefresh,
			},
		});
	} catch (error) {
		console.error("Error en inicio de sesión:", error);
		res.status(500).json({
			success: false,
			error: "Error interno del servidor durante el inicio de sesión",
		});
	}
});

// Endpoint de registro
router.post("/registrarse", async (req, res) => {
	try {
		const { nombre, email, password } = req.body;

		if (!nombre || !email || !password) {
			return res.status(400).json({
				success: false,
				error: "Se requiere nombre, email y contraseña",
			});
		}

		if (password.length < 6) {
			return res.status(400).json({
				success: false,
				error: "La contraseña debe tener al menos 6 caracteres",
			});
		}

		// Valida que si el usuario ya existe
		const usuarioExistente = await Usuario.findOne({ email });
		if (usuarioExistente) {
			return res.status(400).json({
				success: false,
				error: "Ya existe un usuario con éste Email",
			});
		}

		// Encriptar la contraseña
		const PasswordHasheada = await generaPasswordHash(password);

		// Crear usuario
		const usuario_db = await ServicioUsuario.crearUsuario({
			nombre,
			email,
			password: PasswordHasheada,
		});
		// Generar tokens con datos del usuario
		const dataUsuario = {
			nombre: usuario_db.nombre,
			email: usuario_db.email,
		};

		const tokenAcceso = generaTokenAcceso(usuario_db._id, dataUsuario);

		// Retorna los datos del usuario y token de acceso (sin token de actualización para registro)
		res.status(201).json({
			success: true,
			data: {
				usuario: {
					id: usuario_db._id,
					nombre: usuario_db.nombre,
					email: usuario_db.email,
					rol: usuario_db.rol,
				},
				tokenAcceso,
			},
		});
	} catch (error) {
		console.error("Error en registro:", error);
		res.status(500).json({
			success: false,
			error: "Error interno del servidor durante el registro",
		});
	}
});

// Endpoint de token refresh
router.post("/actualizar-token", async (req, res) => {
	try {
		const { tokenRefresh } = req.body;

		if (!tokenRefresh) {
			return res.status(400).json({
				success: false,
				error: "No hay token de actualización",
			});
		}
		// Valida el token de actualización
		let decodificado;
		try {
			decodificado = jwt.verify(tokenRefresh, process.env.JWT_TOKEN_REFRESH);
			console.log("Token refresh verificado al ID de usuario:", decodificado.idUsuario);
		} catch (jwtError) {
			console.log("Token refresh inválido:", jwtError.message);
			return res.status(401).json({
				success: false,
				error: "Token refresh inválido o expirado",
			});
		}
		// Busca usuario y verifica que el token de actualización sea igual
		const usuario_db = await Usuario.findById(decodificado.idUsuario);
		if (!usuario_db || usuario_db.TokenRefresh !== tokenRefresh) {
			console.log("Usuario no encontrado o token refresh no es igual");
			return res.status(401).json({
				success: false,
				error: "Token refresh inválido",
			});
		}

		// genera nuevos tokens con datos del usuario
		const dataUsuario = {
			nombre: usuario_db.nombre,
			email: usuario_db.email,
		};

		const nuevoTokenAcceso = generaTokenAcceso(usuario_db._id, dataUsuario);
		const nuevoTokenRefresh = generaTokenRefresh(usuario_db._id);
		usuario_db.TokenRefresh = nuevoTokenRefresh;
		await usuario_db.save();
		res.json({
			success: true,
			data: {
				tokenAcceso: nuevoTokenAcceso,
				tokenRefresh: nuevoTokenRefresh,
			},
		});
	} catch (error) {
		console.error("Error en actualización de token:", error);
		res.status(500).json({
			success: false,
			error: "Error interno del servidor durante la actualización de token",
		});
	}
});

// Endpoint de cerrar sesion
router.post("/cerrar-sesion", async (req, res) => {
	try {
		res.json({
			success: true,
			message: "Sesión cerrada correctamente",
		});
	} catch (error) {
		console.error("Error en cierre de sesión:", error);
		res.status(500).json({
			success: false,
			error: "Error interno del servidor durante el cierre de sesión",
		});
	}
});

module.exports = router;
