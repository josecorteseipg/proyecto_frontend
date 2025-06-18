// Configuracion de VITE
//https://vite-dev.translate.goog/config/?_x_tr_sl=en&_x_tr_tl=es&_x_tr_hl=es&_x_tr_pto=tc

import path from "path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
	plugins: [react()],
	resolve: {
		alias: {
			"@": path.resolve(__dirname, "./src"),
		},
	},
	server: {
		host: true,
		proxy: {
			"/api": {
				target: "http://localhost:3000", // URL del backend. Apuntando al puerto 3000 de localhost para separar el front del backend. El proxy queda con /api = localhost:3000
				changeOrigin: true,
			},
		},
		allowedHosts: ["localhost"],
		watch: {
			ignored: ["**/node_modules/**", "**/dist/**", "**/public/**", "**/log/**"],
		},
	},
});
