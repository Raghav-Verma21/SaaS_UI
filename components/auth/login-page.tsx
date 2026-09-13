import { Suspense } from "react";

import { GuestOnly } from "@/components/auth/guest-only";
import { LoginForm } from "@/components/auth/login-form";
import { LoginMarketingPanel } from "@/components/auth/login-marketing-panel";

export function LoginPage() {
  return (
    <GuestOnly>
      <div className="auth-page">
        <LoginMarketingPanel />
        <div className="auth-form-panel">
          <Suspense>
            <LoginForm />
          </Suspense>
        </div>
      </div>
    </GuestOnly>
  );
}
