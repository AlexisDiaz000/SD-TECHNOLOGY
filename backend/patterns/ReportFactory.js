const db = require('../db');
const productRepository = require('../repositories/ProductRepository');
const saleRepository = require('../repositories/SaleRepository');
const promotionRepository = require('../repositories/PromotionRepository');

/**
 * Factory Method Pattern para crear reportes según su tipo
 * Permite crear diferentes tipos de reportes sin acoplar el código
 */
class ReportFactory {
  static async createReport(type, baseData) {
    switch (type) {
      case 'Ventas':
        return await this.createSalesReport(baseData);
      case 'Stock':
        return await this.createStockReport(baseData);
      case 'Promo':
        return await this.createPromoReport(baseData);
      case 'General':
        return await this.createGeneralReport(baseData);
      default:
        return baseData;
    }
  }

  static async createSalesReport(baseData) {
    const sales = await saleRepository.findAll();
    const totalSales = sales.length;
    const revenue = sales.reduce((sum, sale) => sum + parseFloat(sale.total || 0), 0);
    
    return {
      ...baseData,
      total_sales: totalSales,
      revenue: revenue,
      total_products: null,
      low_stock_items: null,
      active_promos: null,
      total_discount: null
    };
  }

  static async createStockReport(baseData) {
    const products = await productRepository.findAll();
    const lowStock = await productRepository.findLowStock();
    
    return {
      ...baseData,
      total_sales: null,
      revenue: null,
      total_products: products.length,
      low_stock_items: lowStock.length,
      active_promos: null,
      total_discount: null
    };
  }

  static async createPromoReport(baseData) {
    const activePromos = await promotionRepository.findActive();
    const totalDiscount = activePromos.reduce((sum, promo) => {
      return sum + (parseFloat(promo.discount) || 0);
    }, 0);
    
    return {
      ...baseData,
      total_sales: null,
      revenue: null,
      total_products: null,
      low_stock_items: null,
      active_promos: activePromos.length,
      total_discount: totalDiscount
    };
  }

  static async createGeneralReport(baseData) {
    const sales = await saleRepository.findAll();
    const products = await productRepository.findAll();
    const lowStock = await productRepository.findLowStock();
    const activePromos = await promotionRepository.findActive();
    
    const totalSales = sales.length;
    const revenue = sales.reduce((sum, sale) => sum + parseFloat(sale.total || 0), 0);
    const totalDiscount = activePromos.reduce((sum, promo) => {
      return sum + (parseFloat(promo.discount) || 0);
    }, 0);
    
    return {
      ...baseData,
      total_sales: totalSales,
      revenue: revenue,
      total_products: products.length,
      low_stock_items: lowStock.length,
      active_promos: activePromos.length,
      total_discount: totalDiscount
    };
  }
}

module.exports = ReportFactory;

