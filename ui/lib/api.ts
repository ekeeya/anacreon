export type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000/api/v1";

export async function apiFetch<T>(
  path: string,
  options: { method?: HttpMethod; body?: any; headers?: Record<string, string> } = {}
): Promise<T> {
  const { method = "GET", body, headers = {} } = options;
  const url = `${API_BASE_URL}${path}`;
  const resp = await fetch(url, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
    body: body != null ? JSON.stringify(body) : undefined,
    cache: "no-store",
  });
  if (!resp.ok) {
    const text = await resp.text().catch(() => "");
    throw new Error(`API ${method} ${path} failed: ${resp.status} ${resp.statusText} ${text}`);
  }
  if (resp.status === 204) return undefined as unknown as T;
  return (await resp.json()) as T;
}

export const api = {
  get: <T>(path: string) => apiFetch<T>(path),
  post: <T>(path: string, body: any) => apiFetch<T>(path, { method: "POST", body }),
  put: <T>(path: string, body: any) => apiFetch<T>(path, { method: "PUT", body }),
  patch: <T>(path: string, body: any) => apiFetch<T>(path, { method: "PATCH", body }),
  delete: <T>(path: string) => apiFetch<T>(path, { method: "DELETE" }),
};


