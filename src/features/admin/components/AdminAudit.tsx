import { useEffect, useState } from 'react';
import { adminApi } from '../services/adminApi.js';
import { ErrorPanel } from '../../../shared/ui/ErrorPanel.js';

interface AuditEntry {
  id: number;
  usuario: string;
  accion: string;
  entidad: string;
  entidadId: number | null;
  fecha: string;
}

export function AdminAudit({ token }: { token: string }) {
  const [entries, setEntries] = useState<AuditEntry[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [reload, setReload] = useState(0);

  useEffect(() => {
    adminApi.audit(token)
      .then((data) => setEntries(data as AuditEntry[]))
      .catch((e) => setError(e instanceof Error ? e.message : 'Error'));
  }, [token, reload]);

  return (
    <section className="mt-8" aria-labelledby="auditoria-title">
      <div className="flex items-center justify-between">
        <h2 id="auditoria-title" className="text-xl font-bold">Auditoría</h2>
        <button type="button" onClick={() => setReload((value) => value + 1)} className="text-sm text-teal-800">Actualizar auditoría</button>
      </div>
      {error ? <ErrorPanel message={error} onRetry={() => setError(null)} /> : null}
      <ul className="mt-2 space-y-1 text-xs text-slate-600">
        {entries.map((entry) => <li key={entry.id}>{entry.usuario} · {entry.accion} · {entry.entidad} {entry.entidadId ?? ''} · {entry.fecha}</li>)}
      </ul>
    </section>
  );
}
