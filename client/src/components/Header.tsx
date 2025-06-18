import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { usoAutenticacion } from '@/contexts/Autenticacion';
import { almacenCarro } from '@/store/almacenCarroCompras';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ShoppingCart, User, Search, LogOut, Package } from 'lucide-react';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import MenuLateralCarroCompras from '@/components/MenuCarroCompras';

export default function Header() {
  const { usuario, logout } = usoAutenticacion();
  const { totalItems } = almacenCarro();
  console.log("Total Items:",totalItems)
  const [carroAbierto, setcarroAbierto] = useState(false);
  const [busquedaProducto, setBuscarProducto] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (busquedaProducto.trim()) {
      navigate(`/productos?busqueda=${encodeURIComponent(busquedaProducto.trim())}`);
      setBuscarProducto('');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <>
      <header className="border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="text-2xl font-bold">
              Tienda IPG
            </Link>

            <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-md mx-8">
              <div className="relative w-full">
                <Input
                  type="text"
                  placeholder="Buscar productos..."
                  value={busquedaProducto}
                  onChange={(e) => setBuscarProducto(e.target.value)}
                  className="pr-10"
                />
                <Button
                  type="submit"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3"
                  variant="ghost"
                >
                  <Search className="h-4 w-4" />
                </Button>
              </div>
            </form>

            <div className="flex items-center space-x-4">
              <ThemeToggle />
              
              {usuario ? (
                <>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setcarroAbierto(true)}
                    className="relative"
                  >
                    <ShoppingCart className="h-5 w-5" />
                    {totalItems > 0 && (
                      <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center text-xs">
                        {totalItems}
                      </Badge>
                    )}
                  </Button>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <User className="h-5 w-5" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Mi Cuenta</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Link to="/perfil">
                          <User className="h-4 w-4 mr-2" />
                          Perfil
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link to="/pedidos">
                          <Package className="h-4 w-4 mr-2" />
                          Pedidos
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={handleLogout}>
                        <LogOut className="h-4 w-4 mr-2" />
                        Cerrar Sesión
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </>
              ) : (
                <div className="flex items-center space-x-2">
                  <Button variant="ghost" size="sm" asChild>
                    <Link to="/iniciar-sesion">Iniciar Sesión</Link>
                  </Button>
                  <Button size="sm" asChild>
                    <Link to="/registrarse">Registrarse</Link>
                  </Button>
                </div>
              )}
            </div>
          </div>

          <form onSubmit={handleSearch} className="md:hidden mt-4">
            <div className="relative">
              <Input
                type="text"
                placeholder="Buscar productos..."
                value={busquedaProducto}
                onChange={(e) => setBuscarProducto(e.target.value)}
                className="pr-10"
              />
              <Button
                type="submit"
                size="sm"
                className="absolute right-0 top-0 h-full px-3"
                variant="ghost"
              >
                <Search className="h-4 w-4" />
              </Button>
            </div>
          </form>
        </div>
      </header>

      <MenuLateralCarroCompras estaAbierto={carroAbierto} onClose={() => setcarroAbierto(false)} />
    </>
  );
}