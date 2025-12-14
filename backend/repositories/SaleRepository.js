const { supabase } = require('../supabaseClient');

/**
 * Repository Pattern para Ventas
 */
class SaleRepository {
  async findAll() {
    const { data, error } = await supabase
      .from('sales')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data || [];
  }

  async findById(id) {
    const { data, error } = await supabase
      .from('sales')
      .select('*')
      .eq('id', id)
      .single();
    if (error && error.code !== 'PGRST116') throw error;
    return data || null;
  }

  async create(saleData) {
    const {
      id, product, quantity, price, total, ticket_number, client,
      payment_method, subtotal, tax, warranty, sale_date, sale_time
    } = saleData;
    
    const { data, error } = await supabase
      .from('sales')
      .insert([{ id, product, quantity, price, total, ticket_number, client, payment_method, subtotal, tax, warranty, sale_date, sale_time }])
      .select()
      .single();
    if (error) throw error;
    return data;
  }

  async delete(id) {
    const { data, error } = await supabase
      .from('sales')
      .delete()
      .eq('id', id)
      .select()
      .single();
    if (error && error.code !== 'PGRST116') throw error;
    return data || null;
  }
}

module.exports = new SaleRepository();

