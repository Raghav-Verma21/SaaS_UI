import { DownloadIcon, FileTextIcon, ShieldCheckIcon } from "lucide-react";

import { cn } from "@/lib/utils";

const ARROW_COLOR = "#6B8FE8";

const documentRows = [
  { label: "Commercial Invoice", status: "Passed", tone: "passed" as const },
  { label: "Bill of Lading", status: "Discrepancy", tone: "discrepancy" as const },
  { label: "Packing List", status: "Warning", tone: "warning" as const },
];

const statusStyles = {
  passed: "bg-green-50 text-green-600",
  discrepancy: "bg-red-50 text-red-500",
  warning: "bg-amber-50 text-amber-600",
};

function TinyBranchArrow() {
  return (
    <div className="flex w-5 items-center">
      <div
        className="h-px flex-1 border-t border-dashed"
        style={{ borderColor: ARROW_COLOR }}
      />
      <svg
        width="4"
        height="5"
        viewBox="0 0 4 5"
        className="shrink-0"
        aria-hidden="true"
      >
        <path d="M0 0 L4 2.5 L0 5 Z" fill={ARROW_COLOR} />
      </svg>
    </div>
  );
}

function FlowNode({ className }: { className?: string }) {
  return (
    <div className={cn("relative z-10 flex items-center", className)}>
      <div
        className="size-1.5 shrink-0 rounded-full"
        style={{ backgroundColor: ARROW_COLOR }}
      />
      <TinyBranchArrow />
    </div>
  );
}

function FlowSpine() {
  return (
    <div className="relative flex w-7 shrink-0 flex-col">
      {/* Single vertical dotted line through all 4 nodes */}
      <div
        className="pointer-events-none absolute left-[2px] w-px border-l border-dashed"
        style={{
          borderColor: ARROW_COLOR,
          top: "1.5rem",
          height: "10rem",
        }}
        aria-hidden="true"
      />

      <FlowNode className="h-12" />
      <FlowNode className="h-12" />
      <FlowNode className="h-12" />
      <div className="h-5" aria-hidden="true" />
      <FlowNode className="h-10" />
    </div>
  );
}

function ComplianceDonut() {
  return (
    <div className="relative flex size-28 items-center justify-center">
      <svg className="size-28 -rotate-90" viewBox="0 0 100 100" aria-hidden="true">
        <circle cx="50" cy="50" r="38" fill="none" stroke="#e2e8f0" strokeWidth="10" />
        <circle
          cx="50"
          cy="50"
          r="38"
          fill="none"
          stroke="#22c55e"
          strokeWidth="10"
          strokeDasharray="239"
          strokeDashoffset="24"
          strokeLinecap="round"
        />
        <circle
          cx="50"
          cy="50"
          r="38"
          fill="none"
          stroke="#f59e0b"
          strokeWidth="10"
          strokeDasharray="239"
          strokeDashoffset="215"
          strokeLinecap="round"
        />
        <circle
          cx="50"
          cy="50"
          r="38"
          fill="none"
          stroke="#ef4444"
          strokeWidth="10"
          strokeDasharray="239"
          strokeDashoffset="228"
          strokeLinecap="round"
        />
      </svg>
      <div className="absolute text-center">
        <p className="text-xl font-bold text-navy">96%</p>
        <p className="text-xs font-medium text-green-600">Compliant</p>
      </div>
    </div>
  );
}

export function ComplianceFlowVisual() {
  return (
    <div className="hidden w-full max-w-[300px] shrink-0 lg:flex lg:gap-0">
      <FlowSpine />

      <div className="min-w-0 flex-1">
        <div className="rounded-2xl border border-border bg-white shadow-sm">
          <ul>
            {documentRows.map(({ label, status, tone }, index) => (
              <li
                key={label}
                className={
                  index < documentRows.length - 1 ? "border-b border-border/80" : ""
                }
              >
                <div className="flex h-12 items-center justify-between gap-3 px-4">
                  <span className="text-sm text-muted-foreground">{label}</span>
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${statusStyles[tone]}`}
                  >
                    {status}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-5 rounded-2xl border border-border bg-white p-5 shadow-md">
          <div className="flex h-10 items-center gap-2">
            <div className="flex size-8 items-center justify-center rounded-lg bg-green-50 text-green-600">
              <ShieldCheckIcon className="size-4" aria-hidden="true" />
            </div>
            <span className="text-sm font-semibold text-navy">Compliance Report</span>
          </div>

          <div className="mt-4 flex justify-center">
            <ComplianceDonut />
          </div>

          <div className="mt-4 flex items-center justify-between text-muted-foreground">
            <div className="flex items-center gap-2">
              <FileTextIcon className="size-4" aria-hidden="true" />
              <FileTextIcon className="size-4 opacity-60" aria-hidden="true" />
            </div>
            <DownloadIcon className="size-4" aria-hidden="true" />
          </div>
        </div>
      </div>
    </div>
  );
}
