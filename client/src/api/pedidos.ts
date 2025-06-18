import api from "./api";

export interface Pedido {
	_id: string;
	items: Array<{
		IdProducto: string;
		nombreProducto: string;
		precio: number;
		cantidad: number;
		imagen: string;
	}>;
	totalPedido: number;
	estado: "pendiente" | "confirmado" | "enviado" | "entregado" | "cancelado";
	direccionEnvio: {
		nombreCompleto: string;
		direccion: string;
		ciudad: string;
		region: string;
	};
	fechaCreacion: string;
}

export interface CrearDatosPedido {
	items: Array<{
		IdProducto: string;
		cantidad: number;
	}>;
	direccionEnvio: {
		nombreCompleto: string;
		direccion: string;
		ciudad: string;
		region: string;
	};
	metodoPago: string;
}

// Descripción: Crear un nuevo pedido
// Endpoint: POST /api/pedidos
export const crearPedido = async (datosPedido: CrearDatosPedido) => {
	try {
		const response = await api.post("/api/pedidos", datosPedido);
		return response.data;
	} catch (error: any) {
		throw new Error(error?.response?.data?.error || error.message);
	}
};

// Descripción: Obtener pedidos del usuario
// Endpoint: GET /api/pedidos
export const obtenerPedidos = async () => {
	try {
		const response = await api.get("/api/pedidos");
		return response.data;
	} catch (error: any) {
		throw new Error(error?.response?.data?.error || error.message);
	}
};

// Descripción: Obtener pedido por ID
// Endpoint: GET /api/pedidos/:id
export const obtienePedidoId = async (id: string) => {
	try {
		const response = await api.get(`/api/pedidos/${id}`);
		return response.data;
	} catch (error: any) {
		throw new Error(error?.response?.data?.error || error.message);
	}
};
