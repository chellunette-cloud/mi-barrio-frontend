import { useGeometria } from '../hooks/useGeometria.js';
import { MapaLeaflet } from './MapaLeaflet.js';
import { EstadoCarga } from '../../../shared/ui/EstadoCarga.js';
import { ErrorPanel } from '../../../shared/ui/ErrorPanel.js';

export function MapaBarrio() {
  const { state, retry } = useGeometria();

  return (
    <section aria-labelledby="mapa-title" className="mt-8">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-teal-800">HU-02</p>
          <h2 id="mapa-title" className="mt-1 text-2xl font-bold text-slate-900">
            Ubicación geográfica
          </h2>
        </div>
        <p className="max-w-md text-sm text-slate-600">
          Polígono oficial en WGS84; no se dibuja ni se simplifica manualmente.
        </p>
      </div>

      <div className="mt-4">
        {state.status === 'loading' ? <EstadoCarga label="Cargando mapa…" /> : null}
        {state.status === 'error' ? <ErrorPanel message={state.message} onRetry={retry} /> : null}
        {state.status === 'success' ? (
          <figure>
            <div
              role="region"
              aria-label="Mapa interactivo del polígono oficial de Ciudad Granada"
              className="h-[420px] w-full overflow-hidden rounded-2xl border border-slate-200 bg-slate-100 shadow-sm md:h-[520px]"
            >
              <MapaLeaflet data={state.data} />
            </div>
            <figcaption className="mt-3 text-xs leading-5 text-slate-600">
              Mapa base ©{' '}
              <a
                className="underline decoration-slate-300 underline-offset-2 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-600"
                href="https://www.openstreetmap.org/copyright"
                target="_blank"
                rel="noreferrer noopener"
              >
                OpenStreetMap contributors
              </a>
              . Polígono y centroide: {state.data.fuente.entidad} – IDECA ·{' '}
              <a
                className="underline decoration-slate-300 underline-offset-2 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-600"
                href={state.data.fuente.url}
                target="_blank"
                rel="noreferrer noopener"
              >
                {state.data.fuente.codigo}
              </a>{' '}
              · {state.data.fuente.licencia} · consultado el {state.data.fuente.fechaConsulta}.
            </figcaption>
          </figure>
        ) : null}
      </div>
    </section>
  );
}
