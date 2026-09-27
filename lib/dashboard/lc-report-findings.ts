import type { GeneratedDocument, LcDocument } from "@/lib/api/letter-of-credit";
import {
  categorizeCheck,
  findGeneratedForRequired,
  parseDiscrepancyData,
  type CheckCategory,
  type DiscrepancyCheck,
} from "@/lib/dashboard/generated-documents";

export type ReportFindingRow = {
  document: string;
  check: DiscrepancyCheck;
  category: CheckCategory;
};

export type ReportFilter = CheckCategory | "all";

export type ReportDocumentGroup = {
  document: string;
  rows: ReportFindingRow[];
};

function findingsForDoc(label: string, gen: GeneratedDocument): ReportFindingRow[] {
  if (!Object.keys(gen.discrepancyData ?? {}).length) return [];
  return parseDiscrepancyData(gen.discrepancyData).checks.map((check) => ({
    document: label,
    check,
    category: categorizeCheck(check),
  }));
}

export function collectLcFindings(lc: LcDocument): ReportFindingRow[] {
  const rows: ReportFindingRow[] = [];
  const seen = new Set<string>();

  for (const req of lc.requiredDocuments) {
    const gen = findGeneratedForRequired(req, lc.generatedDocuments);
    if (!gen) continue;
    seen.add(gen.docId);
    rows.push(...findingsForDoc(req.normalized || req.name, gen));
  }

  for (const gen of lc.generatedDocuments) {
    if (seen.has(gen.docId)) continue;
    rows.push(...findingsForDoc(gen.documentType || gen.fileName, gen));
  }

  return rows;
}

export function countFindings(rows: ReportFindingRow[]) {
  const counts = { all: rows.length, passed: 0, warning: 0, discrepancy: 0, other: 0 };
  for (const row of rows) counts[row.category]++;
  return counts;
}

export function filterFindings(rows: ReportFindingRow[], filter: ReportFilter) {
  return filter === "all" ? rows : rows.filter((r) => r.category === filter);
}

export function groupFindingsByDocument(rows: ReportFindingRow[]): ReportDocumentGroup[] {
  const groups: ReportDocumentGroup[] = [];
  const index = new Map<string, number>();

  for (const row of rows) {
    const i = index.get(row.document);
    if (i === undefined) {
      index.set(row.document, groups.length);
      groups.push({ document: row.document, rows: [row] });
    } else {
      groups[i].rows.push(row);
    }
  }

  return groups;
}
