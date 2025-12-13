# 🔗 PRUEBAS DE INTEGRACIÓN - 35 CASOS

## COMUNICACIÓN ENTRE CAPAS VALIDADAS:

### Capa 1: Frontend ↔ Backend API (15 pruebas)
1. **Autenticación Flow** (3 pruebas)
   - Login → Token → Auth headers
   - Refresh token automático
   - Logout y limpieza sesión

2. **Productos API** (5 pruebas)
   - GET /api/products → Render lista
   - POST /api/products → Actualización UI
   - PUT/DELETE → Sync en tiempo real

3. **Ventas API** (4 pruebas)
   - POST /api/sales → Actualización stock
   - GET /api/sales/reports → Generación reportes

4. **Upload/Download** (3 pruebas)
   - Subida archivos Excel
   - Descarga reportes PDF
   - Imágenes productos

### Capa 2: Servicios ↔ Base Datos (10 pruebas)
1. **Conexión PostgreSQL** (3 pruebas)
   - Pool connections
   - Transactions rollback
   - Query optimization

2. **Modelos Sequelize** (4 pruebas)
   - Validaciones datos
   - Hooks y triggers
   - Relaciones (associations)

3. **Repository Pattern** (3 pruebas)
   - Abstract layer
   - Data mapping
   - Cache layer

### Capa 3: Sistema ↔ APIs Externas (10 pruebas)
1. **Pagos Online** (4 pruebas)
   - Stripe/PayPal integration
   - Webhooks handling
   - Payment status sync

2. **Email Service** (3 pruebas)
   - SendGrid/Twilio
   - Templates rendering
   - Queue system

3. **Cloud Storage** (3 pruebas)
   - AWS S3 upload
   - CDN delivery
   - File permissions