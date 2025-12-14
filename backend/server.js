const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

// Importar rutas
const productRoutes = require('./routes/productRoutes');
const saleRoutes = require('./routes/saleRoutes');
const promotionRoutes = require('./routes/promotionRoutes');
const reportRoutes = require('./routes/reportRoutes');
const statisticsRoutes = require('./routes/statisticsRoutes');
const adminUserRoutes = require('./routes/adminUserRoutes');

// Supabase-only: no inicializar PostgreSQL local

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'SD Technology API is running' });
});

// Rutas API
app.use('/api/products', productRoutes);
app.use('/api/sales', saleRoutes);
app.use('/api/promotions', promotionRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/statistics', statisticsRoutes);
app.use('/api/admin/users', adminUserRoutes);

// Manejo de errores
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 SD Technology API Server running on port ${PORT}`);
  console.log(`📊 API endpoints available at http://localhost:${PORT}/api`);
  console.log(`🏗️  Architecture: MVC with Design Patterns`);
  console.log(`📦 Patterns: Singleton, Repository, Factory Method, Observer`);
});

module.exports = app;
