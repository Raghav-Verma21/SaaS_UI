"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  dashboardNavItems,
  CrownIcon,
  isDashboardNavActive,
} from "@/components/dashboard/dashboard-constants";
import { Logo } from "@/components/landing/logo";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface DashboardSidebarContentProps {
  onNavigate?: () => void;
  className?: string;
}

export function DashboardSidebarContent({
  onNavigate,
  className,
}: DashboardSidebarContentProps) {
  const pathname = usePathname();

  return (
    <div className={cn("flex h-full flex-col", className)}>
      <div className="dashboard-sidebar__header">
        <Link href="/dashboard" className="dashboard-sidebar__logo" onClick={onNavigate}>
          <Logo />
        </Link>
      </div>

      <nav className="dashboard-sidebar__nav">
        {dashboardNavItems.map(({ icon: Icon, label, href }) => {
          const active = isDashboardNavActive(pathname, href);

          return (
            <Link
              key={label}
              href={href}
              onClick={onNavigate}
              className={cn(
                "dashboard-sidebar__nav-link",
                active && "dashboard-sidebar__nav-link--active"
              )}
            >
              <Icon className="size-4 shrink-0" aria-hidden="true" />
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="dashboard-sidebar__footer">
        <div className="dashboard-sidebar__trial-card">
          <div className="flex items-center gap-2 text-sm font-semibold text-navy">
            <CrownIcon className="size-4 text-brand-blue" aria-hidden="true" />
            Plan
          </div>
          <p className="mt-1 text-sm font-medium text-navy">Free Trial</p>
          <p className="mt-0.5 text-xs text-muted-foreground">14 days remaining</p>
          <Button className="mt-3 w-full" size="sm">
            Upgrade
          </Button>
        </div>
      </div>
    </div>
  );
}
