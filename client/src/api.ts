// Tiny fetch wrapper for the restaurant orders API.
// In dev, Vite proxies /health, /menu, /orders, /reservations to http://localhost:3000.
import type { Health, MenuItem, MenuItemInput, Order, OrderSize } from './types';

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(path, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  const text = await res.text();
  const data = text ? JSON.parse(text) : null;

  if (!res.ok) {
    const message = data?.error?.message || `Request failed with status ${res.status}`;
    throw new Error(message);
  }

  return data as T;
}

const auth = (token: string) => ({ Authorization: `Bearer ${token}` });

export const api = {
  getHealth: () => request<Health>('/health'),

  getMenu: () => request<MenuItem[]>('/menu'),
  createMenuItem: (item: MenuItemInput) =>
    request<MenuItem>('/menu', { method: 'POST', body: JSON.stringify(item) }),
  updateMenuItem: (id: number, changes: Partial<MenuItemInput>) =>
    request<MenuItem>(`/menu/${id}`, { method: 'PATCH', body: JSON.stringify(changes) }),
  deleteMenuItem: (id: number) => request<null>(`/menu/${id}`, { method: 'DELETE' }),

  getOrders: (token: string) => request<Order[]>('/orders', { headers: auth(token) }),
  createOrder: (token: string, order: { menuItemId: number; size: OrderSize }) =>
    request<Order>('/orders', {
      method: 'POST',
      headers: auth(token),
      body: JSON.stringify(order),
    }),

  serve: (token: string, orderId: number) =>
    request<{ message: string }>('/orders/serve', {
      method: 'POST',
      headers: auth(token),
      body: JSON.stringify({ orderId }),
    }),

  getReservations: () => request<unknown>('/reservations'),
};
