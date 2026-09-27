import { api } from "@/lib/api/api-service";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import type { ApiErrorBody } from "@/lib/api/types";

export interface UploadBeneficiaryCertificateResponse extends ApiErrorBody {
  success?: string;
}

export function uploadBeneficiaryCertificate(lcId: string, file: File) {
  const formData = new FormData();
  formData.append("file", file);

  return api
    .postForm<UploadBeneficiaryCertificateResponse>(
      API_ENDPOINTS.BENEFICIARY_CERTIFICATE_UPLOAD,
      formData,
      { pathParams: { lcId } }
    )
    .then((res) => res.success?.trim() || undefined);
}
