import { api } from "@/lib/api/api-service";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import type { ApiErrorBody } from "@/lib/api/types";

export interface UploadPackagingListResponse extends ApiErrorBody {
  success?: string;
}

export function uploadPackagingList(lcId: string, file: File) {
  const formData = new FormData();
  formData.append("file", file);

  return api
    .postForm<UploadPackagingListResponse>(API_ENDPOINTS.PACKAGING_LIST_UPLOAD, formData, {
      pathParams: { lcId },
    })
    .then((res) => res.success?.trim() || undefined);
}
