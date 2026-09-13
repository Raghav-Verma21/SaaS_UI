"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { DashboardAppShell } from "@/components/dashboard/dashboard-app-shell";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth/auth-context";
import { useDashboardUserDisplay } from "@/lib/dashboard/use-dashboard-user";

export function SettingsShell() {
  const router = useRouter();
  const { clearSession } = useAuth();
  const user = useDashboardUserDisplay();
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);

  function handleLogout() {
    clearSession();
    router.replace("/login");
  }

  return (
    <DashboardAppShell
      title="Settings"
      userLabel={user.label}
      userInitials={user.initials}
      isUploadDialogOpen={isUploadDialogOpen}
      onUploadDialogOpenChange={setIsUploadDialogOpen}
    >
      <Button variant="outline" onClick={handleLogout}>
        Log out
      </Button>
    </DashboardAppShell>
  );
}
