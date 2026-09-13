"use client";

import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar";
import { UploadLcDialog } from "@/components/dashboard/upload-lc-dialog";
import { useDashboardSidebar } from "@/lib/dashboard/sidebar-context";
import { cn } from "@/lib/utils";

interface DashboardAppShellProps {
  title: string;
  userLabel: string;
  userInitials: string;
  children: React.ReactNode;
  isUploadDialogOpen: boolean;
  onUploadDialogOpenChange: (open: boolean) => void;
  onUploadSuccess?: () => void;
}

export function DashboardAppShell({
  title,
  userLabel,
  userInitials,
  children,
  isUploadDialogOpen,
  onUploadDialogOpenChange,
  onUploadSuccess,
}: DashboardAppShellProps) {
  const { isSidebarOpen } = useDashboardSidebar();

  return (
    <div className="dashboard-shell">
      <div
        className={cn(
          "dashboard-layout",
          !isSidebarOpen && "dashboard-layout--sidebar-collapsed"
        )}
      >
        <DashboardSidebar />
        <div className="dashboard-content">
          <DashboardHeader
            title={title}
            userLabel={userLabel}
            userInitials={userInitials}
            onNewLcClick={() => onUploadDialogOpenChange(true)}
          />
          <main className="dashboard-main">{children}</main>
        </div>
      </div>
      <UploadLcDialog
        open={isUploadDialogOpen}
        onOpenChange={onUploadDialogOpenChange}
        onUploadSuccess={onUploadSuccess}
      />
    </div>
  );
}
