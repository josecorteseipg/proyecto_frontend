import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2 } from "lucide-react";
import { usoAutenticacion } from "@/contexts/Autenticacion";

interface FormularioLogin {
  email: string;
  password: string;
}

export function Login() {
  const [error, setError] = useState<string>("");
  const [estaCargando, setEstaCargando] = useState(false);
  const { login } = usoAutenticacion();
  const navegar = useNavigate();

  const {
    register: registrarCampo,
    handleSubmit: handleLogin,
    formState: { errors: errores },
  } = useForm<FormularioLogin>();

  const alEnviar = async (datos: FormularioLogin) => {
    setEstaCargando(true);
    setError("");

    try {
      await login(datos.email, datos.password);     
      navegar("/");
    } catch (err: any) {
      console.error('Error Login:', err);
      setError(err.message || "Error al iniciar sesión. Por favor intenta de nuevo.");
    } finally {
      setEstaCargando(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Iniciar Sesión</CardTitle>
          <CardDescription className="text-center">
            Ingresa tu correo electrónico y contraseña para acceder a tu cuenta
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin(alEnviar)} className="space-y-4">
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
                    message: "Dirección de correo electrónico inválida",
                  },
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
                placeholder="Ingresa tu contraseña"
                {...registrarCampo("password", {
                  required: "La contraseña es requerida",
                  minLength: {
                    value: 6,
                    message: "La contraseña debe tener al menos 6 caracteres",
                  },
                })}
              />
              {errores.password && (
                <p className="text-sm text-red-600">{errores.password.message}</p>
              )}
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Button type="submit" className="w-full" disabled={estaCargando}>
              {estaCargando && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Iniciar Sesión
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              ¿No tienes una cuenta?{" "}
              <Link
                to="/registrarse"
                className="font-medium text-blue-600 hover:text-blue-500"
              >
                Registrarse
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}