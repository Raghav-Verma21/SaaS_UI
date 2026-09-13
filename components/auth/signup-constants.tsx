import type { LucideIcon } from "lucide-react";
import {
  BadgeCheckIcon,
  ClockIcon,
  DownloadIcon,
  ShieldCheckIcon,
} from "lucide-react";

export type SignupFeature = {
  icon: LucideIcon;
  title: string;
  description: string;
};

export const signupFeatures: SignupFeature[] = [
  {
    icon: BadgeCheckIcon,
    title: "Full Platform Access",
    description: "Get complete access to all features during your free trial.",
  },
  {
    icon: ShieldCheckIcon,
    title: "Secure & Trusted",
    description: "Enterprise-grade security to keep your data safe.",
  },
  {
    icon: ClockIcon,
    title: "Save Time",
    description: "Automate document checks and reduce manual effort.",
  },
  {
    icon: DownloadIcon,
    title: "Download Reports",
    description: "Generate professional compliance reports instantly.",
  },
];
