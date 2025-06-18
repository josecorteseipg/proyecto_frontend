import { almacenCarro } from '@/store/almacenCarroCompras';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetTrigger } from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart, Plus, Minus, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

interface MenuLateralCarroComprasPropiedades {
  estaAbierto: boolean;
  onClose: () => void;
}

export default function MenuLateralCarroCompras({estaAbierto, onClose}:MenuLateralCarroComprasPropiedades) {
  const { items, eliminarItem, actualizarCantidad,totalPrecio, limpiarCarro } = almacenCarro();
  const [abierto, setAbierto] = useState(false);
  const navigate = useNavigate();

  const handlePagar = () => {
    setAbierto(false);
    navigate('/pagar');
  };

  return (
    <Sheet open={abierto} onOpenChange={setAbierto}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="sm" className="relative">
          <ShoppingCart className="h-5 w-5" />
          {items.length > 0 && (
            <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
              {items.reduce((sum, item) => sum + item.cantidad, 0)}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Carrito de Compras</SheetTitle>
          <SheetDescription>
            {items.length === 0 ? 'Tu carrito está vacío' : `${items.length} artículo(s) en tu carrito`}
          </SheetDescription>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8">
            <ShoppingCart className="h-16 w-16 text-gray-400 mb-4" />
            <p className="text-gray-500 text-center">Tu carrito está vacío</p>
            <Button
              onClick={() => setAbierto(false)}
              className="mt-4"
            >
              Continuar Comprando
            </Button>
          </div>
        ) : (
          <div className="flex flex-col h-full">
            <div className="flex-1 overflow-y-auto py-4">
              {items.map((item, index) => (
                <div key={`${item._id}-${index}`} className="flex items-center space-x-4 py-2 border-b">
                  <img
                    src={item.imagen}
                    alt={item.nombre}
                    className="w-16 h-16 object-cover rounded"
                  />
                  <div className="flex-1">
                    <h4 className="font-medium text-sm">{item.nombre}</h4>
                    <p className="text-sm text-gray-600">${item.precio}</p>
                    <div className="flex items-center space-x-2 mt-1">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => actualizarCantidad(item._id, Math.max(0, item.cantidad - 1))}
                        className="h-6 w-6 p-0"
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span className="text-sm">{item.cantidad}</span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => actualizarCantidad(item._id, item.cantidad + 1)}
                        className="h-6 w-6 p-0"
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => eliminarItem(item._id)}
                        className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t pt-4">
              <div className="flex justify-between items-center mb-4">
                <span className="font-semibold">Total: ${totalPrecio}</span>
              </div>
              <div className="space-y-2">
                <Button
                  onClick={handlePagar}
                  className="w-full"
                >
                  Pagar
                </Button>
                <Button
                  variant="outline"
                  onClick={limpiarCarro}
                  className="w-full"
                >
                  Vaciar Carrito
                </Button>
              </div>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}