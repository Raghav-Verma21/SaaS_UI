export interface ApiErrorItem {
  errorCode?: string;
  objectCode?: string;
  message?: string;
}

export interface ApiErrorBody {
  success?: string | boolean;
  error?: string;
  message?: string;
  errorList?: ApiErrorItem[];
  ecid?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  success?: string;
  accessToken?: string;
  refreshToken?: string;
  companyId?: string;
  errorList?: ApiErrorItem[];
  ecid?: string;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface RefreshTokenResponse {
  success?: string;
  accessToken?: string;
  errorList?: ApiErrorItem[];
  ecid?: string;
}
