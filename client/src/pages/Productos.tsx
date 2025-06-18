import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { useToast } from "@/hooks/useToast"
import { Grid, List, Filter } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

import { ProductoItemTarjeta } from "@/components/TarjetaProducto"
import { ProductosFiltrados } from "@/components/ProductosFiltrados"
import { obtenerProductos, Producto } from "@/api/productos"
export function Productos() {
  const [productos, setProductos] = useState<Producto[]>([])
  const [cargando, setCargando] = useState(true)
  const [vista, setVista] = useState<'grid' | 'list'>('grid')
  const [filtros, setFiltros] = useState({
    busqueda: '',
    categoria: '',
    minprecio: 0,
    maxprecio: 1000000,
    ordernarPor: ''
  })
  const { toast } = useToast()

  const cargarProductos = useCallback(async () => {
    setCargando(true)
    try {
      const respuesta = await obtenerProductos(filtros)
      setProductos(respuesta.productosEncontrados)
    } catch (error) {
      toast({
        title: "Error",
        description: "Error al cargar los productos. Por favor intenta de nuevo.",
        variant: "destructive"
      })
    } finally {
      setCargando(false)
    }
  }, [filtros, toast])

  useEffect(() => {
    cargarProductos()
  }, [cargarProductos])

  const handleCambioFiltros = useCallback((nuevoFiltros: typeof filtros) => {
    setFiltros(nuevoFiltros)
  }, [])

  const handleEliminarProducto = useCallback((idProductoBorrado: string) => {
    setProductos(productosPrevios => 
      productosPrevios.filter(producto => producto._id !== idProductoBorrado)
    );
  }, [])

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Productos</h1>
          <p className="text-muted-foreground">
            Descubre nuestra increíble colección de productos
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant={vista === 'grid' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setVista('grid')}
          >
            <Grid className="h-4 w-4" />
          </Button>
          <Button
            variant={vista === 'list' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setVista('list')}
          >
            <List className="h-4 w-4" />
          </Button>
          
          {/* Botón de filtros para version telefono */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="sm" className="lg:hidden">
                <Filter className="h-4 w-4" />
                Filtros
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-80">
              <ProductosFiltrados cambioFiltros={handleCambioFiltros} />
            </SheetContent>
          </Sheet>
        </div>
      </div>

      <div className="flex gap-8">
        {/* Barra Lateral de filtros para version escritorio */}
        <aside className="hidden lg:block w-80 flex-shrink-0">
          <ProductosFiltrados cambioFiltros={handleCambioFiltros} className="sticky top-24" />
        </aside>

        {/* Cuadrícula de Productos */}
        <main className="flex-1">
          {cargando ? (
            <div className={`grid gap-6 ${
              vista === 'grid' 
                ? 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3' 
                : 'grid-cols-1'
            }`}>
              {[...Array(9)].map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <div className="aspect-square bg-gray-200 rounded-t-lg"></div>
                  <CardContent className="p-4 space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-3 w-2/3" />
                    <Skeleton className="h-6 w-1/2" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : productos.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-24 h-24 mx-auto mb-4 bg-muted rounded-full flex items-center justify-center">
                <Grid className="h-12 w-12 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-2">No se encontraron productos</h3>
              <p className="text-muted-foreground mb-4">
                Intenta ajustar tus filtros o términos de búsqueda
              </p>
            </div>
          ) : (
            <div className={`grid gap-6 ${
              vista === 'grid' 
                ? 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3' 
                : 'grid-cols-1'
            }`}>
              {productos.map((producto) => (
                <ProductoItemTarjeta 
                  key={producto._id} 
                  producto={producto}
                />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  )
}