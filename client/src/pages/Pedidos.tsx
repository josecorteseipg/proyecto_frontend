import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { obtenerPedidos, Pedido } from "@/api/pedidos"
import { useToast } from "@/hooks/useToast"
import { Package, Eye, Clock, CheckCircle, Truck, XCircle } from "lucide-react"

export function Orders() {
  const [pedidos, setPedidos] = useState<Pedido[]>([])
  const [cargando, setCargando] = useState(true)
  const navegar = useNavigate()
  const { toast } = useToast()

  useEffect(() => {
    const cargarPedidos = async () => {
      try {
        const respuesta = await obtenerPedidos()
        setPedidos(respuesta.orders)
      } catch (error: any) {
        toast({
          title: "Error",
          description: error.message || "Error al cargar los pedidos.",
          variant: "destructive"
        })
      } finally {
        setCargando(false)
      }
    }

    cargarPedidos()
  }, [toast])

  const obtenerIconoEstado = (estado: Pedido['estado']) => {
    switch (estado) {
      case 'pendiente':
        return <Clock className="h-4 w-4" />
      case 'confirmado':
        return <CheckCircle className="h-4 w-4" />
      case 'enviado':
        return <Truck className="h-4 w-4" />
      case 'entregado':
        return <Package className="h-4 w-4" />
      case 'cancelado':
        return <XCircle className="h-4 w-4" />
      default:
        return <Clock className="h-4 w-4" />
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
          <div className="flex items-center justify-between">
            <Skeleton className="h-8 w-48" />
          </div>
          {[...Array(3)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex justify-between items-start">
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-3 w-24" />
                    </div>
                    <Skeleton className="h-6 w-20" />
                  </div>
                  <Skeleton className="h-16 w-full" />
                  <div className="flex justify-between">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-9 w-32" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Mis Pedidos</h1>
            <p className="text-muted-foreground">Rastrea y gestiona tus pedidos</p>
          </div>
        </div>

        {pedidos.length === 0 ? (
          <Card>
            <CardContent className="py-16 text-center">
              <Package className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold mb-2">Aún no tienes pedidos</h3>
              <p className="text-muted-foreground mb-6">
                Comienza a comprar para ver tus pedidos aquí
              </p>
              <Button onClick={() => navegar('/productos')}>
                Explorar Productos
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {pedidos.map((pedido) => (
              <Card key={pedido._id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg">
                        Pedido #{pedido._id.slice(-8).toUpperCase()}
                      </CardTitle>
                      <p className="text-sm text-muted-foreground">
                        Realizado el {new Date(pedido.fechaCreacion).toLocaleDateString('es-CL')}
                      </p>
                    </div>
                    <Badge
                      variant={obtenerColorEstado(pedido.estado)}
                      className="flex items-center gap-1 capitalize"
                    >
                      {obtenerIconoEstado(pedido.estado)}
                      {pedido.estado === 'pendiente' ? 'Pendiente' : 
                       pedido.estado === 'confirmado' ? 'Confirmado' :
                       pedido.estado === 'enviado' ? 'Enviado' :
                       pedido.estado === 'entregado' ? 'Entregado' :
                       pedido.estado === 'cancelado' ? 'Cancelado' : pedido.estado}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Artículos del Pedido */}
                    <div className="space-y-2">
                      {pedido.items.map((articulo, indice) => (
                        <div key={indice} className="flex items-center space-x-4">
                          <img
                            src={articulo.imagen}
                            alt={articulo.nombreProducto}
                            className="w-12 h-12 object-cover rounded-md"
                          />
                          <div className="flex-1">
                            <p className="font-medium text-sm">{articulo.nombreProducto}</p>
                            <p className="text-xs text-muted-foreground">
                              Cant: {articulo.cantidad} × ${articulo.precio}
                            </p>
                          </div>
                          <p className="font-medium">
                            ${(articulo.precio * articulo.cantidad)}
                          </p>
                        </div>
                      ))}
                    </div>

                    {/* Dirección de Envío */}
                    <div className="text-sm text-muted-foreground">
                      <p className="font-medium text-foreground mb-1">Envío a:</p>
                      <p>{pedido.direccionEnvio.nombreCompleto}</p>
                      <p>
                        {pedido.direccionEnvio.direccion}, {pedido.direccionEnvio.ciudad}
                      </p>
                      <p>{pedido.direccionEnvio.region}</p>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t">
                      <div>
                        <p className="text-lg font-semibold">
                          Total: ${pedido.totalPedido}
                        </p>
                      </div>
                      <Button
                        variant="outline"
                        onClick={() => navegar(`/pedidos/${pedido._id}`)}
                        className="flex items-center gap-2"
                      >
                        <Eye className="h-4 w-4" />
                        Ver Detalles
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}