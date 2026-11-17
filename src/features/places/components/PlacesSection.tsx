import { useState } from 'react';
import { useCategorias, usePlaces } from '../hooks/usePlaces.js';
import { PlacesMap } from './PlacesMap.js';
import { EstadoCarga } from '../../../shared/ui/EstadoCarga.js';
import { ErrorPanel } from '../../../shared/ui/ErrorPanel.js';
import type { Lugar } from '../../../shared/contracts/api.js';

export function PlacesSection() {
  const categorias = useCategorias();
  const [selected, setSelected] = useState<string[]>([]);
  const [consulta, setConsulta] = useState('');
  const places = usePlaces(consulta);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const allData = places.state.status === 'success' ? places.state.data ?? [] : [];
  const categoriasData = categorias.status === 'success' ? categorias.data ?? [] : [];
  const visibleData = allData.filter((lugar) => {
    const categoryOk = selected.length === 0 || selected.includes(lugar.categoriaCodigo);
    const distanceOk = lugar.categoriaCodigo !== 'educacion' || (lugar.distanciaM != null && lugar.distanciaM <= 800);
    return categoryOk && distanceOk;
  });
  const selectedPlace = selectedId === null ? null : visibleData.find((lugar) => lugar.id === selectedId) ?? null;
  const salud = nearest(allData.filter((lugar) => lugar.categoriaCodigo === 'salud'));
  const transporte = allData.filter((lugar) => lugar.categoriaCodigo === 'transporte');
  const minSalud = salud[0]?.distanciaM;

  function toggle(code: string) {
    setSelected((current) => current.includes(code) ? current.filter((item) => item !== code) : [...current, code]);
  }

  return (
    <section className="mt-8" aria-labelledby="lugares-title">
      <h2 id="lugares-title" className="text-2xl font-bold text-slate-900">{selected.includes('parques') ? 'Parques y zonas verdes cercanas' : 'Lugares de interés'}</h2>
      <p className="mt-1 text-sm text-slate-600">Catálogo curado con fuente por registro. Cobertura parcial para comercio.</p>
      <div className="mt-4 flex flex-wrap gap-2">
        <button type="button" onClick={() => setSelected([])} className={selected.length === 0 ? 'rounded-full bg-teal-700 px-3 py-1 text-xs font-semibold text-white' : 'rounded-full border border-slate-300 px-3 py-1 text-xs font-semibold text-slate-700'}>Limpiar filtros</button>
        {categoriasData.map((item) => (
          <button key={item.id} type="button" onClick={() => toggle(item.codigo)} className={selected.includes(item.codigo) ? 'rounded-full bg-teal-700 px-3 py-1 text-xs font-semibold text-white' : 'rounded-full border border-slate-300 px-3 py-1 text-xs font-semibold text-slate-700'}>{item.nombre}</button>
        ))}
      </div>
      <input value={consulta} onChange={(event) => setConsulta(event.target.value)} placeholder="Buscar por nombre o dirección" className="mt-4 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm" />
      {selected.includes('salud') ? <p className="mt-3 rounded-xl bg-teal-50 p-3 text-sm text-teal-900">Servicios de salud cercanos: {salud.length}. No hay prestadores dentro del polígono. Distancia mínima: {minSalud == null ? 'no disponible' : `${Math.round(minSalud)} m`}.</p> : null}
      {selected.includes('transporte') ? <p className="mt-3 rounded-xl bg-teal-50 p-3 text-sm text-teal-900">Paraderos SITP cercanos: {transporte.filter((lugar) => lugar.tipo === 'paradero').length}. Estación más cercana: {nearest(transporte.filter((lugar) => lugar.tipo === 'estacion'))[0]?.nombre ?? 'no disponible'} · {distancia(nearest(transporte.filter((lugar) => lugar.tipo === 'estacion'))[0])}. Portal más cercano: {nearest(transporte.filter((lugar) => lugar.tipo === 'portal'))[0]?.nombre ?? 'no disponible'} · {distancia(nearest(transporte.filter((lugar) => lugar.tipo === 'portal'))[0])}. Los paraderos incluyen el código SITP de la fuente F-15; no se muestran rutas, horarios, frecuencias ni tiempos de llegada.</p> : null}
      {places.state.status === 'loading' ? <EstadoCarga label="Cargando lugares…" /> : null}
      {places.state.status === 'error' ? <ErrorPanel message={places.state.message ?? 'Error'} onRetry={places.retry} /> : null}
      {places.state.status === 'success' ? (
        <>
          <p aria-live="polite" className="mt-3 text-xs font-semibold text-slate-600">{visibleData.length} lugares visibles</p>
          {visibleData.length === 0 ? <p className="mt-2 rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">No se encontraron lugares con los filtros seleccionados.</p> : null}
          <div className="mt-4 grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
            <ul className="space-y-2">
              {visibleData.map((lugar) => <li key={lugar.id} data-categoria={lugar.categoriaCodigo}><button type="button" onClick={() => setSelectedId(lugar.id)} className="w-full rounded-2xl border border-slate-200 bg-white p-3 text-left shadow-sm hover:border-teal-300"><p className="font-semibold text-slate-900">{lugar.nombre}</p><p className="text-xs text-slate-600">{lugar.tipo ?? lugar.categoriaCodigo} · {lugar.direccion ?? 'Dirección no disponible'}</p><p className="text-xs text-slate-500">{lugar.dentroBarrio ? 'Dentro del barrio' : 'Cercano'} · {lugar.distanciaM == null ? 'sin distancia' : `${Math.round(lugar.distanciaM)} m`}</p></button></li>)}
            </ul>
            <PlacesMap lugares={visibleData} selectedId={selectedId} onSelect={setSelectedId} />
          </div>
        </>
      ) : null}
      {selectedPlace ? <PlaceDetail lugar={selectedPlace} /> : null}
    </section>
  );
}

function nearest(lugares: Lugar[]): Lugar[] {
  return [...lugares].sort((a, b) => (a.distanciaM ?? Infinity) - (b.distanciaM ?? Infinity));
}

function distancia(lugar?: Lugar): string {
  return lugar?.distanciaM == null ? 'distancia no disponible' : `${Math.round(lugar.distanciaM)} m`;
}

function PlaceDetail({ lugar }: { lugar: Lugar }) {
  return (
    <article className="mt-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <h3 className="text-lg font-bold text-slate-900">{lugar.nombre}</h3>
      <p className="text-sm text-slate-600">{lugar.categoriaCodigo} · {lugar.tipo ?? 'sin tipo'}</p>
      <p className="text-sm text-slate-600">Dirección: {lugar.direccion ?? 'no disponible'}</p>
      {lugar.codigo ? <p className="text-sm text-slate-600">Código SITP: {lugar.codigo}</p> : null}
      <p className="text-sm text-slate-600">{lugar.dentroBarrio ? 'Dentro del polígono oficial' : 'Fuera del polígono, en el entorno'} · {distancia(lugar)}</p>
      <p className="text-xs text-slate-500">Identificador interno: {lugar.id} · Fuente principal: {lugar.fuentePrincipal} · {lugar.fuentes.join(', ')}</p>
    </article>
  );
}
