const db = require('../db');

/**
 * Repository Pattern para Ventas
 */
class SaleRepository {
  async findAll() {
    const result = await db.query('SELECT * FROM sales ORDER BY created_at DESC');
    return result.rows;
  }

  async findById(id) {
    const result = await db.query('SELECT * FROM sales WHERE id = $1', [id]);
    return result.rows[0] || null;
  }

  async create(saleData) {
    const {
      id, product, quantity, price, total, ticket_number, client,
      payment_method, subtotal, tax, warranty, sale_date, sale_time
    } = saleData;
    
    const result = await db.query(
      'INSERT INTO sales (id, product, quantity, price, total, ticket_number, client, payment_method, subtotal, tax, warranty, sale_date, sale_time) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13) RETURNING *',
      [id, product, quantity, price, total, ticket_number, client, payment_method, subtotal, tax, warranty, sale_date, sale_time]
    );
    return result.rows[0];
  }

  async delete(id) {
    const result = await db.query('DELETE FROM sales WHERE id = $1 RETURNING *', [id]);
    return result.rows[0] || null;
  }
}

module.exports = new SaleRepository();

