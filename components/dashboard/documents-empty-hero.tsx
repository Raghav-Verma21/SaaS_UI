"use client";

import { FolderOpenIcon, UploadIcon } from "lucide-react";

import { Button } from "@/components/ui/button";

interface DocumentsEmptyHeroProps {
  onUploadLcClick: () => void;
}

export function DocumentsEmptyHero({ onUploadLcClick }: DocumentsEmptyHeroProps) {
  return (
    <section className="documents-empty-hero">
      <div className="documents-empty-hero__icon-wrap" aria-hidden="true">
        <FolderOpenIcon className="documents-empty-hero__icon" />
      </div>

      <h2 className="documents-empty-hero__title">No documents uploaded yet</h2>
      <p className="documents-empty-hero__description">
        Upload your Letter of Credit first to extract required documents. Once your LC is
        processed, you&apos;ll see the list of required documents here.
      </p>

      <Button type="button" size="lg" className="documents-empty-hero__button gap-2" onClick={onUploadLcClick}>
        <UploadIcon className="size-4" aria-hidden="true" />
        Upload Letter of Credit
      </Button>
    </section>
  );
}
