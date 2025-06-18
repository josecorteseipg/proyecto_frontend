const mongoose = require("mongoose");
const conexionDB = async () => {
	try {
		// Forzar conexión IPv4 usando 127.0.0.1 en lugar de localhost
		const mongoURI = process.env.URL_BASEDATOS || "mongodb://127.0.0.1:27017/ipg-proyecto-frontend-jlc";
		console.log("Intentando conectar a MongoDB:", mongoURI);
		// Documentacion:
		//https://mongoosejs.com/docs/connections.html#serverselectiontimeoutms
		await mongoose.connect(mongoURI, {
			// Agregar opciones de conexión para ayudar con problemas de conexión
			serverSelectionTimeoutMS: 5000, // Timeout después de 5s en lugar de 30s
			socketTimeoutMS: 45000, // Cerrar sockets después de 45s de inactividad
		});
		console.log("MongoDB Conectado:", mongoose.connection.host);
		return true;
	} catch (error) {
		console.error("Error de conexión a MongoDB:", error.message);
		console.error("Error completo:", error);
		// No salir del proceso, pero retornar false para indicar fallo
		return false;
	}
};
//Mensajes de error en caso de fallas de mongoose
mongoose.connection.on("error", (error) => {
	console.error("Error de conexión a MongoDB:", error);
});

mongoose.connection.on("disconnected", () => {
	console.log("MongoDB desconectado");
});

module.exports = { conexionDB };
