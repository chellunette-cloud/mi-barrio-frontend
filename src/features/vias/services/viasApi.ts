import { fetchJson } from '../../../shared/api/http.js';
import type { Via } from '../../../shared/contracts/api.js';

export function getVias(signal: AbortSignal, highway?: string): Promise<Via[]> {
  const suffix = highway ? `?highway=${encodeURIComponent(highway)}` : '';
  return fetchJson<Via[]>(`/api/v1/vias${suffix}`, signal);
}