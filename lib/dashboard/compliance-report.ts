import type { LcDocument } from "@/lib/api/letter-of-credit";
import { collectLcFindings, countFindings } from "@/lib/dashboard/lc-report-findings";

export interface ComplianceReportSummary {
  all: number;
  discrepancies: number;
  warnings: number;
  passed: number;
  other: number;
  overallCompliancePercent: number;
}

export interface ComplianceDonutSegment {
  color: string;
  dashArray: string;
  dashOffset: number;
}

const R = 38;
export const DONUT_RADIUS = R;
export const DONUT_CIRCUMFERENCE = 2 * Math.PI * R;

export const COLORS = {
  green: "#22c55e",
  amber: "#f59e0b",
  red: "#ef4444",
  grey: "#94a3b8",
  track: "#e2e8f0",
} as const;

export function getComplianceReportSummary(lc: LcDocument | null): ComplianceReportSummary {
  if (!lc) {
    return {
      all: 0,
      discrepancies: 0,
      warnings: 0,
      passed: 0,
      other: 0,
      overallCompliancePercent: 0,
    };
  }

  const counts = countFindings(collectLcFindings(lc));
  return {
    all: counts.all,
    discrepancies: counts.discrepancy,
    warnings: counts.warning,
    passed: counts.passed,
    other: counts.other,
    overallCompliancePercent:
      counts.all === 0 ? 0 : Math.round((counts.passed / counts.all) * 100),
  };
}

export function getComplianceDonutSegments(
  summary: ComplianceReportSummary
): ComplianceDonutSegment[] {
  const { all, passed, warnings, discrepancies, other } = summary;
  const C = DONUT_CIRCUMFERENCE;

  if (all === 0) {
    return [{ color: COLORS.track, dashArray: `${C}`, dashOffset: 0 }];
  }

  let offset = 0;
  return [
    { color: COLORS.green, n: passed },
    { color: COLORS.grey, n: other },
    { color: COLORS.amber, n: warnings },
    { color: COLORS.red, n: discrepancies },
  ]
    .filter((part) => part.n > 0)
    .map((part) => {
      const length = C * (part.n / all);
      const seg = { color: part.color, dashArray: `${length} ${C}`, dashOffset: -offset };
      offset += length;
      return seg;
    });
}

export function getComplianceStatusLabel(percent: number) {
  if (percent >= 100) return "Compliant";
  if (percent >= 80) return "Mostly compliant";
  if (percent >= 50) return "Needs review";
  return "Action required";
}
