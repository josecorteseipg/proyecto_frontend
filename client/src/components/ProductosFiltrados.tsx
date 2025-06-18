import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import { Slider } from "./ui/slider"
import { Search, X } from "lucide-react"
import { useState, useEffect } from "react"
import { obtenerCategorias } from "@/api/productos"

interface ProductosFiltradosPropiedades {
  cambioFiltros: (filters: {
    busqueda: string
    categoria: string
    minprecio: number
    maxprecio: number
    ordernarPor: string
  }) => void
  className?: string
}

export function ProductosFiltrados({ cambioFiltros, className }: ProductosFiltradosPropiedades) {
  const [busqueda, setBusqueda] = useState("")
  const [categoria, setCategoria] = useState("todos")
  const [rangoPrecio, setRangoPrecio] = useState([0, 1000000])
  const [ordernarPor, setOrdenarPor] = useState("defecto")
  const [categorias, setCategorias] = useState<string[]>([])

  useEffect(() => {
    const cargarCategorias = async () => {
      try {
        const respuesta = await obtenerCategorias()
        setCategorias(respuesta.categorias)
      } catch (error) {
        console.error('Error al cargar categorías:', error)
      }
    }
    cargarCategorias()
  }, [])

  useEffect(() => {
    cambioFiltros({
      busqueda,
      categoria: categoria === "todos" ? "" : categoria,
      minprecio: rangoPrecio[0],
      maxprecio: rangoPrecio[1],
      ordernarPor: ordernarPor === "defecto" ? "" : ordernarPor
    })
  }, [busqueda, categoria, rangoPrecio, ordernarPor, cambioFiltros])

  const limpiarFiltros = () => {
    setBusqueda("")
    setCategoria("todos")
    setRangoPrecio([0, 100000])
    setOrdenarPor("defecto")
  }

  return (
    <Card className={`bg-white dark:bg-gray-800 ${className}`}>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Filtros</CardTitle>
        <Button variant="ghost" size="sm" onClick={limpiarFiltros}>
          <X className="h-4 w-4 mr-2" />
          Limpiar
        </Button>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="busqueda">Búsqueda</Label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="busqueda"
              placeholder="Buscar productos..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Categoría */}
        <div className="space-y-2">
          <Label>Categoría</Label>
          <Select value={categoria} onValueChange={setCategoria}>
            <SelectTrigger>
              <SelectValue placeholder="Todas las Categorías" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todas las Categorías</SelectItem>
              {categorias.map((cat) => (
                <SelectItem key={cat} value={cat}>
                  {cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Rango de Precios */}
        <div className="space-y-4">
          <Label>Rango de Precios</Label>
          <div className="px-2">
            <Slider
              value={rangoPrecio}
              onValueChange={setRangoPrecio}
              max={1000000}
              min={0}
              step={10000}
              className="w-full"
            />
          </div>
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>${rangoPrecio[0]}</span>
            <span>${rangoPrecio[1]}</span>
          </div>
        </div>

        {/* Ordenar Por */}
        <div className="space-y-2">
          <Label>Ordenar Por</Label>
          <Select value={ordernarPor} onValueChange={setOrdenarPor}>
            <SelectTrigger>
              <SelectValue placeholder="Ordenar por..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="defecto">Por Defecto</SelectItem>
              <SelectItem value="precio_asc">Precio: Menor a Mayor</SelectItem>
              <SelectItem value="precio_desc">Precio: Mayor a Menor</SelectItem>
              <SelectItem value="nombre">Nombre A-Z</SelectItem>
              <SelectItem value="calificacion">Calificación</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  )
}