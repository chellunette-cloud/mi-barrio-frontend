import type { Demografia } from '../../../shared/contracts/api.js';
import { formatInteger } from '../../../shared/lib/format.js';

export function DemografiaPanel({ data }: { data: Demografia }) {
  return (
    <div className="mt-4 grid gap-4 lg:grid-cols-2">
      <article className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <h3 className="font-bold text-slate-900">Barrio Ciudad Granada</h3>
        <p className="text-sm text-slate-600">Población: {formatInteger(data.barrio.poblacion.valor)} ({data.barrio.poblacion.etiqueta})</p>
        <p className="text-sm text-slate-600">Estrato: {data.barrio.estrato} · Área: {data.barrio.areaHectareas} ha</p>
        <p className="text-xs text-slate-500">Fuente: {data.barrio.fuente}</p>
      </article>
      <article className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <h3 className="font-bold text-slate-900">UPZ 82 Patio Bonito</h3>
        <p className="text-sm text-slate-600">Población {data.upz.poblacion.anio}: {formatInteger(data.upz.poblacion.valor)} (H {formatInteger(data.upz.poblacion.hombres)} / M {formatInteger(data.upz.poblacion.mujeres)})</p>
        <p className="text-xs text-slate-500">Fuente: {data.upz.fuente}. La distribución por edad y sexo está disponible solo por quinquenios a nivel UPZ; no se prorratea al barrio.</p>
        <details className="mt-3 text-sm">
          <summary className="cursor-pointer font-semibold text-teal-800">Ver quinquenios por sexo (UPZ 082, {data.upz.poblacion.anio})</summary>
          <div className="mt-2 overflow-x-auto">
            <table className="w-full text-left text-xs" aria-label="Quinquenios de la UPZ 082">
              <thead><tr><th>Edad</th><th>Hombres</th><th>Mujeres</th><th>Total</th></tr></thead>
              <tbody>
                {data.upz.quinquenios.map((group) => (
                  <tr key={group.edad}>
                    <td>{group.edad}</td><td>{formatInteger(group.hombres)}</td>
                    <td>{formatInteger(group.mujeres)}</td><td>{formatInteger(group.total)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </details>
      </article>
    </div>
  );
}
