import { api } from "@/lib/api/api-service";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import type { ApiErrorBody } from "@/lib/api/types";

export interface UploadBeneficiaryCertificateQqResponse extends ApiErrorBody {
  success?: string;
}

export function uploadBeneficiaryCertificateQualityQuantity(lcId: string, file: File) {
  const formData = new FormData();
  formData.append("file", file);

  return api
    .postForm<UploadBeneficiaryCertificateQqResponse>(
      API_ENDPOINTS.BENEFICIARY_CERTIFICATE_QQ_UPLOAD,
      formData,
      { pathParams: { lcId } }
    )
    .then((res) => res.success?.trim() || undefined);
}
