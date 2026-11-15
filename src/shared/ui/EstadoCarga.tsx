export function EstadoCarga({ label = 'Cargando información…' }: { label?: string }) {
  return (
    <div role="status" aria-live="polite" className="rounded-2xl border border-slate-200 bg-white p-6">
      <p className="text-sm font-medium text-slate-700">{label}</p>
      <div className="mt-4 space-y-3" aria-hidden="true">
        <div className="h-4 w-2/3 animate-pulse rounded bg-slate-200" />
        <div className="h-4 w-1/2 animate-pulse rounded bg-slate-200" />
        <div className="h-4 w-3/4 animate-pulse rounded bg-slate-200" />
      </div>
    </div>
  );
}
