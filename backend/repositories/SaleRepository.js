const db = require('../db');
const { supabase } = require('../supabaseClient');

/**
 * Repository Pattern para Ventas
 */
class SaleRepository {
  async findAll() {
    if (supabase) {
      const { data, error } = await supabase
        .from('sales')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data || [];
    }
    const result = await db.query('SELECT * FROM sales ORDER BY created_at DESC');
    return result.rows;
  }

  async findById(id) {
    if (supabase) {
      const { data, error } = await supabase
        .from('sales')
        .select('*')
        .eq('id', id)
        .single();
      if (error && error.code !== 'PGRST116') throw error;
      return data || null;
    }
    const result = await db.query('SELECT * FROM sales WHERE id = $1', [id]);
    return result.rows[0] || null;
  }

  async create(saleData) {
    const {
      id, product, quantity, price, total, ticket_number, client,
      payment_method, subtotal, tax, warranty, sale_date, sale_time
    } = saleData;
    
    if (supabase) {
      const { data, error } = await supabase
        .from('sales')
        .insert([{ id, product, quantity, price, total, ticket_number, client, payment_method, subtotal, tax, warranty, sale_date, sale_time }])
        .select()
        .single();
      if (error) throw error;
      return data;
    }
    const result = await db.query(
      'INSERT INTO sales (id, product, quantity, price, total, ticket_number, client, payment_method, subtotal, tax, warranty, sale_date, sale_time) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13) RETURNING *',
      [id, product, quantity, price, total, ticket_number, client, payment_method, subtotal, tax, warranty, sale_date, sale_time]
    );
    return result.rows[0];
  }

  async delete(id) {
    if (supabase) {
      const { data, error } = await supabase
        .from('sales')
        .delete()
        .eq('id', id)
        .select()
        .single();
      if (error && error.code !== 'PGRST116') throw error;
      return data || null;
    }
    const result = await db.query('DELETE FROM sales WHERE id = $1 RETURNING *', [id]);
    return result.rows[0] || null;
  }
}

module.exports = new SaleRepository();

