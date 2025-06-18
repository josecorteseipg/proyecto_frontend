import api from "./api";

export interface PerfilUsuario {
	_id: string;
	nombre: string;
	email: string;
	telefono?: string;
	direcciones: Direccion[];
	fechaCreacion: string;
}

export interface Direccion {
	_id: string;
	direccion: string;
	ciudad: string;
	region: string;
	esPrincipal: boolean;
}

export interface UpdateProfileData {
	nombre: string;
	email: string;
	telefono?: string;
}

// Descripción: Obtener perfil de usuario
// Endpoint: GET /api/usuario/perfil
export const obtienePerfilUsuario = async () => {
	try {
		const respuesta = await api.get("/api/usuario/perfil");
		return respuesta.data;
	} catch (error: any) {
		console.error("Error obteniendo perfil de usuario:", error);
		throw new Error(error?.respuesta?.data?.error || error.message);
	}
};

// Descripción: Actualizar perfil de usuario
// Endpoint: PUT /api/usuario/perfil
export const actualizaPerfilUsuario = async (data: UpdateProfileData) => {
	try {
		const respuesta = await api.put("/api/usuario/perfil", data);
		return respuesta.data;
	} catch (error: any) {
		console.error("Error actualizando perfil de usuario:", error);
		throw new Error(error?.respuesta?.data?.error || error.message);
	}
};

// Descripción: Agregar nueva dirección
// Endpoint: POST /api/usuario/direcciones
export const agregarDireccion = async (DireccionData: Omit<Direccion, "_id">) => {
	try {
		const respuesta = await api.post("/api/usuario/direcciones", DireccionData);
		return respuesta.data;
	} catch (error: any) {
		console.error("Error agregando dirección:", error);
		throw new Error(error?.respuesta?.data?.error || error.message);
	}
};

// Descripción: Actualizar dirección
// Endpoint: PUT /api/usuario/direcciones/:id
export const actualizarDireccion = async (id: string, DireccionData: Omit<Direccion, "_id">) => {
	try {
		const respuesta = await api.put(`/api/usuario/direcciones/${id}`, DireccionData);
		return respuesta.data;
	} catch (error: any) {
		console.error("Error actualizando dirección:", error);
		throw new Error(error?.respuesta?.data?.error || error.message);
	}
};

// Descripción: Eliminar dirección
// Endpoint: DELETE /api/usuario/direcciones/:id
export const borrarDirecciones = async (id: string) => {
	try {
		const respuesta = await api.delete(`/api/usuario/direcciones/${id}`);
		return respuesta.data;
	} catch (error: any) {
		console.error("Error eliminando dirección:", error);
		throw new Error(error?.respuesta?.data?.error || error.message);
	}
};
