import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Autenticacion } from '@/contexts/Autenticacion';
import { ThemeProvider } from '@/components/ui/theme-provider';
import { Toaster } from '@/components/ui/toaster';
import Layout from '@/components/Layout';
import {ProtectedRoute} from '@/components/ProtectedRoute';
import {Inicio} from '@/pages/Inicio';
import {Login} from '@/pages/Login';
import {Registro} from '@/pages/Registro';
import {Productos} from '@/pages/Productos';
import {DetalleProducto} from '@/pages/DetalleProducto';
import Checkout from '@/pages/Pagar';
import {Orders} from '@/pages/Pedidos';
import {OrderDetail} from '@/pages/DetallePedido';
import {Profile} from '@/pages/Perfil';
import './App.css';

function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
      <Router>
        <Autenticacion>
          <Layout>
            <Routes>
              <Route path="/" element={<Inicio />} />
              <Route path="/iniciar-sesion" element={<Login />} />
              <Route path="/registrarse" element={<Registro />} />
              <Route path="/productos" element={<Productos />} />
              <Route path="/productos/:id" element={<DetalleProducto />} />
              
              <Route
                path="/pagar"
                element={
                  <ProtectedRoute>
                    <Checkout />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/pedidos"
                element={
                  <ProtectedRoute>
                    <Orders />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/pedidos/:id"
                element={
                  <ProtectedRoute>
                    <OrderDetail />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/perfil"
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </Layout>
        </Autenticacion>
      </Router>
      <Toaster />
    </ThemeProvider>
  );
}

export default App;