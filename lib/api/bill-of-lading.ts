import { api } from "@/lib/api/api-service";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import type { ApiErrorBody } from "@/lib/api/types";

export interface UploadBillOfLadingResponse extends ApiErrorBody {
  success?: string;
}

export function uploadBillOfLading(lcId: string, file: File) {
  const formData = new FormData();
  formData.append("file", file);

  return api
    .postForm<UploadBillOfLadingResponse>(API_ENDPOINTS.BILL_OF_LADING_UPLOAD, formData, {
      pathParams: { lcId },
    })
    .then((res) => res.success?.trim() || undefined);
}
