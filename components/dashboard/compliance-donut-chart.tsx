import {
  COLORS,
  DONUT_RADIUS,
  getComplianceDonutSegments,
  getComplianceStatusLabel,
  type ComplianceReportSummary,
} from "@/lib/dashboard/compliance-report";
import { cn } from "@/lib/utils";

interface ComplianceDonutChartProps {
  summary: ComplianceReportSummary;
}

export function ComplianceDonutChart({ summary }: ComplianceDonutChartProps) {
  const segments = getComplianceDonutSegments(summary);
  const statusLabel = getComplianceStatusLabel(summary.overallCompliancePercent);
  const statusClass =
    summary.overallCompliancePercent >= 100
      ? "text-green-600"
      : summary.overallCompliancePercent >= 80
        ? "text-amber-600"
        : "text-red-600";

  return (
    <div
      className="dashboard-compliance-donut"
      role="img"
      aria-label={`Overall compliance ${summary.overallCompliancePercent} percent, ${statusLabel}`}
    >
      <svg className="dashboard-compliance-donut__svg" viewBox="0 0 100 100" aria-hidden="true">
        <circle
          cx="50"
          cy="50"
          r={DONUT_RADIUS}
          fill="none"
          stroke={COLORS.track}
          strokeWidth="10"
        />
        {segments.map((segment, index) => (
          <circle
            key={`${segment.color}-${index}`}
            cx="50"
            cy="50"
            r={DONUT_RADIUS}
            fill="none"
            stroke={segment.color}
            strokeWidth="10"
            strokeDasharray={segment.dashArray}
            strokeDashoffset={segment.dashOffset}
            strokeLinecap="round"
            className="dashboard-compliance-donut__segment"
          />
        ))}
      </svg>
      <div className="dashboard-compliance-donut__center">
        <p className="dashboard-compliance-donut__percent">
          {summary.overallCompliancePercent}%
        </p>
        <p className={cn("dashboard-compliance-donut__status", statusClass)}>
          {statusLabel}
        </p>
      </div>
    </div>
  );
}
