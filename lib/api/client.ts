export { ApiError, api, ApiService } from "@/lib/api/api-service";
export type { ApiRequestOptions, HttpMethod } from "@/lib/api/api-service";

import { api } from "@/lib/api/api-service";
import type { ApiRequestOptions } from "@/lib/api/api-service";

/** @deprecated Use `api.request()` or `api.get()` / `api.post()` instead. */
export function apiClient<TResponse>(
  path: string,
  options: RequestInit = {}
): Promise<TResponse> {
  const method = (options.method ?? "GET").toUpperCase() as ApiRequestOptions["method"];

  if (options.body instanceof FormData) {
    return api.request<TResponse>({
      endpoint: path,
      method,
      formData: options.body,
    });
  }

  let body: unknown;
  if (typeof options.body === "string") {
    try {
      body = JSON.parse(options.body);
    } catch {
      body = options.body;
    }
  }

  return api.request<TResponse>({
    endpoint: path,
    method,
    body,
  });
}
