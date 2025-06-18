# Tienda IPG - Carrito de Compras con Autenticación

Proyecto de Interfaz de Usuario Avanzada - Asignatura Frontend  
Autor: José Luis Cortese Bustos  
Carrera: Ingeniería en Ciencias de Datos - IPG 2025

## Instalación y Ejecución
### Requisitos
- Node.js
- MongoDB
- npm

### 1. Clonar el repositorio
- git clone https://github.com/josecorteseipg/proyecto_frontend.git
- cd proyectofrontend
### 2. Configurar el Backend
#### Navegar al directorio del servidor (api, backend)
cd server
#### Instalar dependencias
npm install
#### Si arroja errores de instalación, forzar con -f
npm install -f

#### Crear archivo .env con las siguientes variables:

- URL_BASEDATOS=mongodb://127.0.0.1:27017/ipg-proyecto-frontend-jlc
- JWT_CLAVE_SECRETA=clave-secreta-jwt
- JWT_TOKEN_REFRESH=clave-refresh-jwt
- PORT=3000

#### Ejecutar el servidor
npm run dev
### 3. Configurar el Frontend
#### En terminal (nueva ventana de terminal), navegar al directorio del cliente (frontend)
cd client
#### Instalar dependencias
npm install
#### Si arroja errores de instalación, forzar con -f
npm install -f
#### Ejecutar la aplicación
npm run dev

### 4. Acceso a la aplicación
- Frontend: http://localhost:5173
- Backend: http://localhost:3000
- Usuario administrador creado automáticamente:
  - Email: admin@tiendaipg.cl
  - Contraseña: admin123
## Base de Datos
Al ejecutar el servidor por primera vez se:
- Conecta a MongoDB
- Crea un usuario administrador
- Carga 10 productos de ejemplo automáticamente

# Documentación Técnica
## Arquitectura del Proyecto
### Stack Tecnológico
Frontend:
- React 18.3.1 con TypeScript
- Vite como bundler o empaquetador
- Tailwind CSS para estilos (https://tailwindcss.com/docs/installation/using-vite)
- radix-ui para componentes (conjunto de componentes de interfaz de usuario -  https://www.radix-ui.com/)
- Zustand para gestión de estado del carrito
- React Router DOM para enrutamiento
- React Hook Form para formularios

Backend:
- Node.js con Express
- MongoDB con Mongoose
- JWT para autenticación
- bcrypt para encriptación de contraseñas
- CORS para comunicación (intercambio de recursos) entre origenes

## Flujo de la Aplicación
### 1. Autenticación
Usuario → Login/Registro → JWT Token → Acceso a funcionalidades protegidas (Carro de compras y Proceso de pedido)
### 2. Navegación de Productos
Inicio → Lista de Productos → Filtros/Búsqueda → Detalle de Producto → Agregar al Carrito
### 3. Proceso de Compra
Carrito → Pagar → Información de Envío → Pago → Confirmación de Pedido
### 4. Gestión de Usuario
Perfil → Información Personal → Direcciones → Historial de Pedidos

## Componentes Principales
### Frontend
#### Páginas (src/pages/)
- Inicio.tsx - Landing page (pagina inicial) con productos destacados
- Login.tsx / Registro.tsx - Autenticación y Registro de usuarios
- Productos.tsx - Catálogo con filtros y búsqueda
- DetalleProducto.tsx - Vista detallada del producto
- Pagar.tsx - Proceso de pago de carrito de compras
- Pedidos.tsx / DetallePedido.tsx - Gestión de pedidos
- Perfil.tsx - Configuración de usuario

#### Componentes Principales (src/components/)
- Layout.tsx - Estructura base de la aplicación
- Header.tsx - Navegación y carrito
- Footer.tsx - Pie de página
- ProtectedRoute.tsx - Protección de rutas autenticadas
- TarjetaProducto.tsx - Tarjeta de producto reutilizable
- ProductosFiltrados.tsx - Sistema de filtros
- MenuCarroCompras.tsx - Sidebar del carrito

#### Gestión de Estado
- almacenCarroCompras.ts - Store de Zustand para el carrito
- Autenticacion.tsx - Context para autenticación

#### Servicios API (src/api/)
- autenticacion.ts - Login, registro, refresh tokens
- productos.ts - CRUD de productos (Crear (Create), Leer (Read), Actualizar (Update) y Eliminar (Delete))
- pedidos.ts - Gestión de órdenes
- usuarios.ts - Perfil y direcciones

### Backend
#### Modelos (models/)
- Usuario.js - Esquema de usuarios con direcciones
- Productos.js - Esquema de productos con especificaciones
- Pedidos.js - Esquema de órdenes con items

#### Servicios (servicios/)
- usuarios.js - Procesos y funciones de usuarios
- productos.js - Procesos y funciones de productos
- pedidos.js - Procesos y funciones de pedidos

#### Rutas (routes/)
- rutasAcceso.js - Endpoints de autenticación
- rutasProductos.js - Endpoints de productos
- rutaPedidos.js - Endpoints de pedidos
- rutasUsuario.js - Endpoints de perfil

## Decisiones de Diseño
### 1. Separación Frontend/Backend
- Decisión: Arquitectura completamente separada
- Justificación: Escalabilidad, mantenibilidad
### 2. Gestión de Estados
- React Context: Para autenticación global
- Zustand: Para carrito de compras (persistencia local en navegador)
### 3. Autenticación JWT con Refresh Tokens
- Decisión: Access token (1 día) + Refresh token (1 hora)
- Justificación: Balance entre seguridad y experiencia de usuario

### 4. Diseño Component-First
- Decisión: Componentes reutilizables con Shadcn/ui (https://ui.shadcn.com/docs)
- Justificación: Consistencia visual, desarrollo rápido, accesibilidad

### 5. TypeScript en Frontend
- Decisión: Tipado estricto en React
- Justificación: Prevención de errores, mejor experiencia de desarrollo

### 6. Validación de Datos Doble
- Frontend: React Hook Form + validación en tiempo real (https://react-hook-form.com/)
- Backend: Validación de modelos Mongoose (https://mongoosejs.com/docs/validation.html)
- Justificación: UX fluida + seguridad robusta

## Seguridad Implementada

- Encriptación de contraseñas con bcrypt (https://www.npmjs.com/package/bcrypt)
- JWT con rotación de refresh tokens (https://dev.to/eidorianavi/authentication-and-jwt-in-node-js-4i13)
- Validación de entrada en frontend y backend
- Middleware de autenticación para rutas protegidas (https://expressjs.com/es/guide/using-middleware.html)
- CORS configurado para cliente específico (localhost:5173)

## Características Implementadas
### Funcionalidades Completadas

- Registro y autenticación de usuarios
- Catálogo de productos con filtros y búsqueda
- Carrito de compras persistente (se guarda localmente con zustand)
- Proceso de compra
- Gestión de perfil y direcciones
- Diseño responsive
- Modo oscuro/claro (con Vite: https://dev.to/ashsajal/implementing-lightdark-mode-in-your-vite-app-with-shadcnui-1ae4 - https://ui.shadcn.com/docs/dark-mode/vite)
- Navegación SPA
- API REST

### Cumplimiento de Requisitos

- SPA: React Router sin recarga de página
- Autenticación: JWT con rutas protegidas
- API RESTful: Backend Express con endpoints REST
- Gestión de Estado: Context + Zustand
- Rutas Dinámicas: Navegación SPA
- Diseño Responsive: Tailwind CSS (https://tailwindcss.com/docs/installation/using-vite)
