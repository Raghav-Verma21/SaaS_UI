import {
  BarChart3Icon,
  ClipboardListIcon,
  FileTextIcon,
  LayoutDashboardIcon,
  ShieldCheckIcon,
  SettingsIcon,
} from "lucide-react";

import { cn } from "@/lib/utils";

const navItems = [
  { icon: LayoutDashboardIcon, label: "Overview" },
  { icon: FileTextIcon, label: "Documents" },
  { icon: ShieldCheckIcon, label: "Compliance", active: true },
  { icon: BarChart3Icon, label: "Reports" },
  { icon: SettingsIcon, label: "Settings" },
];

const documents = [
  { name: "Commercial Invoice", status: "Discrepancy", discrepancies: 1, tone: "danger" as const },
  { name: "Bill of Lading", status: "Passed", discrepancies: 0, tone: "success" as const },
  { name: "Packing List", status: "Warning", discrepancies: 1, tone: "warning" as const },
];

const statusStyles = {
  success: "bg-green-50 text-green-700",
  danger: "bg-red-50 text-red-600",
  warning: "bg-amber-50 text-amber-700",
};

function StatusBadge({
  label,
  tone,
}: {
  label: string;
  tone: keyof typeof statusStyles;
}) {
  return (
    <span
      className={cn(
        "inline-flex rounded-full px-2.5 py-0.5 text-[10px] font-semibold sm:text-xs",
        statusStyles[tone]
      )}
    >
      {label}
    </span>
  );
}

function StatRow({
  count,
  label,
  color,
}: {
  count: number;
  label: string;
  color: string;
}) {
  return (
    <div className="flex items-center gap-2.5">
      <span
        className={cn("size-2 shrink-0 rounded-full", color)}
        aria-hidden="true"
      />
      <span className="text-xs text-muted-foreground sm:text-sm">
        <span className="font-semibold text-foreground">{count}</span> {label}
      </span>
    </div>
  );
}

export function DashboardMockup({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "relative w-full overflow-hidden rounded-2xl border border-border bg-white shadow-2xl shadow-primary/10",
        className
      )}
      aria-hidden="true"
    >
      <div className="flex min-h-[380px] sm:min-h-[440px]">
        {/* Sidebar */}
        <aside className="hidden w-[148px] shrink-0 flex-col gap-1 border-r border-border bg-brand-surface p-3 md:flex">
          {navItems.map(({ icon: Icon, label, active }) => (
            <div
              key={label}
              className={cn(
                "flex items-center gap-2 rounded-lg px-2.5 py-2 text-xs font-medium",
                active
                  ? "bg-white text-navy shadow-sm"
                  : "text-muted-foreground"
              )}
            >
              <Icon className="size-3.5 shrink-0" />
              <span className="truncate">{label}</span>
            </div>
          ))}
        </aside>

        {/* Main content */}
        <div className="min-w-0 flex-1 p-4 sm:p-5">
          <h3 className="text-sm font-semibold text-navy sm:text-base">
            Compliance Overview
          </h3>

          {/* Summary cards */}
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <div className="flex items-center justify-between rounded-xl border border-border bg-white p-4">
              <div>
                <p className="text-xs font-medium text-muted-foreground">
                  Overall Compliance
                </p>
                <p className="mt-1 text-2xl font-bold text-navy sm:text-3xl">
                  96%
                </p>
                <p className="mt-0.5 text-xs font-semibold text-green-600">
                  Compliant
                </p>
              </div>
              <div className="relative flex size-16 items-center justify-center sm:size-[72px]">
                <svg className="size-16 -rotate-90 sm:size-[72px]" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="42"
                    fill="none"
                    stroke="#e2e8f0"
                    strokeWidth="8"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="42"
                    fill="none"
                    stroke="#22c55e"
                    strokeWidth="8"
                    strokeDasharray="264"
                    strokeDashoffset="10.5"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
            </div>

            <div className="flex flex-col justify-center gap-2.5 rounded-xl border border-border bg-white p-4">
              <StatRow count={24} label="Checks Passed" color="bg-green-500" />
              <StatRow count={2} label="Discrepancies" color="bg-red-500" />
              <StatRow count={3} label="Warnings" color="bg-amber-500" />
            </div>
          </div>

          {/* Document table */}
          <div className="mt-4 overflow-hidden rounded-xl border border-border">
            <table className="w-full text-left text-[11px] sm:text-xs">
              <thead>
                <tr className="border-b border-border bg-brand-surface/80">
                  <th className="px-3 py-2.5 font-medium text-muted-foreground">
                    Document
                  </th>
                  <th className="px-3 py-2.5 font-medium text-muted-foreground">
                    Status
                  </th>
                  <th className="px-3 py-2.5 font-medium text-muted-foreground">
                    Discrepancies
                  </th>
                </tr>
              </thead>
              <tbody>
                {documents.map((doc) => (
                  <tr key={doc.name} className="border-b border-border last:border-0">
                    <td className="px-3 py-2.5 font-medium text-foreground">
                      {doc.name}
                    </td>
                    <td className="px-3 py-2.5">
                      <StatusBadge label={doc.status} tone={doc.tone} />
                    </td>
                    <td className="px-3 py-2.5 text-muted-foreground">
                      {doc.discrepancies}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Discrepancy detail popover — compact so the document table stays visible */}
      <div className="absolute right-2 bottom-2 max-w-[168px] rounded-lg border border-border bg-white/95 p-2.5 shadow-lg backdrop-blur-sm sm:right-3 sm:bottom-3 sm:max-w-[188px]">
        <div className="flex items-center gap-1.5">
          <span className="size-1.5 shrink-0 rounded-full bg-red-500" aria-hidden="true" />
          <p className="text-[10px] font-semibold text-navy leading-none sm:text-[11px]">
            Discrepancy Found
          </p>
        </div>

        <dl className="mt-2 space-y-1.5 text-[9px] leading-tight sm:text-[10px]">
          <div>
            <dt className="text-muted-foreground">Check</dt>
            <dd className="font-semibold text-navy">Invoice Amount</dd>
          </div>
          <div className="grid grid-cols-2 gap-x-2">
            <div>
              <dt className="text-muted-foreground">Expected</dt>
              <dd className="font-semibold text-navy">EUR 58,325.85</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Actual</dt>
              <dd className="font-bold text-red-600">EUR 60,325.85</dd>
            </div>
          </div>
          <div>
            <dt className="text-muted-foreground">Reason</dt>
            <dd className="line-clamp-2 text-muted-foreground">
              Invoice amount exceeds the amount permitted by LC.
            </dd>
          </div>
        </dl>

        <button
          type="button"
          className="mt-2 w-full rounded-md border border-border py-1 text-[9px] font-semibold text-navy transition-colors hover:bg-brand-surface sm:text-[10px]"
          tabIndex={-1}
        >
          View Details
        </button>
      </div>
    </div>
  );
}
