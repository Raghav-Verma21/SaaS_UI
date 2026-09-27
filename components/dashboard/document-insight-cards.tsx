"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { FileTextIcon, ShieldCheckIcon, UploadIcon } from "lucide-react";

import { DocumentConditionsDialog } from "@/components/dashboard/document-conditions-dialog";
import { JobStatusBadge } from "@/components/dashboard/job-status-badge";
import { LcSelectorDropdown } from "@/components/dashboard/lc-selector-dropdown";
import { DocumentUnderstandingPanel } from "@/components/dashboard/document-understanding-panel";
import { Button } from "@/components/ui/button";
import type { LcDocument, RequiredDocument } from "@/lib/api/letter-of-credit";
import { uploadAirwayBill } from "@/lib/api/airway-bill";
import { uploadBeneficiaryCertificate } from "@/lib/api/beneficiary-certificate";
import { uploadBeneficiaryCertificateQualityQuantity } from "@/lib/api/beneficiary-certificate-quality-quantity";
import { uploadBillOfLading } from "@/lib/api/bill-of-lading";
import { uploadCertificateOfOrigin } from "@/lib/api/certificate-of-origin";
import { uploadCommercialInvoice } from "@/lib/api/commercial-invoice";
import { uploadInsurancePolicyOrCertificate } from "@/lib/api/insurance-policy-or-certificate";
import { uploadPackagingList } from "@/lib/api/packaging-list";
import {
  isUploadableTradeDocument,
  requiredDocMatchesQuery,
  requiredDocumentToType,
  type TradeDocumentType,
} from "@/lib/dashboard/document-types";
import {
  findGeneratedForRequired,
  formatParsedDataForDisplay,
  groupChecksByCategory,
  defaultCheckCategory,
  parseDiscrepancyData,
  type CheckCategory,
  type DiscrepancyCheck,
  type DiscrepancyDisplay,
} from "@/lib/dashboard/generated-documents";
import { organizeDocumentUnderstanding } from "@/lib/dashboard/understanding-fields";
import { useDocumentUpload } from "@/lib/dashboard/use-document-upload";
import { cn } from "@/lib/utils";

type InsightView = "parsed" | "discrepancy";

const UPLOAD_BY_TYPE: Record<
  TradeDocumentType,
  { upload: (lcId: string, file: File) => Promise<string | undefined>; label: string }
> = {
  commercial_invoice: { upload: uploadCommercialInvoice, label: "commercial invoice" },
  packaging_list: { upload: uploadPackagingList, label: "packing list" },
  bill_of_lading: { upload: uploadBillOfLading, label: "bill of lading" },
  air_waybill: { upload: uploadAirwayBill, label: "airway bill" },
  certificate_of_origin: { upload: uploadCertificateOfOrigin, label: "certificate of origin" },
  beneficiary_certificate: { upload: uploadBeneficiaryCertificate, label: "beneficiary's certificate" },
  beneficiary_certificate_of_quality_and_quantity: {
    upload: uploadBeneficiaryCertificateQualityQuantity,
    label: "beneficiary's certificate of quality and quantity",
  },
  insurance_policy_or_certificate: {
    upload: uploadInsurancePolicyOrCertificate,
    label: "insurance policy or certificate",
  },
};

const CHECK_TABS: { id: CheckCategory; label: string; tone: "pass" | "warn" | "error" | "other" }[] = [
  { id: "passed", label: "Passed", tone: "pass" },
  { id: "warning", label: "Warnings", tone: "warn" },
  { id: "discrepancy", label: "Discrepancy", tone: "error" },
  { id: "other", label: "Others", tone: "other" },
];

function DiscrepancyCheckRow({
  check,
  tone,
}: {
  check: DiscrepancyCheck;
  tone: "pass" | "warn" | "error" | "other";
}) {
  return (
    <li className={cn("doc-check-row", `doc-check-row--${tone}`)}>
      <p className="doc-check-row__name">{check.name}</p>
      {check.reason && <p className="doc-check-row__reason">{check.reason}</p>}
      {(check.expected || check.actual) && (
        <p className="doc-check-row__meta">
          {check.expected && <>Expected: {check.expected}</>}
          {check.expected && check.actual && " · "}
          {check.actual && <>Actual: {check.actual}</>}
        </p>
      )}
    </li>
  );
}

function CrossCheckPanel({ discrepancy }: { discrepancy: DiscrepancyDisplay }) {
  const groups = useMemo(() => groupChecksByCategory(discrepancy.checks), [discrepancy.checks]);
  const [tab, setTab] = useState<CheckCategory>(() => defaultCheckCategory(groups));

  useEffect(() => {
    setTab(defaultCheckCategory(groups));
  }, [groups]);

  const activeChecks = groups[tab];
  const activeTone = CHECK_TABS.find((t) => t.id === tab)?.tone ?? "other";

  return (
    <div className="doc-discrepancy">
      <div className="doc-discrepancy__head">
        {discrepancy.overallCompliant !== null && (
          <span
            className={cn(
              "status-badge",
              discrepancy.overallCompliant ? "status-badge--validated" : "status-badge--discrepancies"
            )}
          >
            {discrepancy.overallCompliant ? "Compliant" : "Discrepancies found"}
          </span>
        )}
        {discrepancy.advice && <p className="doc-discrepancy__advice">{discrepancy.advice}</p>}
      </div>

      <div className="doc-check-tabs" role="tablist" aria-label="Check results">
        {CHECK_TABS.map(({ id, label, tone }) => (
          <button
            key={id}
            type="button"
            role="tab"
            aria-selected={tab === id}
            className={cn(
              "doc-check-tabs__btn",
              `doc-check-tabs__btn--${tone}`,
              tab === id && "doc-check-tabs__btn--active"
            )}
            onClick={() => setTab(id)}
          >
            {label}
            <span className="doc-check-tabs__count">{groups[id].length}</span>
          </button>
        ))}
      </div>

      <div className="doc-check-scroll">
        {activeChecks.length > 0 ? (
          <ul className="doc-check-list">
            {activeChecks.map((check, i) => (
              <DiscrepancyCheckRow key={i} check={check} tone={activeTone} />
            ))}
          </ul>
        ) : (
          <p className="dashboard-summary-card__empty">No checks in this category.</p>
        )}
      </div>
    </div>
  );
}

interface DocumentInsightCardsProps {
  lc: LcDocument;
  allLcs: LcDocument[];
  selectedLcId: string | null;
  onSelectLc: (lcId: string) => void;
  selectorDisabled?: boolean;
  initialDocName?: string | null;
  onUploadComplete?: (docId?: string) => void | Promise<void>;
  resolveDocJobStatus: (docId: string, fallback: string) => string;
}

export function DocumentInsightCards({
  lc,
  allLcs,
  selectedLcId,
  onSelectLc,
  selectorDisabled,
  initialDocName,
  onUploadComplete,
  resolveDocJobStatus,
}: DocumentInsightCardsProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedDoc, setSelectedDoc] = useState<RequiredDocument | null>(
    lc.requiredDocuments[0] ?? null
  );
  const [conditionsDoc, setConditionsDoc] = useState<RequiredDocument | null>(null);
  const [uploadTarget, setUploadTarget] = useState<RequiredDocument | null>(null);
  const [view, setView] = useState<InsightView>("parsed");
  const { uploadFile, error, setError, isUploading } = useDocumentUpload(lc.id, onUploadComplete);
  const focusDoc = selectedDoc ?? lc.requiredDocuments[0] ?? null;
  const generatedDoc = focusDoc
    ? findGeneratedForRequired(focusDoc, lc.generatedDocuments)
    : null;
  const organizedFields = useMemo(() => {
    if (!generatedDoc) return { sections: [] };
    return organizeDocumentUnderstanding(formatParsedDataForDisplay(generatedDoc.parsedData));
  }, [generatedDoc]);
  const discrepancy = generatedDoc
    ? parseDiscrepancyData(generatedDoc.discrepancyData)
    : null;
  const hasDiscrepancyData = !!generatedDoc && Object.keys(generatedDoc.discrepancyData).length > 0;

  useEffect(() => {
    const fromUrl = initialDocName
      ? lc.requiredDocuments.find((d) => requiredDocMatchesQuery(d, initialDocName))
      : null;
    if (fromUrl) {
      setSelectedDoc(fromUrl);
      return;
    }
    const withData = lc.requiredDocuments.find((d) =>
      findGeneratedForRequired(d, lc.generatedDocuments)
    );
    setSelectedDoc(withData ?? lc.requiredDocuments[0] ?? null);
  }, [lc.id, lc.generatedDocuments, initialDocName]);

  useEffect(() => {
    setView("parsed");
  }, [focusDoc?.name, focusDoc?.normalized, lc.id]);

  async function handleUploadClick(doc: RequiredDocument) {
    if (!isUploadableTradeDocument(doc)) return;
    setError(null);
    setUploadTarget(doc);
    fileInputRef.current?.click();
  }

  async function handleFileChange(file: File | undefined) {
    if (!file || !uploadTarget) return;
    const type = requiredDocumentToType(uploadTarget);
    const config = type ? UPLOAD_BY_TYPE[type] : undefined;
    if (!config) return;
    await uploadFile(
      file,
      config.upload,
      `Unable to upload the ${config.label}. Please try again.`
    );
    setUploadTarget(null);
  }

  return (
    <>
      <section className="dashboard-summary-cards">
        <article className="dashboard-summary-card ui-card">
          <div className="ui-card-header ui-card-header--stacked">
            <h2 className="ui-card-title">
              {view === "parsed"
                ? `What we understand from this ${focusDoc?.normalized ?? "document"}`
                : "Cross-checking result with LC"}
            </h2>
            <span className="dashboard-summary-card__subtitle">{lc.lcNumber}</span>
          </div>

          <div className="doc-insight-toggle-bar">
            <div className="doc-insight-toggle" role="tablist" aria-label="Document insight view">
              <button
                type="button"
                role="tab"
                aria-selected={view === "parsed"}
                className={cn(
                  "doc-insight-toggle__btn",
                  view === "parsed" && "doc-insight-toggle__btn--active"
                )}
                onClick={() => setView("parsed")}
              >
                <FileTextIcon className="size-4 shrink-0" aria-hidden="true" />
                Document details
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={view === "discrepancy"}
                className={cn(
                  "doc-insight-toggle__btn",
                  view === "discrepancy" && "doc-insight-toggle__btn--active"
                )}
                onClick={() => setView("discrepancy")}
              >
                <ShieldCheckIcon className="size-4 shrink-0" aria-hidden="true" />
                LC cross-check
              </button>
            </div>
          </div>

          <div className="dashboard-summary-card__body">
            {view === "parsed" ? (
              <DocumentUnderstandingPanel
                organized={organizedFields}
                emptyMessage="Upload this document to extract details and view them here."
              />
            ) : hasDiscrepancyData && discrepancy ? (
              <CrossCheckPanel discrepancy={discrepancy} />
            ) : (
              <p className="dashboard-summary-card__empty">
                Upload this document to run LC cross-check validation.
              </p>
            )}
          </div>
        </article>

        <article className="dashboard-summary-card ui-card">
          <div className="ui-card-header lc-uploaded-table__header">
            <div className="min-w-0">
              <h2 className="ui-card-title">Documents required under this LC</h2>
              <span className="dashboard-summary-card__subtitle">{lc.lcNumber}</span>
            </div>
            <LcSelectorDropdown
              documents={allLcs}
              selectedId={selectedLcId}
              onSelect={onSelectLc}
              disabled={selectorDisabled}
            />
          </div>

          <div className="dashboard-summary-card__body lc-required-docs">
            {lc.requiredDocuments.length > 0 && (
              <p className="lc-required-docs__banner">
                <UploadIcon className="size-4 shrink-0" aria-hidden="true" />
                Upload the below documents to start compliance validation.
              </p>
            )}

            {lc.requiredDocuments.length === 0 ? (
              <p className="dashboard-summary-card__empty">
                No required documents identified for this LC yet.
              </p>
            ) : (
              <ul className="lc-required-docs__list">
                {lc.requiredDocuments.map((doc, i) => {
                  const active =
                    focusDoc?.normalized === doc.normalized && focusDoc?.name === doc.name;
                  const generated = findGeneratedForRequired(doc, lc.generatedDocuments);
                  const docStatus = generated
                    ? resolveDocJobStatus(generated.docId, generated.status)
                    : "—";
                  const canUpload = isUploadableTradeDocument(doc);
                  const uploadingThis =
                    isUploading &&
                    uploadTarget?.normalized === doc.normalized &&
                    uploadTarget?.name === doc.name;
                  return (
                    <li key={`${doc.name}-${doc.normalized}-${i}`} className="lc-required-docs__row">
                      <button
                        type="button"
                        className={cn("lc-required-docs__item", active && "lc-required-docs__item--active")}
                        onClick={() => setSelectedDoc(doc)}
                      >
                        <FileTextIcon className="size-5 shrink-0 text-brand-blue" aria-hidden="true" />
                        <div className="min-w-0 flex-1 text-left">
                          <p className="lc-required-docs__name">{doc.normalized}</p>
                          <p className="lc-required-docs__desc">Copies required: {doc.copies}</p>
                        </div>
                      </button>
                      <JobStatusBadge status={docStatus} />
                      <button
                        type="button"
                        className="dashboard-required-docs-table__details-btn shrink-0"
                        onClick={() => setConditionsDoc(doc)}
                      >
                        View conditions
                      </button>
                      <Button
                        type="button"
                        size="sm"
                        className="shrink-0 gap-1.5"
                        disabled={!canUpload || isUploading}
                        onClick={() => handleUploadClick(doc)}
                      >
                        <UploadIcon className="size-3.5" aria-hidden="true" />
                        {uploadingThis ? "Uploading..." : "Upload"}
                      </Button>
                    </li>
                  );
                })}
              </ul>
            )}
            {error && (
              <p className="lc-upload-hero__error mt-4" role="alert">
                {error}
              </p>
            )}
          </div>
        </article>
      </section>

      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,application/pdf,image/*"
        className="sr-only"
        disabled={isUploading}
        onChange={(e) => {
          const file = e.target.files?.[0];
          void handleFileChange(file);
          e.target.value = "";
        }}
      />

      <DocumentConditionsDialog
        open={conditionsDoc !== null}
        onOpenChange={(open) => !open && setConditionsDoc(null)}
        documentName={conditionsDoc?.normalized ?? ""}
        conditions={conditionsDoc?.conditions ?? []}
      />
    </>
  );
}
