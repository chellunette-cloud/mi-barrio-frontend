import { useEffect, useState } from 'react';
import { adminApi } from '../services/adminApi.js';
import { ErrorPanel } from '../../../shared/ui/ErrorPanel.js';

export function AdminPage() {
  const [token, setToken] = useState<string | null>(null);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [lugares, setLugares] = useState<any[]>([]);
  const [nombre, setNombre] = useState('');
  const [categoriaId, setCategoriaId] = useState(1);
  const [lat, setLat] = useState(4.641833);
  const [lon, setLon] = useState(-74.171758);
  const [editing, setEditing] = useState<number | null>(null);

  async function load() {
    if (!token) return;
    try { setLugares(await adminApi.list(token) as any[]); } catch (e) { setError(e instanceof Error ? e.message : 'Error'); }
  }
  useEffect(() => { void load(); }, [token]);

  async function login(event: React.FormEvent) {
    event.preventDefault();
    try {
      const session = await adminApi.login(username, password) as { accessToken: string };
      setToken(session.accessToken);
      setError(null);
    } catch (e) { setError(e instanceof Error ? e.message : 'Error'); }
  }

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    if (!token) return;
    const body = { categoriaId, nombre, lat, lon, publicado: true };
    try {
      if (editing) await adminApi.update(token, editing, body);
      else await adminApi.create(token, body);
      setEditing(null); setNombre(''); await load();
    } catch (e) { setError(e instanceof Error ? e.message : 'Error'); }
  }

  if (!token) {
    return (
      <main className="mx-auto max-w-md px-4 py-10">
        <h1 className="text-2xl font-bold">Administración</h1>
        <form onSubmit={login} className="mt-4 space-y-3">
          <input value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Usuario" className="w-full rounded-xl border border-slate-300 px-3 py-2" />
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Contraseña" className="w-full rounded-xl border border-slate-300 px-3 py-2" />
          <button className="rounded-xl bg-teal-700 px-4 py-2 text-white">Ingresar</button>
          {error ? <ErrorPanel message={error} onRetry={() => setError(null)} /> : null}
        </form>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="text-2xl font-bold">Panel administrativo</h1>
      <form onSubmit={submit} className="mt-4 grid gap-2 sm:grid-cols-5">
        <input value={nombre} onChange={(e) => setNombre(e.target.value)} placeholder="Nombre" className="rounded-xl border border-slate-300 px-3 py-2" />
        <input type="number" value={categoriaId} onChange={(e) => setCategoriaId(Number(e.target.value))} placeholder="Categoría" className="rounded-xl border border-slate-300 px-3 py-2" />
        <input type="number" value={lat} onChange={(e) => setLat(Number(e.target.value))} placeholder="Lat" className="rounded-xl border border-slate-300 px-3 py-2" />
        <input type="number" value={lon} onChange={(e) => setLon(Number(e.target.value))} placeholder="Lon" className="rounded-xl border border-slate-300 px-3 py-2" />
        <button className="rounded-xl bg-teal-700 px-4 py-2 text-white">{editing ? 'Actualizar' : 'Crear'}</button>
      </form>
      {error ? <ErrorPanel message={error} onRetry={() => setError(null)} /> : null}
      <ul className="mt-4 space-y-2">
        {lugares.map((lugar) => (
          <li key={lugar.id} className="flex items-center justify-between rounded-xl border border-slate-200 p-3">
            <span>{lugar.nombre} ({lugar.categoriaCodigo})</span>
            <button onClick={async () => { await adminApi.remove(token, lugar.id); await load(); }} className="text-sm text-red-700">Eliminar</button>
          </li>
        ))}
      </ul>
    </main>
  );
}