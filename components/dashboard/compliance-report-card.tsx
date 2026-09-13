"use client";

import { DownloadIcon } from "lucide-react";

import { ComplianceDonutChart } from "@/components/dashboard/compliance-donut-chart";
import { Button } from "@/components/ui/button";
import type { LcDocument } from "@/lib/api/letter-of-credit";
import { getComplianceReportSummary } from "@/lib/dashboard/compliance-report";

function Metric({ label, value, tone }: { label: string; value: number; tone: "discrepancy" | "warning" }) {
  return (
    <div className="dashboard-compliance-report__metric">
      <span
        className={`dashboard-compliance-report__metric-label dashboard-compliance-report__metric-label--${tone}`}
      >
        {label}
      </span>
      <span
        className={`dashboard-compliance-report__metric-value dashboard-compliance-report__metric-value--${tone}`}
      >
        {value}
      </span>
    </div>
  );
}

export function ComplianceReportCard({ selectedLc }: { selectedLc: LcDocument | null }) {
  const summary = getComplianceReportSummary(selectedLc?.id ?? null);

  return (
    <article className="dashboard-summary-card ui-card">
      <div className="ui-card-header">
        <h2 className="ui-card-title">Compliance Report</h2>
        {selectedLc && (
          <span className="dashboard-summary-card__subtitle">{selectedLc.lcNumber}</span>
        )}
      </div>

      <div className="dashboard-summary-card__body">
        {!selectedLc ? (
          <p className="dashboard-summary-card__empty">
            Select a Letter of Credit to view the compliance report.
          </p>
        ) : (
          <div className="dashboard-compliance-report">
            <div className="dashboard-compliance-report__main">
              <div className="dashboard-compliance-report__metrics">
                <Metric label="Discrepancies" value={summary.discrepancies} tone="discrepancy" />
                <Metric label="Warnings" value={summary.warnings} tone="warning" />
              </div>
              <div className="dashboard-compliance-report__chart-panel">
                <h3 className="dashboard-compliance-report__chart-title">Overall compliance</h3>
                <ComplianceDonutChart summary={summary} />
                <p className="dashboard-compliance-report__recommendation">
                  Based on our review, we recommend addressing any noted items before submission
                  to help ensure a smoother bank review process.
                </p>
              </div>
            </div>
            <div className="dashboard-compliance-report__footer">
              <Button type="button" className="w-full gap-2 sm:w-auto" size="sm">
                <DownloadIcon aria-hidden="true" />
                Download Compliance Report
              </Button>
            </div>
          </div>
        )}
      </div>
    </article>
  );
}
