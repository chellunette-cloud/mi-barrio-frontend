import { fetchJson } from '../../../shared/api/http.js';
import type { Demografia, Seguridad } from '../../../shared/contracts/api.js';

export function getDemografia(signal: AbortSignal): Promise<Demografia> {
  return fetchJson<Demografia>('/api/v1/estadisticas/demografia', signal);
}

export function getSeguridad(signal: AbortSignal): Promise<Seguridad> {
  return fetchJson<Seguridad>('/api/v1/estadisticas/seguridad', signal);
}