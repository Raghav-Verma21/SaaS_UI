import type { Metadata } from "next";

import { RequireAuth } from "@/components/auth/require-auth";
import { DashboardSidebarProvider } from "@/lib/dashboard/sidebar-context";
import { AuthProvider } from "@/lib/auth/auth-context";

export const metadata: Metadata = {
  title: "Dashboard",
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <RequireAuth>
        <DashboardSidebarProvider>{children}</DashboardSidebarProvider>
      </RequireAuth>
    </AuthProvider>
  );
}
