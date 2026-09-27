import {
  getCompanyLetterOfCredits,
  uploadLetterOfCredit,
  type GeneratedDocument,
  type GeneratedDocumentApiItem,
  type LCDocumentListItem,
  type LcDocument,
  type LcTableStatus,
  type RequiredDocument,
  type RequiredDocumentApiItem,
} from "@/lib/api/letter-of-credit";

const EMPTY = "—";

function str(value: unknown): string | null {
  return typeof value === "string" && value.trim() ? value.trim() : null;
}

function first(...values: Array<string | null | undefined>) {
  return values.find((v) => v?.trim())?.trim() ?? EMPTY;
}

function mapStatus(parsedData: Record<string, unknown> | undefined): LcTableStatus {
  const raw = (str(parsedData?.status) || str(parsedData?.validationStatus) || "").toUpperCase();
  if (raw.includes("VALID") || raw.includes("COMPLETED") || raw === "OK") return "Validated";
  if (raw.includes("DISCREPAN") || raw.includes("FAILED") || raw.includes("REJECT"))
    return "Discrepancies";
  return "Pending Review";
}

function formatDate(value: string | null | undefined) {
  if (!value) return EMPTY;
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? value
    : date.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
}

function mapConditions(value: unknown): string[] {
  if (Array.isArray(value))
    return value
      .map((c) => unescapeText(typeof c === "string" ? c : String(c ?? "")))
      .filter(Boolean);
  return typeof value === "string" && value.trim() ? [unescapeText(value)] : [];
}

function mapGeneratedDocuments(documents: GeneratedDocumentApiItem[] | undefined): GeneratedDocument[] {
  if (!Array.isArray(documents)) return [];
  return documents.map((d) => ({
    docId: first(d.docId),
    fileName: first(d.fileName),
    documentType: first(d.documentType),
    status: first(d.status),
    parsedData: Object.fromEntries(
      Object.entries(d.parsedData ?? {}).map(([k, v]) => [k, unescapeText(String(v))])
    ),
    discrepancyData: Object.fromEntries(
      Object.entries(d.discrepancyData ?? {}).map(([k, v]) => [k, unescapeText(String(v))])
    ),
  }));
}

function mapRequiredDocuments(documents: RequiredDocumentApiItem[] | undefined): RequiredDocument[] {
  if (!Array.isArray(documents)) return [];
  return documents.map((d) => ({
    name: first(d.name),
    normalized: first(d.normalized, d.name),
    copies: first(d.copies),
    code: first(d.code),
    conditions: mapConditions(d.conditions),
  }));
}

function unescapeText(value: string) {
  return value.replace(/\\n/g, "\n").trim();
}

function normalizeSemanticValue(value: unknown): string | null {
  if (value == null) return null;
  if (typeof value === "string") return unescapeText(value) || null;
  if (typeof value === "object") {
    const obj = value as Record<string, unknown>;
    return str(obj.date) ?? str(obj.normalized) ?? str(obj.value);
  }
  const text = String(value).trim();
  if (!text) return null;
  const dateMatch = text.match(/date=([^,}\]]+)/);
  return dateMatch?.[1]?.trim() ?? text;
}

function mapSemanticFields(document: LCDocumentListItem): Record<string, string> {
  const raw =
    document.semanticFieldsData ??
    (document.parsedData?.semanticFieldsData as Record<string, unknown> | undefined) ??
    (document.parsedData?.semanticData as Record<string, unknown> | undefined);

  if (!raw || typeof raw !== "object") return {};

  return Object.fromEntries(
    Object.entries(raw)
      .map(([key, value]) => [key, normalizeSemanticValue(value)])
      .filter((entry): entry is [string, string] => Boolean(entry[1]))
  );
}

function pickIssueDate(
  document: LCDocumentListItem,
  semantic: Record<string, string>
): string {
  const raw =
    document.semanticFieldsData ??
    (document.parsedData?.semanticFieldsData as Record<string, unknown> | undefined) ??
    (document.parsedData?.semanticData as Record<string, unknown> | undefined);

  const candidates: unknown[] = [
    document.issueDate,
    document.parsedData?.issueDate,
    document.parsedData?.date_of_issue,
    document.parsedData?.dateOfIssue,
  ];

  if (raw) {
    for (const [key, value] of Object.entries(raw)) {
      if (/date\s*of\s*issue|issue[_\s-]*date/i.test(key)) candidates.push(value);
    }
  }

  for (const key of ["Date of Issue", "issue_date", "issueDate", "lcIssueDate"]) {
    if (semantic[key]) candidates.push(semantic[key]);
  }

  for (const value of candidates) {
    const normalized = normalizeSemanticValue(value);
    if (normalized) return formatDate(normalized);
  }

  return EMPTY;
}

export function mapLcDocumentToRow(document: LCDocumentListItem): LcDocument {
  const lcNumber = first(document.lcNumber);
  const lcId = first(document.lcId);
  const semantic = mapSemanticFields(document);
  return {
    id: lcId !== EMPTY ? lcId : lcNumber,
    lcNumber,
    lcAmount: first(document.lcAmount),
    applicantName: first(document.applicantName),
    beneficiaryName: first(document.beneficiaryName),
    issueDate: pickIssueDate(document, semantic),
    expiryDate: formatDate(document.expiryDate),
    lastShipmentDate: formatDate(document.lastShipmentDate),
    lcCreatedAt: first(document.lcCreatedAt),
    jobStatus: first(document.status),
    status: mapStatus(document.parsedData),
    requiredDocuments: mapRequiredDocuments(document.requiredDocuments),
    generatedDocuments: mapGeneratedDocuments(document.generatedDocuments),
    semanticFields: semantic,
  };
}

export async function fetchCompanyLetterOfCredits(companyId: string): Promise<LcDocument[]> {
  const response = await getCompanyLetterOfCredits(companyId);
  return (response.documents ?? []).map(mapLcDocumentToRow);
}

function parseCreatedAtMs(value: string) {
  if (!value || value === EMPTY) return 0;
  const ms = Date.parse(value);
  return Number.isNaN(ms) ? 0 : ms;
}

/** Newest uploads first — used for dashboard recent LC table. */
export function pickRecentLetterOfCredits(documents: LcDocument[], limit: number) {
  return [...documents]
    .sort((a, b) => parseCreatedAtMs(b.lcCreatedAt) - parseCreatedAtMs(a.lcCreatedAt))
    .slice(0, limit);
}

export function uploadCompanyLetterOfCredit(companyId: string, file: File) {
  return uploadLetterOfCredit(companyId, file);
}
