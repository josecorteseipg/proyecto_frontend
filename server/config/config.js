const path = require("path");

// Objeto de configuración para la aplicación
const config = {
	// Configuración del servidor
	server: {
		port: process.env.PORT || 3000,
		host: process.env.HOST || "localhost",
		protocol: process.env.PROTOCOL || "http",
	},

	// Configuración de base de datos
	database: {
		url: process.env.MONGODB_URI || "mongodb://localhost/ipg-proyecto", // INPUT_REQUIRED {Cadena de conexión MongoDB}
		options: {
			// Remover opciones obsoletas que están causando advertencias
		},
	},

	// Configuración de carga de archivos
	upload: {
		// Directorio para archivos subidos
		directory: path.join(__dirname, "..", "uploads"),
		// Tamaño máximo de archivo (5MB)
		maxFileSize: 5 * 1024 * 1024,
		// Tipos de archivo permitidos
		allowedTypes: ["image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp"],
		// URL base para servir archivos subidos
		baseUrl: process.env.UPLOAD_BASE_URL || `${process.env.PROTOCOL || "http"}://${process.env.HOST || "localhost"}:${process.env.PORT || 3000}`,
	},

	// Configuración JWT
	jwt: {
		secret: process.env.JWT_CLAVE_SECRETA || "tu-clave-secreta-jwt", // INPUT_REQUIRED {Clave secreta JWT para firma de tokens}
		expiresIn: process.env.JWT_EXPIRES_IN || "7d",
	},

	// Configuración CORS
	cors: {
		origin: process.env.CLIENT_URL || "http://localhost:5173",
		credentials: true,
	},

	// Entorno
	env: process.env.NODE_ENV || "development",

	// Configuración de registro de logs
	logging: {
		level: process.env.LOG_LEVEL || "info",
	},
};

// Función auxiliar para obtener URL completa de archivos subidos
config.getFileUrl = (filename) => {
	if (!filename) return null;

	// Si filename ya es una URL completa, retornar como está
	if (filename.startsWith("http://") || filename.startsWith("https://")) {
		return filename;
	}

	// Si filename comienza con /uploads/, removerlo para evitar duplicación
	const cleanFilename = filename.startsWith("/uploads/") ? filename.substring(9) : filename;

	// Retornar URL completa
	return `${config.upload.baseUrl}/uploads/${cleanFilename}`;
};

// Función auxiliar para obtener opciones de conexión a base de datos sin advertencias obsoletas
config.getDatabaseOptions = () => {
	return {
		// Solo incluir opciones que no estén obsoletas
	};
};

// Validar configuración requerida
config.validate = () => {
	const errors = [];

	if (!config.jwt.secret || config.jwt.secret === "tu-clave-secreta-jwt") {
		errors.push("JWT_CLAVE_SECRETA debe estar configurado en las variables de entorno");
	}

	if (!config.database.url) {
		errors.push("MONGODB_URI debe estar configurado en las variables de entorno");
	}

	if (errors.length > 0) {
		console.error("Errores de validación de configuración:");
		errors.forEach((error) => console.error(`- ${error}`));
		if (config.env === "production") {
			throw new Error("Configuración inválida para entorno de producción");
		}
	}

	console.log("Configuración validada correctamente");
	return true;
};

// Registrar configuración al cargar (excluyendo datos sensibles)
console.log("Cargando configuración de la aplicación...");
console.log(`Entorno: ${config.env}`);
console.log(`Servidor: ${config.server.protocol}://${config.server.host}:${config.server.port}`);
console.log(`Directorio de uploads: ${config.upload.directory}`);
console.log(`URL base de uploads: ${config.upload.baseUrl}`);
console.log(`Origen CORS: ${config.cors.origin}`);

module.exports = config;
