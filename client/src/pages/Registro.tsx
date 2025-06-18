import { useState } from "react"
import { useForm } from "react-hook-form"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card"
import { useToast } from "@/hooks/useToast"
import {
  UserPlus
} from "lucide-react"
import { usoAutenticacion } from "@/contexts/Autenticacion"

type FormularioRegistro = {
  nombre: string
  email: string
  password: string
  confirmarPassword: string
}

export function Registro() {
  const [cargando, setCargando] = useState(false)
  const { toast } = useToast()
  const { registro: registrarUsuario } = usoAutenticacion()
  const navegar = useNavigate()
  const { 
    register: registrarCampo, 
    handleSubmit: manejarEnvio, 
    formState: { errors: errores },
    watch: observar 
  } = useForm<FormularioRegistro>()

  const alEnviar = async (datos: FormularioRegistro) => {
    try {
      setCargando(true)
      await registrarUsuario(datos.nombre, datos.email, datos.password);
      toast({
        title: "Éxito",
        description: "Cuenta creada correctamente",
      })
      navegar("/iniciar-sesion")
    } catch (error: any) {
      console.log("Error de registro:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: error?.message,
      })
    } finally {
      setCargando(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-secondary p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Crear una cuenta</CardTitle>
          <CardDescription>Ingresa tus datos para comenzar</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={manejarEnvio(alEnviar)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="nombre">Nombre Completo</Label>
              <Input
                id="nombre"
                placeholder="Ingresa tu nombre completo"
                {...registrarCampo("nombre", { 
                  required: "El nombre es requerido",
                  minLength: {
                    value: 2,
                    message: "El nombre debe tener al menos 2 caracteres"
                  }
                })}
              />
              {errores.nombre && (
                <p className="text-sm text-red-600">{errores.nombre.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Correo Electrónico</Label>
              <Input
                id="email"
                type="email"
                placeholder="Ingresa tu correo electrónico"
                {...registrarCampo("email", { 
                  required: "El correo electrónico es requerido",
                  pattern: {
                    value: /^\S+@\S+$/i,
                    message: "Dirección de correo electrónico inválida"
                  }
                })}
              />
              {errores.email && (
                <p className="text-sm text-red-600">{errores.email.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Contraseña</Label>
              <Input
                id="password"
                type="password"
                placeholder="Elige una contraseña"
                {...registrarCampo("password", { 
                  required: "La contraseña es requerida",
                  minLength: {
                    value: 6,
                    message: "La contraseña debe tener al menos 6 caracteres"
                  }
                })}
              />
              {errores.password && (
                <p className="text-sm text-red-600">{errores.password.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmarPassword">Confirmar Contraseña</Label>
              <Input
                id="confirmarPassword"
                type="password"
                placeholder="Confirma tu contraseña"
                {...registrarCampo("confirmarPassword", { 
                  required: "Debes confirmar tu contraseña",
                  validate: (valor) => valor === observar('password') || "Las contraseñas no coinciden"
                })}
              />
              {errores.confirmarPassword && (
                <p className="text-sm text-red-600">{errores.confirmarPassword.message}</p>
              )}
            </div>
            <Button type="submit" className="w-full" disabled={cargando}>
              {cargando ? (
                "Cargando..."
              ) : (
                <>
                  <UserPlus className="mr-2 h-4 w-4" />
                  Crear Cuenta
                </>
              )}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button
            variant="link"
            className="text-sm text-muted-foreground"
            onClick={() => navegar("/iniciar-sesion")}
          >
            ¿Ya tienes una cuenta? Iniciar sesión
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}