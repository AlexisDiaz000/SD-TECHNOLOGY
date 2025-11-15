/**
 * Servicio de API para comunicación con el backend
 * Centraliza todas las llamadas HTTP a la API
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

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
  getAll: () => request('/products'),
  getById: (id) => request(`/products/${id}`),
  create: (data) => request('/products', { method: 'POST', body: data }),
  update: (id, data) => request(`/products/${id}`, { method: 'PUT', body: data }),
  delete: (id) => request(`/products/${id}`, { method: 'DELETE' }),
  getLowStock: () => request('/products/low-stock/alert'),
};

// ==================== VENTAS ====================
export const saleAPI = {
  getAll: () => request('/sales'),
  getById: (id) => request(`/sales/${id}`),
  create: (data) => request('/sales', { method: 'POST', body: data }),
  delete: (id) => request(`/sales/${id}`, { method: 'DELETE' }),
};

// ==================== PROMOCIONES ====================
export const promotionAPI = {
  getAll: () => request('/promotions'),
  getById: (id) => request(`/promotions/${id}`),
  create: (data) => request('/promotions', { method: 'POST', body: data }),
  update: (id, data) => request(`/promotions/${id}`, { method: 'PUT', body: data }),
  delete: (id) => request(`/promotions/${id}`, { method: 'DELETE' }),
  toggleActive: (id) => request(`/promotions/${id}/toggle`, { method: 'PATCH' }),
};

// ==================== REPORTES ====================
export const reportAPI = {
  getAll: () => request('/reports'),
  getById: (id) => request(`/reports/${id}`),
  create: (data) => request('/reports', { method: 'POST', body: data }),
  delete: (id) => request(`/reports/${id}`, { method: 'DELETE' }),
};

// ==================== ESTADÍSTICAS ====================
export const statisticsAPI = {
  getDashboard: () => request('/statistics/dashboard'),
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

