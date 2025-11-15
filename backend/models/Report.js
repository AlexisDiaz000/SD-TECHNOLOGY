/**
 * Modelo de Reporte
 */
class Report {
  constructor(data) {
    this.id = data.id;
    this.title = data.title;
    this.type = data.type;
    this.report_date = data.report_date;
    this.status = data.status;
    this.description = data.description;
    this.period = data.period;
    this.total_sales = data.total_sales;
    this.revenue = data.revenue;
    this.total_products = data.total_products;
    this.low_stock_items = data.low_stock_items;
    this.active_promos = data.active_promos;
    this.total_discount = data.total_discount;
    this.created_at = data.created_at;
  }

  toJSON() {
    return {
      id: this.id,
      title: this.title,
      type: this.type,
      report_date: this.report_date,
      status: this.status,
      description: this.description,
      period: this.period,
      total_sales: this.total_sales,
      revenue: this.revenue,
      total_products: this.total_products,
      low_stock_items: this.low_stock_items,
      active_promos: this.active_promos,
      total_discount: this.total_discount,
      created_at: this.created_at
    };
  }
}

module.exports = Report;

