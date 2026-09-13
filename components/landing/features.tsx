import {
  BarChart3Icon,
  FileSearchIcon,
  FileTextIcon,
  ScanTextIcon,
  ShieldAlertIcon,
} from "lucide-react";

import { Container } from "@/components/landing/container";
import { cn } from "@/lib/utils";
import { BRAND } from "@/lib/brand";

const features = [
  {
    icon: ScanTextIcon,
    title: "Intelligent Document Extraction",
    description:
      "Automatically extract key data from invoices, bills of lading, and packing lists.",
  },
  {
    icon: FileTextIcon,
    title: "LC & Document Validation",
    description:
      "Validate trade documents against Letter of Credit terms and UCP 600 rules.",
  },
  {
    icon: ShieldAlertIcon,
    title: "Discrepancy Detection",
    description:
      "Identify mismatches in amounts, dates, and descriptions before bank submission.",
  },
  {
    icon: BarChart3Icon,
    title: "Clear Insights",
    description:
      "Get actionable compliance scores and prioritized issue summaries at a glance.",
  },
  {
    icon: FileSearchIcon,
    title: "Compliance Reports",
    description:
      "Generate audit-ready reports for internal review and bank presentation.",
  },
];

export function FeaturesSection() {
  return (
    <section id="features" className="bg-brand-surface">
      <Container className="py-16 sm:py-24">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-semibold tracking-widest text-brand-blue uppercase">
            Built for Exporters
          </p>
          <h2 className="mt-3 text-2xl font-bold tracking-tight text-navy sm:text-3xl lg:text-4xl">
            Ensure Compliance. Avoid Costly Delays.
          </h2>
          <p className="mt-4 text-base text-muted-foreground sm:text-lg">
            From document upload to bank-ready compliance — {BRAND.name} handles
            the complexity so your team can focus on closing deals.
          </p>
        </div>

        <ul className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {features.map((feature) => (
            <li
              key={feature.title}
              className={cn(
                "flex flex-col items-center rounded-xl border border-border bg-background p-6 text-center shadow-sm transition-shadow hover:shadow-md"
              )}
            >
              <div className="flex size-12 items-center justify-center rounded-xl bg-brand-light text-brand-blue">
                <feature.icon className="size-6" aria-hidden="true" />
              </div>
              <h3 className="mt-4 text-sm font-bold text-navy sm:text-base">
                {feature.title}
              </h3>
              <p className="mt-2 text-xs leading-relaxed text-muted-foreground sm:text-sm">
                {feature.description}
              </p>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
