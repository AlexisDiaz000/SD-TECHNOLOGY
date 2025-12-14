# SD Technology - Sistema de Gestión de Inventario

Actualización de despliegue: todo corre en Vercel con funciones serverless y Supabase. Abajo se detallan cambios, estructura y variables para reproducir el trabajo.

## Cambios Clave
- Migración del backend a funciones serverless bajo `/api/*` en Vercel.
- Integración con Supabase: el frontend usa la `anon key` y las funciones usan la `service role key`.
- `VITE_API_URL` ahora apunta por defecto a `/api`, evitando CORS.
- `vercel.json` preserva `/api/*` y habilita SPA rewrites.
- Panel de administración usa `/api/admin/users/*` con `SUPABASE_SERVICE_ROLE_KEY`.

## Estructura de Carpetas (actualizada)
```
sd-technology/
├── api/
│   ├── _lib/
│   │   └── supabaseClient.js
│   ├── health.js
│   └── admin/
│       └── users/
│           ├── index.js
│           ├── [id].js
│           └── health.js
├── src/
│   ├── services/
│   │   ├── api.js               # base: /api
│   │   ├── adminUsers.js        # /api/admin/users
│   │   └── supabase.js          # cliente anon
├── vercel.json
├── package.json
├── vite.config.js
└── README.md
```


## Despliegue en Vercel
- Root Directory: `sd-technology`
- Build Command: `npm run build`
- Output Directory: `dist`


## API Serverless
- `GET /api/health`
- `GET/POST /api/admin/users`
- `PATCH/DELETE /api/admin/users/:id`

## Flujo de Datos
- Frontend directo a Supabase:
  - Autenticación y CRUD de módulos se realizan con el cliente `@supabase/supabase-js` configurado en `src/services/supabase.js` usando la `anon key`.
  - Ejemplo: crear producto → React llama `supabase.from('products').insert(...)` y guarda con `created_by` del usuario autenticado.
- Frontend a API serverless:
  - Acciones de administración (crear/borrar usuarios, actualizar perfiles) pasan por `/api/admin/users/*` porque requieren la `service role key`.
  - Las funciones leen `SUPABASE_SERVICE_ROLE_KEY`, ejecutan `supabase.auth.admin.*` y actualizan la tabla `profiles`.
- Secuencia típica:
  - Login: Front → Supabase Auth (anon) → sesión del usuario.
  - Operaciones de negocio: Front → Supabase (anon, RLS habilitada) → tablas `products`, `sales`, `promotions`, `reports`.
  - Administración: Front → `/api/admin/users/*` (serverless) → Supabase Admin (service role) → `auth.users` y `profiles`.

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
