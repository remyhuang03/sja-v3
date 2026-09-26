/** Same-origin requests; infrastructure routes /api to the Go service. */
export async function requestJSON<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(path, { ...init, signal: init?.signal ?? AbortSignal.timeout(120_000) });
  const data = await response.json().catch(() => null);
  if (!response.ok) {
    throw new Error(data?.message || data?.msg || `请求失败（HTTP ${response.status}）`);
  }
  return data as T;
}
