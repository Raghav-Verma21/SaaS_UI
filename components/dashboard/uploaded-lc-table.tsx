"use client";

import { FileTextIcon, MoreVerticalIcon } from "lucide-react";

import { LcSelectorDropdown } from "@/components/dashboard/lc-selector-dropdown";
import { JobStatusBadge } from "@/components/dashboard/job-status-badge";
import type { LcDocument } from "@/lib/api/letter-of-credit";

function LcDetailCard({
  row,
  resolveLcJobStatus,
}: {
  row: LcDocument;
  resolveLcJobStatus: (lc: LcDocument) => string;
}) {
  return (
    <div className="lc-uploaded-card">
      <div className="lc-uploaded-card__top">
        <div className="dashboard-lc-mobile-card__lc-number">
          <FileTextIcon className="size-4 shrink-0 text-brand-blue" aria-hidden="true" />
          <span>{row.lcNumber}</span>
        </div>
        <JobStatusBadge status={resolveLcJobStatus(row)} />
      </div>
      <dl className="lc-uploaded-card__grid">
        <div>
          <dt>Applicant</dt>
          <dd>{row.applicantName}</dd>
        </div>
        <div>
          <dt>Beneficiary</dt>
          <dd>{row.beneficiaryName}</dd>
        </div>
        <div>
          <dt>Amount</dt>
          <dd>{row.lcAmount}</dd>
        </div>
        <div>
          <dt>Expiry</dt>
          <dd>{row.expiryDate}</dd>
        </div>
      </dl>
    </div>
  );
}

function LcDetailRow({
  row,
  resolveLcJobStatus,
}: {
  row: LcDocument;
  resolveLcJobStatus: (lc: LcDocument) => string;
}) {
  return (
    <tr className="ui-table-row">
      <td className="ui-table-td">
        <div className="dashboard-lc-table__lc-number-inner">
          <FileTextIcon className="dashboard-lc-table__lc-icon" aria-hidden="true" />
          <div className="min-w-0">
            <span className="font-medium text-navy">{row.lcNumber}</span>
            <p className="lc-uploaded-table__docs">{row.requiredDocuments.length} required docs</p>
          </div>
        </div>
      </td>
      <td className="ui-table-td dashboard-lc-table__text hidden lg:table-cell">{row.applicantName}</td>
      <td className="ui-table-td dashboard-lc-table__text">
        <span className="line-clamp-2">{row.beneficiaryName}</span>
      </td>
      <td className="ui-table-td dashboard-lc-table__muted hidden xl:table-cell">{row.issueDate}</td>
      <td className="ui-table-td dashboard-lc-table__muted">{row.expiryDate}</td>
      <td className="ui-table-td dashboard-lc-table__text">{row.lcAmount}</td>
      <td className="ui-table-td">
        <JobStatusBadge status={resolveLcJobStatus(row)} />
      </td>
      <td className="ui-table-td text-right">
        <button
          type="button"
          className="lc-uploaded-table__menu-btn"
          aria-label={`More actions for ${row.lcNumber}`}
        >
          <MoreVerticalIcon className="size-4" />
        </button>
      </td>
    </tr>
  );
}

interface UploadedLcTableProps {
  documents: LcDocument[];
  isLoading: boolean;
  error: string | null;
  selectedLcId: string | null;
  onSelectLc: (lcId: string) => void;
  resolveLcJobStatus: (lc: LcDocument) => string;
}

export function UploadedLcTable({
  documents,
  isLoading,
  error,
  selectedLcId,
  onSelectLc,
  resolveLcJobStatus,
}: UploadedLcTableProps) {
  const selectedRow =
    documents.find((d) => d.id === selectedLcId) ?? documents[0] ?? null;

  return (
    <section className="lc-uploaded-table ui-card">
      <div className="ui-card-header lc-uploaded-table__header">
        <h2 className="ui-card-title">Your Uploaded LCs</h2>
        <LcSelectorDropdown
          documents={documents}
          selectedId={selectedLcId}
          onSelect={onSelectLc}
          disabled={isLoading || !!error}
        />
      </div>

      <div className="dashboard-lc-mobile-list md:hidden">
        {!isLoading && error && (
          <p className="dashboard-lc-mobile-list__message dashboard-lc-mobile-list__message--error" role="alert">
            {error}
          </p>
        )}
        {!isLoading && !error && selectedRow && (
          <LcDetailCard row={selectedRow} resolveLcJobStatus={resolveLcJobStatus} />
        )}
      </div>

      <div className="ui-table-wrap hidden md:block">
        <table className="ui-table lc-uploaded-table__table">
          <thead className="ui-table-head">
            <tr>
              <th className="ui-table-th">LC Number</th>
              <th className="ui-table-th hidden lg:table-cell">Applicant</th>
              <th className="ui-table-th">Beneficiary</th>
              <th className="ui-table-th hidden xl:table-cell">Issue Date</th>
              <th className="ui-table-th">Expiry Date</th>
              <th className="ui-table-th">Amount</th>
              <th className="ui-table-th">Status</th>
              <th className="ui-table-th text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading && (
              <tr>
                <td colSpan={8} className="ui-table-empty">
                  Loading Letters of Credit...
                </td>
              </tr>
            )}
            {!isLoading && error && (
              <tr>
                <td colSpan={8} className="ui-table-error" role="alert">
                  {error}
                </td>
              </tr>
            )}
            {!isLoading && !error && selectedRow && (
              <LcDetailRow row={selectedRow} resolveLcJobStatus={resolveLcJobStatus} />
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
