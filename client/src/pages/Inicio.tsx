import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, ShoppingBag, Truck, Shield, Headphones } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"
import { obtenerProductos, Producto } from "@/api/productos"

export function Inicio() {
  const navigate = useNavigate()
  const [listadoProductos, setlistadoProductos] = useState<Producto[]>([])
  const [cargando, setCargando] = useState(true)

  useEffect(() => {
    const cargarlistadoProductos = async () => {
      try {
        const resultado = await obtenerProductos({ limite: 4 })//limite de 4 productos por pagina
        setlistadoProductos(resultado.productosEncontrados)
      } catch (error) {
        console.error('Error al cargar productos destacados:', error)
      } finally {
        setCargando(false)
      }
    }

    cargarlistadoProductos()
  }, [])

  const caracteristicas = [
    {
      icono: ShoppingBag,
      titulo: "Amplia Selección",
      descripcion: "Miles de productos en múltiples categorías"
    },
    {
      icono: Truck,
      titulo: "Entrega Rápida",
      descripcion: "Envío gratuito en todos los pedidos"
    },
    {
      icono: Shield,
      titulo: "Compra Segura",
      descripcion: "Tus datos están protegidos con seguridad encriptada"
    },
    {
      icono: Headphones,
      titulo: "Soporte 24/7",
      descripcion: "Obtén ayuda cuando la necesites"
    }
  ]

  return (
    <div className="space-y-16">
      <section className="text-center space-y-6 py-16">
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-600 rounded-full blur-3xl opacity-20 scale-150"></div>
          <h1 className="relative text-5xl md:text-7xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Comercio IPG
          </h1>
        </div>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Descubre productos increíbles a precios inmejorables. Desde electrónicos hasta moda, 
          tenemos todo lo que necesitas para lo que necesitas.
        </p>
        <div className="flex gap-4 justify-center">
          <Button 
            size="lg" 
            onClick={() => navigate('/productos')}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
          >
            Comprar Ahora
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
          <Button 
            size="lg" 
            variant="outline" 
            onClick={() => navigate('/productos')}
            className="hover:shadow-lg transition-all duration-300"
          >
            Explorar Categorías
          </Button>
        </div>
      </section>

      {/* Sección de Características 
      Mapeo de array de caracteristicas
      */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {caracteristicas.map((caracteristica, index) => (
          <Card key={index} className="text-center hover:shadow-lg transition-all duration-300 hover:scale-105 bg-white/50 backdrop-blur-sm dark:bg-gray-800/50">
            <CardContent className="pt-6">
              <div className="w-12 h-12 mx-auto mb-4 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                <caracteristica.icono className="h-6 w-6 text-white" />
              </div>
              <h3 className="font-semibold mb-2">{caracteristica.titulo}</h3>
              <p className="text-sm text-muted-foreground">{caracteristica.descripcion}</p>
            </CardContent>
          </Card>
        ))}
      </section>

      {/* Listado Productos obtenidos desde API (Backend) */}
      <section className="space-y-8">
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-bold">Productos Destacados</h2>
          <p className="text-muted-foreground">Echa un vistazo a nuestros artículos más populares</p>
        </div>

        {cargando ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <div className="aspect-square bg-gray-200 rounded-t-lg"></div>
                <CardContent className="p-4 space-y-2">
                  <div className="h-4 bg-gray-200 rounded"></div>
                  <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                  <div className="h-6 bg-gray-200 rounded w-1/2"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {listadoProductos.map((producto) => (
              <Card 
                key={producto._id} 
                className="group cursor-pointer hover:shadow-lg transition-all duration-300 hover:scale-105 bg-white/80 backdrop-blur-sm dark:bg-gray-800/80"
                onClick={() => navigate(`/productos/${producto._id}`)}
              >
                <div className="aspect-square overflow-hidden rounded-t-lg relative">
                  <img
                    src={producto.imagen}
                    alt={producto.nombreProducto}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <Badge className="absolute top-2 left-2 bg-gradient-to-r from-blue-500 to-purple-500">
                    Destacado
                  </Badge>
                </div>
                <CardContent className="p-4">
                  <h3 className="font-semibold mb-2 line-clamp-1">{producto.nombreProducto}</h3>
                  <p className="text-2xl font-bold text-primary">${producto.precio}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        <div className="text-center">
          <Button 
            onClick={() => navigate('/productos')}
            variant="outline"
            size="lg"
            className="hover:shadow-lg transition-all duration-300"
          >
            Ver Todos los Productos
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </section>
    </div>
  )
}