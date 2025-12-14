/**
 * Servicio de API para comunicación con el backend
 * Centraliza todas las llamadas HTTP a la API
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
import supabase from './supabase';
import { getUser } from './auth';
const USE_SUPABASE = !!supabase;

/**
 * Función auxiliar para realizar peticiones HTTP
 */
async function request(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  if (config.body && typeof config.body === 'object') {
    config.body = JSON.stringify(config.body);
  }

  try {
    const response = await fetch(url, config);
    
    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Error desconocido' }));
      throw new Error(error.error || `Error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
}

// ==================== PRODUCTOS ====================
export const productAPI = {
  async getAll() {
    if (USE_SUPABASE) {
      const { data, error } = await supabase.from('products').select('*').order('created_at', { ascending: false });
      if (error) throw new Error(error.message);
      return data || [];
    }
    return request('/products');
  },
  async getById(id) {
    if (USE_SUPABASE) {
      const { data, error } = await supabase.from('products').select('*').eq('id', id).single();
      if (error) throw new Error(error.message);
      return data;
    }
    return request(`/products/${id}`);
  },
  async create(data) {
    if (USE_SUPABASE) {
      const user = await getUser();
      if (!user) throw new Error('Debes iniciar sesión para crear productos');
      const payload = { id: data.id || (crypto?.randomUUID ? crypto.randomUUID() : undefined), created_by: user.id, ...data };
      const { data: created, error } = await supabase.from('products').insert([payload]).select().single();
      if (error) throw new Error(error.message);
      return created;
    }
    return request('/products', { method: 'POST', body: data });
  },
  async update(id, data) {
    if (USE_SUPABASE) {
      const user = await getUser();
      if (!user) throw new Error('Debes iniciar sesión para actualizar productos');
      const { data: updated, error } = await supabase.from('products').update({ ...data, updated_at: new Date().toISOString() }).eq('id', id).select().single();
      if (error) throw new Error(error.message);
      return updated;
    }
    return request(`/products/${id}`, { method: 'PUT', body: data });
  },
  async delete(id) {
    if (USE_SUPABASE) {
      const user = await getUser();
      if (!user) throw new Error('Debes iniciar sesión para borrar productos');
      const { data: deleted, error } = await supabase.from('products').delete().eq('id', id).select().single();
      if (error) throw new Error(error.message);
      return deleted;
    }
    return request(`/products/${id}`, { method: 'DELETE' });
  },
  async getLowStock() {
    if (USE_SUPABASE) {
      const { data, error } = await supabase.from('products').select('amount,min_stock,name');
      if (error) throw new Error(error.message);
      return (data || []).filter(p => (p.amount ?? 0) < (p.min_stock ?? 0));
    }
    return request('/products/low-stock/alert');
  },
};

// ==================== VENTAS ====================
export const saleAPI = {
  async getAll() {
    if (USE_SUPABASE) {
      const { data, error } = await supabase.from('sales').select('*').order('created_at', { ascending: false });
      if (error) throw new Error(error.message);
      return data || [];
    }
    return request('/sales');
  },
  async getById(id) {
    if (USE_SUPABASE) {
      const { data, error } = await supabase.from('sales').select('*').eq('id', id).single();
      if (error) throw new Error(error.message);
      return data;
    }
    return request(`/sales/${id}`);
  },
  async create(data) {
    if (USE_SUPABASE) {
      const user = await getUser();
      if (!user) throw new Error('Debes iniciar sesión para crear ventas');
      const payload = { id: data.id || (crypto?.randomUUID ? crypto.randomUUID() : undefined), created_by: user.id, ...data };
      const { data: created, error } = await supabase.from('sales').insert([payload]).select().single();
      if (error) throw new Error(error.message);
      return created;
    }
    return request('/sales', { method: 'POST', body: data });
  },
  async delete(id) {
    if (USE_SUPABASE) {
      const user = await getUser();
      if (!user) throw new Error('Debes iniciar sesión para borrar ventas');
      const { data: deleted, error } = await supabase.from('sales').delete().eq('id', id).select().single();
      if (error) throw new Error(error.message);
      return deleted;
    }
    return request(`/sales/${id}`, { method: 'DELETE' });
  },
};

// ==================== PROMOCIONES ====================
export const promotionAPI = {
  async getAll() {
    if (USE_SUPABASE) {
      const { data, error } = await supabase.from('promotions').select('*').order('created_at', { ascending: false });
      if (error) throw new Error(error.message);
      return data || [];
    }
    return request('/promotions');
  },
  async getById(id) {
    if (USE_SUPABASE) {
      const { data, error } = await supabase.from('promotions').select('*').eq('id', id).single();
      if (error) throw new Error(error.message);
      return data;
    }
    return request(`/promotions/${id}`);
  },
  async create(data) {
    if (USE_SUPABASE) {
      const user = await getUser();
      if (!user) throw new Error('Debes iniciar sesión para crear promociones');
      const payload = { id: data.id || (crypto?.randomUUID ? crypto.randomUUID() : undefined), created_by: user.id, ...data };
      const { data: created, error } = await supabase.from('promotions').insert([payload]).select().single();
      if (error) throw new Error(error.message);
      return created;
    }
    return request('/promotions', { method: 'POST', body: data });
  },
  async update(id, data) {
    if (USE_SUPABASE) {
      const user = await getUser();
      if (!user) throw new Error('Debes iniciar sesión para actualizar promociones');
      const { data: updated, error } = await supabase.from('promotions').update({ ...data, updated_at: new Date().toISOString() }).eq('id', id).select().single();
      if (error) throw new Error(error.message);
      return updated;
    }
    return request(`/promotions/${id}`, { method: 'PUT', body: data });
  },
  async delete(id) {
    if (USE_SUPABASE) {
      const user = await getUser();
      if (!user) throw new Error('Debes iniciar sesión para borrar promociones');
      const { data: deleted, error } = await supabase.from('promotions').delete().eq('id', id).select().single();
      if (error) throw new Error(error.message);
      return deleted;
    }
    return request(`/promotions/${id}`, { method: 'DELETE' });
  },
  async toggleActive(id) {
    if (USE_SUPABASE) {
      const user = await getUser();
      if (!user) throw new Error('Debes iniciar sesión para modificar promociones');
      const { data: current, error: readErr } = await supabase.from('promotions').select('active').eq('id', id).single();
      if (readErr) throw new Error(readErr.message);
      const { data: updated, error } = await supabase.from('promotions').update({ active: !current.active, updated_at: new Date().toISOString() }).eq('id', id).select().single();
      if (error) throw new Error(error.message);
      return updated;
    }
    return request(`/promotions/${id}/toggle`, { method: 'PATCH' });
  },
};

// ==================== REPORTES ====================
export const reportAPI = {
  async getAll() {
    if (USE_SUPABASE) {
      const { data, error } = await supabase.from('reports').select('*').order('created_at', { ascending: false });
      if (error) throw new Error(error.message);
      return data || [];
    }
    return request('/reports');
  },
  async getById(id) {
    if (USE_SUPABASE) {
      const { data, error } = await supabase.from('reports').select('*').eq('id', id).single();
      if (error) throw new Error(error.message);
      return data;
    }
    return request(`/reports/${id}`);
  },
  async create(data) {
    if (USE_SUPABASE) {
      const user = await getUser();
      if (!user) throw new Error('Debes iniciar sesión para crear reportes');
      const payload = { id: data.id || (crypto?.randomUUID ? crypto.randomUUID() : undefined), created_by: user.id, ...data };
      const { data: created, error } = await supabase.from('reports').insert([payload]).select().single();
      if (error) throw new Error(error.message);
      return created;
    }
    return request('/reports', { method: 'POST', body: data });
  },
  async delete(id) {
    if (USE_SUPABASE) {
      const user = await getUser();
      if (!user) throw new Error('Debes iniciar sesión para borrar reportes');
      const { data: deleted, error } = await supabase.from('reports').delete().eq('id', id).select().single();
      if (error) throw new Error(error.message);
      return deleted;
    }
    return request(`/reports/${id}`, { method: 'DELETE' });
  },
};

// ==================== ESTADÍSTICAS ====================
export const statisticsAPI = {
  async getDashboard() {
    if (USE_SUPABASE) {
      const [{ count: productsCount }, lowStockRes, salesRes, { count: promosCount }] = await Promise.all([
        supabase.from('products').select('*', { count: 'exact', head: true }),
        supabase.from('products').select('amount,min_stock'),
        supabase.from('sales').select('total', { count: 'exact' }),
        supabase.from('promotions').select('*', { count: 'exact' }).eq('active', true),
      ]);
      const lowStockCount = (lowStockRes.data || []).filter(p => (p.amount ?? 0) < (p.min_stock ?? 0)).length;
      const totalRevenue = (salesRes.data || []).reduce((sum, row) => sum + (parseFloat(row.total) || 0), 0);
      return {
        totalProducts: productsCount || 0,
        lowStockCount,
        totalSalesCount: salesRes.count || 0,
        totalRevenue,
        activePromosCount: promosCount || 0,
      };
    }
    return request('/statistics/dashboard');
  },
};

// ==================== HEALTH CHECK ====================
export const healthAPI = {
  check: () => request('/health'),
};

export default {
  productAPI,
  saleAPI,
  promotionAPI,
  reportAPI,
  statisticsAPI,
  healthAPI,
};
