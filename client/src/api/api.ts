import axios, { AxiosRequestConfig, AxiosError, InternalAxiosRequestConfig, AxiosInstance } from "axios";
import JSONbig from "json-bigint";

const localApi = axios.create({
	headers: {
		"Content-Type": "application/json",
	},
	validateStatus: (status) => {
		return status >= 200 && status < 300;
	},
	transformResponse: [(data) => JSONbig.parse(data)],
});

let tokenAcceso: string | null = null;

const getApiInstance = (url: string) => {
	return localApi;
};

const isAuthEndpoint = (url: string): boolean => {
	return url.includes("/api/autenticacion");
};

// Verificar si la URL es para el endpoint de actualización de token para evitar bucles infinitos
const isRefreshTokenEndpoint = (url: string): boolean => {
	return url.includes("/api/autenticacion/actualizar-token");
};

const setupInterceptors = (apiInstance: typeof axios) => {
	apiInstance.interceptors.request.use(
		(config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
			if (!tokenAcceso) {
				tokenAcceso = localStorage.getItem("tokenAcceso");
			}
			if (tokenAcceso && config.headers) {
				config.headers.Authorization = `Bearer ${tokenAcceso}`;
			}

			return config;
		},
		(error: AxiosError): Promise<AxiosError> => Promise.reject(error)
	);

	apiInstance.interceptors.response.use(
		(response) => response,
		async (error: AxiosError): Promise<any> => {
			const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

			// Solo actualizar token cuando recibimos un error 401/403 (token inválido/expirado)
			if (
				error.response?.status &&
				[401, 403].includes(error.response.status) &&
				!originalRequest._retry &&
				originalRequest.url &&
				!isRefreshTokenEndpoint(originalRequest.url)
			) {
				originalRequest._retry = true;

				try {
					const tokenRefresh = localStorage.getItem("tokenRefresh");
					if (!tokenRefresh) {
						throw new Error("No hay token de actualización disponible");
					}

					const response = await localApi.post(`/api/autenticacion/actualizar-token`, {
						tokenRefresh,
					});

					if (response.data.data) {
						const newAccessToken = response.data.data.tokenAcceso;
						const newRefreshToken = response.data.data.tokenRefresh;

						localStorage.setItem("tokenAcceso", newAccessToken);
						localStorage.setItem("tokenRefresh", newRefreshToken);
						tokenAcceso = newAccessToken;

						if (originalRequest.headers) {
							originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
						}
					} else {
						throw new Error("Respuesta inválida del endpoint de actualización de token");
					}

					if (originalRequest.headers) {
						originalRequest.headers.Authorization = `Bearer ${tokenAcceso}`;
					}
					return getApiInstance(originalRequest.url || "")(originalRequest);
				} catch (err) {
					localStorage.removeItem("tokenRefresh");
					localStorage.removeItem("tokenAcceso");
					tokenAcceso = null;
					window.location.href = "/iniciar-sesion";
					return Promise.reject(err);
				}
			}

			return Promise.reject(error);
		}
	);
};

setupInterceptors(localApi);

const api = {
	request: (config: AxiosRequestConfig) => {
		const apiInstance = getApiInstance(config.url || "");
		return apiInstance(config);
	},
	get: (url: string, config?: AxiosRequestConfig) => {
		const apiInstance = getApiInstance(url);
		return apiInstance.get(url, config);
	},
	post: (url: string, data?: any, config?: AxiosRequestConfig) => {
		const apiInstance = getApiInstance(url);
		return apiInstance.post(url, data, config);
	},
	put: (url: string, data?: any, config?: AxiosRequestConfig) => {
		const apiInstance = getApiInstance(url);
		return apiInstance.put(url, data, config);
	},
	delete: (url: string, config?: AxiosRequestConfig) => {
		const apiInstance = getApiInstance(url);
		return apiInstance.delete(url, config);
	},
};

export default api;
