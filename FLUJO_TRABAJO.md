# Flujo de Trabajo - SD Technology

## 📋 Resumen del Proyecto

SD Technology es una aplicación web para gestión de inventario que consta de:
- **Frontend**: React + Vite + TailwindCSS (Puerto 3000)
- **Backend**: Express.js + PostgreSQL (Puerto 5000)
- **Base de Datos**: PostgreSQL

## 🔄 Flujo de Navegación de la Aplicación

### 1. **Página de Bienvenida** (`/`)
- **Archivo**: `src/views/WelcomePage.jsx`
- **Descripción**: Página inicial que presenta la aplicación
- **Acciones**: 
  - Botón "Inicio" que navega a `/register`

### 2. **Página de Registro** (`/register`)
- **Archivo**: `src/views/RegisterPage.jsx`
- **Descripción**: Permite a los usuarios registrarse
- **Acciones**:
  - Formulario de registro
  - Navegación a `/login`

### 3. **Página de Login** (`/login`)
- **Archivo**: `src/views/LoginPage.jsx`
- **Descripción**: Autenticación de usuarios
- **Estado Actual**: 
  - ⚠️ **NO CONECTADO AL BACKEND** - Solo valida campos localmente
  - Redirige a `/dashboard` sin autenticación real
- **Acciones**:
  - Formulario de email y contraseña
  - Navegación a `/dashboard` al hacer login

### 4. **Dashboard Principal** (`/dashboard`)
- **Archivo**: `src/views/DashboardPage.jsx`
- **Descripción**: Panel principal con acceso a todos los módulos
- **Módulos Disponibles**:
  1. **Stock** (`/stock`) - Gestión de inventario
  2. **Promo** (`/promo`) - Gestión de promociones
  3. **Sales** (`/sales`) - Gestión de ventas
  4. **Report** (`/report`) - Generación de reportes
- **Acciones**:
  - Navegación a cada módulo
  - Botón de logout que regresa a `/`

### 5. **Módulo de Stock** (`/stock`)
- **Archivo**: `src/views/StockPage.jsx`
- **Descripción**: Gestión de productos e inventario
- **Estado Actual**: 
  - ⚠️ **NO CONECTADO AL BACKEND** - Usa datos estáticos en estado local
  - Datos hardcodeados en el componente
- **Funcionalidades**:
  - Listar productos
  - Agregar nuevo producto
  - Editar producto existente
  - Eliminar producto
  - Buscar por nombre o categoría
  - Alerta de stock bajo

### 6. **Módulo de Promociones** (`/promo`)
- **Archivo**: `src/views/PromoPage.jsx`
- **Descripción**: Gestión de promociones y descuentos
- **Estado Actual**: 
  - ⚠️ **NO CONECTADO AL BACKEND** - Usa datos estáticos
- **Funcionalidades**:
  - Listar promociones
  - Crear nueva promoción
  - Editar promoción
  - Eliminar promoción
  - Activar/Desactivar promoción
  - Ver detalles de promoción

### 7. **Módulo de Ventas** (`/sales`)
- **Archivo**: `src/views/SalesPage.jsx`
- **Descripción**: Gestión de ventas y tickets
- **Estado Actual**: 
  - ⚠️ **NO CONECTADO AL BACKEND** - Usa datos estáticos
- **Funcionalidades**:
  - Listar ventas
  - Crear nueva venta
  - Ver detalle de venta (ticket)
  - Buscar por producto o número de ticket
  - Cálculo automático de impuestos (6.25%)

### 8. **Módulo de Reportes** (`/report`)
- **Archivo**: `src/views/ReportPage.jsx`
- **Descripción**: Generación y visualización de reportes
- **Estado Actual**: 
  - ⚠️ **NO CONECTADO AL BACKEND** - Usa datos estáticos
- **Funcionalidades**:
  - Listar reportes
  - Generar nuevo reporte
  - Ver detalles de reporte
  - Descargar reporte (simulado)

## 🗄️ Estructura de la Base de Datos

### Tablas Principales:

1. **products** - Productos e inventario
   - Campos: id, name, category, amount, price, min_stock, supplier, created_at, updated_at

2. **sales** - Ventas realizadas
   - Campos: id, product, quantity, price, total, ticket_number, client, payment_method, subtotal, tax, warranty, sale_date, sale_time, created_at

3. **promotions** - Promociones activas
   - Campos: id, name, discount, active, start_date, end_date, description, applicable_categories, created_at, updated_at

4. **reports** - Reportes generados
   - Campos: id, title, type, report_date, status, description, period, total_sales, revenue, total_products, low_stock_items, active_promos, total_discount, created_at

## 🔌 API Endpoints Disponibles (Backend)

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
- `DELETE /api/promotions/:id` - Eliminar promoción
- `PATCH /api/promotions/:id/toggle` - Activar/Desactivar promoción

### Reportes
- `GET /api/reports` - Obtener todos los reportes
- `GET /api/reports/:id` - Obtener reporte por ID
- `POST /api/reports` - Crear nuevo reporte
- `DELETE /api/reports/:id` - Eliminar reporte

### Estadísticas
- `GET /api/statistics/dashboard` - Estadísticas del dashboard

## ⚠️ Estado Actual de la Conexión Frontend-Backend

### Problemas Identificados:

1. **❌ No hay servicio de API configurado**
   - No existe un archivo de configuración para la URL del backend
   - No hay utilidades para hacer llamadas HTTP (fetch/axios)

2. **❌ Todas las páginas usan datos estáticos**
   - `StockPage`: Datos hardcodeados en `useState`
   - `SalesPage`: Datos hardcodeados en `useState`
   - `PromoPage`: Datos hardcodeados en `useState`
   - `ReportPage`: Datos hardcodeados en `useState`
   - `LoginPage`: No hace llamada al backend para autenticación

3. **❌ No hay manejo de errores de API**
   - No hay try-catch para llamadas HTTP
   - No hay manejo de estados de carga

4. **✅ Backend está completo y funcional**
   - Todos los endpoints están implementados
   - Base de datos configurada con esquema SQL
   - CORS habilitado para comunicación con frontend

## 📝 Próximos Pasos para Completar la Conexión

1. **Crear servicio de API** (`src/services/api.js`)
   - Configurar URL base del backend
   - Crear funciones para cada endpoint
   - Manejo de errores

2. **Conectar LoginPage**
   - Implementar autenticación real
   - Manejo de tokens/sesiones

3. **Conectar StockPage**
   - Reemplazar datos estáticos con llamadas a `/api/products`
   - Implementar CRUD completo

4. **Conectar SalesPage**
   - Reemplazar datos estáticos con llamadas a `/api/sales`
   - Implementar creación de ventas

5. **Conectar PromoPage**
   - Reemplazar datos estáticos con llamadas a `/api/promotions`
   - Implementar CRUD completo

6. **Conectar ReportPage**
   - Reemplazar datos estáticos con llamadas a `/api/reports`
   - Implementar generación de reportes

7. **Conectar DashboardPage**
   - Obtener estadísticas de `/api/statistics/dashboard`

## 🚀 Cómo Ejecutar el Proyecto

### Frontend:
```bash
cd SD-TECHNOLOGY
npm install
npm run dev
```
Frontend disponible en: http://localhost:3000

### Backend:
```bash
cd backend
npm install
# Crear archivo .env con las credenciales de PostgreSQL
npm start  # o npm run dev para desarrollo con nodemon
```
Backend disponible en: http://localhost:5000

### Base de Datos:
1. Instalar PostgreSQL
2. Crear base de datos: `sd_technology`
3. Ejecutar `backend/database.sql` para crear las tablas
4. Configurar credenciales en `backend/.env`

## 📁 Estructura de Carpetas

```
SD-TECHNOLOGY/
├── backend/
│   ├── db.js              # Configuración de PostgreSQL
│   ├── server.js          # Servidor Express con todos los endpoints
│   ├── database.sql       # Esquema de base de datos
│   ├── package.json
│   └── .env              # Variables de entorno (crear manualmente)
├── src/
│   ├── views/            # Páginas principales
│   │   ├── WelcomePage.jsx
│   │   ├── LoginPage.jsx
│   │   ├── RegisterPage.jsx
│   │   ├── DashboardPage.jsx
│   │   ├── StockPage.jsx
│   │   ├── SalesPage.jsx
│   │   ├── PromoPage.jsx
│   │   └── ReportPage.jsx
│   ├── components/       # Componentes reutilizables
│   ├── lib/             # Utilidades
│   └── App.jsx          # Router principal
├── controller/          # (Vacía - para implementar MVC)
├── models/             # (Vacía - para implementar MVC)
└── package.json
```

## 🔧 Configuración Requerida

### Archivo `.env` en `backend/`:
```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=sd_technology
DB_USER=postgres
DB_PASSWORD=postgres
PORT=5000
NODE_ENV=development
```

