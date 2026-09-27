import { api } from "@/lib/api/api-service";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import type { ApiErrorBody } from "@/lib/api/types";

export interface UploadInsurancePolicyOrCertificateResponse extends ApiErrorBody {
  success?: string;
}

export function uploadInsurancePolicyOrCertificate(lcId: string, file: File) {
  const formData = new FormData();
  formData.append("file", file);

  return api
    .postForm<UploadInsurancePolicyOrCertificateResponse>(
      API_ENDPOINTS.INSURANCE_POLICY_OR_CERTIFICATE_UPLOAD,
      formData,
      { pathParams: { lcId } }
    )
    .then((res) => res.success?.trim() || undefined);
}
