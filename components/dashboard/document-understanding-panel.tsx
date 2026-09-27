"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { ChevronDownIcon } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { OrganizedUnderstanding, UnderstandingField } from "@/lib/dashboard/understanding-fields";
import { cn } from "@/lib/utils";

function FieldRow({
  field,
  onMore,
}: {
  field: UnderstandingField;
  onMore: (field: UnderstandingField) => void;
}) {
  const valueRef = useRef<HTMLElement>(null);
  const [truncated, setTruncated] = useState(false);

  useLayoutEffect(() => {
    const el = valueRef.current;
    const lineOverflow = field.value.split("\n").length > 3;
    if (el) setTruncated(lineOverflow || el.scrollHeight > el.clientHeight + 1);
  }, [field.value]);

  return (
    <div className="understanding-field-row">
      <dt className="understanding-field-row__label">{field.label}</dt>
      <dd ref={valueRef} className="understanding-field-row__value understanding-field-row__value--clamp">
        {field.value}
      </dd>
      {truncated && (
        <button type="button" className="understanding-field-row__more" onClick={() => onMore(field)}>
          View full text
        </button>
      )}
    </div>
  );
}

function SectionBlock({
  id,
  title,
  fields,
  defaultOpen,
  onMore,
}: {
  id: string;
  title: string;
  fields: UnderstandingField[];
  defaultOpen?: boolean;
  onMore: (field: UnderstandingField) => void;
}) {
  const [open, setOpen] = useState(defaultOpen ?? false);

  return (
    <div
      className={cn(
        "understanding-section",
        `understanding-section--${id}`,
        open && "understanding-section--open"
      )}
    >
      <button
        type="button"
        className="understanding-section__trigger"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        <span className="understanding-section__title">{title}</span>
        <span className="understanding-section__meta">{fields.length} fields</span>
        <ChevronDownIcon className="understanding-section__chevron size-4" aria-hidden="true" />
      </button>
      {open && (
        <dl className="understanding-section__body">
          {fields.map((field) => (
            <FieldRow key={field.key} field={field} onMore={onMore} />
          ))}
        </dl>
      )}
    </div>
  );
}

export function DocumentUnderstandingPanel({
  organized,
  emptyMessage,
}: {
  organized: OrganizedUnderstanding;
  emptyMessage: string;
}) {
  const [activeField, setActiveField] = useState<UnderstandingField | null>(null);
  const total = organized.sections.reduce((n, s) => n + s.fields.length, 0);

  if (total === 0) {
    return <p className="dashboard-summary-card__empty">{emptyMessage}</p>;
  }

  return (
    <>
      {organized.intro && <p className="understanding-panel__intro">{organized.intro}</p>}

      <div className="understanding-sections">
        {organized.sections.map((section, i) => (
          <SectionBlock
            key={section.id}
            id={section.id}
            title={section.title}
            fields={section.fields}
            defaultOpen={i === 0}
            onMore={setActiveField}
          />
        ))}
      </div>

      <Dialog open={activeField !== null} onOpenChange={(open) => !open && setActiveField(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{activeField?.label}</DialogTitle>
            <DialogDescription>Extracted detail</DialogDescription>
          </DialogHeader>
          <p className="max-h-96 overflow-y-auto whitespace-pre-line text-sm leading-relaxed text-navy">
            {activeField?.value}
          </p>
        </DialogContent>
      </Dialog>
    </>
  );
}
