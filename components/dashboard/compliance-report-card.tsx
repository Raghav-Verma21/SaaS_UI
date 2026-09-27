"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { DownloadIcon } from "lucide-react";

import { ComplianceDonutChart } from "@/components/dashboard/compliance-donut-chart";
import { ComplianceFindingsStats } from "@/components/dashboard/compliance-findings-stats";
import { ApiError } from "@/lib/api";
import { getComplianceReport } from "@/lib/api/compliance-report";
import type { LcDocument } from "@/lib/api/letter-of-credit";
import { getComplianceReportSummary } from "@/lib/dashboard/compliance-report";
import { collectLcFindings, countFindings } from "@/lib/dashboard/lc-report-findings";

interface ComplianceReportCardProps {
  selectedLc: LcDocument | null;
  companyId: string | null;
}

export function ComplianceReportCard({ selectedLc, companyId }: ComplianceReportCardProps) {
  const [downloading, setDownloading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const findings = useMemo(
    () => (selectedLc ? collectLcFindings(selectedLc) : []),
    [selectedLc]
  );
  const counts = useMemo(() => countFindings(findings), [findings]);
  const summary = useMemo(() => getComplianceReportSummary(selectedLc), [selectedLc]);

  async function handleDownload() {
    if (!companyId || !selectedLc) return;
    setDownloading(true);
    setError(null);
    try {
      const res = await getComplianceReport(companyId, selectedLc.id);
      const url = res.signedUrlVO?.signedUrl;
      if (!url) throw new ApiError("Download link unavailable.", 400);
      window.open(url, "_blank", "noopener,noreferrer");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Unable to download the compliance report.");
    } finally {
      setDownloading(false);
    }
  }

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
            <ComplianceFindingsStats counts={counts} compact />

            {findings.length === 0 ? (
              <p className="dashboard-summary-card__empty">
                Upload trade documents and run LC cross-check to see findings here.
              </p>
            ) : (
              <div className="dashboard-compliance-report__chart-panel dashboard-compliance-report__chart-panel--inline">
                <h3 className="dashboard-compliance-report__chart-title">Overall compliance</h3>
                <ComplianceDonutChart summary={summary} />
              </div>
            )}

            <div className="dashboard-compliance-report__footer">
              <button
                type="button"
                className="reports-download"
                disabled={downloading || !companyId || findings.length === 0}
                aria-label="Download Excel report"
                onClick={() => void handleDownload()}
              >
                <DownloadIcon className="size-5" aria-hidden="true" />
                <span className="reports-download__label">
                  {downloading ? "Preparing..." : "Download Excel"}
                </span>
              </button>
              <Link
                href={`/reports?lc=${selectedLc.id}`}
                className="dashboard-compliance-report__view-link"
              >
                View full report
              </Link>
            </div>

            {error && (
              <p className="lc-upload-hero__error" role="alert">
                {error}
              </p>
            )}
          </div>
        )}
      </div>
    </article>
  );
}
