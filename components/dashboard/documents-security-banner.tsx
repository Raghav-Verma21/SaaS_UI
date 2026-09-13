import { ArrowRightIcon, ShieldCheckIcon } from "lucide-react";

export function DocumentsSecurityBanner() {
  return (
    <aside className="documents-security-banner">
      <ShieldCheckIcon className="documents-security-banner__icon" aria-hidden="true" />
      <p className="documents-security-banner__text">
        Your data is secure and confidential. We do not share your documents with anyone.
      </p>
      <a href="#" className="documents-security-banner__link">
        Learn more about security
        <ArrowRightIcon className="size-4" aria-hidden="true" />
      </a>
    </aside>
  );
}
