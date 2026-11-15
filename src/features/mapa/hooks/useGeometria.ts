import { useApiResource } from '../../../shared/api/useApiResource.js';
import { getGeometria } from '../services/geometriaApi.js';

export function useGeometria() {
  return useApiResource(getGeometria);
}
