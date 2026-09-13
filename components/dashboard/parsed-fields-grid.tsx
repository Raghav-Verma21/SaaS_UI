"use client";

import { useLayoutEffect, useRef, useState } from "react";
import {
  CalendarIcon,
  CircleHelpIcon,
  GlobeIcon,
  PackageIcon,
  ShipIcon,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

function formatFieldLabel(key: string) {
  return key
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/[_-]+/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

function fieldIcon(key: string): LucideIcon {
  const k = key.toLowerCase();
  if (k.includes("date") || k.includes("period")) return CalendarIcon;
  if (k.includes("place") || k.includes("port") || k.includes("loading") || k.includes("discharge"))
    return GlobeIcon;
  if (k.includes("goods") || k.includes("incoterm")) return PackageIcon;
  if (k.includes("shipment") || k.includes("ship")) return ShipIcon;
  return CircleHelpIcon;
}

function ParsedField({
  label,
  value,
  icon: Icon,
  onMore,
}: {
  label: string;
  value: string;
  icon: LucideIcon;
  onMore: (field: { label: string; value: string }) => void;
}) {
  const valueRef = useRef<HTMLElement>(null);
  const [truncated, setTruncated] = useState(false);

  useLayoutEffect(() => {
    const el = valueRef.current;
    const lineOverflow = value.split("\n").length > 3;
    if (el) setTruncated(lineOverflow || el.scrollHeight > el.clientHeight + 1);
  }, [value]);

  return (
    <div className="lc-semantic-field">
      <div className="lc-semantic-field__icon" aria-hidden="true">
        <Icon className="size-4 text-brand-blue" />
      </div>
      <div className="min-w-0 flex-1">
        <dt className="lc-semantic-field__label">{label}</dt>
        <dd ref={valueRef} className="lc-semantic-field__value lc-semantic-field__value--clamp">
          {value}
        </dd>
        {truncated && (
          <button
            type="button"
            className="lc-semantic-field__more"
            onClick={() => onMore({ label, value })}
          >
            ...more
          </button>
        )}
      </div>
    </div>
  );
}

export function ParsedFieldsGrid({ fields }: { fields: Record<string, string> }) {
  const [activeField, setActiveField] = useState<{ label: string; value: string } | null>(null);
  const entries = Object.entries(fields);

  if (entries.length === 0) {
    return (
      <p className="dashboard-summary-card__empty">No parsed fields available for this document.</p>
    );
  }

  return (
    <>
      <dl className="lc-semantic-grid">
        {entries.map(([key, value]) => (
          <ParsedField
            key={key}
            label={formatFieldLabel(key)}
            value={value}
            icon={fieldIcon(key)}
            onMore={setActiveField}
          />
        ))}
      </dl>

      <Dialog open={activeField !== null} onOpenChange={(open) => !open && setActiveField(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{activeField?.label}</DialogTitle>
            <DialogDescription>Extracted document detail</DialogDescription>
          </DialogHeader>
          <p className="max-h-96 overflow-y-auto whitespace-pre-line text-sm leading-relaxed text-navy">
            {activeField?.value}
          </p>
        </DialogContent>
      </Dialog>
    </>
  );
}
