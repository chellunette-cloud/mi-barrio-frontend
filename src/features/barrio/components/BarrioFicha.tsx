import { useBarrio } from '../hooks/useBarrio.js';
import { DatoFicha } from '../../../shared/ui/DatoFicha.js';
import { ErrorPanel } from '../../../shared/ui/ErrorPanel.js';
import { EstadoCarga } from '../../../shared/ui/EstadoCarga.js';
import { FuenteDato } from '../../../shared/ui/FuenteDato.js';
import { formatArea, formatInteger } from '../../../shared/lib/format.js';

export function BarrioFicha() {
  const { state, retry } = useBarrio();
  if (state.status === 'loading') return <EstadoCarga label="Cargando ficha del barrio…" />;
  if (state.status === 'error') return <ErrorPanel message={state.message} onRetry={retry} />;

  const data = state.data;
  const fuenteF01 = data.fuentes.find((fuente) => fuente.codigo === 'F-01');
  const fuenteF02 = data.fuentes.find((fuente) => fuente.codigo === 'F-02');

  return (
    <section aria-labelledby="ficha-title">
      <div className="flex flex-wrap items-start justify-between gap-4 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-teal-800">HU-01</p>
          <h2 id="ficha-title" className="mt-1 text-2xl font-bold text-slate-900 sm:text-3xl">
            {data.nombreMostrar}
          </h2>
          <p className="mt-1 text-sm text-slate-600">{data.nombre}</p>
        </div>
        <div className="rounded-full bg-teal-50 px-3 py-1 text-xs font-semibold text-teal-900">
          {data.codigoId ?? 'Código no disponible'}
        </div>
      </div>

      <dl className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <DatoFicha label="Localidad" value={`${data.localidad.nombre} (${data.localidad.codigo})`} />
        <DatoFicha label="UPZ" value={`${data.upz.nombre} (${data.upz.codigo})`} />
        <DatoFicha label="UPL" value={data.upl} />
        <DatoFicha
          label="Área oficial"
          value={`${formatArea(data.area.hectareas, data.area.metrosCuadrados)}`}
          detail="Área oficial del registro y área geodésica calculada"
        />
        <DatoFicha label="Lotes" value={formatInteger(data.lotes)} />
        <DatoFicha
          label="Población estimada"
          value={formatInteger(data.poblacion.valor)}
          detail={data.poblacion.etiqueta}
        />
        <DatoFicha
          label="Estrato predominante"
          value={data.estratoPredominante ?? 'Información no disponible'}
          detail={`${formatInteger(data.manzanasEstrato2)} manzanas verificadas`}
        />
        <DatoFicha label="Centroide" value={`${data.centroide.lat}, ${data.centroide.lon}`} detail="WGS84" />
        <DatoFicha
          label="Historia del barrio"
          value="Información no disponible"
          detail="No se publica texto histórico sin fuente documental verificada."
        />
      </dl>

      <div className="mt-5 grid gap-3 md:grid-cols-2">
        {fuenteF01 ? (
          <FuenteDato
            fuente={fuenteF01}
            campos="Nombre, localidad, UPZ, UPL, área, lotes, población y polígono."
          />
        ) : null}
        {fuenteF02 ? (
          <FuenteDato fuente={fuenteF02} campos="Estrato predominante y manzanas verificadas." />
        ) : null}
      </div>
      <p className="mt-3 text-xs text-slate-500">
        Solo se publican datos con fuente documental verificada. Si un dato no tiene fuente, no se
        publica y se muestra “Información no disponible”.
      </p>
    </section>
  );
}
