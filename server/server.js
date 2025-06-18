/**
 * BACKEND APP COMERCIO ELECTRONICO
 * IPG 2025
 * ASIGNATURA: FRONTEND
 * ESTUDIANTE: JOSÉ LUIS CORTESE BUSTOS
 * CARRERA: INGENIERÍA EN CIENCIAS DE DATOS
 * OBS: TRABAJO EN EL AREA DE DESARROLLO DE SOFTWARE POR MAS DE 10 AÑOS, POR LO QUE
 * EL CODIGO A CONTINUACIÓN ES PARTE DE PROYECTOS YA DESARROLLADOS DE MI AUTORÍA Y LOS
 * COMENTARIOS SON BASICAMENTE PARA EXPLICAR PORQUÉ USE CIERTAS FUNCIONES, ATRIBUTOS Y/O CONFIGURACIONES. *
 */
// Cargar variables de entorno PRIMERO
require("dotenv").config();
const express = require("express");
const path = require("path");

const rutasBasicas = require("./routes/index");
const rutasAcceso = require("./routes/rutasAcceso");
const rutasUsuario = require("./routes/rutasUsuario");
const rutasProductos = require("./routes/rutasProductos");
const rutaPedidos = require("./routes/rutaPedidos");
const { conexionDB } = require("./config/database");
const { verificarYCargarProductos } = require("./verificacionExistenciaProductos");
const cors = require("cors");

// Verificar que las variables de entorno requeridas estén presentes
if (!process.env.URL_BASEDATOS) {
	console.error("Error: La variable URL_BASEDATOS falta en el archivo .env");
	process.exit(-1);
}

if (!process.env.JWT_CLAVE_SECRETA) {
	console.error("Error: La variable JWT_CLAVE_SECRETA falta en el archivo .env");
	process.exit(-1);
}

if (!process.env.JWT_TOKEN_REFRESH) {
	console.error("Error: La variable JWT_TOKEN_REFRESH falta en el archivo .env");
	process.exit(-1);
}

const app = express();
const port = process.env.PORT || 3000;
//Funciones de express.js
//Formatear respuestas JSON de manera legible
app.enable("json spaces");
// Consistencia con las rutas URL, por lo que habilitamos el enrutamiento estricto
//quiere decir: hace que el enrutamiento sea más estricto, especialmente en lo que respecta a las barras diagonales finales en las URLs
app.enable("strict routing");

// Configuración de middlewares
// middleware: es una función que tiene acceso a los objetos de solicitud (req), respuesta (res)
app.use(cors({})); //CORS, o Intercambio de Recursos entre Orígenes
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir archivos estáticos desde el directorio uploads
app.use("/archivos", express.static(path.join(__dirname, "archivos")));

// Conexión a la base de datos
conexionDB();
//Verificar si existen productos en la base de datos para renderizarlos en el front.
//Si no existen, se crearán 10 productos de ejemplo para darle uso al front.
verificarYCargarProductos();
// Rutas Básicas
app.use(rutasBasicas);
// Rutas de Autenticación
app.use("/api/autenticacion", rutasAcceso);
// Rutas de Usuario
app.use("/api/usuario", rutasUsuario);
// Rutas de Productos
app.use("/api/productos", rutasProductos);
// Rutas de Pedidos
app.use("/api/pedidos", rutaPedidos);

// Manejo de errores del servidor
// cuando escucha (listen) el error de manera transversal de las otras funciones y despliega el mensaje en la consola
app.on("error", (error) => {
	console.error(`Error del servidor: ${error.message}`);
	console.error(error.stack);
});
// Si el endpoint (ruta) no existe en ningun enrutador, retorna al front el error 404
app.use((req, res, next) => {
	res.status(404).send("Página no encontrada.");
});

// Manejo de errores generales
app.use((err, req, res, next) => {
	console.error(`Error de aplicación no manejado: ${err.message}`);
	console.error(err.stack);
	res.status(500).send("Hubo un error al procesar su solicitud.");
});

// Iniciar el servidor
app.listen(port, () => {
	console.log(`Servidor ejecutándose en http://localhost:${port}`);
});
