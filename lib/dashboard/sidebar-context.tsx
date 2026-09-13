"use client";

import { createContext, useContext, useEffect, useState } from "react";

import { useMediaQuery } from "@/lib/hooks/use-media-query";

const DESKTOP_MQ = "(min-width: 1024px)";

type SidebarContext = {
  isSidebarOpen: boolean;
  isDesktop: boolean;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
};

const Ctx = createContext<SidebarContext | null>(null);

export function DashboardSidebarProvider({ children }: { children: React.ReactNode }) {
  const isDesktop = useMediaQuery(DESKTOP_MQ);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setIsSidebarOpen(window.matchMedia(DESKTOP_MQ).matches);
    setReady(true);
  }, []);

  const value: SidebarContext = {
    isSidebarOpen: ready ? isSidebarOpen : true,
    isDesktop,
    toggleSidebar: () => setIsSidebarOpen((o) => !o),
    setSidebarOpen: setIsSidebarOpen,
  };

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useDashboardSidebar() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useDashboardSidebar requires DashboardSidebarProvider");
  return ctx;
}
