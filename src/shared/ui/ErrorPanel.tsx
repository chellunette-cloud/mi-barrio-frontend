interface ErrorPanelProps {
  message: string;
  onRetry: () => void;
}

export function ErrorPanel({ message, onRetry }: ErrorPanelProps) {
  return (
    <div role="alert" className="rounded-2xl border border-rose-200 bg-rose-50 p-6">
      <p className="font-semibold text-rose-900">No pudimos cargar esta sección</p>
      <p className="mt-1 text-sm text-rose-800">{message}</p>
      <button
        type="button"
        onClick={onRetry}
        className="mt-4 rounded-lg bg-rose-800 px-4 py-2 text-sm font-semibold text-white hover:bg-rose-900 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-2"
      >
        Reintentar
      </button>
    </div>
  );
}
