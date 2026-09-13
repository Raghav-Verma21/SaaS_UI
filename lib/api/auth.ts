import { api } from "@/lib/api/api-service";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import type {
  LoginRequest,
  LoginResponse,
  RefreshTokenResponse,
} from "@/lib/api/types";

export function login(credentials: LoginRequest) {
  return api.post<LoginResponse>(API_ENDPOINTS.AUTH_LOGIN, credentials);
}

export function refreshAccessToken(refreshToken: string) {
  return api.post<RefreshTokenResponse>(API_ENDPOINTS.AUTH_REFRESH_TOKEN, {
    refreshToken,
  });
}
