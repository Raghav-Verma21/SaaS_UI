"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

import { DashboardAppShell } from "@/components/dashboard/dashboard-app-shell";
import { DocumentInsightCards } from "@/components/dashboard/document-insight-cards";
import { DocumentsEmptyHero } from "@/components/dashboard/documents-empty-hero";
import { DocumentsSecurityBanner } from "@/components/dashboard/documents-security-banner";
import { HowItWorksSection } from "@/components/dashboard/how-it-works-section";
import { useAuth } from "@/lib/auth/auth-context";
import { useCompanyLcs } from "@/lib/dashboard/use-company-lcs";
import { useDashboardUserDisplay } from "@/lib/dashboard/use-dashboard-user";

export function DocumentsShell() {
  const searchParams = useSearchParams();
  const lcParam = searchParams.get("lc");
  const docParam = searchParams.get("doc");
  const { companyId } = useAuth();
  const user = useDashboardUserDisplay();
  const {
    documents,
    selectedLc,
    selectedId,
    setSelectedId,
    isLoading,
    error,
    resolveDocJobStatus,
    handleLcUploadComplete,
    handleDocUploadComplete,
  } = useCompanyLcs(companyId, null);
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const showEmpty = !isLoading && documents.length === 0 && !error;

  useEffect(() => {
    if (!lcParam || isLoading) return;
    if (documents.some((d) => d.id === lcParam)) setSelectedId(lcParam);
  }, [lcParam, isLoading, documents, setSelectedId]);

  return (
    <DashboardAppShell
      title="Documents"
      userLabel={user.label}
      userInitials={user.initials}
      isUploadDialogOpen={isUploadDialogOpen}
      onUploadDialogOpenChange={setIsUploadDialogOpen}
      onUploadSuccess={handleLcUploadComplete}
    >
      <div className="documents-page">
        <header className="documents-page__intro">
          <p className="documents-page__subtitle">
            Upload trade documents to validate compliance against your Letter of Credit.
          </p>
        </header>

        {showEmpty ? (
          <DocumentsEmptyHero onUploadLcClick={() => setIsUploadDialogOpen(true)} />
        ) : (
          selectedLc && (
            <DocumentInsightCards
              key={selectedLc.id}
              lc={selectedLc}
              allLcs={documents}
              selectedLcId={selectedId}
              onSelectLc={setSelectedId}
              selectorDisabled={isLoading || !!error}
              initialDocName={docParam}
              onUploadComplete={handleDocUploadComplete}
              resolveDocJobStatus={resolveDocJobStatus}
            />
          )
        )}

        <HowItWorksSection />
        <DocumentsSecurityBanner />
      </div>
    </DashboardAppShell>
  );
}
