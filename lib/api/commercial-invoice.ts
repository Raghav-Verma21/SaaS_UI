import { api } from "@/lib/api/api-service";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import type { ApiErrorBody } from "@/lib/api/types";

export interface UploadCommercialInvoiceResponse extends ApiErrorBody {
  docId?: string;
  status?: string;
}

export function uploadCommercialInvoice(lcId: string, file: File) {
  const formData = new FormData();
  formData.append("file", file);

  return api
    .postForm<UploadCommercialInvoiceResponse>(
      API_ENDPOINTS.COMMERCIAL_INVOICE_UPLOAD,
      formData,
      { pathParams: { lcId } }
    )
    .then((res) => res.docId?.trim() || undefined);
}
