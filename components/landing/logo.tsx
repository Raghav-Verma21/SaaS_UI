import { cn } from "@/lib/utils";
import { BRAND } from "@/lib/brand";

interface LogoProps {
  className?: string;
  showText?: boolean;
}

export function Logo({ className, showText = true }: LogoProps) {
  return (
    <div className={cn("flex items-center gap-2.5", className)}>
      <svg
        width="32"
        height="32"
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        className="shrink-0"
      >
        <rect width="32" height="32" rx="8" fill="#002878" />
        <path
          d="M9 10h14v2.5H9V10zm0 5h10v2.5H9V15zm0 5h14v2.5H9V20z"
          fill="white"
        />
        <circle cx="22" cy="22" r="5" fill="#3B82F6" />
        <path
          d="M20.5 22l1.2 1.2 2.8-2.8"
          stroke="white"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      {showText && (
        <span className="text-lg font-bold tracking-tight text-navy">
          {BRAND.name}
        </span>
      )}
    </div>
  );
}
