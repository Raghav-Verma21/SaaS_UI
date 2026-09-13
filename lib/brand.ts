/**
 * Single source of truth for product branding.
 * Rename the product by updating values here only.
 */
export const BRAND = {
  name: "DocuCredit AI",
  slug: "docucredit-ai",
  tagline: "Letter of Credit Compliance Simplified",
  taglineLead: "Letter of Credit Compliance",
  taglineAccent: "Simplified.",
  description:
    "Automate Letter of Credit document validation against UCP 600 and ISBP rules. Catch discrepancies before bank submission and avoid costly rejections.",
  shortDescription:
    "Automate LC document validation and eliminate costly bank rejections.",
  domain: "docucredit.ai",
  supportEmail: "hello@docucredit.ai",
  footerSlogan: "Letter of Credit compliance made simple and reliable.",
} as const;

/** Default page title: "Product Name — Tagline" */
export function brandDefaultTitle(): string {
  return `${BRAND.name} — ${BRAND.tagline}`;
}

/** Per-page title template suffix: "Page Title | Product Name" */
export function brandTitleTemplate(): string {
  return `%s | ${BRAND.name}`;
}

/** Copyright line for footers */
export function brandCopyright(year = new Date().getFullYear()): string {
  return `© ${year} ${BRAND.name}. All rights reserved.`;
}

/** Support mailto link */
export function brandSupportMailto(): string {
  return `mailto:${BRAND.supportEmail}`;
}
