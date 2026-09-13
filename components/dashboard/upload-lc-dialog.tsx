"use client";

import { useRef, useState } from "react";
import { FileUpIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useLcUpload } from "@/lib/dashboard/use-lc-upload";

interface UploadLcDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUploadSuccess?: () => void;
}

export function UploadLcDialog({
  open,
  onOpenChange,
  onUploadSuccess,
}: UploadLcDialogProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const { uploadFile, validateFile, error, setError, isUploading } = useLcUpload(() => {
    onUploadSuccess?.();
    setSelectedFile(null);
    setError(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
    onOpenChange(false);
  });

  function reset() {
    setSelectedFile(null);
    setError(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  function handleOpenChange(nextOpen: boolean) {
    if (!nextOpen) reset();
    onOpenChange(nextOpen);
  }

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0] ?? null;
    setError(null);
    if (!file) return setSelectedFile(null);
    const validationError = validateFile(file);
    setSelectedFile(validationError ? null : file);
    if (validationError) setError(validationError);
  }

  async function handleUpload() {
    if (!selectedFile) return setError("Please select a PDF file to upload.");
    await uploadFile(selectedFile);
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Upload Letter of Credit</DialogTitle>
          <DialogDescription>
            Select a PDF file to upload and start processing your Letter of Credit.
          </DialogDescription>
        </DialogHeader>

        <p className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-800">
          Note: Currently only PDF files are supported.
        </p>

        <div className="space-y-2">
          <Label htmlFor="lc-file">LC file</Label>
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="flex w-full flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-border bg-brand-surface px-4 py-8 text-center transition-colors hover:border-brand-blue hover:bg-brand-light/40"
          >
            <FileUpIcon className="size-8 text-brand-blue" aria-hidden="true" />
            <span className="text-sm font-medium text-navy">
              {selectedFile ? selectedFile.name : "Click to choose a PDF file"}
            </span>
            <span className="text-xs text-muted-foreground">or drag and drop here</span>
          </button>
          <input
            ref={fileInputRef}
            id="lc-file"
            type="file"
            accept=".pdf,application/pdf"
            className="sr-only"
            onChange={handleFileChange}
            disabled={isUploading}
          />
        </div>

        {error && (
          <p role="alert" className="text-sm text-red-600">
            {error}
          </p>
        )}

        <div className="flex justify-end gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => handleOpenChange(false)}
            disabled={isUploading}
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleUpload}
            disabled={isUploading || !selectedFile}
          >
            {isUploading ? "Uploading..." : "Upload"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
