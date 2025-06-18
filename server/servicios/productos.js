const Producto = require("../models/Productos");

class ServicioProducto {
	async crearProducto(datosProducto, idUsuario) {
		try {
			console.log("Creando producto con datos:", datosProducto);
			console.log("URL de imagen del producto:", datosProducto.imagen);
			console.log("Array de imágenes del producto:", datosProducto.imagenes);

			const nuevoProducto = new Producto({
				...datosProducto,
				creadoPor: idUsuario,
			});

			await nuevoProducto.save();

			return nuevoProducto;
		} catch (error) {
			console.error("Error creando producto:", error.message, error.stack);
			throw new Error(`Error creando producto: ${error.message}`);
		}
	}

	async obtenerProductos(entradaFiltros = {}) {
		try {
			const { pagina = 1, limite = 15, categoria, busqueda, minprecio, maxprecio, ordernarPor = "precio_asc" } = entradaFiltros;

			const query = {};

			// Filtro de búsqueda
			if (busqueda && busqueda.trim()) {
				// Búsqueda flexible con regex
				// Documentacion sacada desde: https://article.arunangshudas.com/advanced-techniques-for-filtering-data-with-mongoose-ae6d8eeabab8
				const busquedaRegex = new RegExp(busqueda.trim(), "i"); // 'i' = case insensitive
				query.$or = [{ nombreProducto: busquedaRegex }, { descripcionProducto: busquedaRegex }, { categoria: busquedaRegex }];
			}

			// Filtro de categoría
			if (categoria) {
				query.categoria = categoria;
			}

			// Filtro de rango de precios
			if (minprecio || maxprecio) {
				query.precio = {};
				if (minprecio) query.precio.$gte = Number(minprecio);
				if (maxprecio) query.precio.$lte = Number(maxprecio);
			}

			// Ordenamiento
			let orden = {};
			switch (ordernarPor) {
				case "precio_asc":
					orden = { precio: 1 };
					break;
				case "precio_desc":
					orden = { precio: -1 };
					break;
				case "nombre":
					orden = { nombreProducto: 1 };
					break;
				case "calificacion":
					orden = { calificacion: -1 };
					break;
				default:
					orden = { precio: 1 };
			}

			const skip = (pagina - 1) * limite;

			console.log("ServicioProducto - consulta:", query);
			console.log("ServicioProducto - Orden:", orden);
			//Uso de Lean, para consultas mas rapidas al usar objetos js en vez de mongoose
			//Documentacion: https://mongoosejs.com/docs/tutorials/lean.html
			const productosEncontrados = await Producto.find(query).sort(orden).skip(skip).limit(Number(limite)).populate("creadoPor", "nombre email").lean();

			const total = await Producto.countDocuments(query);
			const totalPaginas = Math.ceil(total / limite); //pretendia usar paginador..pero no alcancé

			console.log("ServicioProducto - Productos encontrados:", productosEncontrados.length);

			return {
				productosEncontrados,
				total,
				pagina: Number(pagina),
				totalPaginas,
			};
		} catch (error) {
			console.error("Error obteniendo productos:", error.message, error.stack);
			throw new Error(`Error obteniendo productos: ${error.message}`);
		}
	}

	async obtenerProductosId(IdProducto) {
		try {
			console.log("ServicioProducto - Obteniendo producto por ID:", IdProducto);

			const producto_db = await Producto.findById(IdProducto).populate("creadoPor", "nombre email");

			if (!producto_db) {
				console.log("ServicioProducto - Producto no encontrado:", IdProducto);
				throw new Error("Producto no encontrado");
			}

			return producto_db;
		} catch (error) {
			console.error("Error obteniendo producto:", error.message, error.stack);
			throw new Error(`Error obteniendo producto: ${error.message}`);
		}
	}
	async obtenerCategorias() {
		try {
			const categorias_db = await Producto.distinct("categoria");
			return categorias_db.sort();
		} catch (error) {
			console.error("Error obteniendo categorías:", error.message, error.stack);
			throw new Error(`Error obteniendo categorías: ${error.message}`);
		}
	}
	async actualizarProducto(IdProducto, datosProducto, idUsuario) {
		try {
			console.log("ServicioProducto - Actualizando producto:", IdProducto);
			console.log("ServicioProducto - Datos de actualización:", datosProducto);
			console.log("ServicioProducto - ID del usuario:", idUsuario);

			const producto_db = await Producto.findById(IdProducto);

			if (!producto_db) {
				console.log("ServicioProducto - Producto no encontrado para actualizar:", IdProducto);
				throw new Error("Producto no encontrado");
			}

			// Verificar si el usuario es el creador del producto
			if (producto_db.creadoPor.toString() !== idUsuario) {
				console.log("ServicioProducto - Usuario no autorizado para actualizar producto:", idUsuario);
				throw new Error("No tienes autorización para actualizar este producto");
			}

			const productoActualizado = await Producto.findByIdAndUpdate(IdProducto, datosProducto, { new: true, runValidators: true }).populate(
				"creadoPor",
				"nombre email"
			);

			console.log("ServicioProducto - Producto actualizado correctamente:", productoActualizado.name);
			console.log("ServicioProducto - URL de imagen del producto actualizado:", productoActualizado.image);
			console.log("ServicioProducto - Array de imágenes del producto actualizado:", productoActualizado.images);

			return productoActualizado;
		} catch (error) {
			console.error("Error actualizando producto:", error.message, error.stack);
			throw new Error(`Error actualizando producto: ${error.message}`);
		}
	}
	async borrarProducto(IdProducto, idUsuario) {
		try {
			console.log("ServicioProducto - Eliminando producto:", IdProducto);
			console.log("ServicioProducto - ID del usuario:", idUsuario);

			const producto_db = await Producto.findById(IdProducto);

			if (!producto_db) {
				console.log("ServicioProducto - Producto no encontrado para eliminar:", IdProducto);
				throw new Error("Producto no encontrado");
			}

			// Verificar si el usuario es el creador del producto
			if (producto_db.creadoPor.toString() !== idUsuario) {
				console.log("ServicioProducto - Usuario no autorizado para eliminar producto:", idUsuario);
				throw new Error("No tienes autorización para eliminar este producto");
			}

			await Producto.findByIdAndDelete(IdProducto);

			return { message: "Producto eliminado correctamente" };
		} catch (error) {
			console.error("Error eliminando producto:", error.message, error.stack);
			throw new Error(`Error eliminando producto: ${error.message}`);
		}
	}
}

module.exports = new ServicioProducto();
