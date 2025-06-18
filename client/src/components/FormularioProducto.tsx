import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { X, Plus, Upload } from 'lucide-react';
import { useToast } from '@/hooks/useToast';
import { crearProducto, actualizarProducto, obtenerProductosId, type Producto } from '@/api/productos';

const CATEGORIAS = ['electronicos', 'ropa', 'hogar', 'deportes', 'libros', 'belleza'];

interface PropiedadesProductForm {
  modo?: 'crear' | 'editar';
}

export default function ProductForm({ modo = 'crear' }: PropiedadesProductForm) {
  const [datosFormulario, setDatosFormulario] = useState({
    nombreProducto: '',
    descripcion: '',
    precio: '',
    categoria: '',
  });
  const [imagenes, setImagenes] = useState<File[]>([]);
  const [imagenesExistentes, setImagenesExistentes] = useState<string[]>([]);
  const [especificaciones, setEspecificaciones] = useState<Array<{ clave: string; valor: string }>>([]);
  const [cargando, setCargando] = useState(false);
  const [cargandoProducto, setCargandoProducto] = useState(false);
  const { toast } = useToast();
  const navegar = useNavigate();
  const { id } = useParams();

  console.log('ProductForm - Modo:', modo);
  console.log('ProductForm - ID del producto:', id);
  console.log('ProductForm - Token de acceso existe:', localStorage.getItem('tokenAcceso') ? 'SÍ' : 'NO');

  // Cargar datos del producto si está en modo edición
  useEffect(() => {
    if (modo === 'editar' && id) {
      console.log('ProductForm - Cargando producto para modo edición');
      cargarProducto();
    }
  }, [modo, id]);

  const cargarProducto = async () => {
    if (!id) return;

    console.log('ProductForm - Iniciando carga de producto:', id);
    setCargandoProducto(true);
    try {
      console.log('ProductForm - Llamando API obtenerProductosId');
      const { productoEncontrado }: { productoEncontrado: Producto } = await obtenerProductosId(id);
      console.log('ProductForm - Producto cargado correctamente:', productoEncontrado);

      setDatosFormulario({
        nombreProducto: productoEncontrado.nombreProducto,
        descripcion: productoEncontrado.descripcion,
        precio: productoEncontrado.precio.toString(),
        categoria: productoEncontrado.categoria,
      });

      setImagenesExistentes(productoEncontrado.imagenes || []);

      // Convertir objeto de especificaciones a array
      const arrayEspecificaciones = Object.entries(productoEncontrado.especificaciones || {}).map(([clave, valor]) => ({
        clave,
        valor: valor as string
      }));
      setEspecificaciones(arrayEspecificaciones);
    } catch (error: any) {
      console.error('ProductForm - Error cargando producto:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message
      });
      navegar('/productos');
    } finally {
      console.log('ProductForm - Carga de producto finalizada');
      setCargandoProducto(false);
    }
  };

  const manejarCambioInput = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setDatosFormulario(prev => ({ ...prev, [name]: value }));
  };

  const manejarCambioCategoria = (valor: string) => {
    setDatosFormulario(prev => ({ ...prev, categoria: valor }));
  };

  const manejarCambioImagen = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const nuevasImagenes = Array.from(e.target.files);
      setImagenes(prev => [...prev, ...nuevasImagenes].slice(0, 5)); // Límite de 5 imágenes
    }
  };

  const eliminarImagen = (indice: number) => {
    setImagenes(prev => prev.filter((_, i) => i !== indice));
  };

  const eliminarImagenExistente = (indice: number) => {
    setImagenesExistentes(prev => prev.filter((_, i) => i !== indice));
  };

  const agregarEspecificacion = () => {
    setEspecificaciones(prev => [...prev, { clave: '', valor: '' }]);
  };

  const actualizarEspecificacion = (indice: number, campo: 'clave' | 'valor', valor: string) => {
    setEspecificaciones(prev =>
      prev.map((especificacion, i) =>
        i === indice ? { ...especificacion, [campo]: valor } : especificacion
      )
    );
  };

  const eliminarEspecificacion = (indice: number) => {
    setEspecificaciones(prev => prev.filter((_, i) => i !== indice));
  };

  const manejarEnvio = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!datosFormulario.nombreProducto || !datosFormulario.descripcion || !datosFormulario.precio || !datosFormulario.categoria) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Por favor completa todos los campos requeridos"
      });
      return;
    }

    if (modo === 'crear' && imagenes.length === 0) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Por favor sube al menos una imagen del producto"
      });
      return;
    }

    if (modo === 'editar' && imagenes.length === 0 && imagenesExistentes.length === 0) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "El producto debe tener al menos una imagen"
      });
      return;
    }

    if (isNaN(Number(datosFormulario.precio)) || Number(datosFormulario.precio) <= 0) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Por favor ingresa un precio válido"
      });
      return;
    }

    setCargando(true);

    try {
      const datosFormularioProducto = new FormData();
      datosFormularioProducto.append('nombre', datosFormulario.nombreProducto);
      datosFormularioProducto.append('descripcion', datosFormulario.descripcion);
      datosFormularioProducto.append('precio', datosFormulario.precio);
      datosFormularioProducto.append('categoria', datosFormulario.categoria);

      // Agregar nuevas imágenes
      imagenes.forEach(imagen => {
        datosFormularioProducto.append('images', imagen);
      });

      // Agregar especificaciones
      const objetoEspecificaciones = especificaciones
        .filter(especificacion => especificacion.clave && especificacion.valor)
        .reduce((acc, especificacion) => ({ ...acc, [especificacion.clave]: especificacion.valor }), {});

      datosFormularioProducto.append('especificaciones', JSON.stringify(objetoEspecificaciones));

      if (modo === 'crear') {
        await crearProducto(datosFormularioProducto);
        toast({
          title: "Éxito",
          description: "Producto creado correctamente"
        });
      } else if (modo === 'editar' && id) {
        await actualizarProducto(id, datosFormularioProducto);
        toast({
          title: "Éxito",
          description: "Producto actualizado correctamente"
        });
      }

      navegar('/productos');
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message
      });
    } finally {
      setCargando(false);
    }
  };

  if (cargandoProducto) {
    console.log('ProductForm - Mostrando estado de carga');
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto text-center">
          <p>Cargando producto...</p>
        </div>
      </div>
    );
  }

  console.log('ProductForm - Renderizando formulario');

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>
            {modo === 'editar' ? 'Editar Producto' : 'Crear Nuevo Producto'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={manejarEnvio} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="nombreProducto">Nombre del Producto *</Label>
              <Input
                id="nombreProducto"
                name="nombreProducto"
                value={datosFormulario.nombreProducto}
                onChange={manejarCambioInput}
                placeholder="Ingresa el nombre del producto"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="descripcion">Descripción *</Label>
              <Textarea
                id="descripcion"
                name="descripcion"
                value={datosFormulario.descripcion}
                onChange={manejarCambioInput}
                placeholder="Ingresa la descripción del producto"
                rows={4}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="precio">Precio *</Label>
                <Input
                  id="precio"
                  name="precio"
                  type="number"
                  step="0.01"
                  min="0"
                  value={datosFormulario.precio}
                  onChange={manejarCambioInput}
                  placeholder="0.00"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>Categoría *</Label>
                <Select value={datosFormulario.categoria} onValueChange={manejarCambioCategoria}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar categoría" />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIAS.map(categoria => (
                      <SelectItem key={categoria} value={categoria}>
                        {categoria}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Imágenes del Producto {modo === 'crear' ? '*' : ''} (Máx 5)</Label>

              {/* Mostrar imágenes existentes en modo edición */}
              {modo === 'editar' && imagenesExistentes.length > 0 && (
                <div className="mb-4">
                  <p className="text-sm text-gray-600 mb-2">Imágenes Actuales:</p>
                  <div className="flex flex-wrap gap-2">
                    {imagenesExistentes.map((urlImagen, indice) => (
                      <div key={indice} className="relative">
                        <img
                          src={urlImagen}
                          alt={`Producto ${indice + 1}`}
                          className="w-20 h-20 object-cover rounded border"
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          className="absolute -top-2 -right-2 h-6 w-6 p-0 rounded-full"
                          onClick={() => eliminarImagenExistente(indice)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <Input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={manejarCambioImagen}
                  className="hidden"
                  id="imagenes"
                />
                <Label htmlFor="imagenes" className="cursor-pointer">
                  <Upload className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                  <p className="text-sm text-gray-600">
                    {modo === 'editar' ? 'Agregar nuevas imágenes' : 'Haz clic para subir imágenes o arrastra y suelta'}
                  </p>
                </Label>
              </div>

              {imagenes.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {imagenes.map((imagen, indice) => (
                    <Badge key={indice} variant="secondary" className="p-2">
                      {imagen.name}
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="ml-2 h-4 w-4 p-0"
                        onClick={() => eliminarImagen(indice)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Especificaciones</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={agregarEspecificacion}
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Agregar Especificación
                </Button>
              </div>

              {especificaciones.map((especificacion, indice) => (
                <div key={indice} className="flex gap-2">
                  <Input
                    placeholder="Nombre de especificación"
                    value={especificacion.clave}
                    onChange={(e) => actualizarEspecificacion(indice, 'clave', e.target.value)}
                  />
                  <Input
                    placeholder="Valor de especificación"
                    value={especificacion.valor}
                    onChange={(e) => actualizarEspecificacion(indice, 'valor', e.target.value)}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => eliminarEspecificacion(indice)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>

            <Button type="submit" className="w-full" disabled={cargando}>
              {cargando
                ? (modo === 'editar' ? 'Actualizando Producto...' : 'Creando Producto...')
                : (modo === 'editar' ? 'Actualizar Producto' : 'Crear Producto')
              }
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}