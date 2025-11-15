const db = require('../db');

/**
 * Repository Pattern para Reportes
 */
class ReportRepository {
  async findAll() {
    const result = await db.query('SELECT * FROM reports ORDER BY created_at DESC');
    return result.rows;
  }

  async findById(id) {
    const result = await db.query('SELECT * FROM reports WHERE id = $1', [id]);
    return result.rows[0] || null;
  }

  async create(reportData) {
    const {
      id, title, type, report_date, status, description, period,
      total_sales, revenue, total_products, low_stock_items,
      active_promos, total_discount
    } = reportData;
    
    const result = await db.query(
      'INSERT INTO reports (id, title, type, report_date, status, description, period, total_sales, revenue, total_products, low_stock_items, active_promos, total_discount) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13) RETURNING *',
      [id, title, type, report_date, status, description, period, total_sales, revenue, total_products, low_stock_items, active_promos, total_discount]
    );
    return result.rows[0];
  }

  async delete(id) {
    const result = await db.query('DELETE FROM reports WHERE id = $1 RETURNING *', [id]);
    return result.rows[0] || null;
  }
}

module.exports = new ReportRepository();

