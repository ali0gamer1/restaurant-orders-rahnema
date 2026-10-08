// Tiny fetch wrapper for the restaurant orders API.
// In dev, Vite proxies /health, /menu, /orders, /reservations to http://localhost:3000.

async function request(path, options = {}) {
  const res = await fetch(path, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
  });

  const text = await res.text();
  const data = text ? JSON.parse(text) : null;

  if (!res.ok) {
    const message = data?.error?.message || `Request failed with status ${res.status}`;
    throw new Error(message);
  }

  return data;
}

export const api = {
  getHealth: () => request('/health'),

  getMenu: () => request('/menu'),
  createMenuItem: (item) => request('/menu', { method: 'POST', body: JSON.stringify(item) }),
  updateMenuItem: (id, changes) => request(`/menu/${id}`, { method: 'PATCH', body: JSON.stringify(changes) }),
  deleteMenuItem: (id) => request(`/menu/${id}`, { method: 'DELETE' }),

  getOrders: (token) =>
    request('/orders', { headers: { Authorization: `Bearer ${token}` } }),

  createOrder: (token, order) =>
    request('/orders', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify(order),
    }),

  getReservations: () => request('/reservations'),
};
