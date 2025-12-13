const db = require('../db');
const { supabase } = require('../supabaseClient');
const productRepository = require('./ProductRepository');
const saleRepository = require('./SaleRepository');
const promotionRepository = require('./PromotionRepository');

/**
 * Repository Pattern para Estadísticas
 */
class StatisticsRepository {
  async getDashboardStats() {
    if (supabase) {
      const [{ count: productsCount }, { data: productsData }, { count: salesCount, data: salesData }, { count: activePromosCount }] = await Promise.all([
        supabase.from('products').select('*', { count: 'exact', head: true }),
        supabase.from('products').select('amount,min_stock'),
        supabase.from('sales').select('total', { count: 'exact' }),
        supabase.from('promotions').select('*', { count: 'exact' }).eq('active', true),
      ]).then(async (results) => {
        const [prodCountRes, productsRes, salesRes, promosRes] = results;
        const revenue = (salesRes.data || []).reduce((sum, row) => sum + (parseFloat(row.total) || 0), 0);
        const lowStock = (productsRes.data || []).filter(p => (p.amount ?? 0) < (p.min_stock ?? 0)).length;
        return [
          { count: prodCountRes.count || 0 },
          { data: productsRes.data || [] },
          { count: salesRes.count || 0, data: salesRes.data || [] },
          { count: promosRes.count || 0 },
          { revenue, lowStock },
        ];
      }).catch(() => [{ count: 0 }, { data: [] }, { count: 0, data: [] }, { count: 0 }, { revenue: 0, lowStock: 0 }]);
      const revenue = (salesData || []).reduce((sum, row) => sum + (parseFloat(row.total) || 0), 0);
      const lowStock = (productsData || []).filter(p => (p.amount ?? 0) < (p.min_stock ?? 0)).length;
      return {
        totalProducts: productsCount || 0,
        lowStockCount: lowStock,
        totalSalesCount: salesCount || 0,
        totalRevenue: revenue,
        activePromosCount: activePromosCount || 0,
      };
    }
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

