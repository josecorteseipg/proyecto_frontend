import { Link } from 'react-router-dom';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart, Star } from 'lucide-react';
import { almacenCarro } from '@/store/almacenCarroCompras';
import { useToast } from '@/hooks/useToast';
import type { Producto } from '@/api/productos';

interface PropiedadesProducto {
  producto: Producto;
}

export function ProductoItemTarjeta({ producto }: PropiedadesProducto) {
  const { agregarItem } = almacenCarro();
  const { toast } = useToast();

  const manejarAgregarCarro = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!producto.tieneStock) {
      toast({
        variant: "destructive",
        title: "Agotado",
        description: "Este producto está actualmente agotado"
      });
      return;
    }

    agregarItem({
      _id: producto._id,
      nombre: producto.nombreProducto,
      precio: producto.precio,
      imagen: producto.imagen,
      cantidad: 1
    });

    toast({
      title: "Agregado al Carrito",
      description: `${producto.nombreProducto} ha sido agregado a tu carrito`
    });
  };



  return (
    <Card className="group overflow-hidden hover:shadow-lg transition-shadow">
      <Link to={`/productos/${producto._id}`}>
        <div className="aspect-square overflow-hidden">
          <img
            src={producto.imagen}
            alt={producto.nombreProducto}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
          />
        </div>
        <CardContent className="p-4">
          <div className="flex items-start justify-between mb-2">
            <h3 className="font-semibold text-lg line-clamp-2">{producto.nombreProducto}</h3>
          </div>

          <p className="text-sm text-gray-600 line-clamp-2 mb-2">{producto.descripcionProducto}</p>

          <div className="flex items-center gap-2 mb-2">
            <div className="flex items-center">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span className="text-sm ml-1">{producto.calificacion}</span>
            </div>
            <Badge variant="secondary" className="text-xs">
              {producto.categoria}
            </Badge>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-2xl font-bold">${producto.precio}</span>
            {!producto.tieneStock && (
              <Badge variant="destructive">Agotado</Badge>
            )}
          </div>
        </CardContent>
      </Link>

      <CardFooter className="p-4 pt-0 flex gap-2">
        <Button
          className="flex-1"
          onClick={manejarAgregarCarro}
          disabled={!producto.tieneStock}
        >
          <ShoppingCart className="h-4 w-4 mr-2" />
          Agregar al Carrito
        </Button>
      </CardFooter>
    </Card>
  );
}