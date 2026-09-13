"use client";

import { useCallback, useState } from "react";

import { ApiError } from "@/lib/api";

const MAX_MB = 20;
const MAX_BYTES = MAX_MB * 1024 * 1024;

function isAllowedFile(file: File) {
  return (
    file.type === "application/pdf" ||
    file.name.toLowerCase().endsWith(".pdf") ||
    file.type.startsWith("image/")
  );
}

type UploadFn = (lcId: string, file: File) => Promise<string | undefined>;

export function useDocumentUpload(
  lcId: string,
  onSuccess?: (docId?: string) => void | Promise<void>
) {
  const [error, setError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const uploadFile = useCallback(
    async (file: File, upload: UploadFn, failMessage: string) => {
      if (!isAllowedFile(file)) {
        setError("Only PDF and image files are supported.");
        return false;
      }
      if (file.size > MAX_BYTES) {
        setError(`File size must be under ${MAX_MB} MB.`);
        return false;
      }

      setIsUploading(true);
      setError(null);
      try {
        const docId = await upload(lcId, file);
        await onSuccess?.(docId);
        return true;
      } catch (err) {
        setError(err instanceof ApiError ? err.message : failMessage);
        return false;
      } finally {
        setIsUploading(false);
      }
    },
    [lcId, onSuccess]
  );

  return { uploadFile, error, setError, isUploading };
}
