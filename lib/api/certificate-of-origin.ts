import { api } from "@/lib/api/api-service";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import type { ApiErrorBody } from "@/lib/api/types";

export interface UploadCertificateOfOriginResponse extends ApiErrorBody {
  success?: string;
}

export function uploadCertificateOfOrigin(lcId: string, file: File) {
  const formData = new FormData();
  formData.append("file", file);

  return api
    .postForm<UploadCertificateOfOriginResponse>(
      API_ENDPOINTS.CERTIFICATE_OF_ORIGIN_UPLOAD,
      formData,
      { pathParams: { lcId } }
    )
    .then((res) => res.success?.trim() || undefined);
}
