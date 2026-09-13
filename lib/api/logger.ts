const SENSITIVE_KEYS = new Set([
  "password",
  "currentPassword",
  "newPassword",
  "confirmPassword",
]);

function redactSensitiveData(value: unknown): unknown {
  if (Array.isArray(value)) {
    return value.map(redactSensitiveData);
  }

  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value).map(([key, entry]) => [
        key,
        SENSITIVE_KEYS.has(key) ? "[REDACTED]" : redactSensitiveData(entry),
      ])
    );
  }

  return value;
}

function parseRequestBody(body: BodyInit | null | undefined): unknown {
  if (!body || typeof body !== "string") {
    return body ?? null;
  }

  try {
    return JSON.parse(body);
  } catch {
    return body;
  }
}

export function logApiRequest(
  method: string,
  url: string,
  options: RequestInit = {}
) {
  if (process.env.NODE_ENV !== "development") {
    return;
  }

  const requestBody = redactSensitiveData(parseRequestBody(options.body));

  console.groupCollapsed(`[API] → ${method} ${url}`);
  console.log("Request", { method, url, body: requestBody });
  console.groupEnd();
}

export function logApiResponse(
  method: string,
  url: string,
  status: number,
  body: unknown
) {
  if (process.env.NODE_ENV !== "development") {
    return;
  }

  const style = status >= 400 ? "color: #ef4444" : "color: #22c55e";

  console.groupCollapsed(`%c[API] ← ${status} ${method} ${url}`, style);
  console.log("Response", { status, body });
  console.groupEnd();
}

export function logApiError(method: string, url: string, error: unknown) {
  if (process.env.NODE_ENV !== "development") {
    return;
  }

  console.groupCollapsed(`%c[API] ✕ ${method} ${url}`, "color: #ef4444");
  console.error("Error", error);
  console.groupEnd();
}
