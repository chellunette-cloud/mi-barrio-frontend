import { useEffect, useState } from 'react';
import { ApiError } from '../../../shared/api/http.js';
import { getDemografia, getSeguridad } from '../services/statsApi.js';
import type { Demografia, Seguridad } from '../../../shared/contracts/api.js';

export function useDemografia() {
  const [state, setState] = useState<{ status: 'loading' | 'error' | 'success'; data?: Demografia; message?: string }>({ status: 'loading' });
  useEffect(() => {
    const controller = new AbortController();
    getDemografia(controller.signal)
      .then((data) => { if (!controller.signal.aborted) setState({ status: 'success', data }); })
      .catch((error) => { if (!controller.signal.aborted) setState({ status: 'error', message: error instanceof ApiError ? error.message : 'No fue posible cargar la demografía.' }); });
    return () => controller.abort();
  }, []);
  return state;
}

export function useSeguridad() {
  const [state, setState] = useState<{ status: 'loading' | 'error' | 'success'; data?: Seguridad; message?: string }>({ status: 'loading' });
  useEffect(() => {
    const controller = new AbortController();
    getSeguridad(controller.signal)
      .then((data) => { if (!controller.signal.aborted) setState({ status: 'success', data }); })
      .catch((error) => { if (!controller.signal.aborted) setState({ status: 'error', message: error instanceof ApiError ? error.message : 'No fue posible cargar seguridad.' }); });
    return () => controller.abort();
  }, []);
  return state;
}