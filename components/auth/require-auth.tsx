"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";

import { useAuth } from "@/lib/auth/auth-context";
import { AUTH_SESSION_EXPIRED_EVENT } from "@/lib/api/api-service";
import { hasLocalSession } from "@/lib/auth/session";

export function RequireAuth({ children }: { children: ReactNode }) {
  const router = useRouter();
  const { syncFromStorage, clearSession } = useAuth();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (!hasLocalSession()) {
      router.replace("/login");
      return;
    }

    syncFromStorage();
    setIsReady(true);

    function handleSessionExpired() {
      clearSession();
      router.replace("/login");
    }

    window.addEventListener(AUTH_SESSION_EXPIRED_EVENT, handleSessionExpired);

    return () => {
      window.removeEventListener(AUTH_SESSION_EXPIRED_EVENT, handleSessionExpired);
    };
  }, [router, syncFromStorage, clearSession]);

  if (!isReady) {
    return null;
  }

  return <>{children}</>;
}
