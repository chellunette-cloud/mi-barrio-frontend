import { useDemografia, useSeguridad } from '../hooks/useStats.js';
import { EstadoCarga } from '../../../shared/ui/EstadoCarga.js';
import { ErrorPanel } from '../../../shared/ui/ErrorPanel.js';

export function StatsSection() {
  const demografia = useDemografia();
  const seguridad = useSeguridad();

  return (
    <section className="mt-8" aria-labelledby="stats-title">
      <h2 id="stats-title" className="text-2xl font-bold text-slate-900">Demografía y seguridad</h2>
      {demografia.status === 'loading' ? <EstadoCarga label="Cargando demografía…" /> : null}
      {demografia.status === 'error' ? <ErrorPanel message={demografia.message ?? 'Error'} onRetry={() => window.location.reload()} /> : null}
      {demografia.status === 'success' ? (
        <div className="mt-4 grid gap-4 lg:grid-cols-2">
          <article className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <h3 className="font-bold text-slate-900">Barrio Ciudad Granada</h3>
            <p className="text-sm text-slate-600">Población: {demografia.data!.barrio.poblacion.valor} ({demografia.data!.barrio.poblacion.etiqueta})</p>
            <p className="text-sm text-slate-600">Estrato: {demografia.data!.barrio.estrato} · Área: {demografia.data!.barrio.areaHectareas} ha</p>
            <p className="text-xs text-slate-500">Fuente: {demografia.data!.barrio.fuente}</p>
          </article>
          <article className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <h3 className="font-bold text-slate-900">UPZ 82 Patio Bonito</h3>
            <p className="text-sm text-slate-600">Población 2025: {demografia.data!.upz.poblacion.valor} (H {demografia.data!.upz.poblacion.hombres} / M {demografia.data!.upz.poblacion.mujeres})</p>
            <p className="text-xs text-slate-500">Fuente: {demografia.data!.upz.fuente}</p>
          </article>
        </div>
      ) : null}
      {seguridad.status === 'success' ? (
        <article className="mt-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <h3 className="font-bold text-slate-900">Cuadrante de policía</h3>
          <p className="text-sm text-slate-600">{seguridad.data!.cuadrante.nombre} · {seguridad.data!.cuadrante.codigo}</p>
          <p className="text-sm text-slate-600">Teléfono: {seguridad.data!.cuadrante.telefono} · UPZ {seguridad.data!.cuadrante.upz}</p>
          <p className="text-xs text-slate-500">Indicadores corresponden a la localidad de Kennedy, no al barrio. Fuente: {seguridad.data!.cuadrante.fuente}</p>
          <ul className="mt-2 text-xs text-slate-600">{seguridad.data!.capas.map((capa) => <li key={capa.nombre}>{capa.nombre} · {capa.fuente} · {capa.escala}</li>)}</ul>
        </article>
      ) : null}
    </section>
  );
}