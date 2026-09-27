"use client";

import { useMemo, useState } from "react";
import { DownloadIcon, InfoIcon } from "lucide-react";

import { LcSelectorDropdown } from "@/components/dashboard/lc-selector-dropdown";
import { ApiError } from "@/lib/api";
import { getComplianceReport } from "@/lib/api/compliance-report";
import type { LcDocument } from "@/lib/api/letter-of-credit";
import { ComplianceFindingsStats } from "@/components/dashboard/compliance-findings-stats";
import {
  collectLcFindings,
  countFindings,
  filterFindings,
  groupFindingsByDocument,
  type ReportFilter,
  type ReportFindingRow,
} from "@/lib/dashboard/lc-report-findings";
import type { CheckCategory } from "@/lib/dashboard/generated-documents";
import { cn } from "@/lib/utils";

function statusLabel(category: CheckCategory) {
  if (category === "passed") return "Passed";
  if (category === "discrepancy") return "Failed";
  if (category === "warning") return "Warning";
  return "Other";
}

function statusBadgeClass(category: CheckCategory) {
  if (category === "passed") return "status-badge--validated";
  if (category === "discrepancy") return "status-badge--discrepancies";
  return "status-badge--pending";
}

function rowTone(category: CheckCategory) {
  if (category === "passed") return "pass";
  if (category === "discrepancy") return "error";
  if (category === "warning") return "warn";
  return "other";
}

function FindingRow({ row }: { row: ReportFindingRow }) {
  const tone = rowTone(row.category);
  return (
    <tr className={cn("ui-table-row reports-table__row", `reports-table__row--${tone}`)}>
      <td className="ui-table-td">{row.check.name}</td>
      <td className="ui-table-td">
        <span className={cn("status-badge", statusBadgeClass(row.category))}>
          {statusLabel(row.category)}
        </span>
      </td>
      <td className="ui-table-td reports-table__severity">
        {row.check.severity?.trim() || "—"}
      </td>
      <td className="ui-table-td reports-table__reason">{row.check.reason?.trim() || "—"}</td>
      <td className="ui-table-td">{row.check.expected?.trim() || "—"}</td>
      <td className="ui-table-td">{row.check.actual?.trim() || "—"}</td>
    </tr>
  );
}

function DocumentFindingsTable({ rows }: { rows: ReportFindingRow[] }) {
  return (
    <div className="ui-table-wrap reports-table-wrap">
      <table className="ui-table reports-table">
        <thead className="ui-table-head">
          <tr>
            <th className="ui-table-th text-left">Check</th>
            <th className="ui-table-th">Status</th>
            <th className="ui-table-th">Severity</th>
            <th className="ui-table-th reports-table__reason text-left">Reason</th>
            <th className="ui-table-th text-left">Expected</th>
            <th className="ui-table-th text-left">Actual</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <FindingRow key={`${row.check.name}-${i}`} row={row} />
          ))}
        </tbody>
      </table>
    </div>
  );
}

interface ReportsFindingsCardProps {
  lc: LcDocument;
  allLcs: LcDocument[];
  selectedLcId: string | null;
  onSelectLc: (lcId: string) => void;
  selectorDisabled?: boolean;
  companyId: string | null;
}

export function ReportsFindingsCard({
  lc,
  allLcs,
  selectedLcId,
  onSelectLc,
  selectorDisabled,
  companyId,
}: ReportsFindingsCardProps) {
  const [filter, setFilter] = useState<ReportFilter>("all");
  const [downloading, setDownloading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const findings = useMemo(() => collectLcFindings(lc), [lc]);
  const counts = useMemo(() => countFindings(findings), [findings]);
  const grouped = useMemo(
    () => groupFindingsByDocument(filterFindings(findings, filter)),
    [findings, filter]
  );

  async function handleDownload() {
    if (!companyId) return;
    setDownloading(true);
    setError(null);
    try {
      const res = await getComplianceReport(companyId, lc.id);
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
    <article className="dashboard-summary-card ui-card reports-card">
      <div className="ui-card-header lc-uploaded-table__header">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h2 className="ui-card-title">Compliance findings</h2>
            <InfoIcon className="size-4 text-muted-foreground" aria-hidden="true" />
          </div>
          <span className="dashboard-summary-card__subtitle">{lc.lcNumber}</span>
        </div>
        <LcSelectorDropdown
          documents={allLcs}
          selectedId={selectedLcId}
          onSelect={onSelectLc}
          disabled={selectorDisabled}
        />
      </div>

      <div className="dashboard-summary-card__body reports-card__body">
        <ComplianceFindingsStats counts={counts} filter={filter} onFilter={setFilter} />

        {grouped.length > 0 ? (
          <div className="reports-doc-groups">
            {grouped.map((group) => (
              <section key={group.document} className="reports-doc-group">
                <header className="reports-doc-group__header">
                  <h3 className="reports-doc-group__title">{group.document}</h3>
                  <span className="reports-doc-group__meta">
                    {group.rows.length} check{group.rows.length === 1 ? "" : "s"}
                  </span>
                </header>
                <DocumentFindingsTable rows={group.rows} />
              </section>
            ))}
          </div>
        ) : (
          <p className="dashboard-summary-card__empty">
            {findings.length === 0
              ? "Upload trade documents and run LC cross-check to see findings here."
              : "No findings in this category."}
          </p>
        )}

        <div className="reports-footer">
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
        </div>

        {error && (
          <p className="lc-upload-hero__error" role="alert">
            {error}
          </p>
        )}
      </div>
    </article>
  );
}
