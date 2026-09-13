"use client";

import { useState } from "react";

import { ComplianceReportCard } from "@/components/dashboard/compliance-report-card";
import { DocumentConditionsDialog } from "@/components/dashboard/document-conditions-dialog";
import type { LcDocument, RequiredDocument } from "@/lib/api/letter-of-credit";

interface DashboardSummaryCardsProps {
  selectedLc: LcDocument | null;
}

function DetailsButton({
  doc,
  onSelect,
}: {
  doc: RequiredDocument;
  onSelect: (doc: RequiredDocument) => void;
}) {
  return (
    <button
      type="button"
      className="dashboard-required-docs-table__details-btn"
      onClick={() => onSelect(doc)}
    >
      View details
    </button>
  );
}

export function DashboardSummaryCards({ selectedLc }: DashboardSummaryCardsProps) {
  const [activeDocument, setActiveDocument] = useState<RequiredDocument | null>(null);
  const requiredDocuments = selectedLc?.requiredDocuments ?? [];

  const emptyMessage = !selectedLc
    ? "Select a Letter of Credit to view required documents."
    : "No required documents found for this Letter of Credit.";

  return (
    <>
      <section className="dashboard-summary-cards">
        <article className="dashboard-summary-card ui-card">
          <div className="ui-card-header ui-card-header--stacked">
            <h2 className="ui-card-title">Required Documents</h2>
            {selectedLc && (
              <span className="dashboard-summary-card__subtitle">{selectedLc.lcNumber}</span>
            )}
          </div>

          {requiredDocuments.length === 0 ? (
            <div className="dashboard-summary-card__body">
              <p className="dashboard-summary-card__empty">{emptyMessage}</p>
            </div>
          ) : (
            <>
              <div className="dashboard-required-docs-mobile md:hidden">
                {requiredDocuments.map((doc, i) => (
                  <div key={`${doc.normalized}-${i}`} className="dashboard-required-docs-mobile__item">
                    <div className="dashboard-required-docs-mobile__name">{doc.normalized}</div>
                    <div className="dashboard-required-docs-mobile__meta">
                      <span className="dashboard-required-docs-mobile__copies">
                        Copies: {doc.copies}
                      </span>
                      <DetailsButton doc={doc} onSelect={setActiveDocument} />
                    </div>
                  </div>
                ))}
              </div>

              <div className="dashboard-summary-card__body dashboard-summary-card__table-body hidden md:block">
                <div className="ui-table-wrap">
                  <table className="ui-table dashboard-required-docs-table">
                    <thead className="ui-table-head">
                      <tr>
                        <th className="ui-table-th dashboard-required-docs-table__name">
                          Document Name
                        </th>
                        <th className="ui-table-th dashboard-required-docs-table__copies">Copies</th>
                        <th className="ui-table-th dashboard-required-docs-table__conditions">
                          Conditions
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {requiredDocuments.map((doc, i) => (
                        <tr key={`${doc.normalized}-${i}`} className="ui-table-row">
                          <td className="ui-table-td dashboard-required-docs-table__name dashboard-lc-table__text">
                            <span className="dashboard-required-docs-table__name-text">
                              {doc.normalized}
                            </span>
                          </td>
                          <td className="ui-table-td dashboard-required-docs-table__copies dashboard-lc-table__muted">
                            <span className="dashboard-required-docs-table__copies-text">
                              {doc.copies}
                            </span>
                          </td>
                          <td className="ui-table-td dashboard-required-docs-table__conditions">
                            <DetailsButton doc={doc} onSelect={setActiveDocument} />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}
        </article>
        <ComplianceReportCard selectedLc={selectedLc} />
      </section>

      <DocumentConditionsDialog
        open={activeDocument !== null}
        onOpenChange={(open) => !open && setActiveDocument(null)}
        documentName={activeDocument?.normalized ?? ""}
        conditions={activeDocument?.conditions ?? []}
      />
    </>
  );
}
