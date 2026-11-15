import { fetchJson } from '../../../shared/api/http.js';
import type { BarrioGeometria } from '../../../shared/contracts/api.js';

export function getGeometria(signal: AbortSignal): Promise<BarrioGeometria> {
  return fetchJson<BarrioGeometria>('/api/v1/barrio/geometria', signal);
}
