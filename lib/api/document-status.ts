import { api } from "@/lib/api/api-service";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import type { ApiErrorBody } from "@/lib/api/types";

export interface JobStatusResponse extends ApiErrorBody {
  status?: string;
}

export function getLCStatus(companyId: string, lcId: string) {
  return api.get<JobStatusResponse>(API_ENDPOINTS.LC_STATUS, {
    pathParams: { companyId, lcId },
  });
}

export function getGeneratedDocumentStatus(companyId: string, docId: string) {
  return api.get<JobStatusResponse>(API_ENDPOINTS.GENERATED_DOCUMENT_STATUS, {
    pathParams: { companyId, docId },
  });
}
