"use client";

import { CheckCircle2Icon, ChevronRightIcon, FileTextIcon } from "lucide-react";

import { JobStatusBadge } from "@/components/dashboard/job-status-badge";
import type { LcDocument } from "@/lib/api/letter-of-credit";
import { cn } from "@/lib/utils";

function LcMobileCard({
  row,
  isSelected,
  onSelect,
  resolveLcJobStatus,
}: {
  row: LcDocument;
  isSelected: boolean;
  onSelect: () => void;
  resolveLcJobStatus: (lc: LcDocument) => string;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        "dashboard-lc-mobile-card w-full text-left",
        isSelected && "dashboard-lc-mobile-card--selected"
      )}
      aria-pressed={isSelected}
    >
      <div className="dashboard-lc-mobile-card__header">
        <div className="dashboard-lc-mobile-card__lc-number">
          {isSelected ? (
            <CheckCircle2Icon className="size-4 shrink-0 text-brand-blue" aria-hidden="true" />
          ) : (
            <FileTextIcon className="size-4 shrink-0 text-brand-blue" aria-hidden="true" />
          )}
          <span>{row.lcNumber}</span>
        </div>
        <JobStatusBadge status={resolveLcJobStatus(row)} />
      </div>

      <dl className="dashboard-lc-mobile-card__details">
        <div className="dashboard-lc-mobile-card__detail">
          <dt>Amount</dt>
          <dd>{row.lcAmount}</dd>
        </div>
        <div className="dashboard-lc-mobile-card__detail">
          <dt>Beneficiary</dt>
          <dd>{row.beneficiaryName}</dd>
        </div>
        <div className="dashboard-lc-mobile-card__detail">
          <dt>Expiry</dt>
          <dd>{row.expiryDate}</dd>
        </div>
        <div className="dashboard-lc-mobile-card__detail">
          <dt>Last shipment</dt>
          <dd>{row.lastShipmentDate}</dd>
        </div>
      </dl>

      <div className="dashboard-lc-mobile-card__footer">
        <span>View details below</span>
        <ChevronRightIcon
          className={cn(
            "size-4",
            isSelected ? "text-brand-blue" : "text-muted-foreground"
          )}
          aria-hidden="true"
        />
      </div>
    </button>
  );
}

interface RecentLetterOfCreditTableProps {
  documents: LcDocument[];
  isLoading: boolean;
  error: string | null;
  selectedLcId: string | null;
  onSelectLc: (lcId: string) => void;
  resolveLcJobStatus: (lc: LcDocument) => string;
}

export function RecentLetterOfCreditTable({
  documents,
  isLoading,
  error,
  selectedLcId,
  onSelectLc,
  resolveLcJobStatus,
}: RecentLetterOfCreditTableProps) {
  return (
    <section className="dashboard-lc-table ui-card">
      <div className="ui-card-header ui-card-header--stacked">
        <h2 className="ui-card-title">Recent Letters of Credit</h2>
        <p className="dashboard-lc-table__hint">Select an LC to view details below</p>
      </div>

      <div className="dashboard-lc-mobile-list md:hidden">
        {isLoading && (
          <p className="dashboard-lc-mobile-list__message">Loading Letters of Credit...</p>
        )}
        {!isLoading && error && (
          <p className="dashboard-lc-mobile-list__message dashboard-lc-mobile-list__message--error" role="alert">
            {error}
          </p>
        )}
        {!isLoading && !error && documents.length === 0 && (
          <p className="dashboard-lc-mobile-list__message">
            No Letters of Credit found yet.
          </p>
        )}
        {!isLoading &&
          !error &&
          documents.map((row) => (
            <LcMobileCard
              key={row.id}
              row={row}
              isSelected={selectedLcId === row.id}
              onSelect={() => onSelectLc(row.id)}
              resolveLcJobStatus={resolveLcJobStatus}
            />
          ))}
      </div>

      <div className="ui-table-wrap hidden md:block">
        <table className="ui-table">
          <thead className="ui-table-head">
            <tr>
              <th className="ui-table-th">
                <span className="sr-only">Selected</span>
              </th>
              <th className="ui-table-th">LC Number</th>
              <th className="ui-table-th">LC Amount</th>
              <th className="ui-table-th hidden lg:table-cell">Beneficiary</th>
              <th className="ui-table-th hidden xl:table-cell">Expiry Date</th>
              <th className="ui-table-th hidden xl:table-cell">Last Shipment Date</th>
              <th className="ui-table-th">Status</th>
            </tr>
          </thead>
          <tbody>
            {isLoading && (
              <tr>
                <td colSpan={7} className="ui-table-empty">
                  Loading Letters of Credit...
                </td>
              </tr>
            )}

            {!isLoading && error && (
              <tr>
                <td colSpan={7} className="ui-table-error" role="alert">
                  {error}
                </td>
              </tr>
            )}

            {!isLoading && !error && documents.length === 0 && (
              <tr>
                <td colSpan={7} className="ui-table-empty">
                  No Letters of Credit found yet.
                </td>
              </tr>
            )}

            {!isLoading &&
              !error &&
              documents.map((row) => {
                const isSelected = selectedLcId === row.id;

                return (
                  <tr
                    key={row.id}
                    className={cn(
                      "ui-table-row dashboard-lc-table__row cursor-pointer transition-all duration-200",
                      isSelected && "dashboard-lc-table__row--selected"
                    )}
                    onClick={() => onSelectLc(row.id)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" || event.key === " ") {
                        event.preventDefault();
                        onSelectLc(row.id);
                      }
                    }}
                    tabIndex={0}
                    aria-selected={isSelected}
                    aria-label={`Select Letter of Credit ${row.lcNumber}`}
                  >
                    <td className="ui-table-td dashboard-lc-table__select-cell">
                      {isSelected ? (
                        <CheckCircle2Icon
                          className="dashboard-lc-table__selected-icon"
                          aria-hidden="true"
                        />
                      ) : (
                        <span
                          className="dashboard-lc-table__select-ring"
                          aria-hidden="true"
                        />
                      )}
                    </td>
                    <td className="ui-table-td dashboard-lc-table__lc-number">
                      <div className="dashboard-lc-table__lc-number-inner">
                        <FileTextIcon
                          className="dashboard-lc-table__lc-icon"
                          aria-hidden="true"
                        />
                        <span>{row.lcNumber}</span>
                      </div>
                    </td>
                    <td className="ui-table-td dashboard-lc-table__text">
                      {row.lcAmount}
                    </td>
                    <td className="ui-table-td dashboard-lc-table__text hidden lg:table-cell">
                      {row.beneficiaryName}
                    </td>
                    <td className="ui-table-td dashboard-lc-table__muted hidden xl:table-cell">
                      {row.expiryDate}
                    </td>
                    <td className="ui-table-td dashboard-lc-table__muted hidden xl:table-cell">
                      {row.lastShipmentDate}
                    </td>
                    <td className="ui-table-td text-center">
                      <div className="flex items-center justify-center gap-2">
                        <JobStatusBadge status={resolveLcJobStatus(row)} />
                        <ChevronRightIcon
                          className={cn(
                            "size-4 text-muted-foreground transition-transform",
                            isSelected && "translate-x-0.5 text-brand-blue"
                          )}
                          aria-hidden="true"
                        />
                      </div>
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>
    </section>
  );
}
