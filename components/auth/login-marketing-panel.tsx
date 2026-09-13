import Link from "next/link";
import {
  BadgeCheckIcon,
  ClockIcon,
  FileCheck2Icon,
  TrendingDownIcon,
} from "lucide-react";

import { ComplianceFlowVisual } from "@/components/auth/compliance-flow-visual";
import { Logo } from "@/components/landing/logo";
import { BRAND } from "@/lib/brand";

const features = [
  {
    icon: BadgeCheckIcon,
    title: "Accurate Validation",
    description:
      "Validate every document against LC terms and global standards.",
  },
  {
    icon: ClockIcon,
    title: "Save Time",
    description: "Automate manual checks and reduce document review time.",
  },
  {
    icon: TrendingDownIcon,
    title: "Reduce Rejections",
    description: "Identify discrepancies early and avoid costly delays.",
  },
  {
    icon: FileCheck2Icon,
    title: "Audit Ready",
    description: "Generate professional reports with full audit trail.",
  },
];

export function LoginMarketingPanel() {
  return (
    <div className="auth-marketing-panel">
      <div className="marketing-blob-top" aria-hidden="true" />
      <div className="marketing-blob-bottom" aria-hidden="true" />

      <Link href="/" className="relative z-10 w-fit">
        <Logo />
      </Link>

      <div className="auth-marketing-content">
        <div className="max-w-xl">
          <h1 className="auth-marketing-headline">
            {BRAND.taglineLead}{" "}
            <span className="text-brand-blue">{BRAND.taglineAccent}</span>
          </h1>
          <p className="auth-marketing-subtext">
            Upload your LC and trade documents, validate against LC terms,
            identify discrepancies, and generate compliance reports in minutes.
          </p>

          <ul className="auth-feature-list">
            {features.map(({ icon: Icon, title, description }) => (
              <li key={title} className="auth-feature-item">
                <div className="auth-feature-icon">
                  <Icon className="size-5" aria-hidden="true" />
                </div>
                <div>
                  <p className="auth-feature-title">{title}</p>
                  <p className="auth-feature-description">{description}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <ComplianceFlowVisual />
      </div>
    </div>
  );
}
