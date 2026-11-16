import { fetchJson } from '../../../shared/api/http.js';
import type { Categoria, Lugar } from '../../../shared/contracts/api.js';

export function getCategorias(signal: AbortSignal): Promise<Categoria[]> {
  return fetchJson<Categoria[]>('/api/v1/categorias', signal);
}

export function getLugares(
  params: { categoria?: string; q?: string; limite?: number },
  signal: AbortSignal
): Promise<Lugar[]> {
  const query = new URLSearchParams();
  if (params.categoria) query.set('categoria', params.categoria);
  if (params.q) query.set('q', params.q);
  if (params.limite) query.set('limite', String(params.limite));
  const suffix = query.toString() ? `?${query.toString()}` : '';
  return fetchJson<Lugar[]>(`/api/v1/lugares${suffix}`, signal);
}

export function getLugar(id: number, signal: AbortSignal): Promise<Lugar> {
  return fetchJson<Lugar>(`/api/v1/lugares/${id}`, signal);
}