import Link from "next/link";
import { ArrowRightIcon, FileCheck2Icon } from "lucide-react";

import { Container } from "@/components/landing/container";
import { Button } from "@/components/ui/button";
import { BRAND } from "@/lib/brand";

export function CtaSection() {
  return (
    <section id="cta" className="bg-background">
      <Container className="py-16 sm:py-24">
        <div
          id="pricing"
          className="flex flex-col items-center gap-8 rounded-2xl bg-brand-light px-6 py-10 sm:px-10 sm:py-12 lg:flex-row lg:justify-between lg:gap-12"
        >
          <div className="flex items-start gap-5 lg:max-w-xl">
            <div className="hidden size-16 shrink-0 items-center justify-center rounded-2xl bg-white text-brand-blue shadow-sm sm:flex">
              <FileCheck2Icon className="size-8" aria-hidden="true" />
            </div>
            <div className="text-center lg:text-left">
              <h2 className="text-2xl font-bold tracking-tight text-navy sm:text-3xl">
                Start Your Compliance Journey Today
              </h2>
              <p className="mt-3 text-sm text-muted-foreground sm:text-base">
                Join exporters who trust {BRAND.name} to streamline LC compliance
                and eliminate costly document rejections.
              </p>
            </div>
          </div>

          <div className="flex w-full flex-col items-center gap-3 sm:flex-row sm:justify-center lg:w-auto lg:flex-col">
            <Button size="lg" className="w-full sm:w-auto lg:min-w-[200px]" asChild>
              <Link href="/signup">Start Free Trial</Link>
            </Button>
            <Button
              variant="link"
              size="lg"
              className="w-full text-brand-blue sm:w-auto"
              asChild
            >
              <Link href="#cta">
                Book a Demo
                <ArrowRightIcon className="size-4" aria-hidden="true" />
              </Link>
            </Button>
          </div>
        </div>
      </Container>
    </section>
  );
}
