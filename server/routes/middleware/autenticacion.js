const ServicioUsuario = require("../../servicios/usuarios.js");
const jwt = require("jsonwebtoken");

const requiereUsuario = async (req, res, next) => {
	//split separa string segun el caracter indicado, en este caso lo separa por espacio en blanco
	const token = req.headers.authorization?.split(" ")[1];
	if (!token) return res.status(401).json({ message: "No autorizado" });

	try {
		const decodificacion = jwt.verify(token, process.env.JWT_CLAVE_SECRETA);
		const dataUsuario = await ServicioUsuario.obtener(decodificacion.idUsuario);
		if (!dataUsuario) {
			return res.status(401).json({ error: "Usuario no encontrado" });
		}
		req.user = dataUsuario;

		next();
	} catch (err) {
		return res.status(403).json({ error: "Token inválido o expirado" });
	}
};

module.exports = {
	requiereUsuario,
};
