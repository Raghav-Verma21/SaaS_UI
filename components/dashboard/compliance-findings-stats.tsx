import type { ReportFilter } from "@/lib/dashboard/lc-report-findings";
import { cn } from "@/lib/utils";

export const COMPLIANCE_SUMMARY_STATS: {
  key: ReportFilter;
  label: string;
  tone: "total" | "error" | "warn" | "pass" | "other";
}[] = [
  { key: "all", label: "Total Checks", tone: "total" },
  { key: "discrepancy", label: "Discrepancies", tone: "error" },
  { key: "warning", label: "Warnings", tone: "warn" },
  { key: "passed", label: "Passed", tone: "pass" },
  { key: "other", label: "Others", tone: "other" },
];

type FindingCounts = Record<ReportFilter, number>;

interface ComplianceFindingsStatsProps {
  counts: FindingCounts;
  filter?: ReportFilter;
  onFilter?: (filter: ReportFilter) => void;
  compact?: boolean;
}

export function ComplianceFindingsStats({
  counts,
  filter,
  onFilter,
  compact,
}: ComplianceFindingsStatsProps) {
  return (
    <div className={cn("reports-stats", compact && "dashboard-compliance-report__stats")}>
      {COMPLIANCE_SUMMARY_STATS.map(({ key, label, tone }) => {
        const className = cn(
          "reports-stat",
          `reports-stat--${tone}`,
          filter === key && "reports-stat--active",
          compact && "dashboard-compliance-report__stat"
        );
        const content = (
          <>
            <span
              className={cn(
                "reports-stat__value",
                compact && "dashboard-compliance-report__stat-value"
              )}
            >
              {counts[key]}
            </span>
            <span className="reports-stat__label">{label}</span>
          </>
        );

        if (onFilter) {
          return (
            <button key={key} type="button" className={className} onClick={() => onFilter(key)}>
              {content}
            </button>
          );
        }

        return (
          <div key={key} className={className}>
            {content}
          </div>
        );
      })}
    </div>
  );
}
