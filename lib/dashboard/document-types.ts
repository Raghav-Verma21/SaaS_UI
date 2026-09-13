import type { RequiredDocument } from "@/lib/api/letter-of-credit";

export type TradeDocumentType =
  | "commercial_invoice"
  | "packaging_list"
  | "bill_of_lading"
  | "insurance";

const TRADE_TYPES: TradeDocumentType[] = [
  "commercial_invoice",
  "packaging_list",
  "bill_of_lading",
  "insurance",
];

const REQUIRED_TO_TYPE: Array<{ pattern: RegExp; type: TradeDocumentType }> = [
  { pattern: /commercial\s*invoice/i, type: "commercial_invoice" },
  { pattern: /packing[\s_-]*list|packaging[\s_-]*list/i, type: "packaging_list" },
  { pattern: /bill[\s_-]*of[\s_-]*l(?:ad|and)ing/i, type: "bill_of_lading" },
  { pattern: /insurance/i, type: "insurance" },
];

export function normalizeDocTypeKey(value: string) {
  return value
    .toLowerCase()
    .replace(/packaging/g, "packing")
    .replace(/[\s_-]+/g, "");
}

export function documentTypesMatch(generatedType: string, tradeType: TradeDocumentType) {
  return normalizeDocTypeKey(generatedType) === normalizeDocTypeKey(tradeType);
}

function fromPattern(text: string): TradeDocumentType | null {
  const normalized = text.replace(/_/g, " ");
  return REQUIRED_TO_TYPE.find(({ pattern }) => pattern.test(normalized))?.type ?? null;
}

function asTradeType(value: string): TradeDocumentType | null {
  if (!value || value === "—") return null;
  const key = normalizeDocTypeKey(value);
  return TRADE_TYPES.find((type) => normalizeDocTypeKey(type) === key) ?? null;
}

export function requiredDocumentToType(
  doc: Pick<RequiredDocument, "normalized" | "name" | "code"> | string
): TradeDocumentType | null {
  if (typeof doc === "string") return asTradeType(doc) ?? fromPattern(doc);
  return asTradeType(doc.name) ?? asTradeType(doc.code) ?? fromPattern(doc.normalized);
}

export function isPackingListDocument(doc: Pick<RequiredDocument, "normalized" | "name" | "code"> | string) {
  return requiredDocumentToType(doc) === "packaging_list";
}

export function isCommercialInvoiceDocument(
  doc: Pick<RequiredDocument, "normalized" | "name" | "code"> | string
) {
  return requiredDocumentToType(doc) === "commercial_invoice";
}

const UPLOADABLE_TYPES: TradeDocumentType[] = [
  "commercial_invoice",
  "packaging_list",
  "bill_of_lading",
];

export function isUploadableTradeDocument(
  doc: Pick<RequiredDocument, "normalized" | "name" | "code"> | string
) {
  const type = requiredDocumentToType(doc);
  return type != null && UPLOADABLE_TYPES.includes(type);
}

export function requiredDocMatchesQuery(
  doc: Pick<RequiredDocument, "normalized" | "name" | "code">,
  query: string
) {
  const q = normalizeDocTypeKey(query);
  return [doc.normalized, doc.name, doc.code].some(
    (v) => v && v !== "—" && (v === query || normalizeDocTypeKey(v) === q)
  );
}
