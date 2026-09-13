const ACCESS_TOKEN_KEY = "accessToken";
const REFRESH_TOKEN_KEY = "refreshToken";
const COMPANY_ID_KEY = "companyId";
export const USER_EMAIL_KEY = "userEmail";

export interface AuthSession {
  accessToken: string;
  refreshToken: string;
  companyId: string;
}

export function getAccessToken(): string | null {
  if (typeof window === "undefined") {
    return null;
  }
  return localStorage.getItem(ACCESS_TOKEN_KEY);
}

export function getRefreshToken(): string | null {
  if (typeof window === "undefined") {
    return null;
  }
  return localStorage.getItem(REFRESH_TOKEN_KEY);
}

export function getCompanyId(): string | null {
  if (typeof window === "undefined") {
    return null;
  }
  return localStorage.getItem(COMPANY_ID_KEY);
}

export function setTokens(accessToken: string, refreshToken: string) {
  localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
  localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
}

export function setAuthSession({ accessToken, refreshToken, companyId }: AuthSession) {
  setTokens(accessToken, refreshToken);
  localStorage.setItem(COMPANY_ID_KEY, companyId);
}

export function setAccessToken(accessToken: string) {
  localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
}

export function clearTokens() {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
  localStorage.removeItem(COMPANY_ID_KEY);
  localStorage.removeItem(USER_EMAIL_KEY);
}

export function hasStoredSession(): boolean {
  return Boolean(getRefreshToken());
}

/**
 * Token sent as `Authorization: Bearer` on authenticated API calls.
 * Uses the JWT access token (backend JwtRequestFilter validates JWT, not refresh token).
 * Refresh token is stored separately as `bearerToken` in AuthContext.
 */
export function getBearerTokenForApi(): string | null {
  return getAccessToken();
}
