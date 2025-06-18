const Pedido = require("../models/Pedidos.js");
const Producto = require("../models/Productos.js");

class PedidosServicio {
	static async crearPedido(datosPedido, idUsuario) {
		try {
			const { items, direccionEnvio, metodoPago } = datosPedido;

			if (!items || !Array.isArray(items) || items.length === 0) {
				throw new Error("El pedido debe contener al menos un elemento");
			}

			if (!direccionEnvio || !direccionEnvio.nombreCompleto || !direccionEnvio.direccion || !direccionEnvio.ciudad || !direccionEnvio.region) {
				throw new Error("Se requiere una dirección de envío completa");
			}

			if (!metodoPago) {
				throw new Error("Se requiere un método de pago");
			}

			// Validar y obtener detalles del producto para cada elemento
			const itemsPedido = [];
			let totalPedido = 0;

			for (const item of items) {
				if (!item.IdProducto || !item.cantidad || item.cantidad <= 0) {
					throw new Error("Datos de elemento inválidos: se requieren IdProducto y cantidad");
				}

				// Obtener detalles del producto desde la base de datos
				const producto_db = await Producto.findById(item.IdProducto);
				if (!producto_db) {
					throw new Error(`Producto no encontrado: ${item.IdProducto}`);
				}

				if (!producto_db.tieneStock) {
					throw new Error(`El producto está agotado: ${producto_db.nombreProducto}`);
				}

				const a_ItemPedido = {
					IdProducto: producto_db._id.toString(),
					nombreProducto: producto_db.nombreProducto,
					name: producto_db.name,
					precio: producto_db.precio,
					cantidad: item.cantidad,
					imagen: producto_db.imagen,
				};

				itemsPedido.push(a_ItemPedido);
				totalPedido += producto_db.precio * item.cantidad;
			}

			// Crear el pedido
			const nuevoPedido = new Pedido({
				idUsuario,
				items: itemsPedido,
				totalPedido,
				direccionEnvio,
				metodoPago,
			});

			await nuevoPedido.save();

			console.log(`Pedido creado correctamente: ${nuevoPedido._id}`);
			return nuevoPedido;
		} catch (error) {
			console.error(`Error creando pedido: ${error.message}`);
			throw error;
		}
	}
	static async obtienePedidosUsuario(idUsuario) {
		try {
			const pedidos_db = await Pedido.find({ idUsuario }).sort({ fechaCreacion: -1 });
			console.log(`Se obtuvieron ${pedidos_db.length} pedidos para el usuario: ${idUsuario}`);
			return pedidos_db;
		} catch (error) {
			console.error(`Error obteniendo pedidos del usuario: ${error.message}`);
			throw error;
		}
	}
	static async obtienePedidoId(pedidoId, idUsuario) {
		try {
			const pedido_db = await Pedido.findOne({
				_id: pedidoId,
				idUsuario,
			});

			if (!pedido_db) {
				throw new Error("Pedido no encontrado");
			}
			return pedido_db;
		} catch (error) {
			console.error(`Error obteniendo pedido por ID: ${error.message}`);
			throw error;
		}
	}
}

module.exports = PedidosServicio;
