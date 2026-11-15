import { fetchJson } from '../../../shared/api/http.js';
import type { Barrio } from '../../../shared/contracts/api.js';

export function getBarrio(signal: AbortSignal): Promise<Barrio> {
  return fetchJson<Barrio>('/api/v1/barrio', signal);
}
