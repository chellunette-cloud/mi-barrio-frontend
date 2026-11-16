import { ApiError } from '../../../shared/api/http.js';

const baseUrl = '';

async function request(path: string, init: RequestInit = {}) {
  const response = await fetch(`${baseUrl}${path}`, init);
  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new ApiError(response.status, body?.error?.code ?? 'ERROR', body?.error?.message ?? 'Error');
  }
  if (response.status === 204) return undefined;
  return response.json();
}

export const adminApi = {
  login: (username: string, password: string) =>
    request('/api/v1/auth/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ username, password }) }),
  list: (token: string) => request('/api/v1/admin/lugares', { headers: { Authorization: `Bearer ${token}` } }),
  create: (token: string, body: unknown) => request('/api/v1/admin/lugares', { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify(body) }),
  update: (token: string, id: number, body: unknown) => request(`/api/v1/admin/lugares/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify(body) }),
  remove: (token: string, id: number) => request(`/api/v1/admin/lugares/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } })
};