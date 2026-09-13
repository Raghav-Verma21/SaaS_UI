"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type ComponentType, type FormEvent } from "react";
import {
  Building2Icon,
  CreditCardIcon,
  EyeIcon,
  EyeOffIcon,
  InfoIcon,
  LockIcon,
  MailIcon,
  PhoneIcon,
  UserIcon,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  ApiError,
  createAccountWithPrimaryUser,
  mapSignupFormToRequest,
  validateSignupForm,
  type SignupFormValues,
} from "@/lib/api";
import { cn } from "@/lib/utils";

const fieldInputClassName = "h-12 pl-11 text-base";

function GoogleIcon() {
  return (
    <svg className="size-5" viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        fill="#EA4335"
      />
    </svg>
  );
}

const initialFormState: SignupFormValues = {
  fullName: "",
  businessEmail: "",
  companyName: "",
  companyPAN: "",
  phoneNumber: "",
  password: "",
  confirmPassword: "",
  agreedToTerms: false,
};

function IconField({
  id,
  label,
  icon: Icon,
  className,
  children,
}: {
  id: string;
  label: string;
  icon: ComponentType<{ className?: string }>;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={cn("space-y-3", className)}>
      <Label htmlFor={id} className="text-base font-medium">
        {label}
      </Label>
      <div className="relative mt-0">
        <Icon className="pointer-events-none absolute top-1/2 left-3.5 size-5 -translate-y-1/2 text-muted-foreground" />
        {children}
      </div>
    </div>
  );
}

export function SignupForm() {
  const router = useRouter();
  const [form, setForm] = useState<SignupFormValues>(initialFormState);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function updateField<K extends keyof SignupFormValues>(
    key: K,
    value: SignupFormValues[K]
  ) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    const validationError = validateSignupForm(form);
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsLoading(true);

    try {
      const response = await createAccountWithPrimaryUser(
        mapSignupFormToRequest(form)
      );

      if (response.success === "OK" || response.userId) {
        router.push("/login?registered=true");
        return;
      }

      setError("Account could not be created. Please try again.");
    } catch (err) {
      const message =
        err instanceof ApiError
          ? err.message
          : "An error occurred. Please try again later.";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex w-full max-w-4xl flex-col">
      <div className="w-full rounded-2xl border border-border bg-white p-7 shadow-sm sm:p-9 lg:p-10">
        <div className="text-center sm:text-left">
          <h2 className="text-3xl font-bold tracking-tight text-navy">
            Create your account
          </h2>
          <p className="mt-2 text-base leading-relaxed text-muted-foreground">
            Start your 14-day free trial. No credit card required.
          </p>
        </div>

        <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
          {error && (
            <p
              role="alert"
              className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600"
            >
              {error}
            </p>
          )}

          <IconField id="fullName" label="Full Name" icon={UserIcon}>
            <Input
              id="fullName"
              placeholder="Enter your full name"
              autoComplete="name"
              className={fieldInputClassName}
              value={form.fullName}
              onChange={(e) => updateField("fullName", e.target.value)}
              disabled={isLoading}
              required
            />
          </IconField>

          <IconField id="businessEmail" label="Business Email" icon={MailIcon}>
            <Input
              id="businessEmail"
              type="email"
              placeholder="Enter your business email"
              autoComplete="email"
              className={fieldInputClassName}
              value={form.businessEmail}
              onChange={(e) => updateField("businessEmail", e.target.value)}
              disabled={isLoading}
              required
            />
          </IconField>

          <IconField id="companyName" label="Company Name" icon={Building2Icon}>
            <Input
              id="companyName"
              placeholder="Enter your company name"
              autoComplete="organization"
              className={fieldInputClassName}
              value={form.companyName}
              onChange={(e) => updateField("companyName", e.target.value)}
              disabled={isLoading}
              required
            />
          </IconField>

          <IconField id="companyPAN" label="Company PAN" icon={CreditCardIcon}>
            <Input
              id="companyPAN"
              placeholder="ABCDE1234F"
              className={`${fieldInputClassName} uppercase`}
              value={form.companyPAN}
              onChange={(e) => updateField("companyPAN", e.target.value)}
              disabled={isLoading}
              maxLength={10}
              required
            />
          </IconField>

          <IconField id="phoneNumber" label="Phone Number" icon={PhoneIcon}>
            <Input
              id="phoneNumber"
              type="tel"
              placeholder="Enter your phone number"
              autoComplete="tel"
              className={fieldInputClassName}
              value={form.phoneNumber}
              onChange={(e) => updateField("phoneNumber", e.target.value)}
              disabled={isLoading}
              required
            />
          </IconField>

          <IconField id="password" label="Password" icon={LockIcon}>
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="Create a strong password"
              autoComplete="new-password"
              className={`${fieldInputClassName} pr-11`}
              value={form.password}
              onChange={(e) => updateField("password", e.target.value)}
              disabled={isLoading}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute top-1/2 right-3.5 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? (
                <EyeOffIcon className="size-5" />
              ) : (
                <EyeIcon className="size-5" />
              )}
            </button>
          </IconField>

          {/* Confirm password — temporarily hidden
          <IconField
            id="confirmPassword"
            label="Confirm Password"
            icon={LockIcon}
          >
            <Input
              id="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm your password"
              autoComplete="new-password"
              className={`${fieldInputClassName} pr-11`}
              value={form.confirmPassword}
              onChange={(e) => updateField("confirmPassword", e.target.value)}
              disabled={isLoading}
              required
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword((prev) => !prev)}
              className="absolute top-1/2 right-3.5 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              aria-label={
                showConfirmPassword ? "Hide confirm password" : "Show confirm password"
              }
            >
              {showConfirmPassword ? (
                <EyeOffIcon className="size-5" />
              ) : (
                <EyeIcon className="size-5" />
              )}
            </button>
          </IconField>
          */}

          <div className="flex gap-3.5 rounded-lg border border-brand-light bg-brand-light/60 px-4 py-4 text-base leading-relaxed text-muted-foreground">
            <InfoIcon className="mt-0.5 size-5 shrink-0 text-brand-blue" />
            <p>
              After sign up, you can invite your team members and collaborate
              within your workspace.
            </p>
          </div>

          <div className="flex items-start gap-3 pt-1">
            <Checkbox
              id="terms"
              checked={form.agreedToTerms}
              onCheckedChange={(checked: boolean | "indeterminate") =>
                updateField("agreedToTerms", checked === true)
              }
              disabled={isLoading}
              className="mt-0.5"
            />
            <Label
              htmlFor="terms"
              className="cursor-pointer text-base leading-relaxed font-normal text-muted-foreground"
            >
              I agree to the{" "}
              <Link href="#" className="font-medium text-brand-blue hover:underline">
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link href="#" className="font-medium text-brand-blue hover:underline">
                Privacy Policy
              </Link>
            </Label>
          </div>

          <Button
            type="submit"
            className="h-12 w-full text-base"
            size="lg"
            disabled={isLoading}
          >
            {isLoading ? "Creating account..." : "Start Free Trial"}
          </Button>
        </form>

        <div className="relative my-8">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-border" />
          </div>
          <div className="relative flex justify-center text-sm uppercase">
            <span className="bg-white px-3 text-muted-foreground">
              Or sign up with
            </span>
          </div>
        </div>

        <Button variant="outline" type="button" className="h-12 w-full text-base" size="lg">
          <GoogleIcon />
          Continue with Google
        </Button>

        <p className="mt-8 text-center text-base text-muted-foreground">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-semibold text-brand-blue hover:underline"
          >
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}
