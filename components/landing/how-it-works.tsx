import {
  ArrowRightIcon,
  CheckCircleIcon,
  FileUpIcon,
  ScanIcon,
  UploadIcon,
} from "lucide-react";

import { Container } from "@/components/landing/container";
import { cn } from "@/lib/utils";

const steps = [
  {
    number: 1,
    icon: UploadIcon,
    title: "Upload LC",
    description: "Import your Letter of Credit document to begin validation.",
  },
  {
    number: 2,
    icon: ScanIcon,
    title: "Extract & Structure",
    description: "AI extracts and structures all LC terms and conditions.",
  },
  {
    number: 3,
    icon: FileUpIcon,
    title: "Upload Documents",
    description: "Add invoices, bills of lading, and packing lists etc.",
  },
  {
    number: 4,
    icon: CheckCircleIcon,
    title: "Validate Compliance",
    description: "Automated checks against LC terms and trade rules.",
  },
  {
    number: 5,
    icon: ArrowRightIcon,
    title: "Review & Export",
    description: "Review findings and export bank-ready compliance reports.",
  },
];

export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="bg-background">
      <Container className="py-16 sm:py-24">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-semibold tracking-widest text-muted-foreground uppercase">
            How It Works
          </p>
          <h2 className="mt-3 text-2xl font-bold tracking-tight text-navy sm:text-3xl lg:text-4xl">
            From Upload to Compliance in Simple Steps
          </h2>
        </div>

        <ol className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-5 lg:gap-4 xl:gap-6">
          {steps.map((step, index) => (
            <li
              key={step.number}
              className="relative flex flex-col items-center text-center"
            >
              <div className="flex size-14 items-center justify-center rounded-full bg-brand-light text-brand-blue">
                <step.icon className="size-6" aria-hidden="true" />
              </div>
              <span className="mt-3 text-xs font-semibold text-brand-blue">
                Step {step.number}
              </span>
              <h3 className="mt-1 text-sm font-bold text-navy sm:text-base">
                {step.title}
              </h3>
              <p className="mt-2 text-xs leading-relaxed text-muted-foreground sm:text-sm">
                {step.description}
              </p>

              {index < steps.length - 1 && (
                <ArrowRightIcon
                  className={cn(
                    "absolute top-5 -right-3 size-4 text-border",
                    "hidden lg:block xl:-right-4 xl:size-5"
                  )}
                  aria-hidden="true"
                />
              )}
            </li>
          ))}
        </ol>
      </Container>
    </section>
  );
}
