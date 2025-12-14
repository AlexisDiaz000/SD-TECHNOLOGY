const { supabase } = require('../supabaseClient');

/**
 * Repository Pattern para Productos
 * Abstrae las operaciones de base de datos y facilita migración futura
 */
class ProductRepository {
  async findAll() {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data || [];
  }

  async findById(id) {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .single();
    if (error && error.code !== 'PGRST116') throw error;
    return data || null;
  }

  async create(productData) {
    const { id, name, category, amount, price, min_stock, supplier } = productData;
    const { data, error } = await supabase
      .from('products')
      .insert([{ id, name, category, amount, price, min_stock, supplier }])
      .select()
      .single();
    if (error) throw error;
    return data;
  }

  async update(id, productData) {
    const { name, category, amount, price, min_stock, supplier } = productData;
    const { data, error } = await supabase
      .from('products')
      .update({ name, category, amount, price, min_stock, supplier, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
    if (error && error.code !== 'PGRST116') throw error;
    return data || null;
  }

  async delete(id) {
    const { data, error } = await supabase
      .from('products')
      .delete()
      .eq('id', id)
      .select()
      .single();
    if (error && error.code !== 'PGRST116') throw error;
    return data || null;
  }

  async findLowStock() {
    const { data, error } = await supabase
      .from('products')
      .select('*');
    if (error) throw error;
    return (data || []).filter(p => (p.amount ?? 0) < (p.min_stock ?? 0));
  }
}

module.exports = new ProductRepository();

