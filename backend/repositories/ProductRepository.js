const db = require('../db');
const { supabase } = require('../supabaseClient');

/**
 * Repository Pattern para Productos
 * Abstrae las operaciones de base de datos y facilita migración futura
 */
class ProductRepository {
  async findAll() {
    if (supabase) {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data || [];
    }
    const result = await db.query('SELECT * FROM products ORDER BY created_at DESC');
    return result.rows;
  }

  async findById(id) {
    if (supabase) {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single();
      if (error && error.code !== 'PGRST116') throw error;
      return data || null;
    }
    const result = await db.query('SELECT * FROM products WHERE id = $1', [id]);
    return result.rows[0] || null;
  }

  async create(productData) {
    const { id, name, category, amount, price, min_stock, supplier } = productData;
    if (supabase) {
      const { data, error } = await supabase
        .from('products')
        .insert([{ id, name, category, amount, price, min_stock, supplier }])
        .select()
        .single();
      if (error) throw error;
      return data;
    }
    const result = await db.query(
      'INSERT INTO products (id, name, category, amount, price, min_stock, supplier) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
      [id, name, category, amount, price, min_stock, supplier]
    );
    return result.rows[0];
  }

  async update(id, productData) {
    const { name, category, amount, price, min_stock, supplier } = productData;
    if (supabase) {
      const { data, error } = await supabase
        .from('products')
        .update({ name, category, amount, price, min_stock, supplier, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();
      if (error && error.code !== 'PGRST116') throw error;
      return data || null;
    }
    const result = await db.query(
      'UPDATE products SET name = $1, category = $2, amount = $3, price = $4, min_stock = $5, supplier = $6, updated_at = CURRENT_TIMESTAMP WHERE id = $7 RETURNING *',
      [name, category, amount, price, min_stock, supplier, id]
    );
    return result.rows[0] || null;
  }

  async delete(id) {
    if (supabase) {
      const { data, error } = await supabase
        .from('products')
        .delete()
        .eq('id', id)
        .select()
        .single();
      if (error && error.code !== 'PGRST116') throw error;
      return data || null;
    }
    const result = await db.query('DELETE FROM products WHERE id = $1 RETURNING *', [id]);
    return result.rows[0] || null;
  }

  async findLowStock() {
    if (supabase) {
      const { data, error } = await supabase
        .from('products')
        .select('*');
      if (error) throw error;
      return (data || []).filter(p => (p.amount ?? 0) < (p.min_stock ?? 0));
    }
    const result = await db.query('SELECT * FROM products WHERE amount < min_stock');
    return result.rows;
  }
}

module.exports = new ProductRepository();

