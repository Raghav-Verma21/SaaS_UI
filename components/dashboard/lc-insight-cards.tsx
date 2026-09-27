"use client";

import { useRouter } from "next/navigation";
import { ChevronRightIcon, FileTextIcon } from "lucide-react";

import { DocumentUnderstandingPanel } from "@/components/dashboard/document-understanding-panel";
import { JobStatusBadge } from "@/components/dashboard/job-status-badge";
import type { LcDocument } from "@/lib/api/letter-of-credit";
import { findGeneratedForRequired } from "@/lib/dashboard/generated-documents";
import { organizeLcUnderstanding } from "@/lib/dashboard/understanding-fields";

export function LcInsightCards({
  lc,
  resolveDocJobStatus,
  resolveLcJobStatus,
}: {
  lc: LcDocument;
  resolveDocJobStatus: (docId: string, fallback: string) => string;
  resolveLcJobStatus: (lc: LcDocument) => string;
}) {
  const router = useRouter();
  const organized = organizeLcUnderstanding(lc.semanticFields);

  return (
    <section className="dashboard-summary-cards">
      <article className="dashboard-summary-card ui-card">
        <div className="ui-card-header ui-card-header--stacked">
          <h2 className="ui-card-title">What we understand from this LC</h2>
          <div className="flex flex-wrap items-center gap-2">
            <span className="dashboard-summary-card__subtitle">{lc.lcNumber}</span>
            <JobStatusBadge status={resolveLcJobStatus(lc)} />
          </div>
        </div>

        <div className="dashboard-summary-card__body">
          <DocumentUnderstandingPanel
            organized={organized}
            emptyMessage="Key LC details are shown in the summary table above. No additional terms were extracted."
          />
        </div>
      </article>

      <article className="dashboard-summary-card ui-card">
        <div className="ui-card-header ui-card-header--stacked">
          <h2 className="ui-card-title">Documents required under this LC</h2>
          <span className="dashboard-summary-card__subtitle">{lc.lcNumber}</span>
        </div>

        <div className="dashboard-summary-card__body lc-required-docs">
          {lc.requiredDocuments.length === 0 ? (
            <p className="dashboard-summary-card__empty">
              No required documents identified for this LC yet.
            </p>
          ) : (
            <>
              <p className="lc-required-docs__hint">
                To upload the document click on the document below.
              </p>
              <ul className="lc-required-docs__list">
                {lc.requiredDocuments.map((doc, i) => {
                  const generated = findGeneratedForRequired(doc, lc.generatedDocuments);
                  const docStatus = generated
                    ? resolveDocJobStatus(generated.docId, generated.status)
                    : "—";
                  return (
                    <li key={`${doc.normalized}-${i}`}>
                      <button
                        type="button"
                        className="lc-required-docs__item lc-required-docs__item--link"
                        onClick={() =>
                          router.push(
                            `/documents?lc=${encodeURIComponent(lc.id)}&doc=${encodeURIComponent(doc.normalized)}`
                          )
                        }
                      >
                        <FileTextIcon className="size-5 shrink-0 text-brand-blue" aria-hidden="true" />
                        <div className="min-w-0 flex-1 text-left">
                          <p className="lc-required-docs__name">{doc.normalized}</p>
                          <p className="lc-required-docs__desc">Copies required: {doc.copies}</p>
                        </div>
                        <JobStatusBadge status={docStatus} />
                        <ChevronRightIcon className="size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
                      </button>
                    </li>
                  );
                })}
              </ul>
            </>
          )}
        </div>
      </article>
    </section>
  );
}
