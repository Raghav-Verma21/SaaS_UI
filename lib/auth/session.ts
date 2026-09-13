import { getCompanyId, getRefreshToken } from "@/lib/auth/tokens";

/** Checks only that login data exists locally. Session validity is enforced by the backend. */
export function hasLocalSession(): boolean {
  return Boolean(getRefreshToken() && getCompanyId());
}
