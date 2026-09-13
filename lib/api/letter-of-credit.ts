import { api } from "@/lib/api/api-service";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import type { ApiErrorBody } from "@/lib/api/types";

export interface RequiredDocument {
  name: string;
  normalized: string;
  copies: string;
  code: string;
  conditions: string[];
}

export interface RequiredDocumentApiItem {
  name?: string;
  normalized?: string;
  copies?: string;
  code?: string;
  conditions?: unknown;
}

export interface GeneratedDocumentApiItem {
  docId?: string;
  fileName?: string;
  documentType?: string;
  status?: string;
  parsedData?: Record<string, string>;
  discrepancyData?: Record<string, string>;
}

export interface GeneratedDocument {
  docId: string;
  fileName: string;
  documentType: string;
  status: string;
  parsedData: Record<string, string>;
  discrepancyData: Record<string, string>;
}

export interface LCDocumentListItem {
  lcId?: string;
  lcNumber?: string;
  status?: string;
  lcAmount?: string;
  applicantName?: string;
  beneficiaryName?: string;
  expiryDate?: string;
  issueDate?: string;
  lastShipmentDate?: string;
  requiredDocuments?: RequiredDocumentApiItem[];
  generatedDocuments?: GeneratedDocumentApiItem[];
  semanticFieldsData?: Record<string, string>;
  parsedData?: Record<string, unknown>;
}

export interface LCDocumentListResponse extends ApiErrorBody {
  documents?: LCDocumentListItem[];
}

export interface UploadLetterOfCreditResponse extends ApiErrorBody {
  success?: string;
}

export type LcTableStatus = "Validated" | "Discrepancies" | "Pending Review";

export interface LcTableRow {
  id: string;
  lcNumber: string;
  lcAmount: string;
  applicantName: string;
  beneficiaryName: string;
  issueDate: string;
  expiryDate: string;
  lastShipmentDate: string;
  jobStatus: string;
  status: LcTableStatus;
  requiredDocuments: RequiredDocument[];
  generatedDocuments: GeneratedDocument[];
  semanticFields: Record<string, string>;
}

export type LcDocument = LcTableRow;

export function getCompanyLetterOfCredits(companyId: string, limit: number | null = null) {
  return api.get<LCDocumentListResponse>(API_ENDPOINTS.COMPANY_LETTER_OF_CREDIT, {
    pathParams: { companyId },
    queryParams: { limit },
  });
}

export function uploadLetterOfCredit(companyId: string, file: File) {
  const formData = new FormData();
  formData.append("file", file);

  return api.postForm<UploadLetterOfCreditResponse>(
    API_ENDPOINTS.COMPANY_LETTER_OF_CREDIT_UPLOAD,
    formData,
    { pathParams: { companyId } }
  );
}
