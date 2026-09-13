export function formatJobStatusLabel(status: string) {
  const normalized = status?.trim().toUpperCase();
  if (!normalized || normalized === "—") return "Pending";
  if (normalized === "SUCCEEDED") return "Uploaded";
  return status.trim();
}

export function jobStatusBadgeClass(status: string) {
  const normalized = status?.trim().toUpperCase();
  if (normalized === "SUCCEEDED") return "status-badge--validated";
  if (normalized === "FAILED") return "status-badge--discrepancies";
  return "status-badge--pending";
}

export function isTerminalJobStatus(status: string) {
  const normalized = status?.trim().toUpperCase();
  return normalized === "SUCCEEDED" || normalized === "FAILED";
}

export function resolveJobStatus(
  overrides: Record<string, string>,
  key: string,
  fallback: string
) {
  return formatJobStatusLabel(overrides[key] ?? fallback);
}

export function resolveJobStatusRaw(
  overrides: Record<string, string>,
  key: string,
  fallback: string
) {
  return overrides[key] ?? fallback;
}
