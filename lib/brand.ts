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
  feedbackEmail: "raghavv406@gmail.com",
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

export function buildFeedbackDraft(message: string, fromLabel?: string) {
  const body = fromLabel
    ? `${message.trim()}\n\n—\nSent from ${BRAND.name} (${fromLabel})`
    : message.trim();
  return {
    to: BRAND.feedbackEmail,
    subject: `${BRAND.name} — Feedback`,
    body,
  };
}

/** Default OS mail app (Thunderbird, Apple Mail, etc.) */
export function feedbackMailto(message: string, fromLabel?: string) {
  const { to, subject, body } = buildFeedbackDraft(message, fromLabel);
  const params = new URLSearchParams({ subject, body });
  return `mailto:${to}?${params.toString()}`;
}

/** Gmail in the browser — no desktop app required. */
export function feedbackGmailUrl(message: string, fromLabel?: string) {
  const { to, subject, body } = buildFeedbackDraft(message, fromLabel);
  const params = new URLSearchParams({ view: "cm", fs: "1", to, su: subject, body });
  return `https://mail.google.com/mail/?${params.toString()}`;
}

/** Outlook on the web — no desktop app required. */
export function feedbackOutlookUrl(message: string, fromLabel?: string) {
  const { to, subject, body } = buildFeedbackDraft(message, fromLabel);
  const params = new URLSearchParams({ to, subject, body });
  return `https://outlook.live.com/mail/0/deeplink/compose?${params.toString()}`;
}

export function feedbackDraftText(message: string, fromLabel?: string) {
  const { to, subject, body } = buildFeedbackDraft(message, fromLabel);
  return `To: ${to}\nSubject: ${subject}\n\n${body}`;
}
