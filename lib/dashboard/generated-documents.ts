import type { GeneratedDocument, RequiredDocument } from "@/lib/api/letter-of-credit";
import {
  documentTypesMatch,
  normalizeDocTypeKey,
  requiredDocumentToType,
  type TradeDocumentType,
} from "@/lib/dashboard/document-types";

export function getLatestGeneratedDocument(
  documents: GeneratedDocument[] | undefined,
  documentType: TradeDocumentType
): GeneratedDocument | null {
  const matches = (documents ?? []).filter((d) => documentTypesMatch(d.documentType, documentType));
  return matches[matches.length - 1] ?? null;
}

export function findGeneratedForRequired(
  required: Pick<RequiredDocument, "normalized" | "name" | "code">,
  documents: GeneratedDocument[] | undefined
): GeneratedDocument | null {
  const list = documents ?? [];
  if (!list.length) return null;

  const tradeType = requiredDocumentToType(required);
  if (tradeType) {
    const byType = getLatestGeneratedDocument(list, tradeType);
    if (byType) return byType;
  }

  const keys = [required.name, required.normalized, required.code]
    .filter((v) => v && v !== "—")
    .map(normalizeDocTypeKey);

  const matches = list.filter((doc) => {
    const genKey = normalizeDocTypeKey(doc.documentType);
    return keys.some((k) => k === genKey);
  });

  return matches[matches.length - 1] ?? null;
}

/** Prefer .normalized values; drop confidence scores and duplicate .raw fields. */
export function formatParsedDataForDisplay(data: Record<string, string>): Record<string, string> {
  const out: Record<string, string> = {};
  const normalizedBases = new Set(
    Object.keys(data)
      .filter((k) => k.endsWith(".normalized"))
      .map((k) => k.slice(0, -".normalized".length))
  );

  for (const [key, value] of Object.entries(data)) {
    if (!value?.trim() || key.endsWith(".confidence")) continue;

    if (key.endsWith(".normalized")) {
      out[key.slice(0, -".normalized".length)] = value;
      continue;
    }

    if (key.endsWith(".raw") && normalizedBases.has(key.slice(0, -".raw".length))) continue;

    if (!key.includes(".")) out[key] = value;
  }

  return out;
}

export type DiscrepancyCheck = {
  name: string;
  passed: boolean;
  severity?: string;
  matchType?: string;
  reason?: string;
  expected?: string;
  actual?: string;
};

export type CheckCategory = "passed" | "warning" | "discrepancy" | "other";

export type DiscrepancyDisplay = {
  overallCompliant: boolean | null;
  advice: string;
  summary: Record<string, string>;
  checks: DiscrepancyCheck[];
  discrepancies: Array<{ checkName?: string; reason?: string; severity?: string; expected?: string }>;
};

function groupIndexedFields(data: Record<string, string>, prefix: string) {
  const escaped = prefix.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const re = new RegExp(`^${escaped}\\[(\\d+)\\]\\.(.+)$`);
  const groups = new Map<number, Record<string, string>>();

  for (const [key, value] of Object.entries(data)) {
    const match = key.match(re);
    if (!match || !value?.trim()) continue;
    const idx = Number(match[1]);
    const field = match[2];
    const row = groups.get(idx) ?? {};
    row[field] = value;
    groups.set(idx, row);
  }

  return [...groups.entries()]
    .sort(([a], [b]) => a - b)
    .map(([, fields]) => fields);
}

export function parseDiscrepancyData(data: Record<string, string>): DiscrepancyDisplay {
  const summary: Record<string, string> = {};
  for (const [key, value] of Object.entries(data)) {
    if (key.startsWith("summary.") && !key.includes("[") && value?.trim()) {
      summary[key.slice("summary.".length)] = value;
    }
  }

  const checks = groupIndexedFields(data, "checks").map((fields) => ({
    name: fields.checkName ?? "Check",
    passed: fields.passed === "true",
    severity: fields.severity,
    matchType: fields.matchType,
    reason: fields.reason,
    expected: fields.expected,
    actual: fields.actual,
  }));

  const discrepancies = groupIndexedFields(data, "summary.discrepanciesFound").map((fields) => ({
    checkName: fields.checkName,
    reason: fields.reason,
    severity: fields.severity,
    expected: fields.expected,
  }));

  const rawCompliant = data.overallCompliant?.trim().toLowerCase();
  const overallCompliant =
    rawCompliant === "true" ? true : rawCompliant === "false" ? false : null;

  return {
    overallCompliant,
    advice: data.complianceAdvice?.trim() ?? "",
    summary,
    checks,
    discrepancies,
  };
}

export function categorizeCheck(check: DiscrepancyCheck): CheckCategory {
  if (check.passed) return "passed";
  const severity = check.severity?.toLowerCase() ?? "";
  if (severity === "error") return "discrepancy";
  if (severity === "warning" || severity === "warn") return "warning";
  return "other";
}

export function groupChecksByCategory(checks: DiscrepancyCheck[]) {
  const groups: Record<CheckCategory, DiscrepancyCheck[]> = {
    passed: [],
    warning: [],
    discrepancy: [],
    other: [],
  };
  for (const check of checks) groups[categorizeCheck(check)].push(check);
  return groups;
}

export function defaultCheckCategory(groups: Record<CheckCategory, DiscrepancyCheck[]>) {
  if (groups.discrepancy.length) return "discrepancy";
  if (groups.warning.length) return "warning";
  if (groups.other.length) return "other";
  return "passed";
}
