import type { ApiErrorItem } from "@/lib/api/types";

export interface NewCompanyUserRequest {
  companyName: string;
  companyPAN: string;
  companyAddress: string;
  adminUserName: string;
  adminUserEmail: string;
  adminUserPassword: string;
  adminUserPhoneNumber: string;
}

export interface NewCompanyUserResponse {
  success?: string;
  companyId?: string;
  companyName?: string;
  companyPAN?: string;
  companyAddress?: string;
  userId?: string;
  email?: string;
  userName?: string;
  phoneNumber?: string;
  errorList?: ApiErrorItem[];
  ecid?: string;
}

export interface SignupFormValues {
  fullName: string;
  businessEmail: string;
  companyName: string;
  companyPAN: string;
  phoneNumber: string;
  password: string;
  confirmPassword: string;
  agreedToTerms: boolean;
}

const PAN_PATTERN = /^[A-Z]{5}[0-9]{4}[A-Z]$/;

export function mapSignupFormToRequest(
  values: SignupFormValues
): NewCompanyUserRequest {
  return {
    companyName: values.companyName.trim(),
    companyPAN: values.companyPAN.trim().toUpperCase(),
    companyAddress: values.companyName.trim(),
    adminUserName: values.fullName.trim(),
    adminUserEmail: values.businessEmail.trim(),
    adminUserPassword: values.password,
    adminUserPhoneNumber: values.phoneNumber.trim(),
  };
}

export function validateSignupForm(values: SignupFormValues): string | null {
  if (!values.agreedToTerms) {
    return "You must agree to the Terms of Service and Privacy Policy.";
  }

  // Confirm password is temporarily hidden in the UI.
  // if (values.password !== values.confirmPassword) {
  //   return "Passwords do not match.";
  // }

  if (!PAN_PATTERN.test(values.companyPAN.trim().toUpperCase())) {
    return "Invalid PAN format. Example: ABCDE1234F";
  }

  return null;
}
