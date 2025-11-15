const db = require('../db');
const productRepository = require('./ProductRepository');
const saleRepository = require('./SaleRepository');
const promotionRepository = require('./PromotionRepository');

/**
 * Repository Pattern para Estadísticas
 */
class StatisticsRepository {
  async getDashboardStats() {
    const totalProducts = await db.query('SELECT COUNT(*) FROM products');
    const lowStockCount = await db.query('SELECT COUNT(*) FROM products WHERE amount < min_stock');
    const totalSales = await db.query('SELECT COUNT(*), SUM(total) as revenue FROM sales');
    const activePromos = await db.query('SELECT COUNT(*) FROM promotions WHERE active = true');
    
    return {
      totalProducts: parseInt(totalProducts.rows[0].count),
      lowStockCount: parseInt(lowStockCount.rows[0].count),
      totalSalesCount: parseInt(totalSales.rows[0].count),
      totalRevenue: parseFloat(totalSales.rows[0].revenue || 0),
      activePromosCount: parseInt(activePromos.rows[0].count)
    };
  }
}

module.exports = new StatisticsRepository();

