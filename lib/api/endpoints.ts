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
  AIRWAY_BILL_UPLOAD: "/api/v1/airwayBill/{lcId}/uploadFile",
  CERTIFICATE_OF_ORIGIN_UPLOAD: "/api/v1/certificateOfOrigin/{lcId}/uploadFile",
  BENEFICIARY_CERTIFICATE_UPLOAD: "/api/v1/beneficiaryCertificate/{lcId}/uploadFile",
  BENEFICIARY_CERTIFICATE_QQ_UPLOAD:
    "/api/v1/beneficiaryCertificateOfQualityAndQuantity/{lcId}/uploadFile",
  INSURANCE_POLICY_OR_CERTIFICATE_UPLOAD:
    "/api/v1/insurancePolicyOrCertificate/{lcId}/uploadFile",
  LC_STATUS: "/api/v1/company/{companyId}/letterOfCredit/{lcId}/getLCStatus",
  GENERATED_DOCUMENT_STATUS: "/api/v1/company/{companyId}/otherDocuments/{docId}/getStatus",
  COMPLIANCE_REPORT:
    "/api/v1/company/{companyId}/letterOfCredit/{lcId}/complianceReport/excel/fileSignedUrl",
} as const;
