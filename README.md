# SD Technology - Sistema de Gestión de Inventario

SD Technology es una solución digital inteligente diseñada para transformar la manera en que gestionas tu inventario. Esta aplicación web permite a los usuarios gestionar productos, ventas, promociones y generar reportes de manera eficiente.

## 🚀 Características

- **Gestión de Inventario (Stock)**: Administra productos, categorías, stock mínimo y proveedores
- **Gestión de Ventas**: Registra ventas, genera tickets y gestiona clientes
- **Promociones**: Crea y gestiona promociones con descuentos y períodos de vigencia
- **Reportes**: Genera reportes de ventas, inventario, promociones y reportes generales
- **Dashboard**: Visualiza estadísticas en tiempo real del negocio
- **Notificaciones Automáticas**: Alertas de stock bajo y activación de promociones

## 🛠️ Tecnologías Utilizadas

### Frontend
- **React 18.2.0**: Biblioteca de JavaScript para construir interfaces de usuario
- **Vite 4.4.5**: Herramienta de construcción rápida para desarrollo frontend
- **React Router 6.16.0**: Enrutamiento para aplicaciones React
- **TailwindCSS 3.3.3**: Framework de CSS utility-first
- **Framer Motion 10.16.4**: Biblioteca de animaciones para React
- **Lucide React 0.285.0**: Iconos modernos
- **Radix UI**: Componentes de UI accesibles

### Backend
- **Node.js**: Entorno de ejecución de JavaScript
- **Express.js 4.18.2**: Framework web para Node.js
- **PostgreSQL**: Base de datos relacional
- **pg 8.11.3**: Cliente PostgreSQL para Node.js
- **dotenv 16.3.1**: Gestión de variables de entorno
- **uuid 9.0.1**: Generación de identificadores únicos

## 📁 Estructura del Proyecto

```
SD-TECHNOLOGY/
├── backend/                    # Servidor backend
│   ├── controllers/           # Controladores (lógica de negocio)
│   │   ├── ProductController.js
│   │   ├── SaleController.js
│   │   ├── PromotionController.js
│   │   ├── ReportController.js
│   │   └── StatisticsController.js
│   ├── models/                # Modelos de datos
│   │   ├── Product.js
│   │   ├── Sale.js
│   │   ├── Promotion.js
│   │   └── Report.js
│   ├── repositories/          # Repositorios (acceso a datos)
│   │   ├── ProductRepository.js
│   │   ├── SaleRepository.js
│   │   ├── PromotionRepository.js
│   │   ├── ReportRepository.js
│   │   └── StatisticsRepository.js
│   ├── routes/                # Rutas de la API
│   │   ├── productRoutes.js
│   │   ├── saleRoutes.js
│   │   ├── promotionRoutes.js
│   │   ├── reportRoutes.js
│   │   └── statisticsRoutes.js
│   ├── patterns/              # Patrones de diseño
│   │   ├── Observer.js        # Observer Pattern
│   │   └── ReportFactory.js   # Factory Method Pattern
│   ├── services/              # Servicios
│   │   └── NotificationService.js
│   ├── db.js                  # Singleton para conexión a BD
│   ├── server.js              # Servidor principal
│   ├── database.sql           # Script de creación de BD
│   ├── package.json
│   └── .env                   # Variables de entorno (crear)
│
├── src/                       # Código fuente del frontend
│   ├── components/           # Componentes reutilizables
│   │   ├── ui/              # Componentes de UI
│   │   └── ModuleLayout.jsx
│   ├── services/            # Servicios del frontend
│   │   └── api.js          # Cliente API
│   ├── views/              # Páginas/Vistas
│   │   ├── WelcomePage.jsx
│   │   ├── LoginPage.jsx
│   │   ├── RegisterPage.jsx
│   │   ├── DashboardPage.jsx
│   │   ├── StockPage.jsx
│   │   ├── SalesPage.jsx
│   │   ├── PromoPage.jsx
│   │   └── ReportPage.jsx
│   ├── App.jsx             # Componente principal
│   ├── main.jsx            # Punto de entrada
│   └── index.css           # Estilos globales
│
├── package.json            # Dependencias del frontend
├── vite.config.js         # Configuración de Vite
├── tailwind.config.js     # Configuración de TailwindCSS
└── README.md              # Este archivo
```

## 🏗️ Arquitectura

El proyecto sigue una arquitectura **MVC (Model-View-Controller)** con los siguientes patrones de diseño:

### Patrones Implementados

1. **Singleton Pattern** (`backend/db.js`)
   - Garantiza una única instancia de conexión a la base de datos
   - Evita múltiples conexiones innecesarias

2. **Repository Pattern** (`backend/repositories/`)
   - Abstrae las operaciones de base de datos
   - Facilita la migración futura a otras bases de datos (ej: Supabase)
   - Separa la lógica de acceso a datos del resto de la aplicación

3. **Factory Method Pattern** (`backend/patterns/ReportFactory.js`)
   - Crea diferentes tipos de reportes según su tipo
   - Permite agregar nuevos tipos de reportes sin modificar código existente

4. **Observer Pattern** (`backend/patterns/Observer.js`)
   - Maneja notificaciones automáticas
   - Notifica cambios en inventario (stock bajo)
   - Notifica activación de promociones

### Flujo de Datos

```
Frontend (React) 
    ↓
API Service (src/services/api.js)
    ↓
Backend Routes (backend/routes/)
    ↓
Controllers (backend/controllers/)
    ↓
Repositories (backend/repositories/)
    ↓
Database (PostgreSQL)
```

## 📋 Requisitos Previos

Antes de comenzar, asegúrate de tener instalado:

- **Node.js** (v16 o superior) - [Descargar](https://nodejs.org/)
- **PostgreSQL** (v12 o superior) - [Descargar](https://www.postgresql.org/download/)
- **npm** o **yarn** (viene con Node.js)
- **Git** - [Descargar](https://git-scm.com/)

## 🔧 Instalación

### 1. Clonar el Repositorio

```bash
git clone <url-del-repositorio>
cd SD-TECHNOLOGY
```

### 2. Instalar Dependencias del Frontend

```bash
npm install
```

### 3. Instalar Dependencias del Backend

```bash
cd backend
npm install
cd ..
```

### 4. Configurar Base de Datos PostgreSQL

1. **Crear la base de datos**:

```sql
CREATE DATABASE sd_technology;
```

2. **Ejecutar el script de creación de tablas**:

```bash
# Opción 1: Desde psql
psql -U postgres -d sd_technology -f backend/database.sql

# Opción 2: Desde pgAdmin o cualquier cliente PostgreSQL
# Abre backend/database.sql y ejecuta el contenido
```

### 5. Configurar Variables de Entorno

Crea un archivo `.env` en la carpeta `backend/`:

```env
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=sd_technology
DB_USER=postgres
DB_PASSWORD=tu_contraseña_postgres

# Server Configuration
PORT=5000
NODE_ENV=development
```

**Nota**: Reemplaza `tu_contraseña_postgres` con tu contraseña real de PostgreSQL.

### 6. (Opcional) Configurar URL del Backend en Frontend

Si el backend no está en `http://localhost:5000`, crea un archivo `.env` en la raíz del proyecto:

```env
VITE_API_URL=http://localhost:5000/api
```

## 🚀 Ejecutar el Proyecto

### Desarrollo

Necesitas ejecutar tanto el frontend como el backend en terminales separadas:

#### Terminal 1 - Backend

```bash
cd backend
npm start
# o para desarrollo con auto-reload:
npm run dev
```

El backend estará disponible en: `http://localhost:5000`

#### Terminal 2 - Frontend

```bash
npm run dev
```

El frontend estará disponible en: `http://localhost:3000`

### Producción

#### Build del Frontend

```bash
npm run build
```

Los archivos compilados estarán en la carpeta `dist/`.

#### Preview del Build

```bash
npm run preview
```

## 📡 API Endpoints

### Productos (Stock)

- `GET /api/products` - Obtener todos los productos
- `GET /api/products/:id` - Obtener producto por ID
- `POST /api/products` - Crear nuevo producto
- `PUT /api/products/:id` - Actualizar producto
- `DELETE /api/products/:id` - Eliminar producto
- `GET /api/products/low-stock/alert` - Productos con stock bajo

### Ventas

- `GET /api/sales` - Obtener todas las ventas
- `GET /api/sales/:id` - Obtener venta por ID
- `POST /api/sales` - Crear nueva venta
- `DELETE /api/sales/:id` - Eliminar venta

### Promociones

- `GET /api/promotions` - Obtener todas las promociones
- `GET /api/promotions/:id` - Obtener promoción por ID
- `POST /api/promotions` - Crear nueva promoción
- `PUT /api/promotions/:id` - Actualizar promoción
- `PATCH /api/promotions/:id/toggle` - Activar/Desactivar promoción
- `DELETE /api/promotions/:id` - Eliminar promoción

### Reportes

- `GET /api/reports` - Obtener todos los reportes
- `GET /api/reports/:id` - Obtener reporte por ID
- `POST /api/reports` - Crear nuevo reporte
- `DELETE /api/reports/:id` - Eliminar reporte

### Estadísticas

- `GET /api/statistics/dashboard` - Estadísticas del dashboard

### Health Check

- `GET /api/health` - Verificar estado del servidor

## 🗄️ Base de Datos

### Tablas

1. **products**: Almacena información de productos
2. **sales**: Registra todas las ventas realizadas
3. **promotions**: Gestiona promociones y descuentos
4. **reports**: Almacena reportes generados

### Datos de Ejemplo

El script `backend/database.sql` incluye datos de ejemplo para probar la aplicación:
- 4 productos de ejemplo
- 4 ventas de ejemplo
- 3 promociones de ejemplo
- 4 reportes de ejemplo

## 🧪 Probar la Aplicación

1. **Iniciar el backend**:
   ```bash
   cd backend
   npm start
   ```

2. **Iniciar el frontend**:
   ```bash
   npm run dev
   ```

3. **Abrir el navegador**:
   - Ve a `http://localhost:3000`
   - Navega por las diferentes secciones
   - Prueba crear, editar y eliminar productos, ventas y promociones

4. **Verificar la API**:
   - Visita `http://localhost:5000/api/health` para verificar que el backend está funcionando
   - Prueba los endpoints con Postman o cualquier cliente HTTP

## 🔍 Solución de Problemas

### Error de conexión a la base de datos

- Verifica que PostgreSQL esté ejecutándose
- Confirma que las credenciales en `.env` sean correctas
- Asegúrate de que la base de datos `sd_technology` exista

### Error CORS

- El backend ya tiene CORS habilitado
- Si persiste, verifica que el frontend esté apuntando a la URL correcta

### Puerto ya en uso

- Cambia el puerto en `backend/.env` (PORT) o `vite.config.js` (frontend)
- O detén el proceso que está usando el puerto

## 📝 Notas Adicionales

- El login actualmente es simulado (no requiere autenticación real)
- Las notificaciones se muestran en la consola del servidor
- Los reportes se pueden descargar en formato JSON


## 📄 Licencia

Este proyecto es de código abierto y está disponible bajo la licencia MIT.

## 👥 Autores

- Equipo
- ALEXIS DIAZ
- SARA ROJAS
- YORQUIS MURRILLO

## 🙏 Agradecimientos

- A todos los contribuyentes 

---

**¡Gracias por usar SD Technology!** 🚀

Para más información o soporte, abre un issue en el repositorio.
