import { useDemografia, useSeguridad } from '../hooks/useStats.js';
import { EstadoCarga } from '../../../shared/ui/EstadoCarga.js';
import { ErrorPanel } from '../../../shared/ui/ErrorPanel.js';
import { DemografiaPanel } from './DemografiaPanel.js';

export function StatsSection() {
  const demografia = useDemografia();
  const seguridad = useSeguridad();

  return (
    <section className="mt-8" aria-labelledby="stats-title">
      <h2 id="stats-title" className="text-2xl font-bold text-slate-900">Demografía y seguridad</h2>
      {demografia.status === 'loading' ? <EstadoCarga label="Cargando demografía…" /> : null}
      {demografia.status === 'error' ? <ErrorPanel message={demografia.message ?? 'Error'} onRetry={() => window.location.reload()} /> : null}
      {demografia.status === 'success' ? <DemografiaPanel data={demografia.data!} /> : null}
      {seguridad.status === 'success' ? (
        <article className="mt-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <h3 className="font-bold text-slate-900">Cuadrante de policía</h3>
          <p className="text-sm text-slate-600">{seguridad.data!.cuadrante.nombre} · {seguridad.data!.cuadrante.codigo}</p>
          <p className="text-sm text-slate-600">Teléfono: {seguridad.data!.cuadrante.telefono} · UPZ {seguridad.data!.cuadrante.upz}</p>
          <p className="text-xs text-slate-500">Indicadores corresponden a la localidad de Kennedy, no al barrio. Fuente: {seguridad.data!.cuadrante.fuente}</p>
          <ul className="mt-2 text-xs text-slate-600">{seguridad.data!.capas.map((capa) => <li key={capa.nombre}>{capa.nombre} · {capa.fuente} · {capa.escala}</li>)}</ul>
          <ul className="mt-3 text-sm text-slate-700">{seguridad.data!.indicadores.map((indicador) => <li key={indicador.nombre}>{indicador.nombre} · {indicador.nivel} · {indicador.periodo} · Fuente {indicador.fuente}</li>)}</ul>
          <p className="mt-2 text-xs text-slate-500">Los indicadores de delitos corresponden a la localidad, no al barrio Ciudad Granada.</p>
        </article>
      ) : null}
    </section>
  );
}