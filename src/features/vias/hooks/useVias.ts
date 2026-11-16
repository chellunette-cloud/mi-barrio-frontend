import { useEffect, useState } from 'react';
import { ApiError } from '../../../shared/api/http.js';
import { getVias } from '../services/viasApi.js';
import type { Via } from '../../../shared/contracts/api.js';

export function useVias(highway?: string) {
  const [state, setState] = useState<{ status: 'loading' | 'error' | 'success'; data?: Via[]; message?: string }>({ status: 'loading' });
  useEffect(() => {
    const controller = new AbortController();
    setState({ status: 'loading' });
    getVias(controller.signal, highway)
      .then((data) => { if (!controller.signal.aborted) setState({ status: 'success', data }); })
      .catch((error) => {
        if (controller.signal.aborted) return;
        setState({ status: 'error', message: error instanceof ApiError ? error.message : 'No fue posible cargar las vías.' });
      });
    return () => controller.abort();
  }, [highway]);
  return state;
}