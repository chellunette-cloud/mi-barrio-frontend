import type { Fuente } from '../contracts/api.js';

interface FuenteDatoProps {
  fuente: Fuente;
  campos: string;
}

export function FuenteDato({ fuente, campos }: FuenteDatoProps) {
  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm">
      <p className="font-semibold text-slate-800">
        Fuente {fuente.codigo} · {fuente.entidad}
      </p>
      <p className="mt-1 text-slate-600">{campos}</p>
      <a
        className="mt-1 inline-block break-all text-teal-800 underline decoration-teal-300 underline-offset-2 hover:text-teal-950 focus:outline-none focus:ring-2 focus:ring-teal-600"
        href={fuente.url}
        target="_blank"
        rel="noreferrer noopener"
      >
        {fuente.url}
      </a>
      <p className="mt-1 text-slate-600">
        Consultada el {fuente.fechaConsulta} · Licencia {fuente.licencia}
      </p>
    </div>
  );
}
