"use client";

import { useCallback, useState } from "react";

import { ApiError } from "@/lib/api";
import { uploadCompanyLetterOfCredit } from "@/lib/dashboard/lc-documents";
import { useAuth } from "@/lib/auth/auth-context";

const MAX_MB = 20;
const MAX_BYTES = MAX_MB * 1024 * 1024;

function isPdf(file: File) {
  return file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf");
}

export function useLcUpload(onSuccess?: () => void) {
  const { companyId } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const validateFile = useCallback((file: File): string | null => {
    if (!isPdf(file)) return "Only PDF files are supported at the moment.";
    if (file.size > MAX_BYTES) return `File size must be under ${MAX_MB} MB.`;
    return null;
  }, []);

  const uploadFile = useCallback(
    async (file: File) => {
      if (!companyId) {
        setError("Company information is missing. Please log in again.");
        return false;
      }
      const validationError = validateFile(file);
      if (validationError) {
        setError(validationError);
        return false;
      }

      setIsUploading(true);
      setError(null);
      try {
        await uploadCompanyLetterOfCredit(companyId, file);
        onSuccess?.();
        return true;
      } catch (err) {
        setError(
          err instanceof ApiError
            ? err.message
            : "Unable to upload the Letter of Credit. Please try again."
        );
        return false;
      } finally {
        setIsUploading(false);
      }
    },
    [companyId, onSuccess, validateFile]
  );

  return { uploadFile, validateFile, error, setError, isUploading, maxFileSizeMb: MAX_MB };
}
