import { useState } from 'react';
import { adminApi } from '../services/adminApi.js';
import { ErrorPanel } from '../../../shared/ui/ErrorPanel.js';
import { ApiError } from '../../../shared/api/http.js';
import type { AdminCategoria } from '../adminTypes.js';

interface Props {
  token: string;
  categorias: AdminCategoria[];
  onChanged: () => void;
}
export function AdminCategorias({ token, categorias, onChanged }: Props) {
  const [codigo, setCodigo] = useState('');
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [activa, setActiva] = useState(true);
  const [editing, setEditing] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [protectedId, setProtectedId] = useState<number | null>(null);
  const [targetId, setTargetId] = useState('');

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    const body = { codigo, nombre, descripcion, activa };
    try {
      if (editing) await adminApi.updateCategoria(token, editing, body);
      else await adminApi.createCategoria(token, body);
      reset(); onChanged();
    } catch (e) { setError(mensaje(e)); }
  }

  function editar(categoria: AdminCategoria) {
    setEditing(categoria.id); setCodigo(categoria.codigo); setNombre(categoria.nombre);
    setDescripcion(categoria.descripcion); setActiva(categoria.activa);
  }
  function reset() { setEditing(null); setCodigo(''); setNombre(''); setDescripcion(''); setActiva(true); }

  async function eliminar(categoria: AdminCategoria) {
    try {
      await adminApi.removeCategoria(token, categoria.id);
      cancelarProteccion(); onChanged();
    } catch (e) {
      if (e instanceof ApiError && e.code === 'CATEGORIA_CON_LUGARES') {
        setProtectedId(categoria.id); setError(null);
      } else { setError(mensaje(e)); }
    }
  }

  async function reasignar() {
    if (!protectedId || !targetId) return;
    try {
      await adminApi.removeCategoria(token, protectedId, Number(targetId));
      cancelarProteccion(); onChanged();
    } catch (e) { setError(mensaje(e)); }
  }
  function cancelarProteccion() { setProtectedId(null); setTargetId(''); }

  return (
    <section className="mt-8" aria-labelledby="categorias-admin-title">
      <h2 id="categorias-admin-title" className="text-xl font-bold">Categorías</h2>
      <form onSubmit={submit} className="mt-3 grid gap-2 sm:grid-cols-5">
        <input value={codigo} onChange={(e) => setCodigo(e.target.value)} placeholder="Código" className="rounded-xl border border-slate-300 px-3 py-2" />
        <input value={nombre} onChange={(e) => setNombre(e.target.value)} placeholder="Nombre de categoría" className="rounded-xl border border-slate-300 px-3 py-2" />
        <input value={descripcion} onChange={(e) => setDescripcion(e.target.value)} placeholder="Descripción" className="rounded-xl border border-slate-300 px-3 py-2" />
        <label className="flex items-center gap-1 text-xs"><input type="checkbox" checked={activa} onChange={(e) => setActiva(e.target.checked)} />Activa</label>
        <button className="rounded-xl bg-teal-700 px-4 py-2 text-white">{editing ? 'Actualizar categoría' : 'Crear categoría'}</button>
      </form>
      {editing ? <button type="button" onClick={reset} className="mt-2 text-sm text-slate-600">Cancelar edición de categoría</button> : null}
      {error ? <ErrorPanel message={error} onRetry={() => setError(null)} /> : null}
      {protectedId ? (
        <div role="alert" className="mt-3 rounded-xl border border-amber-300 bg-amber-50 p-3">
          <p className="text-sm text-amber-900">La categoría tiene lugares asociados. Elija una categoría destino para reasignarlos antes de eliminarla.</p>
          <div className="mt-2 flex flex-wrap gap-2">
            <select aria-label="Categoría destino" value={targetId} onChange={(e) => setTargetId(e.target.value)} className="rounded-xl border border-slate-300 px-3 py-2 text-sm">
              <option value="">Seleccione una categoría</option>
              {categorias.filter((item) => item.id !== protectedId && item.activa).map((item) => <option key={item.id} value={item.id}>{item.nombre}</option>)}
            </select>
            <button type="button" onClick={() => void reasignar()} disabled={!targetId} className="rounded-xl bg-teal-700 px-3 py-2 text-sm text-white disabled:opacity-50">Reasignar y eliminar</button>
            <button type="button" onClick={cancelarProteccion} className="text-sm text-slate-600">Cancelar</button>
          </div>
        </div>
      ) : null}
      <ul className="mt-4 space-y-2" aria-label="Categorías administrables">
        {categorias.map((categoria) => (
          <li key={categoria.id} className="flex items-center justify-between gap-2 rounded-xl border border-slate-200 p-3">
            <span>{categoria.nombre} · {categoria.codigo} · {categoria.activa ? 'Activa' : 'Inactiva'}</span>
            <span className="flex gap-2 text-sm">
              <button type="button" onClick={() => editar(categoria)} className="text-teal-800">Editar categoría</button>
              <button type="button" onClick={() => void eliminar(categoria)} className="text-red-700">Eliminar categoría</button>
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
