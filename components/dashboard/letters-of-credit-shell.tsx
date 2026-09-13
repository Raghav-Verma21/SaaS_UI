"use client";

import { useState } from "react";

import { DashboardAppShell } from "@/components/dashboard/dashboard-app-shell";
import { HowItWorksSection } from "@/components/dashboard/how-it-works-section";
import { LcInsightCards } from "@/components/dashboard/lc-insight-cards";
import { LcUploadHero } from "@/components/dashboard/lc-upload-hero";
import { UploadedLcTable } from "@/components/dashboard/uploaded-lc-table";
import { useAuth } from "@/lib/auth/auth-context";
import { useCompanyLcs } from "@/lib/dashboard/use-company-lcs";
import { useDashboardUserDisplay } from "@/lib/dashboard/use-dashboard-user";

export function LettersOfCreditShell() {
  const { companyId } = useAuth();
  const user = useDashboardUserDisplay();
  const { documents, selectedLc, selectedId, setSelectedId, isLoading, error, resolveLcJobStatus, resolveDocJobStatus, handleLcUploadComplete } =
    useCompanyLcs(companyId, null);
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const showUpload = !isLoading && documents.length === 0 && !error;

  return (
    <DashboardAppShell
      title="Letters of Credit"
      userLabel={user.label}
      userInitials={user.initials}
      isUploadDialogOpen={isUploadDialogOpen}
      onUploadDialogOpenChange={setIsUploadDialogOpen}
      onUploadSuccess={handleLcUploadComplete}
    >
      <div className="lc-page">
        {showUpload ? (
          <>
            <header className="lc-page__intro">
              <p className="lc-page__subtitle">
                Upload your Letter of Credit to extract key details and start
                compliance validation.
              </p>
            </header>
            <LcUploadHero onUploadSuccess={handleLcUploadComplete} />
          </>
        ) : (
          <div className="lc-tab">
            <UploadedLcTable
              documents={documents}
              isLoading={isLoading}
              error={error}
              selectedLcId={selectedId}
              onSelectLc={setSelectedId}
              resolveLcJobStatus={resolveLcJobStatus}
            />
            {selectedLc && (
              <LcInsightCards
                lc={selectedLc}
                resolveDocJobStatus={resolveDocJobStatus}
                resolveLcJobStatus={resolveLcJobStatus}
              />
            )}
          </div>
        )}
        <HowItWorksSection />
      </div>
    </DashboardAppShell>
  );
}
