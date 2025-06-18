/**
 * Funciones de utilidad para manejar URLs de imágenes en la aplicación
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

/**
 * Convierte una ruta de imagen relativa a una URL completa
 * @param imagePath - La ruta de imagen del backend (ej. "/uploads/filename.jpg")
 * @returns URL completa para la imagen
 */
export const getImageUrl = (imagePath: string): string => {
	if (!imagePath) {
		console.warn("getImageUrl: No se proporcionó ruta de imagen");
		return "";
	}

	// Si ya es una URL completa (comienza con http/https), devolverla tal como está
	if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) {
		console.log("getImageUrl: URL completa proporcionada:", imagePath);
		return imagePath;
	}

	// Si es una ruta relativa, construir la URL completa
	const fullUrl = `${API_BASE_URL}${imagePath.startsWith("/") ? "" : "/"}${imagePath}`;
	console.log("getImageUrl: Convirtiendo ruta relativa a URL completa:", { imagePath, fullUrl });

	return fullUrl;
};

/**
 * Obtiene la primera URL de imagen disponible del array de imágenes de un producto o regresa a la imagen principal
 * @param product - Objeto producto con propiedades image y/o images
 * @returns URL completa para la imagen principal
 */
export const getProductImageUrl = (product: { image?: string; images?: string[] }): string => {
	console.log("getProductImageUrl: Procesando imágenes del producto:", {
		image: product.image,
		images: product.images,
	});

	// Intentar obtener del array de imágenes primero
	if (product.images && product.images.length > 0) {
		const firstImage = product.images[0];
		if (firstImage) {
			console.log("getProductImageUrl: Usando primera imagen del array de imágenes:", firstImage);
			return getImageUrl(firstImage);
		}
	}

	// Recurrir a la propiedad de imagen principal
	if (product.image) {
		console.log("getProductImageUrl: Usando propiedad de imagen principal:", product.image);
		return getImageUrl(product.image);
	}

	console.warn("getProductImageUrl: No se encontró imagen para el producto");
	return "";
};

/**
 * Obtiene todas las URLs de imágenes para un producto
 * @param product - Objeto producto con propiedades image y/o images
 * @returns Array de URLs completas para todas las imágenes del producto
 */
export const getProductImageUrls = (product: { image?: string; images?: string[] }): string[] => {
	console.log("getProductImageUrls: Procesando todas las imágenes del producto:", {
		image: product.image,
		images: product.images,
	});

	const imageUrls: string[] = [];

	// Agregar imágenes del array de imágenes
	if (product.images && product.images.length > 0) {
		product.images.forEach((imagePath, index) => {
			if (imagePath) {
				const fullUrl = getImageUrl(imagePath);
				imageUrls.push(fullUrl);
				console.log(`getProductImageUrls: Agregada imagen ${index + 1}:`, fullUrl);
			}
		});
	}

	// Si no hay imágenes en el array, recurrir a la propiedad de imagen principal
	if (imageUrls.length === 0 && product.image) {
		const fullUrl = getImageUrl(product.image);
		imageUrls.push(fullUrl);
		console.log("getProductImageUrls: Agregada imagen principal como respaldo:", fullUrl);
	}

	console.log("getProductImageUrls: Array final de URLs de imágenes:", imageUrls);
	return imageUrls;
};

/**
 * Valida si una URL de imagen es accesible
 * @param imageUrl - La URL de imagen a validar
 * @returns Promise que se resuelve a true si la imagen es accesible, false en caso contrario
 */
export const validateImageUrl = async (imageUrl: string): Promise<boolean> => {
	if (!imageUrl) {
		console.warn("validateImageUrl: No se proporcionó URL");
		return false;
	}

	try {
		console.log("validateImageUrl: Validando URL de imagen:", imageUrl);

		const response = await fetch(imageUrl, {
			method: "HEAD",
			mode: "cors",
		});

		const isValid = response.ok && response.headers.get("content-type")?.startsWith("image/");
		console.log("validateImageUrl: Resultado de validación:", { imageUrl, isValid, status: response.status });

		return isValid;
	} catch (error) {
		console.error("validateImageUrl: Error validando URL de imagen:", { imageUrl, error });
		return false;
	}
};

/**
 * Obtiene una URL de imagen de placeholder para cuando no hay imagen disponible
 * @param width - Ancho de la imagen placeholder
 * @param height - Alto de la imagen placeholder
 * @returns URL de imagen placeholder
 */
export const getPlaceholderImageUrl = (width: number = 400, height: number = 400): string => {
	const placeholderUrl = `https://via.placeholder.com/${width}x${height}/e5e7eb/9ca3af?text=Sin+Imagen`;
	console.log("getPlaceholderImageUrl: URL de placeholder generada:", placeholderUrl);
	return placeholderUrl;
};

/**
 * Obtiene URL de imagen con respaldo a placeholder
 * @param imagePath - La ruta de imagen del backend
 * @param width - Ancho para placeholder si la imagen falla
 * @param height - Alto para placeholder si la imagen falla
 * @returns URL de imagen con respaldo
 */
export const getImageUrlWithFallback = (imagePath: string | undefined, width: number = 400, height: number = 400): string => {
	if (!imagePath) {
		console.log("getImageUrlWithFallback: No hay ruta de imagen, usando placeholder");
		return getPlaceholderImageUrl(width, height);
	}

	const imageUrl = getImageUrl(imagePath);
	console.log("getImageUrlWithFallback: Usando URL de imagen:", imageUrl);
	return imageUrl;
};
