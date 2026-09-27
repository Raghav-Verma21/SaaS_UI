"use client";

import { useState } from "react";

import { DashboardAppShell } from "@/components/dashboard/dashboard-app-shell";
import { DashboardSummaryCards } from "@/components/dashboard/dashboard-summary-cards";
import { HowItWorksSection } from "@/components/dashboard/how-it-works-section";
import { RecentLetterOfCreditTable } from "@/components/dashboard/recent-lc-table";
import { useAuth } from "@/lib/auth/auth-context";
import { useCompanyLcs } from "@/lib/dashboard/use-company-lcs";
import { useDashboardUserDisplay } from "@/lib/dashboard/use-dashboard-user";

export function DashboardShell() {
  const { companyId } = useAuth();
  const user = useDashboardUserDisplay();
  const { documents, selectedLc, selectedId, setSelectedId, isLoading, error, resolveLcJobStatus, handleLcUploadComplete } =
    useCompanyLcs(companyId, 2);
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);

  return (
    <DashboardAppShell
      title="Dashboard"
      userLabel={user.label}
      userInitials={user.initials}
      isUploadDialogOpen={isUploadDialogOpen}
      onUploadDialogOpenChange={setIsUploadDialogOpen}
      onUploadSuccess={handleLcUploadComplete}
    >
      <RecentLetterOfCreditTable
        documents={documents}
        isLoading={isLoading}
        error={error}
        selectedLcId={selectedId}
        onSelectLc={setSelectedId}
        resolveLcJobStatus={resolveLcJobStatus}
      />
      <DashboardSummaryCards selectedLc={selectedLc} companyId={companyId} />
      <HowItWorksSection />
    </DashboardAppShell>
  );
}
