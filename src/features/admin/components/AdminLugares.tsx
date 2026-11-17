import { useEffect, useState } from 'react';
import { adminApi } from '../services/adminApi.js';
import { ErrorPanel } from '../../../shared/ui/ErrorPanel.js';
import type { AdminCategoria, AdminLugar } from '../adminTypes.js';

interface Props {
  token: string;
  categorias: AdminCategoria[];
  revision: number;
  onChanged: () => void;
}

export function AdminLugares({ token, categorias, revision, onChanged }: Props) {
  const [lugares, setLugares] = useState<AdminLugar[]>([]);
  const [nombre, setNombre] = useState('');
  const [categoriaId, setCategoriaId] = useState(1);
  const [lat, setLat] = useState(4.641833);
  const [lon, setLon] = useState(-74.171758);
  const [publicado, setPublicado] = useState(true);
  const [editing, setEditing] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    try { setLugares(await adminApi.list(token) as AdminLugar[]); } catch (e) { setError(mensaje(e)); }
  }
  useEffect(() => { void load(); }, [token, revision]);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    const body = { categoriaId, nombre, lat, lon, publicado };
    try {
      if (editing) await adminApi.update(token, editing, body);
      else await adminApi.create(token, body);
      cancelar(); await load(); onChanged();
    } catch (e) { setError(mensaje(e)); }
  }

  function editar(lugar: AdminLugar) {
    setEditing(lugar.id); setNombre(lugar.nombre); setCategoriaId(lugar.categoriaId);
    setLat(lugar.lat); setLon(lugar.lon); setPublicado(lugar.publicado);
  }
  function cancelar() { setEditing(null); setNombre(''); setPublicado(true); }
  async function despublicar(lugar: AdminLugar) {
    try { await adminApi.update(token, lugar.id, { publicado: !lugar.publicado }); await load(); } catch (e) { setError(mensaje(e)); }
  }
  async function eliminar(id: number) {
    try { await adminApi.remove(token, id); await load(); onChanged(); } catch (e) { setError(mensaje(e)); }
  }

  return (
    <section className="mt-6" aria-labelledby="lugares-admin-title">
      <h2 id="lugares-admin-title" className="text-xl font-bold">Lugares</h2>
      <form onSubmit={submit} className="mt-3 grid gap-2 sm:grid-cols-6">
        <input value={nombre} onChange={(e) => setNombre(e.target.value)} placeholder="Nombre" className="rounded-xl border border-slate-300 px-3 py-2" />
        <select value={categoriaId} onChange={(e) => setCategoriaId(Number(e.target.value))} aria-label="Categoría" className="rounded-xl border border-slate-300 px-3 py-2">
          {categorias.map((categoria) => <option key={categoria.id} value={categoria.id}>{categoria.nombre}</option>)}
        </select>
        <input type="number" value={lat} onChange={(e) => setLat(Number(e.target.value))} placeholder="Lat" className="rounded-xl border border-slate-300 px-3 py-2" />
        <input type="number" value={lon} onChange={(e) => setLon(Number(e.target.value))} placeholder="Lon" className="rounded-xl border border-slate-300 px-3 py-2" />
        <label className="flex items-center gap-1 text-xs"><input type="checkbox" checked={publicado} onChange={(e) => setPublicado(e.target.checked)} />Publicado</label>
        <button className="rounded-xl bg-teal-700 px-4 py-2 text-white">{editing ? 'Actualizar' : 'Crear'}</button>
      </form>
      {editing ? <button type="button" onClick={cancelar} className="mt-2 text-sm text-slate-600">Cancelar edición</button> : null}
      {error ? <ErrorPanel message={error} onRetry={() => setError(null)} /> : null}
      <ul className="mt-4 space-y-2" aria-label="Lugares administrables">
        {lugares.map((lugar) => (
          <li key={lugar.id} className="flex items-center justify-between gap-2 rounded-xl border border-slate-200 p-3">
            <span>{lugar.nombre} ({lugar.categoriaId})</span>
            <span className="flex gap-2 text-sm">
              <button type="button" onClick={() => editar(lugar)} className="text-teal-800">Editar</button>
              <button type="button" onClick={() => void despublicar(lugar)} className="text-amber-700">{lugar.publicado ? 'Despublicar' : 'Publicar'}</button>
              <button type="button" onClick={() => void eliminar(lugar.id)} className="text-red-700">Eliminar lugar</button>
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}

function mensaje(error: unknown): string {
  return error instanceof Error ? error.message : 'Error';
}
