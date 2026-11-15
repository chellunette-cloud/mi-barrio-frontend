import { useApiResource } from '../../../shared/api/useApiResource.js';
import { getBarrio } from '../services/barrioApi.js';

export function useBarrio() {
  return useApiResource(getBarrio);
}
