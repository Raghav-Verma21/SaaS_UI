/**
 * API URL resolution — browser always calls same-origin `/api/*`.
 *
 * The Next.js server proxies those requests to the backend via `API_PROXY_TARGET`
 * (server-only env var). The backend URL is never exposed to the client, which
 * avoids CORS and keeps the API origin off the public internet when desired.
 *
 * Do NOT use NEXT_PUBLIC_* for the backend URL — that embeds it in client JS.
 */

const API_PATH_PREFIX = "/api/";

/** Relative same-origin path used by all client-side API calls. */
export function getApiUrl(path: string): string {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;

  if (!normalizedPath.startsWith(API_PATH_PREFIX)) {
    throw new Error(
      `API path must start with "${API_PATH_PREFIX}". Received: ${normalizedPath}`
    );
  }

  return normalizedPath;
}
