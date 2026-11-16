import { useVias } from '../hooks/useVias.js';
import { MapContainer, Polyline, Popup, TileLayer } from 'react-leaflet';
import { EstadoCarga } from '../../../shared/ui/EstadoCarga.js';
import { ErrorPanel } from '../../../shared/ui/ErrorPanel.js';

export function ViasSection() {
  const state = useVias();
  const data = state.status === 'success' ? state.data ?? [] : [];
  const residenciales = data.filter((via) => via.highway === 'residential').length;
  const terciarias = data.filter((via) => via.highway === 'tertiary').length;

  return (
    <section className="mt-8" aria-labelledby="vias-title">
      <h2 id="vias-title" className="text-2xl font-bold text-slate-900">Vías y accesos</h2>
      <p className="mt-1 text-sm text-slate-600">Malla vial disponible en OpenStreetMap. Cobertura parcial; no se presentan rutas calculadas.</p>
      <p className="mt-2 text-xs text-slate-500">{data.length} tramos cargados: {residenciales} residenciales y {terciarias} terciarios.</p>
      {state.status === 'loading' ? <EstadoCarga label="Cargando vías…" /> : null}
      {state.status === 'error' ? <ErrorPanel message={state.message ?? 'Error'} onRetry={() => window.location.reload()} /> : null}
      {state.status === 'success' ? (
        <div className="mt-4 h-[420px] overflow-hidden rounded-2xl border border-slate-200 bg-slate-100 shadow-sm">
          <MapContainer center={[4.641833, -74.171758]} zoom={15} scrollWheelZoom={false} className="h-full w-full">
            <TileLayer attribution='&copy; OpenStreetMap contributors' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            {data.map((via) => (
              <Polyline key={via.id} positions={via.coordenadas.map((coord) => [coord[1] ?? 0, coord[0] ?? 0])} pathOptions={{ color: via.highway === 'tertiary' ? '#1d4ed8' : '#475569', weight: via.highway === 'tertiary' ? 3 : 2 }} >
                <Popup>{via.nombre ?? 'Vía sin nombre'}<br />{via.highway}</Popup>
              </Polyline>
            ))}
          </MapContainer>
        </div>
      ) : null}
    </section>
  );
}