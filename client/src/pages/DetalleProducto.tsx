import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { ShoppingCart, Star, Minus, Plus } from 'lucide-react';
import { almacenCarro } from '@/store/almacenCarroCompras';
import { useToast } from '@/hooks/useToast';
import { obtenerProductosId, type Producto } from '@/api/productos';

export function DetalleProducto() {
  const { id } = useParams<{ id: string }>();
  const [producto, setProducto] = useState<Producto | null>(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [imagenSeleccionada, setImagenSeleccionada] = useState(0);
  const [cantidad, setCantidad] = useState(1);

  const { agregarItem } = almacenCarro();
  const { toast } = useToast();


  useEffect(() => {
    if (id) {
      cargarProducto();
    }
  }, [id]);

  const cargarProducto = async () => {
    if (!id) return;

    try {
      setCargando(true);
      setError(null);
      const { productoEncontrado } = await obtenerProductosId(id);
      setProducto(productoEncontrado);
      
    } catch (err: any) {
      setError(err.message);
    } finally {
      setCargando(false);
    }
  };

  const handleAgregarCarro = () => {
    if (!producto) return;

    if (!producto.tieneStock) {
      toast({
        variant: "destructive",
        title: "Sin Stock",
        description: "Este producto está actualmente agotado"
      });
      return;
    }

    agregarItem({
      _id: producto._id,
      nombre: producto.nombreProducto,
      precio: producto.precio,
      imagen: producto.imagen,
      cantidad
    });

    toast({
      title: "Agregado al Carrito",
      description: `${cantidad} x ${producto.nombreProducto} agregado a tu carrito`
    });
  };


  if (cargando) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div className="aspect-square bg-gray-200 rounded-lg"></div>
              <div className="flex gap-2">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="w-20 h-20 bg-gray-200 rounded-lg"></div>
                ))}
              </div>
            </div>
            <div className="space-y-4">
              <div className="h-8 bg-gray-200 rounded w-3/4"></div>
              <div className="h-6 bg-gray-200 rounded w-1/2"></div>
              <div className="h-20 bg-gray-200 rounded"></div>
              <div className="h-10 bg-gray-200 rounded w-32"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !producto) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold mb-4">Producto no encontrado</h1>
        <p className="text-gray-600 mb-4">{error || "El producto que buscas no existe."}</p>
        <Button asChild>
          <Link to="/productos">Volver a Productos</Link>
        </Button>
      </div>
    );
  }



  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <Breadcrumb className="mb-6">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link to="/">Inicio</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link to="/productos">Productos</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{producto.nombreProducto}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Imágenes del Producto */}
        <div className="space-y-4">
          <Card className="overflow-hidden">
            <CardContent className="p-0">
              <div className="aspect-square">
                <img
                  src={producto.imagenes && producto.imagenes.length > 0 ? producto.imagenes[imagenSeleccionada] : producto.imagen}
                  alt={producto.nombreProducto}
                  className="w-full h-full object-cover"
                />
              </div>
            </CardContent>
          </Card>

          {producto.imagenes && producto.imagenes.length > 1 && (
            <div className="flex gap-2 overflow-x-auto">
              {producto.imagenes.map((imagen, index) => (
                <button
                  key={index}
                  onClick={() => setImagenSeleccionada(index)}
                  className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                    imagenSeleccionada === index
                      ? 'border-primary'
                      : 'border-transparent hover:border-gray-300'
                  }`}
                >
                  <img
                    src={imagen}
                    alt={`${producto.nombreProducto} ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Detalles del Producto */}
        <div className="space-y-6">
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Badge variant="secondary">{producto.categoria}</Badge>
                {!producto.tieneStock && (
                  <Badge variant="destructive">Sin Stock</Badge>
                )}
              </div>
            </div>
            <h1 className="text-3xl font-bold mb-4">{producto.nombreProducto}</h1>

            <div className="flex items-center gap-4 mb-4">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-5 w-5 ${
                      i < Math.floor(producto.calificacion)
                        ? 'text-yellow-400 fill-current'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
            </div>

            <div className="text-3xl font-bold text-primary mb-6">
              ${producto.precio}
            </div>
          </div>

          <Separator />

          <div>
            <h3 className="font-semibold mb-2">Descripción</h3>
            <p className="text-muted-foreground leading-relaxed">
              {producto.descripcionProducto}
            </p>
          </div>

          {producto.especificaciones && Object.keys(producto.especificaciones).length > 0 && (
            <>
              <Separator />
              {/* Especificaciones */}
              <div>
                <h3 className="font-semibold mb-3">Especificaciones</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                  {Object.entries(producto.especificaciones).map(([key, value]) => (
                    <div key={key} className="flex justify-between py-1">
                      <span className="text-muted-foreground">{key}:</span>
                      <span className="font-medium">{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          <Separator />

          {/* Agregar al Carrito */}
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <span className="font-medium">Cantidad:</span>
              <div className="flex items-center border rounded-lg">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setCantidad(Math.max(1, cantidad - 1))}
                  disabled={cantidad <= 1}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="px-4 py-2 font-medium">{cantidad}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setCantidad(cantidad + 1)}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                onClick={handleAgregarCarro}
                disabled={!producto.tieneStock}
                className="flex-1"
                size="lg"
              >
                <ShoppingCart className="h-5 w-5 mr-2" />
                Agregar al Carrito
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}