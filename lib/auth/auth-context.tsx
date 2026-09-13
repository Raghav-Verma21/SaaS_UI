"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import {
  clearTokens,
  getAccessToken,
  getCompanyId,
  getRefreshToken,
  setAuthSession,
  type AuthSession,
} from "@/lib/auth/tokens";
import {
  AUTH_SESSION_EXPIRED_EVENT,
  AUTH_TOKEN_REFRESHED_EVENT,
} from "@/lib/api/api-service";

export interface AuthContextValue {
  /** Refresh token from login — sent as Bearer on authenticated API calls. */
  bearerToken: string | null;
  accessToken: string | null;
  companyId: string | null;
  isAuthenticated: boolean;
  setSession: (session: AuthSession) => void;
  clearSession: () => void;
  syncFromStorage: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

function readSessionFromStorage() {
  return {
    bearerToken: getRefreshToken(),
    accessToken: getAccessToken(),
    companyId: getCompanyId(),
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSessionState] = useState(readSessionFromStorage);

  const syncFromStorage = useCallback(() => {
    setSessionState(readSessionFromStorage());
  }, []);

  const setSession = useCallback((next: AuthSession) => {
    setAuthSession(next);
    setSessionState(readSessionFromStorage());
  }, []);

  const clearSession = useCallback(() => {
    clearTokens();
    setSessionState({
      bearerToken: null,
      accessToken: null,
      companyId: null,
    });
  }, []);

  useEffect(() => {
    syncFromStorage();

    function handleTokenRefreshed() {
      syncFromStorage();
    }

    function handleSessionExpired() {
      clearSession();
    }

    window.addEventListener(AUTH_TOKEN_REFRESHED_EVENT, handleTokenRefreshed);
    window.addEventListener(AUTH_SESSION_EXPIRED_EVENT, handleSessionExpired);

    return () => {
      window.removeEventListener(AUTH_TOKEN_REFRESHED_EVENT, handleTokenRefreshed);
      window.removeEventListener(AUTH_SESSION_EXPIRED_EVENT, handleSessionExpired);
    };
  }, [syncFromStorage, clearSession]);

  const value = useMemo<AuthContextValue>(
    () => ({
      bearerToken: session.bearerToken,
      accessToken: session.accessToken,
      companyId: session.companyId,
      isAuthenticated: Boolean(session.bearerToken && session.companyId),
      setSession,
      clearSession,
      syncFromStorage,
    }),
    [session, setSession, clearSession, syncFromStorage]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
}
