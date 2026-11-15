import type { ReactNode } from 'react';

interface DatoFichaProps {
  label: string;
  value: ReactNode;
  detail?: string;
}

export function DatoFicha({ label, value, detail }: DatoFichaProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</dt>
      <dd className="mt-1 text-lg font-semibold text-slate-900">{value ?? 'Información no disponible'}</dd>
      {detail ? <p className="mt-1 text-sm text-slate-600">{detail}</p> : null}
    </div>
  );
}
