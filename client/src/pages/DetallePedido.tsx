import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import { obtienePedidoId, Pedido } from "@/api/pedidos"
import { useToast } from "@/hooks/useToast"
import { ArrowLeft, Package, Clock, CheckCircle, Truck, XCircle, MapPin } from "lucide-react"

export function OrderDetail() {
  const { id } = useParams<{ id: string }>()
  const navegar = useNavigate()
  const [pedido, setPedido] = useState<Pedido | null>(null)
  const [cargando, setCargando] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    const cargarPedido = async () => {
      if (!id) return

      try {
        const respuesta = await obtienePedidoId(id)
        setPedido(respuesta.order)
      } catch (error: any) {
        toast({
          title: "Error",
          description: error.message || "Error al cargar los detalles del pedido.",
          variant: "destructive"
        })
      } finally {
        setCargando(false)
      }
    }

    cargarPedido()
  }, [id, toast])

  const obtenerIconoEstado = (estado: Pedido['estado']) => {
    switch (estado) {
      case 'pendiente':
        return <Clock className="h-5 w-5" />
      case 'confirmado':
        return <CheckCircle className="h-5 w-5" />
      case 'enviado':
        return <Truck className="h-5 w-5" />
      case 'entregado':
        return <Package className="h-5 w-5" />
      case 'cancelado':
        return <XCircle className="h-5 w-5" />
      default:
        return <Clock className="h-5 w-5" />
    }
  }

  const obtenerColorEstado = (estado: Pedido['estado']) => {
    switch (estado) {
      case 'pendiente':
        return 'secondary'
      case 'confirmado':
        return 'default'
      case 'enviado':
        return 'default'
      case 'entregado':
        return 'default'
      case 'cancelado':
        return 'destructive'
      default:
        return 'secondary'
    }
  }

  if (cargando) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-6">
          <Skeleton className="h-10 w-32" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardContent className="p-6">
                  <Skeleton className="h-6 w-48 mb-4" />
                  <Skeleton className="h-20 w-full" />
                </CardContent>
              </Card>
            </div>
            <div className="space-y-6">
              <Card>
                <CardContent className="p-6">
                  <Skeleton className="h-32 w-full" />
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!pedido) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold mb-4">Pedido no encontrado</h1>
        <Button onClick={() => navegar('/pedidos')}>
          Volver a Pedidos
        </Button>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <Button
          variant="ghost"
          onClick={() => navegar('/pedidos')}
          className="mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Volver a Pedidos
        </Button>

        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">
              Pedido #{pedido._id.slice(-8).toUpperCase()}
            </h1>
            <p className="text-muted-foreground">
              Realizado el {new Date(pedido.fechaCreacion).toLocaleDateString('es-CL')}
            </p>
          </div>
          <Badge
            variant={obtenerColorEstado(pedido.estado)}
            className="flex items-center gap-2 text-sm px-3 py-1 capitalize"
          >
            {obtenerIconoEstado(pedido.estado)}
            {pedido.estado === 'pendiente' ? 'Pendiente' : 
             pedido.estado === 'confirmado' ? 'Confirmado' :
             pedido.estado === 'enviado' ? 'Enviado' :
             pedido.estado === 'entregado' ? 'Entregado' :
             pedido.estado === 'cancelado' ? 'Cancelado' : pedido.estado}
          </Badge>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Artículos del Pedido */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Artículos del Pedido</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {pedido.items.map((articulo, indice) => (
                    <div key={indice} className="flex items-center space-x-4 p-4 bg-secondary/20 rounded-lg">
                      <img
                        src={articulo.imagen}
                        alt={articulo.nombreProducto}
                        className="w-16 h-16 object-cover rounded-md"
                      />
                      <div className="flex-1">
                        <h3 className="font-medium">{articulo.nombreProducto}</h3>
                        <p className="text-sm text-muted-foreground">
                          Cantidad: {articulo.cantidad}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Precio: ${articulo.precio} cada uno
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">
                          ${(articulo.precio * articulo.cantidad)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Dirección de Envío */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Dirección de Envío
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-sm">
                  <p className="font-medium">{pedido.direccionEnvio.nombreCompleto}</p>
                  <p>{pedido.direccionEnvio.direccion}</p>
                  <p>
                    {pedido.direccionEnvio.ciudad}
                  </p>
                  <p>{pedido.direccionEnvio.region}</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Resumen del Pedido */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Resumen del Pedido</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>${pedido.totalPedido}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Envío</span>
                    <span>Gratis</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-semibold text-lg">
                    <span>Total</span>
                    <span>${pedido.totalPedido}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

          </div>
        </div>
      </div>
    </div>
  )
}