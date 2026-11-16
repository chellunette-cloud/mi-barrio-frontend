import { useEffect, useState } from 'react';
import { ApiError } from '../../../shared/api/http.js';
import { getCategorias, getLugares } from '../services/placesApi.js';
import type { Categoria, Lugar } from '../../../shared/contracts/api.js';

export function useCategorias() {
  const [state, setState] = useState<{ status: 'loading' | 'error' | 'success'; data?: Categoria[]; message?: string }>({ status: 'loading' });
  useEffect(() => {
    const controller = new AbortController();
    getCategorias(controller.signal)
      .then((data) => { if (!controller.signal.aborted) setState({ status: 'success', data }); })
      .catch((error) => {
        if (controller.signal.aborted) return;
        setState({ status: 'error', message: error instanceof ApiError ? error.message : 'No fue posible cargar las categorías.' });
      });
    return () => controller.abort();
  }, []);
  return state;
}

export function usePlaces(categoria: string, consulta: string) {
  const [state, setState] = useState<{ status: 'loading' | 'error' | 'success'; data?: Lugar[]; message?: string }>({ status: 'loading' });
  const [attempt, setAttempt] = useState(0);
  useEffect(() => {
    const controller = new AbortController();
    setState({ status: 'loading' });
    getLugares({ categoria: categoria === 'todos' ? undefined : categoria, q: consulta || undefined }, controller.signal)
      .then((data) => { if (!controller.signal.aborted) setState({ status: 'success', data }); })
      .catch((error) => {
        if (controller.signal.aborted) return;
        setState({ status: 'error', message: error instanceof ApiError ? error.message : 'No fue posible cargar los lugares.' });
      });
    return () => controller.abort();
  }, [categoria, consulta, attempt]);
  return { state, retry: () => setAttempt((value) => value + 1) };
}