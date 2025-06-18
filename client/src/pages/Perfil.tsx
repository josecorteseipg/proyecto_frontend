import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { useToast } from "@/hooks/useToast"
import { User, MapPin, Package, Plus, Edit, Trash2, Clock, CheckCircle, Truck, XCircle } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog"
import { obtienePerfilUsuario, actualizaPerfilUsuario, agregarDireccion, actualizarDireccion, borrarDirecciones, PerfilUsuario, Direccion } from "@/api/usuarios"
import { obtenerPedidos, Pedido } from "@/api/pedidos"

export function Profile() {
  const [perfil, setPerfil] = useState<PerfilUsuario | null>(null)
  const [pedidos, setPedidos] = useState<Pedido[]>([])
  const [cargando, setCargando] = useState(true)
  const [editando, setEditando] = useState(false)
  const [ventanaDireccionAbierta, setVentanaDireccionAbierta] = useState(false)
  const [editandoDireccion, setEditandoDireccion] = useState<Direccion | null>(null)
  const { toast } = useToast()

  const formularioPerfil = useForm<{ nombre: string; email: string; telefono: string }>({
    defaultValues: {
      nombre: '',
      email: '',
      telefono: ''
    }
  })

  const formularioDireccion = useForm<Omit<Direccion, '_id'>>({
    defaultValues: {
      nombreCompleto: '',
      direccion: '',
      ciudad: '',
      region: '',
      esPrincipal: false
    }
  })

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const [respuestaPerfil, respuestaPedidos] = await Promise.all([
          obtienePerfilUsuario(),
          obtenerPedidos()
        ])
        
        if (respuestaPerfil && respuestaPerfil.usuarioDatos) {
          setPerfil(respuestaPerfil.usuarioDatos)
          formularioPerfil.reset({
            nombre: respuestaPerfil.usuarioDatos.nombre || '',
            email: respuestaPerfil.usuarioDatos.email || '',
            telefono: respuestaPerfil.usuarioDatos.telefono || ''
          })
        } else {
          console.error('Estructura de respuesta del perfil inválida:', respuestaPerfil)
          throw new Error('Se recibieron datos de perfil inválidos')
        }
        
        if (respuestaPedidos && respuestaPedidos.Pedido) {
          setPedidos(respuestaPedidos.Pedido)
        } else {
          console.warn('No se recibieron datos de pedidos, estableciendo array vacío')
          setPedidos([])
        }
      } catch (error: any) {
        console.error('Error al cargar datos del perfil:', error)
        toast({
          title: "Error",
          description: error.message || "Error al cargar los datos del perfil.",
          variant: "destructive"
        })
      } finally {
        setCargando(false)
      }
    }

    cargarDatos()
  }, [formularioPerfil, toast])

  const onActualizarPerfil = async (data: { nombre: string; email: string; telefono: string }) => {
    try {
      const respuesta = await actualizaPerfilUsuario(data)
      if (respuesta && respuesta.usuarioDatos) {
        setPerfil(respuesta.usuarioDatos)
        setEditando(false)
        toast({
          title: "Éxito",
          description: "Perfil actualizado correctamente."
        })
      }
    } catch (error: any) {
      console.error('Error al actualizar perfil:', error)
      toast({
        title: "Error",
        description: error.message || "Error al actualizar el perfil.",
        variant: "destructive"
      })
    }
  }

  const onAgregarDireccion = async (data: Omit<Direccion, '_id'>) => {
    try {
      console.log('Agregando dirección:', data)
      const respuesta = await agregarDireccion(data)
      if (respuesta && respuesta.direccion && perfil) {
        setPerfil({
          ...perfil,
          direcciones: [...perfil.direcciones, respuesta.direccion]
        })
        setVentanaDireccionAbierta(false)
        formularioDireccion.reset({
          nombreCompleto: '',
          direccion: '',
          ciudad: '',
          region: 'Chile',
          esPrincipal: false
        })
        toast({
          title: "Éxito",
          description: "Dirección agregada correctamente."
        })
      }
    } catch (error: any) {
      console.error('Error al agregar dirección:', error)
      toast({
        title: "Error",
        description: error.message || "Error al agregar la dirección.",
        variant: "destructive"
      })
    }
  }

  const onActualizarDireccion = async (data: Omit<Direccion, '_id'>) => {
    if (!editandoDireccion) return

    try {
      console.log('Actualizando dirección:', editandoDireccion._id, data)
      const respuesta = await actualizarDireccion(editandoDireccion._id, data)
      if (respuesta && respuesta.direccion && perfil) {
        setPerfil({
          ...perfil,
          direcciones: perfil.direcciones.map(addr =>
            addr._id === editandoDireccion._id ? respuesta.direccion : addr
          )
        })
        setVentanaDireccionAbierta(false)
        setEditandoDireccion(null)
        formularioDireccion.reset({
          nombreCompleto: '',
          direccion: '',
          ciudad: '',
          region: '',
          esPrincipal: false
        })
        toast({
          title: "Correcto",
          description: "Dirección actualizada correctamente."
        })
      }
    } catch (error: any) {
      console.error('Error al actualizar dirección:', error)
      toast({
        title: "Error",
        description: error.message || "Error al actualizar la dirección.",
        variant: "destructive"
      })
    }
  }

  const onEliminarDireccion = async (direccionId: string) => {
    try {
      console.log('Eliminando dirección:', direccionId)
      await borrarDirecciones(direccionId)
      if (perfil) {
        setPerfil({
          ...perfil,
          direcciones: perfil.direcciones.filter(addr => addr._id !== direccionId)
        })
      }
      toast({
        title: "Eliminada",
        description: "Dirección eliminada correctamente."
      })
    } catch (error: any) {
      console.error('Error al eliminar dirección:', error)
      toast({
        title: "Error",
        description: error.message || "Error al eliminar la dirección.",
        variant: "destructive"
      })
    }
  }

  const handleClickAgregarDireccion = () => {
    setEditandoDireccion(null)
    formularioDireccion.reset({
      direccion: '',
      ciudad: '',
      region: '',
      esPrincipal: false
    })
    setVentanaDireccionAbierta(true)
  }

  const handleClicEditarDireccion = (direccion: Direccion) => {
    if (!direccion || !direccion.direccion) {
      console.error('Datos de dirección inválidos:', direccion)
      toast({
        title: "Error",
        description: "Datos de dirección inválidos.",
        variant: "destructive"
      })
      return
    }
    
    setEditandoDireccion(direccion)
    formularioDireccion.reset({
      direccion: direccion.direccion,
      ciudad: direccion.ciudad,
      region: direccion.region,
      esPrincipal: direccion.esPrincipal
    })
    setVentanaDireccionAbierta(true)
  }

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
        <div className="max-w-4xl mx-auto">
          <Skeleton className="h-8 w-48 mb-8" />
          <div className="space-y-6">
            <Card>
              <CardContent className="p-6">
                <Skeleton className="h-32 w-full" />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    )
  }

  if (!perfil) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold mb-4">Perfil no encontrado</h1>
        <p className="text-muted-foreground">Por favor intenta iniciar sesión de nuevo.</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Mi Perfil</h1>

        <Tabs defaultValue="perfil" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="perfil" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Perfil
            </TabsTrigger>
            <TabsTrigger value="direcciones" className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              Direcciones
            </TabsTrigger>
            <TabsTrigger value="pedidos" className="flex items-center gap-2">
              <Package className="h-4 w-4" />
              Pedidos
            </TabsTrigger>
          </TabsList>

          <TabsContent value="perfil">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Información Personal</CardTitle>
                  <Button
                    variant="outline"
                    onClick={() => setEditando(!editando)}
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    {editando ? 'Cancelar' : 'Editar'}
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {editando ? (
                  <form onSubmit={formularioPerfil.handleSubmit(onActualizarPerfil)} className="space-y-4">
                    <div>
                      <Label htmlFor="nombre">Nombre Completo</Label>
                      <Input
                        id="nombre"
                        {...formularioPerfil.register('nombre', { required: 'El nombre es requerido' })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Correo Electrónico</Label>
                      <Input
                        id="email"
                        type="email"
                        {...formularioPerfil.register('email', { required: 'El email es requerido' })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="telefono">Teléfono</Label>
                      <Input
                        id="telefono"
                        {...formularioPerfil.register('telefono')}
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button type="submit">Guardar Cambios</Button>
                      <Button type="button" variant="outline" onClick={() => setEditando(false)}>
                        Cancelar
                      </Button>
                    </div>
                  </form>
                ) : (
                  <div className="space-y-4">
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">Nombre Completo</Label>
                      <p className="text-lg">{perfil.nombre || 'No proporcionado'}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">Correo Electrónico</Label>
                      <p className="text-lg">{perfil.email || 'No proporcionado'}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">Teléfono</Label>
                      <p className="text-lg">{perfil.telefono || 'No proporcionado'}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">Miembro Desde</Label>
                      <p className="text-lg">{new Date(perfil.fechaCreacion).toLocaleDateString('es-CL')}</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="direcciones">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Direcciones Guardadas</CardTitle>
                  <Dialog open={ventanaDireccionAbierta} onOpenChange={setVentanaDireccionAbierta}>
                    <DialogTrigger asChild>
                      <Button onClick={handleClickAgregarDireccion}>
                        <Plus className="h-4 w-4 mr-2" />
                        Agregar Dirección
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>
                          {editandoDireccion ? 'Editar Dirección' : 'Agregar Nueva Dirección'}
                        </DialogTitle>
                        <DialogDescription>
                          {editandoDireccion ? 'Actualiza la información de tu dirección.' : 'Agrega una nueva dirección a tu cuenta.'}
                        </DialogDescription>
                      </DialogHeader>
                      <form
                        onSubmit={formularioDireccion.handleSubmit(editandoDireccion ? onActualizarDireccion : onAgregarDireccion)}
                        className="space-y-4"
                      >                       
                        <div>
                          <Label htmlFor="direccion">Dirección</Label>
                          <Input
                            id="direccion"
                            {...formularioDireccion.register('direccion', { required: 'La dirección es requerida' })}
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="ciudad">Ciudad</Label>
                            <Input
                              id="ciudad"
                              {...formularioDireccion.register('ciudad', { required: 'La ciudad es requerida' })}
                            />
                          </div>
                          <div>
                            <Label htmlFor="state">Región</Label>
                            <Input
                              id="region"
                              {...formularioDireccion.register('region', { required: 'La región es requerida' })}
                            />
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button type="submit">
                            {editandoDireccion ? 'Actualizar Dirección' : 'Agregar Dirección'}
                          </Button>
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => setVentanaDireccionAbierta(false)}
                          >
                            Cancelar
                          </Button>
                        </div>
                      </form>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                {!perfil.direcciones || perfil.direcciones.length === 0 ? (
                  <div className="text-center py-8">
                    <MapPin className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">No hay direcciones guardadas aún</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {perfil.direcciones.map((direccion) => {
                      // Verificación de seguridad para datos de dirección
                      if (!direccion || !direccion._id) {
                        console.error('Datos de dirección inválidos:', direccion)
                        return null
                      }
                      
                      return (
                        <div key={direccion._id} className="p-4 border rounded-lg">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <p className="font-medium">{direccion.direccion || 'Sin dirección'}</p>
                                {direccion.esPrincipal && (
                                  <Badge variant="secondary">Predeterminada</Badge>
                                )}
                              </div>
                              <p className="text-sm text-muted-foreground">
                                {direccion.ciudad || 'Sin ciudad'}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                {direccion.region || 'Sin región'}
                              </p>
                            </div>
                            <div className="flex gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleClicEditarDireccion(direccion)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => onEliminarDireccion(direccion._id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="pedidos">
            <Card>
              <CardHeader>
                <CardTitle>Pedidos Recientes</CardTitle>
              </CardHeader>
              <CardContent>
                {!pedidos || pedidos.length === 0 ? (
                  <div className="text-center py-8">
                    <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">No hay pedidos aún</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {pedidos.slice(0, 5).map((pedido) => {
                      if (!pedido || !pedido._id) {
                        console.error('Datos de pedido inválidos:', pedido)
                        return null
                      }
                      
                      return (
                        <div key={pedido._id} className="p-4 border rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <div>
                              <p className="font-medium">
                                Pedido #{pedido._id.slice(-8).toUpperCase()}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                {new Date(pedido.fechaCreacion).toLocaleDateString('es-CL')}
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
                          <div className="flex items-center justify-between">
                            <p className="text-sm text-muted-foreground">
                              {pedido.items?.length || 0} artículo(s) • ${(pedido.totalPedido || 0).toFixed(2)}
                            </p>
                            <Button variant="outline" size="sm">
                              Ver Detalles
                            </Button>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}