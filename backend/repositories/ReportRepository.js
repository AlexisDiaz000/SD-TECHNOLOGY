const { supabase } = require('../supabaseClient');

/**
 * Repository Pattern para Reportes
 */
class ReportRepository {
  async findAll() {
    const { data, error } = await supabase
      .from('reports')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data || [];
  }

  async findById(id) {
    const { data, error } = await supabase
      .from('reports')
      .select('*')
      .eq('id', id)
      .single();
    if (error && error.code !== 'PGRST116') throw error;
    return data || null;
  }

  async create(reportData) {
    const {
      id, title, type, report_date, status, description, period,
      total_sales, revenue, total_products, low_stock_items,
      active_promos, total_discount
    } = reportData;
    
    const { data, error } = await supabase
      .from('reports')
      .insert([{ id, title, type, report_date, status, description, period, total_sales, revenue, total_products, low_stock_items, active_promos, total_discount }])
      .select()
      .single();
    if (error) throw error;
    return data;
  }

  async delete(id) {
    const { data, error } = await supabase
      .from('reports')
      .delete()
      .eq('id', id)
      .select()
      .single();
    if (error && error.code !== 'PGRST116') throw error;
    return data || null;
  }
}

module.exports = new ReportRepository();

