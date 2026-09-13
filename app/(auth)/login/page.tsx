import type { Metadata } from "next";

import { LoginPage } from "@/components/auth/login-page";
import { BRAND } from "@/lib/brand";

export const metadata: Metadata = {
  title: "Log In",
  description: `Sign in to your ${BRAND.name} account.`,
};

export default function LoginRoute() {
  return <LoginPage />;
}
