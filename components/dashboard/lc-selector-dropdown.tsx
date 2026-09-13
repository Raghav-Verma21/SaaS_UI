"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDownIcon } from "lucide-react";

import type { LcDocument } from "@/lib/api/letter-of-credit";
import { cn } from "@/lib/utils";

function truncateApplicant(name: string, max = 20) {
  return name.length > max ? `${name.slice(0, max)}...` : name;
}

interface LcSelectorDropdownProps {
  documents: LcDocument[];
  selectedId: string | null;
  onSelect: (lcId: string) => void;
  disabled?: boolean;
}

export function LcSelectorDropdown({
  documents,
  selectedId,
  onSelect,
  disabled,
}: LcSelectorDropdownProps) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const selected = documents.find((d) => d.id === selectedId) ?? documents[0];

  useEffect(() => {
    if (!open) return;
    const close = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", close);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", close);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  if (!selected) return null;

  return (
    <div ref={rootRef} className="lc-selector">
      <button
        type="button"
        className={cn("lc-selector__trigger", open && "lc-selector__trigger--open")}
        disabled={disabled || documents.length <= 1}
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-label="Select Letter of Credit"
        onClick={() => documents.length > 1 && setOpen((v) => !v)}
      >
        <span className="min-w-0 flex-1">
          <span className="block truncate text-sm font-semibold text-navy">{selected.lcNumber}</span>
          <span className="lc-selector__trigger-applicant">
            {truncateApplicant(selected.applicantName)}
          </span>
        </span>
        {documents.length > 1 && (
          <ChevronDownIcon
            className={cn("lc-selector__chevron size-4 shrink-0", open && "lc-selector__chevron--open")}
            aria-hidden="true"
          />
        )}
      </button>

      {open && documents.length > 1 && (
        <ul className="lc-selector__list" role="listbox" aria-label="Letters of Credit">
          {documents.map((doc) => {
            const active = doc.id === selected.id;
            return (
              <li key={doc.id} role="presentation">
                <button
                  type="button"
                  role="option"
                  aria-selected={active}
                  className={cn("lc-selector__option", active && "lc-selector__option--selected")}
                  onClick={() => {
                    onSelect(doc.id);
                    setOpen(false);
                  }}
                >
                  <span className="lc-selector__option-lc">{doc.lcNumber}</span>
                  <span className="lc-selector__option-applicant">
                    {truncateApplicant(doc.applicantName)}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
