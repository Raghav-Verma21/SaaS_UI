import Link from "next/link";

import { signupFeatures } from "@/components/auth/signup-constants";
import { SignupMarketingVisual } from "@/components/auth/signup-marketing-visual";
import { Logo } from "@/components/landing/logo";

export function SignupMarketingPanel() {
  return (
    <div className="auth-marketing-panel auth-marketing-panel--signup">
      <div className="marketing-blob-top" aria-hidden="true" />
      <div className="marketing-blob-bottom" aria-hidden="true" />

      <Link href="/" className="relative z-10 w-fit">
        <Logo />
      </Link>

      <div className="relative z-10 flex flex-1 flex-col justify-center">
        <div className="grid gap-8 min-[768px]:grid-cols-2 min-[768px]:items-start min-[768px]:gap-6 min-[1200px]:gap-10">
          <div className="min-w-0">
            <h1 className="auth-marketing-headline auth-marketing-headline--signup">
              Start Your Free Trial
              <br />
              <span className="text-brand-blue">14 Days. Full Access.</span>
            </h1>
            <p className="auth-marketing-subtext max-w-lg">
              Experience the most reliable way to validate Letter of Credit
              documents and ensure compliance with confidence.
            </p>

            <ul className="auth-feature-list">
              {signupFeatures.map(({ icon: Icon, title, description }) => (
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

          <div className="hidden justify-center min-[768px]:flex min-[768px]:pt-10 min-[1200px]:items-center min-[1200px]:pt-14">
            <SignupMarketingVisual />
          </div>
        </div>
      </div>
    </div>
  );
}
