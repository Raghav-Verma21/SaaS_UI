import { GuestOnly } from "@/components/auth/guest-only";
import { SignupForm } from "@/components/auth/signup-form";
import { SignupMarketingPanel } from "@/components/auth/signup-marketing-panel";

export function SignupPage() {
  return (
    <GuestOnly>
      <div className="auth-page">
        <SignupMarketingPanel />
        <div className="auth-form-panel auth-form-panel--signup">
          <SignupForm />
        </div>
      </div>
    </GuestOnly>
  );
}
