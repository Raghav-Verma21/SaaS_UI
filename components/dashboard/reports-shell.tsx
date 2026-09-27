"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

import { DashboardAppShell } from "@/components/dashboard/dashboard-app-shell";
import { DocumentsEmptyHero } from "@/components/dashboard/documents-empty-hero";
import { ReportsFindingsCard } from "@/components/dashboard/reports-findings-card";
import { useAuth } from "@/lib/auth/auth-context";
import { useCompanyLcs } from "@/lib/dashboard/use-company-lcs";
import { useDashboardUserDisplay } from "@/lib/dashboard/use-dashboard-user";

export function ReportsShell() {
  const searchParams = useSearchParams();
  const lcParam = searchParams.get("lc");
  const { companyId } = useAuth();
  const user = useDashboardUserDisplay();
  const {
    documents,
    selectedLc,
    selectedId,
    setSelectedId,
    isLoading,
    error,
    handleLcUploadComplete,
  } = useCompanyLcs(companyId, null);
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const showEmpty = !isLoading && documents.length === 0 && !error;

  useEffect(() => {
    if (!lcParam || isLoading) return;
    if (documents.some((d) => d.id === lcParam)) setSelectedId(lcParam);
  }, [lcParam, isLoading, documents, setSelectedId]);

  return (
    <DashboardAppShell
      title="Reports"
      userLabel={user.label}
      userInitials={user.initials}
      isUploadDialogOpen={isUploadDialogOpen}
      onUploadDialogOpenChange={setIsUploadDialogOpen}
      onUploadSuccess={handleLcUploadComplete}
    >
      <div className="reports-page">
        <header className="reports-page__intro">
          <p className="reports-page__subtitle">
            Review cross-check findings across all trade documents for the selected Letter of Credit.
          </p>
        </header>

        {showEmpty ? (
          <DocumentsEmptyHero onUploadLcClick={() => setIsUploadDialogOpen(true)} />
        ) : (
          selectedLc && (
            <ReportsFindingsCard
              key={selectedLc.id}
              lc={selectedLc}
              allLcs={documents}
              selectedLcId={selectedId}
              onSelectLc={setSelectedId}
              selectorDisabled={isLoading || !!error}
              companyId={companyId}
            />
          )
        )}
      </div>
    </DashboardAppShell>
  );
}
