import { DashboardSidebarContent } from "@/components/dashboard/dashboard-sidebar-content";

export function DashboardSidebar() {
  return (
    <aside className="dashboard-sidebar hidden lg:flex">
      <DashboardSidebarContent className="w-full" />
    </aside>
  );
}
