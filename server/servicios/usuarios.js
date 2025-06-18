const { randomUUID } = require("crypto");

const Usuario = require("../models/Usuario");
const bcrypt = require("bcrypt");

class ServicioUsuario {
	async obtieneUsuarios() {
		try {
			const usuarios_db = await Usuario.find({}, "-password");
			return usuarios_db;
		} catch (err) {
			console.error("Error al obtener usuarios:", err);
			throw new Error(`Error al obtener usuarios: ${err.message}`);
		}
	}
	async obtieneUsuarioId(idUsuario) {
		try {
			const usuario_db = await Usuario.findById(idUsuario, "-password");
			if (!usuario_db) {
				throw new Error("Usuario no encontrado");
			}
			return usuario_db;
		} catch (err) {
			console.error("Error al obtener usuario:", err);
			throw new Error(`Error al obtener usuario: ${err.message}`);
		}
	}
	async obtener(idUsuario) {
		return this.obtieneUsuarioId(idUsuario);
	}
	async crearUsuario(userData) {
		try {
			const nuevoUsuario = new Usuario(userData);
			await nuevoUsuario.save();
			return nuevoUsuario;
		} catch (err) {
			console.error("Error al crear usuario:", err);
			throw new Error(`Error al crear usuario: ${err.message}`);
		}
	}
	async actualizarUsuario(idUsuario, userData) {
		try {
			const usuario_db = await Usuario.findByIdAndUpdate(idUsuario, userData, { new: true, select: "-password" });
			if (!usuario_db) {
				throw new Error("Usuario no encontrado");
			}
			return usuario_db;
		} catch (err) {
			if (err.message === "Usuario no encontrado") {
				throw err;
			}
			console.error("Error al actualizar usuario:", err);
			throw new Error(`Error al actualizar usuario: ${err.message}`);
		}
	}

	async update(idUsuario, userData) {
		return this.actualizarUsuario(idUsuario, userData);
	}

	async borrarUsuario(idUsuario) {
		try {
			const usuario_db = await Usuario.findByIdAndDelete(idUsuario);
			if (!usuario_db) {
				throw new Error("Usuario no encontrado");
			}
			return { message: "Usuario eliminado correctamente" };
		} catch (err) {
			console.error("Error al eliminar usuario:", err);
			throw new Error(`Error al eliminar usuario: ${err.message}`);
		}
	}
	async autenticacionPassword(email, password) {
		try {
			console.log("Intentando autenticar usuario:", email);

			const usuario_db = await Usuario.findOne({ email }).maxTimeMS(5000); // Timeout de 5 segundos

			if (!usuario_db) {
				console.log("Usuario no encontrado:", email);
				return null;
			}
			const esPasswordValida = await bcrypt.compare(password, usuario_db.password);

			if (!esPasswordValida) {
				console.log("Contraseña inválida del usuario:", email);
				return null;
			}
			return usuario_db;
		} catch (err) {
			console.error("Error durante la autenticación:", err.message);
			throw new Error(`Falló la autenticación: ${err.message}`);
		}
	}

	// Métodos de gestión de direcciones
	async agregarDireccion(idUsuario, datosDireccion) {
		try {
			const usuario_db = await Usuario.findById(idUsuario);
			if (!usuario_db) {
				throw new Error("Usuario no encontrado");
			}
			usuario_db.direcciones.push(datosDireccion);
			await usuario_db.save();
			return usuario_db.direcciones[usuario_db.direcciones.length - 1];
		} catch (err) {
			console.error("Error al agregar dirección:", err);
			throw new Error(`Error al agregar dirección: ${err.message}`);
		}
	}

	async actualizarDireccion(idUsuario, direccionId, datosDireccion) {
		try {
			const usuario_db = await Usuario.findById(idUsuario);
			if (!usuario_db) {
				throw new Error("Usuario no encontrado");
			}
			const direccion_db = usuario_db.direcciones.id(direccionId);
			if (!direccion_db) {
				throw new Error("Dirección no encontrada");
			}

			Object.assign(direccion_db, datosDireccion);
			await usuario_db.save();

			return direccion_db;
		} catch (err) {
			console.error("Error al actualizar dirección:", err);
			throw new Error(`Error al actualizar dirección: ${err.message}`);
		}
	}

	async obtenerDirecciones(idUsuario) {
		try {
			const usuario_db = await Usuario.findById(idUsuario);
			if (!usuario_db) {
				throw new Error("Usuario no encontrado");
			}
			return usuario_db.direcciones;
		} catch (err) {
			console.error("Error al obtener direcciones:", err);
			throw new Error(`Error al obtener direcciones: ${err.message}`);
		}
	}

	async borrarDirecciones(idUsuario, direccionId) {
		try {
			const usuario_db = await Usuario.findById(idUsuario);
			if (!usuario_db) {
				throw new Error("Usuario no encontrado");
			}

			usuario_db.direcciones.id(direccionId).remove();
			await usuario_db.save();
			return { message: "Dirección eliminada correctamente" };
		} catch (err) {
			console.error("Error al eliminar dirección:", err);
			throw new Error(`Error al eliminar dirección: ${err.message}`);
		}
	}
}

module.exports = new ServicioUsuario();
