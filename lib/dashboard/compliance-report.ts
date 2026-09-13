export interface ComplianceReportSummary {
  discrepancies: number;
  warnings: number;
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
  track: "#e2e8f0",
} as const;

/** Placeholder until API-driven compliance metrics are available. */
export function getComplianceReportSummary(_lcId: string | null): ComplianceReportSummary {
  return { discrepancies: 0, warnings: 0, overallCompliancePercent: 100 };
}

export function getComplianceDonutSegments(
  summary: ComplianceReportSummary
): ComplianceDonutSegment[] {
  const { discrepancies, warnings, overallCompliancePercent } = summary;
  const C = DONUT_CIRCUMFERENCE;

  if (discrepancies === 0 && warnings === 0) {
    return [{ color: COLORS.green, dashArray: `${C}`, dashOffset: 0 }];
  }

  const compliant = Math.max(0, Math.min(100, overallCompliancePercent)) / 100;
  const warning = warnings > 0 ? Math.min(0.15, warnings * 0.05) : 0;
  const discrepancy = discrepancies > 0 ? Math.min(0.25, discrepancies * 0.08) : 0;
  const adjusted = compliant + Math.max(0, 1 - compliant - warning - discrepancy);

  let offset = 0;
  return [
    { color: COLORS.green, portion: adjusted },
    { color: COLORS.amber, portion: warning },
    { color: COLORS.red, portion: discrepancy },
  ]
    .filter((s) => s.portion > 0)
    .map((s) => {
      const length = C * s.portion;
      const seg = { color: s.color, dashArray: `${length} ${C}`, dashOffset: -offset };
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
