"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  CalendarIcon,
  ChevronRightIcon,
  CircleHelpIcon,
  FileTextIcon,
  GlobeIcon,
  InfoIcon,
  PackageIcon,
  ShipIcon,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { JobStatusBadge } from "@/components/dashboard/job-status-badge";
import type { LcDocument } from "@/lib/api/letter-of-credit";
import { findGeneratedForRequired } from "@/lib/dashboard/generated-documents";

function formatFieldLabel(key: string) {
  return key
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/[_-]+/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

function fieldIcon(key: string): LucideIcon {
  const k = key.toLowerCase();
  if (k.includes("date") || k.includes("period")) return CalendarIcon;
  if (k.includes("place") || k.includes("port") || k.includes("loading") || k.includes("discharge"))
    return GlobeIcon;
  if (k.includes("goods") || k.includes("incoterm")) return PackageIcon;
  if (k.includes("shipment") || k.includes("ship")) return ShipIcon;
  return CircleHelpIcon;
}

function SemanticField({
  label,
  value,
  icon: Icon,
  onMore,
}: {
  label: string;
  value: string;
  icon: LucideIcon;
  onMore: (field: { label: string; value: string }) => void;
}) {
  const valueRef = useRef<HTMLElement>(null);
  const [truncated, setTruncated] = useState(false);

  useLayoutEffect(() => {
    const el = valueRef.current;
    const lineOverflow = value.split("\n").length > 3;
    if (el) setTruncated(lineOverflow || el.scrollHeight > el.clientHeight + 1);
  }, [value]);

  return (
    <div className="lc-semantic-field">
      <div className="lc-semantic-field__icon" aria-hidden="true">
        <Icon className="size-4 text-brand-blue" />
      </div>
      <div className="min-w-0 flex-1">
        <dt className="lc-semantic-field__label">{label}</dt>
        <dd ref={valueRef} className="lc-semantic-field__value lc-semantic-field__value--clamp">
          {value}
        </dd>
        {truncated && (
          <button
            type="button"
            className="lc-semantic-field__more"
            onClick={() => onMore({ label, value })}
          >
            ...more
          </button>
        )}
      </div>
    </div>
  );
}

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
  const [activeField, setActiveField] = useState<{ label: string; value: string } | null>(null);
  const semanticEntries = Object.entries(lc.semanticFields);

  return (
    <>
      <section className="dashboard-summary-cards">
        <article className="dashboard-summary-card ui-card">
          <div className="ui-card-header ui-card-header--stacked">
            <div className="flex items-center gap-2">
              <h2 className="ui-card-title">What we understand from this LC</h2>
              <InfoIcon className="size-4 text-muted-foreground" aria-hidden="true" />
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="dashboard-summary-card__subtitle">{lc.lcNumber}</span>
              <JobStatusBadge status={resolveLcJobStatus(lc)} />
            </div>
          </div>

          <div className="dashboard-summary-card__body">
            {semanticEntries.length === 0 ? (
              <p className="dashboard-summary-card__empty">
                No extracted LC details available yet.
              </p>
            ) : (
              <dl className="lc-semantic-grid">
                {semanticEntries.map(([key, value]) => (
                  <SemanticField
                    key={key}
                    label={formatFieldLabel(key)}
                    value={value}
                    icon={fieldIcon(key)}
                    onMore={setActiveField}
                  />
                ))}
              </dl>
            )}
          </div>
        </article>

        <article className="dashboard-summary-card ui-card">
          <div className="ui-card-header ui-card-header--stacked">
            <div className="flex items-center gap-2">
              <h2 className="ui-card-title">Documents required under this LC</h2>
              <InfoIcon className="size-4 text-muted-foreground" aria-hidden="true" />
            </div>
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

      <Dialog open={activeField !== null} onOpenChange={(open) => !open && setActiveField(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{activeField?.label}</DialogTitle>
            <DialogDescription>Extracted LC detail</DialogDescription>
          </DialogHeader>
          <p className="max-h-96 overflow-y-auto whitespace-pre-line text-sm leading-relaxed text-navy">
            {activeField?.value}
          </p>
        </DialogContent>
      </Dialog>
    </>
  );
}
