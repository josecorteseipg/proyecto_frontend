// Archivo de configuración para la aplicación cliente
export const config = {
	// Configuración de API
	api: {
		baseUrl: process.env.VITE_API_BASE_URL || "http://localhost:3000", // INPUT_REQUIRED {URL base de la API del backend}
		timeout: 10000,
	},

	// Configuración de imágenes
	images: {
		baseUrl: process.env.VITE_API_BASE_URL || "http://localhost:3000", // INPUT_REQUIRED {URL base del backend para imágenes}
		uploadsPath: "/uploads",
		defaultImage: "/placeholder-image.jpg",
	},

	// Configuración de la aplicación
	app: {
		name: "IPG: Proyecto de Interfaz de Usuario Avanzada",
		version: "1.0.0",
	},

	// Valores por defecto de paginación
	pagination: {
		defaultLimit: 12,
		maxLimit: 100,
	},

	// Configuración de toast
	toast: {
		duration: 3000,
	},
};

// Función auxiliar para obtener URL completa de imagen
export const getImageUrl = (imagePath: string): string => {
	if (!imagePath) {
		console.log("No se proporcionó ruta de imagen, usando imagen por defecto");
		return config.images.baseUrl + config.images.defaultImage;
	}

	// Si ya es una URL completa, devolverla tal como está
	if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) {
		console.log("URL completa proporcionada:", imagePath);
		return imagePath;
	}

	// Si comienza con /uploads, construir URL completa
	if (imagePath.startsWith("/uploads")) {
		const fullUrl = config.images.baseUrl + imagePath;
		console.log("URL de imagen construida:", fullUrl);
		return fullUrl;
	}

	// Si es solo un nombre de archivo, agregar ruta de uploads
	const fullUrl = config.images.baseUrl + config.images.uploadsPath + "/" + imagePath;
	console.log("URL de imagen construida desde nombre de archivo:", fullUrl);
	return fullUrl;
};

// Función auxiliar para obtener URL de API
export const getApiUrl = (endpoint: string): string => {
	if (endpoint.startsWith("/")) {
		return config.api.baseUrl + endpoint;
	}
	return config.api.baseUrl + "/" + endpoint;
};

export default config;
