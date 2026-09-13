"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface DocumentConditionsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  documentName: string;
  conditions: string[];
}

export function DocumentConditionsDialog({
  open,
  onOpenChange,
  documentName,
  conditions,
}: DocumentConditionsDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{documentName}</DialogTitle>
          <DialogDescription>Document conditions</DialogDescription>
        </DialogHeader>

        {conditions.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No conditions listed for this document.
          </p>
        ) : (
          <ul className="max-h-80 space-y-2 overflow-y-auto text-sm text-navy">
            {conditions.map((condition, index) => (
              <li
                key={`${condition}-${index}`}
                className="rounded-lg border border-border bg-brand-surface/60 px-3 py-2 leading-relaxed whitespace-pre-line"
              >
                {condition}
              </li>
            ))}
          </ul>
        )}
      </DialogContent>
    </Dialog>
  );
}
