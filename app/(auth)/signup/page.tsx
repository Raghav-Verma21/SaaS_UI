import type { Metadata } from "next";

import { SignupPage } from "@/components/auth/signup-page";
import { BRAND } from "@/lib/brand";

export const metadata: Metadata = {
  title: "Start Free Trial",
  description: `Create your ${BRAND.name} account and start your 14-day free trial.`,
};

export default function SignupRoute() {
  return <SignupPage />;
}
