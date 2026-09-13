import { api } from "@/lib/api/api-service";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import type {
  NewCompanyUserRequest,
  NewCompanyUserResponse,
} from "@/lib/api/signup";

export function createAccountWithPrimaryUser(payload: NewCompanyUserRequest) {
  return api.post<NewCompanyUserResponse>(API_ENDPOINTS.CREATE_ACCOUNT, payload);
}
