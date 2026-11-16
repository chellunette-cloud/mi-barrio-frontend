import { useState } from 'react';
import { useCategorias, usePlaces } from '../hooks/usePlaces.js';
import { PlacesMap } from './PlacesMap.js';
import { EstadoCarga } from '../../../shared/ui/EstadoCarga.js';
import { ErrorPanel } from '../../../shared/ui/ErrorPanel.js';
import type { Lugar } from '../../../shared/contracts/api.js';

export function PlacesSection() {
  const categorias = useCategorias();
  const [categoria, setCategoria] = useState('todos');
  const [consulta, setConsulta] = useState('');
  const places = usePlaces(categoria, consulta);
  const [selected, setSelected] = useState<number | null>(null);
  const data = places.state.status === 'success' ? places.state.data ?? [] : [];
  const visibleData = categoria === 'educacion'
    ? data.filter((lugar) => lugar.distanciaM != null && lugar.distanciaM <= 800)
    : data;
  const categoriasData = categorias.status === 'success' ? categorias.data ?? [] : [];
  const selectedPlace = selected === null ? null : visibleData.find((lugar) => lugar.id === selected) ?? null;

  return (
    <section className="mt-8" aria-labelledby="lugares-title">
      <h2 id="lugares-title" className="text-2xl font-bold text-slate-900">{categoria === "parques" ? "Parques y zonas verdes cercanas" : "Lugares de interés"}</h2>
      <p className="mt-1 text-sm text-slate-600">Catálogo curado con fuente por registro. Cobertura parcial para comercio.</p>
      <div className="mt-4 flex flex-wrap gap-2">
        <button type="button" onClick={() => setCategoria('todos')} className={categoria === 'todos' ? 'rounded-full bg-teal-700 px-3 py-1 text-xs font-semibold text-white' : 'rounded-full border border-slate-300 px-3 py-1 text-xs font-semibold text-slate-700'}>Todos</button>
        {categoriasData.map((item) => (
          <button key={item.id} type="button" onClick={() => setCategoria(item.codigo)} className={categoria === item.codigo ? 'rounded-full bg-teal-700 px-3 py-1 text-xs font-semibold text-white' : 'rounded-full border border-slate-300 px-3 py-1 text-xs font-semibold text-slate-700'}>{item.nombre}</button>
        ))}

      </div>
      <input value={consulta} onChange={(event) => setConsulta(event.target.value)} placeholder="Buscar por nombre o dirección" className="mt-4 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm" />
      {places.state.status === 'loading' ? <EstadoCarga label="Cargando lugares…" /> : null}
      {places.state.status === 'error' ? <ErrorPanel message={places.state.message ?? 'Error'} onRetry={places.retry} /> : null}
      {places.state.status === 'success' ? (
        <div className="mt-4 grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
          <ul className="space-y-2">
            {visibleData.map((lugar) => <li key={lugar.id}><button type="button" onClick={() => setSelected(Number(lugar.id))} className="w-full rounded-2xl border border-slate-200 bg-white p-3 text-left shadow-sm hover:border-teal-300"><p className="font-semibold text-slate-900">{lugar.nombre}</p><p className="text-xs text-slate-600">{lugar.categoriaCodigo} · {lugar.direccion ?? 'Sin dirección'}</p><p className="text-xs text-slate-500">{lugar.dentroBarrio ? 'Dentro del barrio' : 'Cercano'} · {lugar.distanciaM === null ? 'sin distancia' : `${Math.round(lugar.distanciaM ?? 0)} m`}</p></button></li>)}
          </ul>
          <PlacesMap lugares={visibleData} selectedId={selected} onSelect={setSelected} />
        </div>
      ) : null}
      {selectedPlace ? <PlaceDetail lugar={selectedPlace} /> : null}
    </section>
  );
}

function PlaceDetail({ lugar }: { lugar: Lugar }) {
  return (
    <article className="mt-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <h3 className="text-lg font-bold text-slate-900">{lugar.nombre}</h3>
      <p className="text-sm text-slate-600">{lugar.categoriaCodigo} · {lugar.tipo ?? 'sin tipo'}</p>
      <p className="text-sm text-slate-600">{lugar.direccion ?? 'Sin dirección'}</p>
      <p className="text-xs text-slate-500">Fuente principal: {lugar.fuentePrincipal} · {lugar.fuentes.join(', ')}</p>
      <p className="text-xs text-slate-500">{lugar.dentroBarrio ? 'Dentro del polígono oficial' : 'Fuera del polígono, en el entorno'}</p>
    </article>
  );
}