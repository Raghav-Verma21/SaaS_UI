import { api } from "@/lib/api/api-service";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import type { ApiErrorBody } from "@/lib/api/types";

export interface SignedUrlVO {
  fileName?: string;
  signedUrl?: string;
  downloadFileName?: string;
}

export interface ComplianceReportResponse extends ApiErrorBody {
  signedUrlVO?: SignedUrlVO;
}

export function getComplianceReport(companyId: string, lcId: string) {
  return api.get<ComplianceReportResponse>(API_ENDPOINTS.COMPLIANCE_REPORT, {
    pathParams: { companyId, lcId },
  });
}
