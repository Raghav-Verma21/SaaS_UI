import { api } from "@/lib/api/api-service";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import type { ApiErrorBody } from "@/lib/api/types";

export interface UploadAirwayBillResponse extends ApiErrorBody {
  success?: string;
}

export function uploadAirwayBill(lcId: string, file: File) {
  const formData = new FormData();
  formData.append("file", file);

  return api
    .postForm<UploadAirwayBillResponse>(API_ENDPOINTS.AIRWAY_BILL_UPLOAD, formData, {
      pathParams: { lcId },
    })
    .then((res) => res.success?.trim() || undefined);
}
