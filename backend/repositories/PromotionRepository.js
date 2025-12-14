const { supabase } = require('../supabaseClient');

/**
 * Repository Pattern para Promociones
 */
class PromotionRepository {
  async findAll() {
    const { data, error } = await supabase
      .from('promotions')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data || [];
  }

  async findById(id) {
    const { data, error } = await supabase
      .from('promotions')
      .select('*')
      .eq('id', id)
      .single();
    if (error && error.code !== 'PGRST116') throw error;
    return data || null;
  }

  async create(promotionData) {
    const {
      id, name, discount, active, start_date, end_date,
      description, applicable_categories
    } = promotionData;
    
    const { data, error } = await supabase
      .from('promotions')
      .insert([{ id, name, discount, active, start_date, end_date, description, applicable_categories }])
      .select()
      .single();
    if (error) throw error;
    return data;
  }

  async update(id, promotionData) {
    const {
      name, discount, active, start_date, end_date,
      description, applicable_categories
    } = promotionData;
    
    const { data, error } = await supabase
      .from('promotions')
      .update({ name, discount, active, start_date, end_date, description, applicable_categories, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
    if (error && error.code !== 'PGRST116') throw error;
    return data || null;
  }

  async delete(id) {
    const { data, error } = await supabase
      .from('promotions')
      .delete()
      .eq('id', id)
      .select()
      .single();
    if (error && error.code !== 'PGRST116') throw error;
    return data || null;
  }

  async toggleActive(id) {
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

  async findActive() {
    const { data, error } = await supabase
      .from('promotions')
      .select('*')
      .eq('active', true);
    if (error) throw error;
    return data || [];
  }
}

module.exports = new PromotionRepository();

