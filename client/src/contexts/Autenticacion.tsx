import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/useToast';
import { login as apiLogin, registrousuario as apiRegister } from '@/api/autenticacion';

interface Usuario {
  id: string;
  nombre: string;
  email: string;
}

interface TypeContextoAutenticacion {
  usuario: Usuario | null;
  cargando: boolean;
  login: (email: string, password: string) => Promise<void>;
  registro: (nombre: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

const ContextoAutenticacion = createContext<TypeContextoAutenticacion | undefined>(undefined);

export function Autenticacion({ children }: { children: ReactNode }) {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [cargando, setCargando] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const tokenAcceso = localStorage.getItem('tokenAcceso');
        const tokenRefresh = localStorage.getItem('tokenRefresh');

        if (tokenAcceso) {
          console.log('Autenticacion: Token de acceso encontrado: SÍ')
          try {
            console.log('Autenticacion: Intentando parsear token JWT...');
            const tokenParts = tokenAcceso.split('.')            
            if (tokenParts.length === 3) {
              const payload = JSON.parse(atob(tokenParts[1]))
              const dataUsuario = {
                id: payload.idUsuario,
                nombre: payload.nombre || '',
                email: payload.email || ''
              }
              console.log('Autenticacion: Estableciendo usuario desde token:', dataUsuario)
              setUsuario(dataUsuario)
            } else {
              console.log('Autenticacion: Formato de token inválido, limpiando token')
              localStorage.removeItem('tokenAcceso')
              localStorage.removeItem('tokenRefresh')
            }
          } catch (tokenError) {
            console.error('Autenticacion: Error parseando token:', tokenError)
            localStorage.removeItem('tokenAcceso')
            localStorage.removeItem('tokenRefresh')
          }
        } else {
          console.log('Autenticacion: Token de acceso encontrado: NO - usuario no autenticado')
        }
      } catch (error) {
        console.error('Autenticacion: Error inicializando autenticación:', error)
      } finally {
        setCargando(false)
      }
    };

    initializeAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setCargando(true);
      const response = await apiLogin(email, password);

      // La estructura de respuesta es { success: true, data: { usuario: {...}, tokenAcceso: "...", tokenRefresh: "..." } }
      const datosUsuario = response.data.usuario;
      const tokenAcceso = response.data.tokenAcceso;
      const tokenRefresh = response.data.tokenRefresh;

      console.log('Autenticacion: Datos de usuario:', datosUsuario);
      if (!datosUsuario || !tokenAcceso) {
        throw new Error('Respuesta inválida del servidor - faltan datos de usuario o token de acceso');
      }

      console.log('Autenticacion: Almacenando tokens en localStorage');
      localStorage.setItem('tokenAcceso', tokenAcceso);
      if (tokenRefresh) {
        localStorage.setItem('tokenRefresh', tokenRefresh);
      }

      setUsuario(datosUsuario);
      toast({
        title: "Inicio de Sesión",
        description: "¡Hola, bienvenido!",
      });
    } catch (error: any) {
      console.error('Autenticacion: Error de inicio de sesión:', error);
      toast({
        title: "Error de Inicio de Sesión",
        description: error.message || "Por favor verifica tus credenciales e intenta de nuevo.",
        variant: "destructive"
      });
      throw error;
    } finally {
      setCargando(false);
    }
  };

  const registro = async (nombre: string, email: string, password: string) => {
    try {
      setCargando(true);
      const respuesta = await apiRegister(nombre, email, password);
      // La estructura de respuesta es { success: true, data: { usuario: {...}, tokenAcceso: "..." } }
      const datosUsuario = respuesta.data.usuario;
      const tokenAcceso = respuesta.data.tokenAcceso;
      if (!datosUsuario || !tokenAcceso) {
        throw new Error('Respuesta inválida del servidor - faltan datos de usuario o token de acceso');
      }
      localStorage.setItem('tokenAcceso', tokenAcceso);
      setUsuario(datosUsuario);
      toast({
        title: "Registro Completo",
        description: "¡Bienvenido! Tu cuenta ha sido creada.",
      });
    } catch (error: any) {
      console.error('Autenticacion: Error de registro:', error);
      toast({
        title: "Error de Registro",
        description: error.message || "Por favor intenta de nuevo.",
        variant: "destructive"
      });
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('tokenAcceso');
    localStorage.removeItem('tokenRefresh');
    setUsuario(null);
    navigate('/');
    toast({
      title: "Sesión Cerrada",
      description: "Has cerrado sesión correctamente.",
    });
  };

  const value = {
    usuario,
    cargando,
    login,
    registro,
    logout
  };

  return (
    <ContextoAutenticacion.Provider value={value}>
      {children}
    </ContextoAutenticacion.Provider>
  );
}

export function usoAutenticacion() {
  const context = useContext(ContextoAutenticacion);
  if (context === undefined) {
    throw new Error('useAuth debe ser usado dentro de un Autenticacion');
  }
  return context;
}