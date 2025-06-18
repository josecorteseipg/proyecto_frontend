/**
 * SCRIPT DE CARGA DE PRODUCTOS DE EJEMPLO
 * IPG 2025 - Asignatura FRONTEND
 * Autor: José Cortese B.
 * Carga 10 productos de ejemplo en la base de datos
 */

require("dotenv").config();
const mongoose = require("mongoose");
const Producto = require("./models/Productos");
const Usuario = require("./models/Usuario");
const { generaPasswordHash } = require("./utilidades/password");
async function conectarDB() {
	try {
		await mongoose.connect(process.env.URL_BASEDATOS);
	} catch (error) {
		console.error("Error conectando a la base de datos:", error);
		process.exit(1);
	}
}

// Valida si existe o crear un usuario administrador para usarlo en el front
async function obtenerUsuarioAdmin() {
	try {
		let usuarioAdmin = await Usuario.findOne({ email: "admin@tiendaipg.cl" });
		let passwordInicial = "admin123";
		// Encriptar la contraseña
		const PasswordHasheada = await generaPasswordHash(passwordInicial);
		if (!usuarioAdmin) {
			usuarioAdmin = new Usuario({
				nombre: "Administrador",
				email: "admin@tiendaipg.cl",
				password: PasswordHasheada,
				rol: "admin",
			});
			await usuarioAdmin.save();
		}

		return usuarioAdmin._id;
	} catch (error) {
		console.error("Error obteniendo/creando usuario administrador:", error);
		throw error;
	}
}

// Productos de ejemplo
const productosEjemplo = [
	// ELECTRÓNICOS
	{
		nombreProducto: "Smartphone Samsung Galaxy A54",
		descripcionProducto:
			"Smartphone con pantalla Super AMOLED, cámara triple de 50MP y batería de larga duración. Perfecto para el uso diario con rendimiento confiable.",
		precio: 349000,
		imagen: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQKsm462lXSBngaQK-ndCLNCGeqz5xz-bjmNQ&s",
		imagenes: ["https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQKsm462lXSBngaQK-ndCLNCGeqz5xz-bjmNQ&s"],
		categoria: "electronicos",
		calificacion: 4.3,
		tieneStock: true,
		especificaciones: new Map([
			["Pantalla", "6.4 pulgadas Super AMOLED"],
			["Cámara", "50MP + 12MP + 5MP"],
			["Batería", "5000 mAh"],
		]),
	},
	{
		nombreProducto: "Televisor LG 55 4K Smart TV",
		descripcionProducto: "Smart TV 4K UHD con tecnología webOS, HDR10 y control por voz. Entretenimiento inteligente con calidad de imagen excepcional.",
		precio: 599000,
		imagen: "https://www.lg.com/content/dam/channel/wcms/cl/images/televisores/55ur7300psa_awhq_escl_cl_c/gallery/DZ-1.jpg",
		imagenes: ["https://www.lg.com/content/dam/channel/wcms/cl/images/televisores/55ur7300psa_awhq_escl_cl_c/gallery/DZ-1.jpg"],
		categoria: "electronicos",
		calificacion: 4.5,
		tieneStock: true,
		especificaciones: new Map([
			["Tamaño", "55 pulgadas 4K UHD"],
			["Sistema", "webOS Smart TV"],
			["HDR", "HDR10, HLG"],
		]),
	},

	// ROPA
	{
		nombreProducto: "Polera Nike Dri-FIT",
		descripcionProducto: "Polera deportiva con tecnología Dri-FIT que mantiene la piel seca y cómoda. Ideal para entrenamientos y uso casual.",
		precio: 29000,
		imagen: "https://nikeclprod.vtexassets.com/arquivos/ids/612482/DX0687_100_A_PREM.jpg?v=638022213838070000",
		imagenes: ["https://nikeclprod.vtexassets.com/arquivos/ids/612482/DX0687_100_A_PREM.jpg?v=638022213838070000"],
		categoria: "ropa",
		calificacion: 4.4,
		tieneStock: true,
		especificaciones: new Map([
			["Material", "100% Poliéster Dri-FIT"],
			["Tallas", "S, M, L, XL"],
			["Cuidado", "Lavado en máquina"],
		]),
	},
	{
		nombreProducto: "Jeans Levi's 501 Original",
		descripcionProducto:
			"Los jeans clásicos de corte recto con el ajuste original que ha definido el denim por generaciones. Estilo atemporal y durabilidad garantizada.",
		precio: 79000,
		imagen: "https://lsco.scene7.com/is/image/lsco/005010000-front-pdp?fmt=jpeg&qlt=70&resMode=bisharp&fit=crop,0&op_usm=1.25,0.6,8&wid=1240&hei=1550",
		imagenes: ["https://lsco.scene7.com/is/image/lsco/005010000-front-pdp?fmt=jpeg&qlt=70&resMode=bisharp&fit=crop,0&op_usm=1.25,0.6,8&wid=1240&hei=1550"],
		categoria: "ropa",
		calificacion: 4.7,
		tieneStock: true,
		especificaciones: new Map([
			["Corte", "Recto clásico"],
			["Material", "100% Algodón"],
			["Tallas", "28-38 cintura"],
		]),
	},

	// HOGAR
	{
		nombreProducto: "Cafetera Oster de Expresso",
		descripcionProducto: "Cafetera espresso automática con sistema de espuma de leche. Prepara café de calidad barista en casa.",
		precio: 189000,
		imagen: "https://ostercl.vtexassets.com/arquivos/ids/158646/BVSTEM6603R-1.jpg?v=637370823276300000",
		imagenes: ["https://ostercl.vtexassets.com/arquivos/ids/158646/BVSTEM6603R-1.jpg?v=637370823276300000"],
		categoria: "hogar",
		calificacion: 4.2,
		tieneStock: true,
		especificaciones: new Map([
			["Presión", "15 bares"],
			["Capacidad", "1.25 litros"],
			["Espumador", "Vapor automático"],
		]),
	},
	{
		nombreProducto: "Juego de Sábanas King",
		descripcionProducto: "Juego de sábanas 100% algodón con tratamiento antibacterial. Incluye sábana ajustable, plana y dos fundas de almohada.",
		precio: 45000,
		imagen:
			"https://cannonhome.cl/media/catalog/product/s/a/sabanasking200hiloschaik_1_14.jpg?optimize=medium&bg-color=255,255,255&fit=bounds&height=815&width=900&canvas=900:815",
		imagenes: [
			"https://cannonhome.cl/media/catalog/product/s/a/sabanasking200hiloschaik_1_14.jpg?optimize=medium&bg-color=255,255,255&fit=bounds&height=815&width=900&canvas=900:815",
		],
		categoria: "hogar",
		calificacion: 4.6,
		tieneStock: true,
		especificaciones: new Map([
			["Tamaño", "King 200x200cm"],
			["Material", "100% Algodón"],
			["Incluye", "3 piezas + fundas"],
		]),
	},

	// DEPORTES
	{
		nombreProducto: "Zapatillas Adidas Ultraboost 22",
		descripcionProducto:
			"Zapatillas de running con tecnología Boost para máximo retorno de energía. Diseñadas para corredores que buscan rendimiento y comodidad.",
		precio: 159000,
		imagen: "https://assets.adidas.com/images/w_600,f_auto,q_auto/9a3ad0beda9a42a6921dae6f013f9f6b_9366/Zapatillas_Ultraboost_22_Negro_GX5928_01_standard.jpg",
		imagenes: [
			"https://assets.adidas.com/images/w_600,f_auto,q_auto/9a3ad0beda9a42a6921dae6f013f9f6b_9366/Zapatillas_Ultraboost_22_Negro_GX5928_01_standard.jpg",
		],
		categoria: "deportes",
		calificacion: 4.8,
		tieneStock: true,
		especificaciones: new Map([
			["Tecnología", "Boost Energy Return"],
			["Uso", "Running y entrenamiento"],
			["Tallas", "36-45 disponibles"],
		]),
	},
	{
		nombreProducto: "Pelota de Fútbol Nike Pitch 24",
		descripcionProducto: "Balón oficial de fútbol con tecnología AeroPulse para vuelo estable y control preciso. Certificada por FIFA para uso profesional.",
		precio: 35000,
		imagen: "https://nikeclprod.vtexassets.com/arquivos/ids/1069230/FZ3048_101_A_PREM.jpg?v=638570099316770000",
		imagenes: ["https://nikeclprod.vtexassets.com/arquivos/ids/1069230/FZ3048_101_A_PREM.jpg?v=638570099316770000"],
		categoria: "deportes",
		calificacion: 4.5,
		tieneStock: true,
		especificaciones: new Map([
			["Color", "Blanco"],
			["Certificación", "FIFA Quality Pro"],
			["Material", "Cuero sintético premium"],
		]),
	},

	// LIBROS
	{
		nombreProducto: "Cien Años de Soledad - Gabriel García Márquez",
		descripcionProducto:
			"La obra maestra del realismo mágico que narra la historia de la familia Buendía. Una novela fundamental de la literatura latinoamericana.",
		precio: 18000,
		imagen: "https://libry.cl/cdn/shop/files/X_cien-anos-de-soledad-gabriel-g.png?v=1714754386",
		imagenes: ["https://libry.cl/cdn/shop/files/X_cien-anos-de-soledad-gabriel-g.png?v=1714754386"],
		categoria: "libros",
		calificacion: 4.9,
		tieneStock: true,
		especificaciones: new Map([
			["Páginas", "471 páginas"],
			["Editorial", "Sudamericana"],
			["Idioma", "Español"],
		]),
	},
	{
		nombreProducto: "Código Limpio - Robert C. Martin",
		descripcionProducto: "Manual de estilo para el desarrollo ágil de software",
		precio: 22000,
		imagen: "https://images.cdn1.buscalibre.com/fit-in/360x360/87/da/87da3d378f0336fd04014c4ea153d064.jpg",
		imagenes: ["https://images.cdn1.buscalibre.com/fit-in/360x360/87/da/87da3d378f0336fd04014c4ea153d064.jpg"],
		categoria: "libros",
		calificacion: 4.7,
		tieneStock: true,
		especificaciones: new Map([
			["Páginas", "464 páginas"],
			["Género", "Programacion"],
			["Año", "2012"],
		]),
	},

	// BELLEZA
	{
		nombreProducto: "Crema Facial Neutrogena Hydra Boost",
		descripcionProducto: "Crema hidratante facial con ácido hialurónico que proporciona hidratación intensa por 48 horas. Para todo tipo de piel.",
		precio: 15000,
		imagen: "https://images.ctfassets.net/opz40nfr11p8/4JQ1YmtkFYZWvkAecFjZB3/2e29f6f98f5fd30dc760db13e7597826/cena-pote-e-cartucho-vista-2_1-es-ar.jpeg",
		imagenes: ["https://images.ctfassets.net/opz40nfr11p8/4JQ1YmtkFYZWvkAecFjZB3/2e29f6f98f5fd30dc760db13e7597826/cena-pote-e-cartucho-vista-2_1-es-ar.jpeg"],
		categoria: "belleza",
		calificacion: 4.4,
		tieneStock: true,
		especificaciones: new Map([
			["Contenido", "50ml"],
			["Ingrediente activo", "Ácido hialurónico"],
			["Tipo de piel", "Todo tipo"],
		]),
	},
	{
		nombreProducto: "Perfume Hugo Boss Bottled",
		descripcionProducto: "Fragancia masculina elegante y sofisticada con notas de manzana, canela y sándalo. Un clásico atemporal para el hombre moderno.",
		precio: 65000,
		imagen: "https://www.eliteperfumes.cl/cdn/shop/products/hugo-boss-hugo-boss-boss-bottled-edt-100-ml-h-28329534390308.jpg?v=1627820682&width=1214",
		imagenes: ["https://www.eliteperfumes.cl/cdn/shop/products/hugo-boss-hugo-boss-boss-bottled-edt-100-ml-h-28329534390308.jpg?v=1627820682&width=1214"],
		categoria: "belleza",
		calificacion: 4.6,
		tieneStock: false,
		especificaciones: new Map([
			["Contenido", "100ml EDT"],
			["Familia olfativa", "Amaderada especiada"],
			["Duración", "6-8 horas"],
		]),
	},
];

async function cargarProductosEjemplo() {
	try {
		// verifican si ya existen productos en la base de datos
		const conteoProductos = await Producto.countDocuments();

		if (conteoProductos > 0) {
			console.log(`existen ${conteoProductos} productos en la base de datos.`);
		}
		const idUsuarioAdmin = await obtenerUsuarioAdmin();
		let productosCreados = 0;
		let productosOmitidos = 0;

		for (const productoDatos of productosEjemplo) {
			try {
				const productoExistente = await Producto.findOne({
					nombreProducto: productoDatos.nombreProducto,
				});
				if (productoExistente) {
					console.log(`Producto "${productoDatos.nombreProducto}" ya existe, se omite...`);
					productosOmitidos++;
					continue;
				}
				const nuevoProducto = new Producto({
					...productoDatos,
					creadoPor: idUsuarioAdmin,
				});
				await nuevoProducto.save();
				console.log(`Producto creado: ${productoDatos.nombreProducto}`);
				productosCreados++;
			} catch (error) {
				console.error(`Error al crear producto "${productoDatos.nombreProducto}":`, error.message);
			}
		}
		console.log(`Productos creados: ${productosCreados}`);
		console.log(`Productos omitidos (ya existían): ${productosOmitidos}`);
		console.log(`Total de productos en la base de datos: ${await Producto.countDocuments()}`);
	} catch (error) {
		console.error("Error en la carga de productos:", error);
	}
}

async function main() {
	try {
		await conectarDB();
		await cargarProductosEjemplo();
		process.exit(0);
	} catch (error) {
		console.error("Error:", error);
		process.exit(1);
	}
}

// Ejecutar solo si el archivo se ejecuta directamente
if (require.main === module) {
	main();
}

module.exports = { cargarProductosEjemplo };
