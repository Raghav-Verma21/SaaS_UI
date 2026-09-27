import type { Metadata } from "next";

import { RequireAuth } from "@/components/auth/require-auth";
import { DashboardSidebarProvider } from "@/lib/dashboard/sidebar-context";
import { AuthProvider } from "@/lib/auth/auth-context";
import { QueryProvider } from "@/lib/query/query-provider";

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
        <QueryProvider>
          <DashboardSidebarProvider>{children}</DashboardSidebarProvider>
        </QueryProvider>
      </RequireAuth>
    </AuthProvider>
  );
}
