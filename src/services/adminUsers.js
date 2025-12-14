const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

async function request(path, options = {}) {
  const url = `${API_BASE_URL}${path}`;
  const config = { headers: { 'Content-Type': 'application/json', ...(options.headers || {}) }, ...options };
  if (config.body && typeof config.body === 'object') config.body = JSON.stringify(config.body);
  const resp = await fetch(url, config);
  if (!resp.ok) {
    const err = await resp.json().catch(() => ({}));
    throw new Error(err.error || `Error ${resp.status}`);
  }
  return await resp.json();
}

export const adminUsersAPI = {
  list: () => request('/admin/users'),
  create: (email, password, role = 'editor', active = true) => request('/admin/users', { method: 'POST', body: { email, password, role, active } }),
  update: (id, payload) => request(`/admin/users/${id}`, { method: 'PATCH', body: payload }),
  remove: (id) => request(`/admin/users/${id}`, { method: 'DELETE' }),
  health: () => request('/admin/users/health'),
};

