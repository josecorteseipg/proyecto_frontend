/**
 * USO DE ZUSTAND.
 * Documentacion: https://medium.com/@arsathcomeng/zustand-in-react-native-c53381796bf7
 * Link: https://zustand.docs.pmnd.rs/getting-started/introduction
 * Es un "store" o almacenamiento local (localstorage) simple de usar..
 */
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface ItemCarro {
	_id: string;
	nombre: string;
	precio: number;
	imagen: string;
	cantidad: number;
}

interface AlmacenCarro {
	items: ItemCarro[];
	totalItems: number;
	totalPrecio: number;
	agregarItem: (item: Omit<ItemCarro, "cantidad"> & { cantidad?: number }) => void;
	eliminarItem: (id: string) => void;
	actualizarCantidad: (id: string, cantidad: number) => void;
	limpiarCarro: () => void;
	contadorItems: () => number;
	obtenerTotalPrecio: () => number;
}
const calcularTotales = (items: ItemCarro[]) => {
	const totalItems = items.reduce((sum, item) => sum + item.cantidad, 0);
	const totalPrecio = items.reduce((sum, item) => sum + item.precio * item.cantidad, 0);
	return { totalItems, totalPrecio };
};

export const almacenCarro = create<AlmacenCarro>()(
	persist(
		(set, get) => ({
			items: [],
			totalItems: 0,
			totalPrecio: 0,
			agregarItem: (item) => {
				const items = get().items;
				const itemExistente = items.find((ItemCarro) => ItemCarro._id === item._id);
				let itemsActualizados: ItemCarro[];
				if (itemExistente) {
					// Si el item existe aumenta la cantidad
					itemsActualizados = items.map((ItemCarro) =>
						ItemCarro._id === item._id ? { ...ItemCarro, cantidad: ItemCarro.cantidad + (item.cantidad || 1) } : ItemCarro
					);
				} else {
					//es nuevo y se agrega al carro
					const nuevoItem = { ...item, cantidad: item.cantidad || 1 };
					itemsActualizados = [...items, nuevoItem];
				}
				const { totalItems, totalPrecio } = calcularTotales(itemsActualizados);
				set({ items: itemsActualizados, totalItems, totalPrecio });
			},
			eliminarItem: (id) => {
				const items = get().items;
				const itemsActualizados = items.filter((item) => item._id !== id);
				const { totalItems, totalPrecio } = calcularTotales(itemsActualizados);
				set({ items: itemsActualizados, totalItems, totalPrecio });
			},
			actualizarCantidad: (id, cantidad) => {
				const items = get().items;
				let itemsActualizados: ItemCarro[];
				if (cantidad <= 0) {
					//si es 0 o menor..por si acaso, lo elimna del carro
					itemsActualizados = items.filter((item) => item._id !== id);
				} else {
					itemsActualizados = items.map((item) => (item._id === id ? { ...item, cantidad } : item));
				}
				const { totalItems, totalPrecio } = calcularTotales(itemsActualizados);
				set({ items: itemsActualizados, totalItems, totalPrecio });
			},
			limpiarCarro: () => set({ items: [], totalItems: 0, totalPrecio: 0 }),
			contadorItems: () => {
				const items = get().items;
				return items.reduce((sum, item) => sum + item.cantidad, 0);
			},
			obtenerTotalPrecio: () => {
				const items = get().items;
				return items.reduce((sum, item) => sum + item.precio * item.cantidad, 0);
			},
		}),
		{
			name: "almacen-carro-compras",
		}
	)
);
