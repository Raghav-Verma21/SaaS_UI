"use client";

import { MenuIcon } from "lucide-react";

import { BellIcon, ChevronDownIcon, PlusIcon } from "@/components/dashboard/dashboard-constants";
import { DashboardSidebarContent } from "@/components/dashboard/dashboard-sidebar-content";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { useDashboardSidebar } from "@/lib/dashboard/sidebar-context";

interface DashboardHeaderProps {
  title: string;
  userLabel: string;
  userInitials: string;
  onNewLcClick: () => void;
}

export function DashboardHeader({
  title,
  userLabel,
  userInitials,
  onNewLcClick,
}: DashboardHeaderProps) {
  const { isSidebarOpen, isDesktop, toggleSidebar, setSidebarOpen } =
    useDashboardSidebar();

  return (
    <>
      <header className="dashboard-header">
        <div className="dashboard-header__title-row">
          <button
            type="button"
            className="dashboard-header__menu-btn"
            onClick={toggleSidebar}
            aria-expanded={isSidebarOpen}
            aria-label={isSidebarOpen ? "Hide sidebar" : "Show sidebar"}
          >
            <MenuIcon className="size-5" aria-hidden="true" />
          </button>
          <h1 className="dashboard-header__title">{title}</h1>
        </div>

        <div className="dashboard-header__actions">
          <button
            type="button"
            className="dashboard-header__icon-btn"
            aria-label="Notifications"
          >
            <BellIcon className="size-4" />
            <span className="absolute top-2 right-2 size-2 rounded-full bg-brand-blue" />
          </button>
          <button type="button" className="dashboard-header__profile-btn">
            <span className="dashboard-header__avatar">{userInitials}</span>
            <span className="hidden sm:inline">{userLabel}</span>
            <ChevronDownIcon className="size-4 text-muted-foreground" />
          </button>
          <Button className="gap-2" size="sm" onClick={onNewLcClick}>
            <PlusIcon className="size-4" />
            New LC
          </Button>
        </div>
      </header>

      {!isDesktop && (
        <Sheet open={isSidebarOpen} onOpenChange={setSidebarOpen}>
          <SheetContent
            side="left"
            className="dashboard-sidebar-sheet w-[min(100%,280px)] border-none bg-sidebar p-0 text-white sm:max-w-[280px] [&>button]:text-white [&>button]:opacity-80 [&>button]:hover:opacity-100"
          >
            <SheetTitle className="sr-only">Dashboard navigation</SheetTitle>
            <DashboardSidebarContent onNavigate={() => setSidebarOpen(false)} />
          </SheetContent>
        </Sheet>
      )}
    </>
  );
}
