const jwt = require("jsonwebtoken");

const generaTokenAcceso = (idUsuario, datosUsuario = {}) => {
	const jwtSecreta = process.env.JWT_CLAVE_SECRETA;
	if (!jwtSecreta) {
		console.error("JWT_CLAVE_SECRETA no está definido en las variables de entorno");
		throw new Error("JWT_CLAVE_SECRETA debe estar configurado");
	}

	console.log("Generando token de acceso para usuario:", idUsuario);
	console.log("Datos de usuario para token:", datosUsuario);

	const payload = {
		idUsuario,
		nombre: datosUsuario.nombre || "",
		email: datosUsuario.email || "",
	};

	return jwt.sign(payload, jwtSecreta, { expiresIn: "1d" });
};

const generaTokenRefresh = (idUsuario) => {
	const jwtSecretaRefresh = process.env.JWT_TOKEN_REFRESH;
	if (!jwtSecretaRefresh) {
		console.error("JWT_TOKEN_REFRESH no está definido en las variables de entorno");
		throw new Error("JWT_TOKEN_REFRESH debe estar configurado");
	}

	console.log("Generando token de actualización para usuario:", idUsuario);
	return jwt.sign({ idUsuario }, jwtSecretaRefresh, { expiresIn: "1h" });
};

module.exports = {
	generaTokenAcceso,
	generaTokenRefresh,
};
