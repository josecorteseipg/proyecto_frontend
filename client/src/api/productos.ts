import api from "./api";

export interface Producto {
	_id: string;
	nombreProducto: string;
	descripcionProducto: string;
	precio: number;
	imagen: string;
	imagenes: string[];
	categoria: string;
	calificacion: number;
	tieneStock: boolean;
	especificaciones: Record<string, string>;
	creadoPor: string;
}

export interface ProductsResponse {
	productos: Producto[];
	total: number;
	pagina: number;
	totalPaginas: number;
}

// Descripción: Obtener todos los productos con filtros opcionales
// Endpoint: GET /api/productos
export const obtenerProductos = async (params?: {
	pagina?: number;
	limite?: number;
	categoria?: string;
	busqueda?: string;
	minprecio?: number;
	maxprecio?: number;
	ordernarPor?: string;
}) => {
	try {
		const respuesta = await api.get("/api/productos", { params });
		return respuesta.data.data;
	} catch (error: any) {
		console.error("Error obteniendo productos:", error);
		throw new Error(error?.respuesta?.data?.error || error.message);
	}
};

// Descripción: Obtener producto por ID
// Endpoint: GET /api/productos/:id
export const obtenerProductosId = async (id: string) => {
	try {
		console.log("Obteniendo producto por ID:", id);
		const respuesta = await api.get(`/api/productos/${id}`);
		console.log(respuesta.data.data);
		return respuesta.data.data;
	} catch (error: any) {
		console.error("Error obteniendo producto por ID:", error);
		throw new Error(error?.respuesta?.data?.error || error.message);
	}
};

// Descripción: Obtener categorías de productos
// Endpoint: GET /api/productos/categorias/lista
export const obtenerCategorias = async () => {
	try {
		const respuesta = await api.get("/api/productos/categorias/lista");
		return respuesta.data.data;
	} catch (error: any) {
		throw new Error(error?.respuesta?.data?.error || error.message);
	}
};
