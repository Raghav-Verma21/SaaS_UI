import {
  BellIcon,
  ChevronDownIcon,
  CrownIcon,
  FileTextIcon,
  FilesIcon,
  HelpCircleIcon,
  LayoutDashboardIcon,
  PlusIcon,
  ScrollTextIcon,
  SettingsIcon,
} from "lucide-react";

export const dashboardNavItems = [
  { icon: LayoutDashboardIcon, label: "Dashboard", href: "/dashboard" },
  { icon: FileTextIcon, label: "Letters of Credit", href: "/letters-of-credit" },
  { icon: FilesIcon, label: "Documents", href: "/documents" },
  { icon: ScrollTextIcon, label: "Reports", href: "#" },
  { icon: SettingsIcon, label: "Settings", href: "/settings" },
  { icon: HelpCircleIcon, label: "Help & Support", href: "#" },
] as const;

export function isDashboardNavActive(pathname: string, href: string) {
  return href !== "#" && (pathname === href || pathname.startsWith(`${href}/`));
}

export const howItWorksSteps = [
  {
    step: 1,
    title: "Upload LC",
    description: "Upload your Letter of Credit in any supported format.",
  },
  {
    step: 2,
    title: "Extract & Review",
    description: "We extract LC details and identify required documents.",
  },
  {
    step: 3,
    title: "Upload Documents",
    description: "Upload trade documents as per LC requirements.",
  },
  {
    step: 4,
    title: "Validate Compliance",
    description: "We validate documents against LC terms.",
  },
  {
    step: 5,
    title: "Get Report",
    description: "Review discrepancies and download compliance report.",
  },
] as const;

export { BellIcon, ChevronDownIcon, CrownIcon, PlusIcon };
