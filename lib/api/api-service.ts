import { getApiUrl } from "@/lib/api/config";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import {
  logApiError,
  logApiRequest,
  logApiResponse,
} from "@/lib/api/logger";
import type { ApiErrorBody, RefreshTokenResponse } from "@/lib/api/types";
import {
  clearTokens,
  getBearerTokenForApi,
  getRefreshToken,
  setAccessToken,
} from "@/lib/auth/tokens";

export type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export interface ApiRequestOptions {
  endpoint: string;
  method?: HttpMethod;
  pathParams?: Record<string, string>;
  queryParams?: Record<string, string | number | boolean | null | undefined>;
  body?: unknown;
  formData?: FormData;
}

const PUBLIC_API_PATH_PREFIXES = [
  "/api/auth/login",
  "/api/auth/refreshToken",
  "/api/new/",
] as const;

export const ACCESS_TOKEN_EXPIRED_ERROR = "ACCESS_TOKEN_EXPIRED";
export const AUTH_SESSION_EXPIRED_EVENT = "auth:session-expired";
export const AUTH_TOKEN_REFRESHED_EVENT = "auth:token-refreshed";

export class ApiError extends Error {
  readonly status: number;
  readonly body: ApiErrorBody | null;

  constructor(message: string, status: number, body: ApiErrorBody | null = null) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.body = body;
  }
}

let refreshAccessTokenPromise: Promise<void> | null = null;
const inflightGetRequests = new Map<string, Promise<unknown>>();

function getInflightRequestKey(
  method: HttpMethod,
  path: string,
  hasRetried: boolean
): string | null {
  if (method !== "GET") {
    return null;
  }

  return `${method}:${path}:${hasRetried ? "retry" : "initial"}`;
}

function shouldAttachAuth(path: string): boolean {
  return !PUBLIC_API_PATH_PREFIXES.some((prefix) => path.startsWith(prefix));
}

function getErrorMessage(body: ApiErrorBody | null, fallback: string): string {
  const directMessage = body?.message?.trim();
  if (directMessage) {
    return directMessage;
  }

  const apiMessage = body?.errorList?.[0]?.message;
  return apiMessage?.trim() || fallback;
}

function isSuccessfulResponse(body: ApiErrorBody | null): boolean {
  if (!body) {
    return true;
  }

  if (body.success === "OK" || body.success === true) {
    return true;
  }

  if (Array.isArray(body.errorList) && body.errorList.length > 0) {
    return false;
  }

  return body.success !== false;
}

function isAccessTokenExpiredResponse(
  status: number,
  body: ApiErrorBody | null
): boolean {
  return status === 401 && body?.error === ACCESS_TOKEN_EXPIRED_ERROR;
}

function notifySessionExpired() {
  clearTokens();

  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent(AUTH_SESSION_EXPIRED_EVENT));
  }
}

function resolveEndpoint(
  endpoint: string,
  pathParams?: Record<string, string>
): string {
  if (!pathParams) {
    return endpoint;
  }

  return Object.entries(pathParams).reduce((path, [key, value]) => {
    return path.replace(`{${key}}`, encodeURIComponent(value));
  }, endpoint);
}

function appendQueryParams(
  path: string,
  queryParams?: Record<string, string | number | boolean | null | undefined>
): string {
  if (!queryParams) {
    return path;
  }

  const searchParams = new URLSearchParams();

  for (const [key, value] of Object.entries(queryParams)) {
    if (value != null) {
      searchParams.set(key, String(value));
    }
  }

  const queryString = searchParams.toString();
  return queryString ? `${path}?${queryString}` : path;
}

function buildRequestBody(
  body: unknown | undefined,
  formData: FormData | undefined
): BodyInit | undefined {
  if (formData) {
    return formData;
  }

  if (body == null) {
    return undefined;
  }

  return JSON.stringify(body);
}

function buildHeaders(
  path: string,
  method: HttpMethod,
  requestBody: BodyInit | undefined,
  formData: FormData | undefined
): Headers {
  const headers = new Headers();

  if (formData) {
    // Let the browser set multipart boundaries.
  } else if (requestBody != null) {
    headers.set("Content-Type", "application/json");
  } else if (method === "GET" && shouldAttachAuth(path)) {
    // Some Spring endpoints declare consumes=application/json on GET.
    headers.set("Content-Type", "application/json");
  }

  if (shouldAttachAuth(path)) {
    const bearerToken = getBearerTokenForApi();
    if (bearerToken) {
      headers.set("Authorization", `Bearer ${bearerToken}`);
    }
  }

  return headers;
}

async function parseJsonResponse<TResponse>(
  response: Response
): Promise<(TResponse & ApiErrorBody) | null> {
  const contentType = response.headers.get("content-type") ?? "";
  const isJson = contentType.includes("application/json");

  if (!isJson) {
    return null;
  }

  return (await response.json()) as TResponse & ApiErrorBody;
}

async function refreshAccessTokenInternal(): Promise<void> {
  const refreshToken = getRefreshToken();

  if (!refreshToken) {
    notifySessionExpired();
    throw new ApiError("Session expired. Please log in again.", 401, {
      error: ACCESS_TOKEN_EXPIRED_ERROR,
    });
  }

  const url = getApiUrl(API_ENDPOINTS.AUTH_REFRESH_TOKEN);

  logApiRequest("POST", url, {
    body: JSON.stringify({ refreshToken: "[REDACTED]" }),
  });

  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refreshToken }),
    credentials: "same-origin",
  });

  const body = await parseJsonResponse<RefreshTokenResponse>(response);
  logApiResponse("POST", url, response.status, body);

  if (!response.ok || !body?.accessToken) {
    notifySessionExpired();
    throw new ApiError(
      getErrorMessage(body, "Unable to refresh session. Please log in again."),
      response.status,
      body
    );
  }

  setAccessToken(body.accessToken);

  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent(AUTH_TOKEN_REFRESHED_EVENT));
  }
}

async function ensureFreshAccessToken(): Promise<void> {
  if (!refreshAccessTokenPromise) {
    refreshAccessTokenPromise = refreshAccessTokenInternal().finally(() => {
      refreshAccessTokenPromise = null;
    });
  }

  await refreshAccessTokenPromise;
}

export class ApiService {
  private async executeRequest<TResponse>(
    options: ApiRequestOptions
  ): Promise<{
    response: Response;
    body: (TResponse & ApiErrorBody) | null;
    url: string;
    method: HttpMethod;
    requestBody: BodyInit | undefined;
  }> {
    const method = options.method ?? "GET";
    const path = appendQueryParams(
      resolveEndpoint(options.endpoint, options.pathParams),
      options.queryParams
    );
    const url = getApiUrl(path);
    const requestBody = buildRequestBody(options.body, options.formData);
    const headers = buildHeaders(path, method, requestBody, options.formData);

    logApiRequest(method, url, { body: requestBody });

    const response = await fetch(url, {
      method,
      headers,
      body: requestBody,
      credentials: "same-origin",
    });

    const body = await parseJsonResponse<TResponse>(response);
    logApiResponse(method, url, response.status, body);

    return { response, body, url, method, requestBody };
  }

  private handleFailedResponse<TResponse>(
    response: Response,
    body: (TResponse & ApiErrorBody) | null
  ): never {
    throw new ApiError(
      getErrorMessage(body, `Request failed with status ${response.status}`),
      response.status,
      body
    );
  }

  async request<TResponse>(
    options: ApiRequestOptions,
    hasRetried = false
  ): Promise<TResponse> {
    const path = appendQueryParams(
      resolveEndpoint(options.endpoint, options.pathParams),
      options.queryParams
    );
    const method = options.method ?? "GET";
    const inflightKey = getInflightRequestKey(method, path, hasRetried);

    if (inflightKey) {
      const inflightRequest = inflightGetRequests.get(inflightKey);
      if (inflightRequest) {
        return inflightRequest as Promise<TResponse>;
      }
    }

    const requestPromise = this.executeRequestFlow<TResponse>(
      options,
      path,
      hasRetried
    );

    if (inflightKey) {
      inflightGetRequests.set(inflightKey, requestPromise);
      requestPromise.finally(() => {
        inflightGetRequests.delete(inflightKey);
      });
    }

    return requestPromise;
  }

  private async executeRequestFlow<TResponse>(
    options: ApiRequestOptions,
    path: string,
    hasRetried: boolean
  ): Promise<TResponse> {
    try {
      const { response, body } = await this.executeRequest<TResponse>(options);

      if (
        isAccessTokenExpiredResponse(response.status, body) &&
        shouldAttachAuth(path) &&
        !hasRetried
      ) {
        await ensureFreshAccessToken();
        return this.request<TResponse>(options, true);
      }

      if (!response.ok) {
        this.handleFailedResponse(response, body);
      }

      if (!isSuccessfulResponse(body)) {
        throw new ApiError(
          getErrorMessage(body, "Request failed"),
          response.status,
          body
        );
      }

      return body as TResponse;
    } catch (error) {
      if (!(error instanceof ApiError)) {
        const url = getApiUrl(path);
        logApiError(options.method ?? "GET", url, error);
      }
      throw error;
    }
  }

  get<TResponse>(
    endpoint: string,
    options: Omit<ApiRequestOptions, "endpoint" | "method"> = {}
  ) {
    return this.request<TResponse>({ ...options, endpoint, method: "GET" });
  }

  post<TResponse>(
    endpoint: string,
    body?: unknown,
    options: Omit<ApiRequestOptions, "endpoint" | "method" | "body"> = {}
  ) {
    return this.request<TResponse>({ ...options, endpoint, method: "POST", body });
  }

  postForm<TResponse>(
    endpoint: string,
    formData: FormData,
    options: Omit<ApiRequestOptions, "endpoint" | "method" | "formData"> = {}
  ) {
    return this.request<TResponse>({
      ...options,
      endpoint,
      method: "POST",
      formData,
    });
  }
}

export const api = new ApiService();
