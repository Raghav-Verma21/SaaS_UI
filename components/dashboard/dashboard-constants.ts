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
  { icon: ScrollTextIcon, label: "Reports", href: "/reports" },
  { icon: SettingsIcon, label: "Settings", href: "/settings" },
  { icon: HelpCircleIcon, label: "Help & Support", href: "/help" },
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

/** One FAQ per step in {@link howItWorksSteps}. */
export const helpFaqItems = [
  {
    step: 1,
    question: "How do I upload a Letter of Credit?",
    answer:
      "Click + New LC in the header (from Dashboard or any page). Select your LC PDF — PDF is supported today. After upload, processing runs automatically; status updates on your Dashboard within a few minutes.",
  },
  {
    step: 2,
    question: "What happens after my LC is uploaded?",
    answer:
      "We extract LC fields (parties, amount, dates, etc.) and list required trade documents from the LC text. Review parsed details under Letters of Credit or on the Dashboard once processing completes.",
  },
  {
    step: 3,
    question: "How do I upload required trade documents?",
    answer:
      "Open Documents, select your LC, pick a required document type, and upload the matching PDF or image. Upload one document at a time; wait for each job to finish before uploading the next if you are unsure of status.",
  },
  {
    step: 4,
    question: "How does compliance validation work?",
    answer:
      "After a trade document is processed, we cross-check extracted fields against your LC terms. Passed checks, warnings, and discrepancies appear on the Documents tab for that file and roll up into your compliance summary on Dashboard and Reports.",
  },
  {
    step: 5,
    question: "Where do I see findings and download a report?",
    answer:
      "Open Reports for document-wise findings and filters by status. The Dashboard compliance card shows a summary for the selected LC. Use Download Excel on Reports for a full compliance workbook once checks have run.",
  },
] as const;

export { BellIcon, ChevronDownIcon, CrownIcon, PlusIcon };
