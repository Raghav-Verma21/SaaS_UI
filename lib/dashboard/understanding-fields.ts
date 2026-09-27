export type UnderstandingField = { key: string; label: string; value: string };

export type UnderstandingSection = {
  id: string;
  title: string;
  fields: UnderstandingField[];
};

export type OrganizedUnderstanding = {
  intro?: string;
  sections: UnderstandingSection[];
};

const LC_SUMMARY_PATTERNS = [
  /applicant/i,
  /beneficiary/i,
  /lc.?number|^20$/i,
  /(^|\b)amount(\b|$)|32b/i,
  /expir(y|ation)|31d/i,
  /issue.?date|date.?of.?issue|31c/i,
];

const SECTION_RULES: { id: string; title: string; pattern: RegExp }[] = [
  {
    id: "parties",
    title: "Parties",
    pattern: /applicant|beneficiary|consignee|shipper|notify|drawer|drawee|seller|buyer|exporter|importer|insured/i,
  },
  {
    id: "shipment",
    title: "Shipment & logistics",
    pattern: /port|loading|discharge|vessel|awb|waybill|shipment|transport|destination|origin|freight|carrier/i,
  },
  {
    id: "goods",
    title: "Goods & quantity",
    pattern: /goods|description|quantity|weight|package|incoterm|commodity|hs.?code/i,
  },
  {
    id: "dates",
    title: "Dates & periods",
    pattern: /date|period|expir|valid|tenor|deadline/i,
  },
  {
    id: "terms",
    title: "Terms & banking",
    pattern: /payment|terms|bank|charge|presentation|credit|insurance|condition|clause|required.?doc/i,
  },
];

export function formatFieldLabel(key: string) {
  return key
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/[_-]+/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

function normalizeKey(key: string) {
  return key.toLowerCase().replace(/[\s_'-]+/g, "");
}

function toField(key: string, value: string): UnderstandingField {
  return { key, label: formatFieldLabel(key), value: value.trim() };
}

function assignSection(key: string): string {
  const normalized = normalizeKey(key);
  for (const rule of SECTION_RULES) {
    if (rule.pattern.test(key) || rule.pattern.test(normalized)) return rule.id;
  }
  return "other";
}

function isLcSummaryField(key: string) {
  const normalized = normalizeKey(key);
  return LC_SUMMARY_PATTERNS.some((p) => p.test(key) || p.test(normalized));
}

function buildSections(fields: UnderstandingField[]): UnderstandingSection[] {
  const buckets = new Map<string, UnderstandingField[]>();
  for (const field of fields) {
    const id = assignSection(field.key);
    const list = buckets.get(id) ?? [];
    list.push(field);
    buckets.set(id, list);
  }

  const ordered = [...SECTION_RULES.map((r) => r.id), "other"];
  return ordered
    .map((id) => {
      const fields = buckets.get(id);
      if (!fields?.length) return null;
      const title = SECTION_RULES.find((r) => r.id === id)?.title ?? "Other details";
      return { id, title, fields };
    })
    .filter((s): s is UnderstandingSection => s != null);
}

export function organizeLcUnderstanding(fields: Record<string, string>): OrganizedUnderstanding {
  const entries = Object.entries(fields)
    .filter(([, v]) => v?.trim())
    .map(([k, v]) => toField(k, v))
    .filter((f) => !isLcSummaryField(f.key));

  return {
    intro: "Shipment, goods, ports, and LC conditions extracted beyond the summary table above.",
    sections: buildSections(entries),
  };
}

export function organizeDocumentUnderstanding(fields: Record<string, string>): OrganizedUnderstanding {
  const entries = Object.entries(fields)
    .filter(([, v]) => v?.trim())
    .map(([k, v]) => toField(k, v));

  return { sections: buildSections(entries) };
}
