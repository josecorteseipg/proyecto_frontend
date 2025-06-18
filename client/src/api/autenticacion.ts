import api from "./api";

interface LoginRespuesta {
	success: boolean;
	data: {
		usuario: {
			id: string;
			nombre: string;
			email: string;
		};
		tokenAcceso: string;
		tokenRefresh: string;
	};
}

interface RegistroRespuesta {
	success: boolean;
	data: {
		usuario: {
			id: string;
			nombre: string;
			email: string;
		};
		tokenAcceso: string;
	};
}

// Descripción: Inicio de sesión de usuario
// Endpoint: POST /api/autenticacion/iniciar-sesion
export const login = async (email: string, password: string): Promise<LoginRespuesta> => {
	try {
		const respuesta = await api.post("/api/autenticacion/iniciar-sesion", { email, password });

		if (!respuesta.data || !respuesta.data.data) {
			console.error("Estructura de respuesta inválida:", respuesta.data);
			throw new Error("Respuesta inválida del servidor");
		}

		const { usuario, tokenAcceso, tokenRefresh } = respuesta.data.data;
		console.log("API de inicio de sesión - Datos de usuario:", usuario);

		if (!usuario || !tokenAcceso) {
			throw new Error("Faltan datos de usuario o token de acceso en la respuesta");
		}

		return respuesta.data;
	} catch (error: any) {
		console.error("Error API de inicio de sesión:", error);
		console.error("Respuesta de error:", error.respuesta?.data);
		throw new Error(error?.respuesta?.data?.error || error.message);
	}
};

// Descripción: Registro de usuario
// Endpoint: POST /api/autenticacion/registrarse
export const registrousuario = async (nombre: string, email: string, password: string): Promise<RegistroRespuesta> => {
	try {
		console.log("Realizando llamada API a /api/autenticacion/registrarse");
		const respuesta = await api.post("/api/autenticacion/registrarse", { nombre, email, password });
		console.log("Respuesta de API de registro recibida:", respuesta.data);

		// Verificar la estructura de la respuesta
		if (!respuesta.data || !respuesta.data.data) {
			console.error("Estructura de respuesta inválida:", respuesta.data);
			throw new Error("Respuesta inválida del servidor");
		}

		const { usuario, tokenAcceso } = respuesta.data.data;
		console.log("API de registro - Datos de usuario:", usuario);

		if (!usuario || !tokenAcceso) {
			throw new Error("Faltan datos de usuario o token de acceso en la respuesta");
		}
		return respuesta.data;
	} catch (error: any) {
		console.error("Error API de registro:", error);
		console.error("Respuesta de error:", error.respuesta?.data);
		throw new Error(error?.respuesta?.data?.error || error.message);
	}
};

// Descripción: Cerrar sesión de usuario
// Endpoint: POST /api/autenticacion/cerrar-sesion
export const logout = async () => {
	console.log("API de cierre de sesión llamada");
	try {
		console.log("Realizando llamada API a /api/autenticacion/cerrar-sesion");
		const respuesta = await api.post("/api/autenticacion/cerrar-sesion");
		console.log("Respuesta de API de cierre de sesión recibida:", respuesta.data);
		return respuesta.data;
	} catch (error: any) {
		console.error("Error API de cierre de sesión:", error);
		console.error("Respuesta de error:", error.respuesta?.data);
		throw new Error(error?.respuesta?.data?.error || error.message);
	}
};
