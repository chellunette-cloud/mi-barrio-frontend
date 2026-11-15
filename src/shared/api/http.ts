export class ApiError extends Error {
  constructor(
    public readonly status: number,
    public readonly code: string,
    message: string
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export async function fetchJson<T>(path: string, signal: AbortSignal): Promise<T> {
  const baseUrl = import.meta.env.VITE_API_BASE_URL ?? '';
  const response = await fetch(`${baseUrl}${path}`, {
    signal,
    headers: { Accept: 'application/json' }
  });
  if (!response.ok) {
    let code = 'ERROR_API';
    let message = 'No fue posible cargar la información.';
    try {
      const body = (await response.json()) as { error?: { code?: string; message?: string } };
      code = body.error?.code ?? code;
      message = body.error?.message ?? message;
    } catch {
      // La respuesta no es JSON; se usa el mensaje genérico.
    }
    throw new ApiError(response.status, code, message);
  }
  return (await response.json()) as T;
}
