import { HomePage } from '../pages/HomePage.js';
import { AdminPage } from '../features/admin/components/AdminPage.js';

export function App() {
  if (window.location.hash === '#admin') return <AdminPage />;
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <a href="#contenido" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-teal-900 focus:px-4 focus:py-2 focus:text-white">
        Saltar al contenido principal
      </a>
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-teal-800">Mi Barrio</p>
          <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">Ciudad Granada</h1>
          <p className="mt-1 text-sm text-slate-600">Localidad de Kennedy · Bogotá D.C. · Información territorial oficial</p>
        </div>
      </header>
      <main id="contenido" className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <HomePage />
      </main>
      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-6 text-xs leading-5 text-slate-600 sm:px-6 lg:px-8">
          <p>Fase 1 · HU-01 y HU-02. Fuentes: SDP/UAECD – IDECA. Los datos se publican con su entidad, URL y fecha de consulta.</p>
        </div>
      </footer>
    </div>
  );
}