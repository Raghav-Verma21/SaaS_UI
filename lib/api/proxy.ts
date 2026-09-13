import { loadEnvConfig } from "@next/env";

loadEnvConfig(process.cwd());

/** Server-only backend URL for the API route proxy. */
export function getApiProxyTarget(): string {
  const target = process.env.API_PROXY_TARGET?.trim();

  if (target) {
    return target.replace(/\/$/, "");
  }

  if (process.env.NODE_ENV === "production") {
    throw new Error(
      "API_PROXY_TARGET must be set in production. " +
        "Set it in your hosting env vars or in .env.local for local builds."
    );
  }

  // Prefer 127.0.0.1 over localhost to avoid IPv6 connection issues.
  return "http://127.0.0.1:8080";
}

export function buildBackendUrl(path: string[], search: string): string {
  const targetPath = `/api/${path.join("/")}`;
  return `${getApiProxyTarget()}${targetPath}${search}`;
}
