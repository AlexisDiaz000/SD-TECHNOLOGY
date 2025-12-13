const db = require('../db');
const { supabase } = require('../supabaseClient');

/**
 * Repository Pattern para Promociones
 */
class PromotionRepository {
  async findAll() {
    if (supabase) {
      const { data, error } = await supabase
        .from('promotions')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data || [];
    }
    const result = await db.query('SELECT * FROM promotions ORDER BY created_at DESC');
    return result.rows;
  }

  async findById(id) {
    if (supabase) {
      const { data, error } = await supabase
        .from('promotions')
        .select('*')
        .eq('id', id)
        .single();
      if (error && error.code !== 'PGRST116') throw error;
      return data || null;
    }
    const result = await db.query('SELECT * FROM promotions WHERE id = $1', [id]);
    return result.rows[0] || null;
  }

  async create(promotionData) {
    const {
      id, name, discount, active, start_date, end_date,
      description, applicable_categories
    } = promotionData;
    
    if (supabase) {
      const { data, error } = await supabase
        .from('promotions')
        .insert([{ id, name, discount, active, start_date, end_date, description, applicable_categories }])
        .select()
        .single();
      if (error) throw error;
      return data;
    }
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
    
    if (supabase) {
      const { data, error } = await supabase
        .from('promotions')
        .update({ name, discount, active, start_date, end_date, description, applicable_categories, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();
      if (error && error.code !== 'PGRST116') throw error;
      return data || null;
    }
    const result = await db.query(
      'UPDATE promotions SET name = $1, discount = $2, active = $3, start_date = $4, end_date = $5, description = $6, applicable_categories = $7, updated_at = CURRENT_TIMESTAMP WHERE id = $8 RETURNING *',
      [name, discount, active, start_date, end_date, description, applicable_categories, id]
    );
    return result.rows[0] || null;
  }

  async delete(id) {
    if (supabase) {
      const { data, error } = await supabase
        .from('promotions')
        .delete()
        .eq('id', id)
        .select()
        .single();
      if (error && error.code !== 'PGRST116') throw error;
      return data || null;
    }
    const result = await db.query('DELETE FROM promotions WHERE id = $1 RETURNING *', [id]);
    return result.rows[0] || null;
  }

  async toggleActive(id) {
    if (supabase) {
      const { data: current, error: readErr } = await supabase
        .from('promotions')
        .select('active')
        .eq('id', id)
        .single();
      if (readErr) throw readErr;
      const { data, error } = await supabase
        .from('promotions')
        .update({ active: !current.active, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();
      if (error && error.code !== 'PGRST116') throw error;
      return data || null;
    }
    const result = await db.query(
      'UPDATE promotions SET active = NOT active, updated_at = CURRENT_TIMESTAMP WHERE id = $1 RETURNING *',
      [id]
    );
    return result.rows[0] || null;
  }

  async findActive() {
    if (supabase) {
      const { data, error } = await supabase
        .from('promotions')
        .select('*')
        .eq('active', true);
      if (error) throw error;
      return data || [];
    }
    const result = await db.query('SELECT * FROM promotions WHERE active = true');
    return result.rows;
  }
}

module.exports = new PromotionRepository();

