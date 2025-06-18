import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { almacenCarro } from '@/store/almacenCarroCompras';
import { usoAutenticacion } from '@/contexts/Autenticacion';
import { crearPedido } from '@/api/pedidos';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/useToast';
import { CreditCard, MapPin, Package } from 'lucide-react';

interface InformacionEnvio {
  nombre: string;
  apellido: string;
  email: string;
  telefono: string;
  direccion: string;
  ciudad: string;
  region: string;
}

interface InformacionPago {
  numeroTarjeta: string;
  fechaVencimiento: string;
  cvv: string;
  nombreTarjeta: string;
}

export default function Checkout() {
  const { items, limpiarCarro, totalPrecio } = almacenCarro();
  const { usuario } = usoAutenticacion();
  const navegar = useNavigate();
  const { toast } = useToast();
  const [estaCargando, setEstaCargando] = useState(false);

  const [informacionEnvio, setInformacionEnvio] = useState<InformacionEnvio>({
    nombre: '',
    apellido: '',
    email: usuario?.email || '',
    telefono: '',
    direccion: '',
    ciudad: '',
    region: '',
  });

  const [informacionPago, setInformacionPago] = useState<InformacionPago>({
    numeroTarjeta: '',
    fechaVencimiento: '',
    cvv: '',
    nombreTarjeta: '',
  });

  useEffect(() => {
    if (items.length === 0) {
      navegar('/');
    }
  }, [items, navegar]);

  const manejarCambioEnvio = (campo: keyof InformacionEnvio, valor: string) => {
    setInformacionEnvio(prev => ({ ...prev, [campo]: valor }));
  };

  const manejarCambioPago = (campo: keyof InformacionPago, valor: string) => {
    setInformacionPago(prev => ({ ...prev, [campo]: valor }));
  };

  const manejarEnvio = async (e: React.FormEvent) => {
    e.preventDefault();
    setEstaCargando(true);

    try {
      const datosPedido = {
        items: items.map(articulo => ({
          IdProducto: articulo._id,
          cantidad: articulo.cantidad,
        })),
        direccionEnvio: {
          nombreCompleto: `${informacionEnvio.nombre} ${informacionEnvio.apellido}`,
          direccion: informacionEnvio.direccion,
          ciudad: informacionEnvio.ciudad,
          region: informacionEnvio.region,
        },
        metodoPago: 'tarjeta',
      };

      const respuesta = await crearPedido(datosPedido);

      if (respuesta.success) {
        limpiarCarro();
        toast({
          title: '¡Pedido Realizado Exitosamente!',
          description: `Tu pedido ha sido realizado correctamente.`,
        });
        navegar(`/pedidos/${respuesta.order._id}`);
      }
    } catch (error: any) {
      console.error('Error al crear pedido:', error);
      toast({
        title: 'Error',
        description: error.message || 'Error al realizar pedido. Por favor intenta de nuevo.',
        variant: 'destructive',
      });
    } finally {
      setEstaCargando(false);
    }
  };

  const costoEnvio = 0;
  const totalFinal = totalPrecio + costoEnvio ;

  if (items.length === 0) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Finalizar Compra</h1>

      <div className="grid gap-8 lg:grid-cols-2">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Información de Despacho
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label htmlFor="nombre">Nombre</Label>
                  <Input
                    id="nombre"
                    value={informacionEnvio.nombre}
                    onChange={(e) => manejarCambioEnvio('nombre', e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="apellido">Apellido</Label>
                  <Input
                    id="apellido"
                    value={informacionEnvio.apellido}
                    onChange={(e) => manejarCambioEnvio('apellido', e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label htmlFor="email">Correo Electrónico</Label>
                  <Input
                    id="email"
                    type="email"
                    value={informacionEnvio.email}
                    onChange={(e) => manejarCambioEnvio('email', e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="telefono">Teléfono</Label>
                  <Input
                    id="telefono"
                    value={informacionEnvio.telefono}
                    onChange={(e) => manejarCambioEnvio('telefono', e.target.value)}
                    required
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="direccion">Dirección</Label>
                <Input
                  id="direccion"
                  value={informacionEnvio.direccion}
                  onChange={(e) => manejarCambioEnvio('direccion', e.target.value)}
                  required
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-3">
                <div>
                  <Label htmlFor="ciudad">Ciudad</Label>
                  <Input
                    id="ciudad"
                    value={informacionEnvio.ciudad}
                    onChange={(e) => manejarCambioEnvio('ciudad', e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="region">Región</Label>
                  <Input
                    id="region"
                    value={informacionEnvio.region}
                    onChange={(e) => manejarCambioEnvio('region', e.target.value)}
                    required
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Información de Pago
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="nombreTarjeta">Nombre en la Tarjeta</Label>
                <Input
                  id="nombreTarjeta"
                  value={informacionPago.nombreTarjeta}
                  onChange={(e) => manejarCambioPago('nombreTarjeta', e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="numeroTarjeta">Número de Tarjeta</Label>
                <Input
                  id="numeroTarjeta"
                  placeholder="1234 5678 9012 3456"
                  value={informacionPago.numeroTarjeta}
                  onChange={(e) => manejarCambioPago('numeroTarjeta', e.target.value)}
                  required
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label htmlFor="fechaVencimiento">Fecha de Vencimiento</Label>
                  <Input
                    id="fechaVencimiento"
                    placeholder="MM/AA"
                    value={informacionPago.fechaVencimiento}
                    onChange={(e) => manejarCambioPago('fechaVencimiento', e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="cvv">CVV</Label>
                  <Input
                    id="cvv"
                    placeholder="123"
                    value={informacionPago.cvv}
                    onChange={(e) => manejarCambioPago('cvv', e.target.value)}
                    required
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Resumen del Pedido
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {items.map((articulo) => (
                <div key={articulo._id} className="flex items-center space-x-4">
                  <img
                    src={articulo.imagen}
                    alt={articulo.nombre}
                    className="w-16 h-16 object-cover rounded"
                  />
                  <div className="flex-1">
                    <h3 className="font-medium">{articulo.nombre}</h3>
                    <p className="text-sm text-muted-foreground">
                      Cantidad: {articulo.cantidad}
                    </p>
                  </div>
                  <p className="font-medium">
                    ${(articulo.precio * articulo.cantidad)}
                  </p>
                </div>
              ))}

              <Separator />

              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>${totalPrecio}</span>
                </div>
                <div className="flex justify-between">
                  <span>Envío</span>
                  <span>${costoEnvio}</span>
                </div>
               
                <Separator />
                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span>${totalFinal}</span>
                </div>
              </div>

              <Button
                className="w-full"
                onClick={manejarEnvio}
                disabled={estaCargando}
                size="lg"
              >
                {estaCargando ? 'Procesando...' : 'Realizar Pedido'}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}