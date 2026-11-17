import { useState } from 'react';
import { ErrorPanel } from '../../../shared/ui/ErrorPanel.js';

export function AdminLogin({ onLogin }: { onLogin: (username: string, password: string) => Promise<void> }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    try { await onLogin(username, password); } catch (e) { setError(e instanceof Error ? e.message : 'Error'); }
  }

  return (
    <main className="mx-auto max-w-md px-4 py-10">
      <h1 className="text-2xl font-bold">Administración</h1>
      <form onSubmit={submit} className="mt-4 space-y-3">
        <input value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Usuario" className="w-full rounded-xl border border-slate-300 px-3 py-2" />
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Contraseña" className="w-full rounded-xl border border-slate-300 px-3 py-2" />
        <button className="rounded-xl bg-teal-700 px-4 py-2 text-white">Ingresar</button>
        {error ? <ErrorPanel message={error} onRetry={() => setError(null)} /> : null}
      </form>
    </main>
  );
}
