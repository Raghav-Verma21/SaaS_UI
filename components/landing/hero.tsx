import Link from "next/link";
import {
  BadgeCheckIcon,
  ClockIcon,
  ShieldCheckIcon,
  TrendingDownIcon,
} from "lucide-react";

import { Container } from "@/components/landing/container";
import { DashboardMockup } from "@/components/landing/dashboard-mockup";
import { Button } from "@/components/ui/button";
import { BRAND } from "@/lib/brand";

const trustBadges = [
  { icon: BadgeCheckIcon, label: "Accurate Validation" },
  { icon: ClockIcon, label: "Save Time" },
  { icon: TrendingDownIcon, label: "Reduce Rejections" },
  { icon: ShieldCheckIcon, label: "Audit Ready" },
];

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-background">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-brand-light/60 via-background to-background" />

      <Container className="relative grid items-center gap-10 py-16 sm:py-20 lg:grid-cols-2 lg:gap-12 lg:py-24 xl:gap-16">
        <div className="flex flex-col gap-6">
          <h1 className="text-3xl leading-tight font-bold tracking-tight text-navy sm:text-4xl lg:text-[2.75rem] lg:leading-[1.1] xl:text-5xl">
            {BRAND.taglineLead} <span className="text-brand-blue">{BRAND.taglineAccent}</span>
          </h1>
          <p className="max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            Automate document validation against LC terms and international trade
            rules. Catch discrepancies before submission and avoid costly bank
            rejections.
          </p>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <Button size="lg" asChild>
              <Link href="/signup">Start Free Trial</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="#cta">Book a Demo</Link>
            </Button>
          </div>

          <ul className="grid grid-cols-2 gap-x-4 gap-y-3 pt-2 sm:grid-cols-4 lg:max-w-2xl">
            {trustBadges.map(({ icon: Icon, label }) => (
              <li key={label} className="flex items-center gap-2">
                <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-brand-light text-brand-blue">
                  <Icon className="size-4" aria-hidden="true" />
                </div>
                <span className="text-xs font-medium text-foreground sm:text-sm">
                  {label}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div className="relative w-full lg:pl-4">
          <DashboardMockup />
        </div>
      </Container>
    </section>
  );
}
