import { useEffect, useState } from 'react';
import { adminApi } from '../services/adminApi.js';
import { AdminAudit } from './AdminAudit.js';
import { AdminCategorias } from './AdminCategorias.js';
import { AdminLogin } from './AdminLogin.js';
import { AdminLugares } from './AdminLugares.js';
import type { AdminCategoria } from '../adminTypes.js';

export function AdminPage() {
  const [token, setToken] = useState<string | null>(null);
  const [categorias, setCategorias] = useState<AdminCategoria[]>([]);
  const [revision, setRevision] = useState(0);

  async function loadCategorias() {
    if (!token) return;
    try { setCategorias(await adminApi.listCategorias(token) as AdminCategoria[]); } catch { setCategorias([]); }
  }
  useEffect(() => { void loadCategorias(); }, [token, revision]);

  function refresh() {
    setRevision((value) => value + 1);
  }

  if (!token) {
    return <AdminLogin onLogin={async (username, password) => {
      const session = await adminApi.login(username, password) as { accessToken: string };
      setToken(session.accessToken);
    }} />;
  }

  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="text-2xl font-bold">Panel administrativo</h1>
      <AdminLugares token={token} categorias={categorias} revision={revision} onChanged={refresh} />
      <AdminCategorias token={token} categorias={categorias} onChanged={refresh} />
      <AdminAudit token={token} />
    </main>
  );
}
