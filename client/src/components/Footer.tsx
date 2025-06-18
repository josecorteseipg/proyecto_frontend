import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-background border-t">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Tienda IPG</h3>
            <p className="text-sm text-muted-foreground">
              Este es un sitio de comercio electrónico desarrollado para asignatura FrontEnd, IPG 2025<br/>Autor: José Luis Cortese B.
            </p>
          </div>
          
          <div className="space-y-4">
            <h4 className="font-semibold">Tienda</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/productos" className="text-muted-foreground hover:text-foreground">
                  Todos los Productos
                </Link>
              </li>
              <li>
                <Link to="/productos?categoria=electronicos" className="text-muted-foreground hover:text-foreground">
                  Electrónicos
                </Link>
              </li>
              <li>
                <Link to="/productos?categoria=ropa" className="text-muted-foreground hover:text-foreground">
                  Ropa
                </Link>
              </li>
              <li>
                <Link to="/productos?categoria=hogar" className="text-muted-foreground hover:text-foreground">
                  Hogar y Jardín
                </Link>
              </li>
            </ul>
          </div>
          
          <div className="space-y-4">
            <h4 className="font-semibold">Cuenta</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/perfil" className="text-muted-foreground hover:text-foreground">
                  Mi Perfil
                </Link>
              </li>
              <li>
                <Link to="/pedidos" className="text-muted-foreground hover:text-foreground">
                  Mis Pedidos
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
          <p>IPG 2025, Ingeniería en Ciencias de Datos - Tienda IPG APP. Desarrollado para asignatura FrontEnd, por José Luis Cortese B.</p>
        </div>
      </div>
    </footer>
  );
}