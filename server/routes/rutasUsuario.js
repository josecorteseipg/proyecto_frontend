const express = require("express");
const ServicioUsuario = require("../servicios/usuarios.js");
const { requiereUsuario } = require("./middleware/autenticacion.js");

const router = express.Router();

// Obtener perfil de usuario
router.get("/perfil", requiereUsuario, async (req, res) => {
	try {
		const usuarioDatos = await ServicioUsuario.obtener(req.user._id);
		if (!usuarioDatos) {
			return res.status(404).json({ error: "Usuario no encontrado" });
		}
		res.json({ usuarioDatos });
	} catch (error) {
		console.error(`Error obteniendo perfil de usuario: ${error.message}`);
		res.status(500).json({ error: error.message });
	}
});

// Actualizar perfil de usuario
router.put("/perfil", requiereUsuario, async (req, res) => {
	try {
		const { nombre, email, telefono } = req.body;

		if (!nombre || !email) {
			return res.status(400).json({ error: "El nombre y email son requeridos" });
		}

		const usuarioActualizado = await ServicioUsuario.update(req.user._id, {
			nombre,
			email,
			telefono: telefono || "",
		});

		if (!usuarioActualizado) {
			return res.status(404).json({ error: "Usuario no encontrado" });
		}

		res.json({ usuario: usuarioActualizado, success: true });
	} catch (error) {
		console.error(`Error actualizando perfil de usuario: ${error.message}`);
		res.status(500).json({ error: error.message });
	}
});

// Agregar nueva dirección
router.post("/direcciones", requiereUsuario, async (req, res) => {
	try {
		const { direccion, ciudad, region, esPrincipal } = req.body;

		if (!direccion || !ciudad || !region) {
			return res.status(400).json({ error: "Todos los campos de dirección son requeridos" });
		}

		const datosDireccion = {
			direccion,
			ciudad,
			region,
			esPrincipal: esPrincipal || false,
		};

		const nuevaDireccion = await ServicioUsuario.agregarDireccion(req.user._id, datosDireccion);
		res.status(201).json({ direccion: nuevaDireccion, success: true });
	} catch (error) {
		console.error(`Error agregando dirección: ${error.message}`);
		res.status(500).json({ error: error.message });
	}
});

// Actualizar dirección
router.put("/direcciones/:id", requiereUsuario, async (req, res) => {
	try {
		const { id } = req.params;
		const { direccion, ciudad, region, esPrincipal } = req.body;

		if (!direccion || !ciudad || !region) {
			return res.status(400).json({ error: "Todos los campos de dirección son requeridos" });
		}

		const datosDireccion = {
			direccion,
			ciudad,
			region,
			esPrincipal: esPrincipal || false,
		};

		const direccionActualizada = await ServicioUsuario.actualizarDireccion(req.user._id, id, datosDireccion);
		res.json({ direccion: direccionActualizada, success: true });
	} catch (error) {
		console.error(`Error actualizando dirección: ${error.message}`);
		res.status(500).json({ error: error.message });
	}
});

// Eliminar dirección
router.delete("/direcciones/:id", requiereUsuario, async (req, res) => {
	try {
		const { id } = req.params;
		await ServicioUsuario.borrarDirecciones(req.user._id, id);
		res.json({ success: true });
	} catch (error) {
		console.error(`Error eliminando dirección: ${error.message}`);
		res.status(500).json({ error: error.message });
	}
});

module.exports = router;
