"use client";

import { useRef, useState } from "react";
import { CloudUploadIcon, FileTextIcon, UploadIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useLcUpload } from "@/lib/dashboard/use-lc-upload";
import { cn } from "@/lib/utils";

export function LcUploadHero({ onUploadSuccess }: { onUploadSuccess?: () => void }) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const { uploadFile, error, setError, isUploading, maxFileSizeMb } =
    useLcUpload(onUploadSuccess);

  async function handleFiles(files: FileList | null) {
    const file = files?.[0];
    if (file) await uploadFile(file);
  }

  return (
    <section
      className={cn("lc-upload-hero", isDragging && "lc-upload-hero--dragging")}
      onDragOver={(e) => {
        e.preventDefault();
        setIsDragging(true);
      }}
      onDragLeave={(e) => {
        e.preventDefault();
        setIsDragging(false);
      }}
      onDrop={async (e) => {
        e.preventDefault();
        setIsDragging(false);
        setError(null);
        await handleFiles(e.dataTransfer.files);
      }}
    >
      <div className="lc-upload-hero__illustration" aria-hidden="true">
        <div className="lc-upload-hero__doc">
          <FileTextIcon className="lc-upload-hero__doc-icon" />
        </div>
        <div className="lc-upload-hero__cloud">
          <CloudUploadIcon className="size-7 text-white" />
        </div>
      </div>

      <h2 className="lc-upload-hero__title">Upload your Letter of Credit</h2>
      <p className="lc-upload-hero__description">
        Drop your LC here to extract details, identify required documents, and start
        compliance checks. PDF format is supported today.
      </p>

      <Button
        type="button"
        size="lg"
        className="lc-upload-hero__button gap-2"
        disabled={isUploading}
        onClick={() => fileInputRef.current?.click()}
      >
        <UploadIcon className="size-4" aria-hidden="true" />
        {isUploading ? "Uploading..." : "Upload LC"}
      </Button>

      <p className="lc-upload-hero__drop-hint">or drag and drop your file here</p>
      <p className="lc-upload-hero__formats">PDF (Max. {maxFileSizeMb} MB)</p>

      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,application/pdf"
        className="sr-only"
        disabled={isUploading}
        onChange={(e) => {
          setError(null);
          void handleFiles(e.target.files);
          e.target.value = "";
        }}
      />

      {error && (
        <p className="lc-upload-hero__error" role="alert">
          {error}
        </p>
      )}
    </section>
  );
}
