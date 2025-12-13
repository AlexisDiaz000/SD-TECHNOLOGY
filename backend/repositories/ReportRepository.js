const db = require('../db');
const { supabase } = require('../supabaseClient');

/**
 * Repository Pattern para Reportes
 */
class ReportRepository {
  async findAll() {
    if (supabase) {
      const { data, error } = await supabase
        .from('reports')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data || [];
    }
    const result = await db.query('SELECT * FROM reports ORDER BY created_at DESC');
    return result.rows;
  }

  async findById(id) {
    if (supabase) {
      const { data, error } = await supabase
        .from('reports')
        .select('*')
        .eq('id', id)
        .single();
      if (error && error.code !== 'PGRST116') throw error;
      return data || null;
    }
    const result = await db.query('SELECT * FROM reports WHERE id = $1', [id]);
    return result.rows[0] || null;
  }

  async create(reportData) {
    const {
      id, title, type, report_date, status, description, period,
      total_sales, revenue, total_products, low_stock_items,
      active_promos, total_discount
    } = reportData;
    
    if (supabase) {
      const { data, error } = await supabase
        .from('reports')
        .insert([{ id, title, type, report_date, status, description, period, total_sales, revenue, total_products, low_stock_items, active_promos, total_discount }])
        .select()
        .single();
      if (error) throw error;
      return data;
    }
    const result = await db.query(
      'INSERT INTO reports (id, title, type, report_date, status, description, period, total_sales, revenue, total_products, low_stock_items, active_promos, total_discount) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13) RETURNING *',
      [id, title, type, report_date, status, description, period, total_sales, revenue, total_products, low_stock_items, active_promos, total_discount]
    );
    return result.rows[0];
  }

  async delete(id) {
    if (supabase) {
      const { data, error } = await supabase
        .from('reports')
        .delete()
        .eq('id', id)
        .select()
        .single();
      if (error && error.code !== 'PGRST116') throw error;
      return data || null;
    }
    const result = await db.query('DELETE FROM reports WHERE id = $1 RETURNING *', [id]);
    return result.rows[0] || null;
  }
}

module.exports = new ReportRepository();

