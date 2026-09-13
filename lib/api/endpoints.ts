export const API_ENDPOINTS = {
  AUTH_LOGIN: "/api/auth/login",
  AUTH_REFRESH_TOKEN: "/api/auth/refreshToken",
  CREATE_ACCOUNT: "/api/new/createAccountWithPrimaryUser",
  COMPANY_LETTER_OF_CREDIT: "/api/v1/company/{companyId}/letterOfCredit",
  COMPANY_LETTER_OF_CREDIT_UPLOAD:
    "/api/v1/company/{companyId}/letterOfCredit/uploadFile",
  PACKAGING_LIST_UPLOAD: "/api/v1/packagingList/{lcId}/uploadFile",
  COMMERCIAL_INVOICE_UPLOAD: "/api/v1/commercialInvoice/{lcId}/uploadFile",
  BILL_OF_LADING_UPLOAD: "/api/v1/billOfLanding/{lcId}/uploadFile",
  LC_STATUS: "/api/v1/company/{companyId}/letterOfCredit/{lcId}/getLCStatus",
  GENERATED_DOCUMENT_STATUS: "/api/v1/company/{companyId}/otherDocuments/{docId}/getStatus",
} as const;
