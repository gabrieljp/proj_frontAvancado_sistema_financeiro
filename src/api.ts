let csrf: { token: string; headerName: string } | null = null;

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}
export async function refreshCsrf() {
  const res = await fetch("/api/csrf", { credentials: "same-origin" });
  if (!res.ok)
    throw new Error(
      "Não foi possível conectar à API. Verifique se o backend está em execução.",
    );
  csrf = await res.json();
}
export async function api<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const headers = new Headers(options.headers);
  if (options.body && !(options.body instanceof URLSearchParams))
    headers.set("Content-Type", "application/json");
  if (options.method && options.method !== "GET") {
    if (!csrf) await refreshCsrf();
    headers.set(csrf!.headerName, csrf!.token);
  }
  let res: Response;
  try {
    res = await fetch(`/api${path}`, {
      ...options,
      headers,
      credentials: "same-origin",
    });
  } catch {
    throw new Error(
      "Sem conexão com o servidor. Verifique o backend e tente novamente.",
    );
  }
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new ApiError(
      [
        body.message || "Não foi possível concluir a operação.",
        ...(body.errors || []),
      ].join(" "),
      res.status,
    );
  }
  return res.status === 204 ? (undefined as T) : res.json();
}
