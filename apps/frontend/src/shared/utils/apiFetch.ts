import { ApiError } from "./apiError";

export async function apiFetch<T>(
  input: RequestInfo,
  init?: RequestInit,
): Promise<T> {
  const res = await fetch(input, init);

  if (!res.ok) {
    let data;
    try {
      data = await res.json();
    } catch {}

    throw new ApiError(data?.message || res.statusText, res.status, data);
  }

  return res.json();
}
