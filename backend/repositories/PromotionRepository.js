const db = require('../db');

/**
 * Repository Pattern para Promociones
 */
class PromotionRepository {
  async findAll() {
    const result = await db.query('SELECT * FROM promotions ORDER BY created_at DESC');
    return result.rows;
  }

  async findById(id) {
    const result = await db.query('SELECT * FROM promotions WHERE id = $1', [id]);
    return result.rows[0] || null;
  }

  async create(promotionData) {
    const {
      id, name, discount, active, start_date, end_date,
      description, applicable_categories
    } = promotionData;
    
    const result = await db.query(
      'INSERT INTO promotions (id, name, discount, active, start_date, end_date, description, applicable_categories) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *',
      [id, name, discount, active, start_date, end_date, description, applicable_categories]
    );
    return result.rows[0];
  }

  async update(id, promotionData) {
    const {
      name, discount, active, start_date, end_date,
      description, applicable_categories
    } = promotionData;
    
    const result = await db.query(
      'UPDATE promotions SET name = $1, discount = $2, active = $3, start_date = $4, end_date = $5, description = $6, applicable_categories = $7, updated_at = CURRENT_TIMESTAMP WHERE id = $8 RETURNING *',
      [name, discount, active, start_date, end_date, description, applicable_categories, id]
    );
    return result.rows[0] || null;
  }

  async delete(id) {
    const result = await db.query('DELETE FROM promotions WHERE id = $1 RETURNING *', [id]);
    return result.rows[0] || null;
  }

  async toggleActive(id) {
    const result = await db.query(
      'UPDATE promotions SET active = NOT active, updated_at = CURRENT_TIMESTAMP WHERE id = $1 RETURNING *',
      [id]
    );
    return result.rows[0] || null;
  }

  async findActive() {
    const result = await db.query('SELECT * FROM promotions WHERE active = true');
    return result.rows;
  }
}

module.exports = new PromotionRepository();

