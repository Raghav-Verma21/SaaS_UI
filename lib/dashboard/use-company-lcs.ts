"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import { ApiError } from "@/lib/api";
import type { LcDocument } from "@/lib/api/letter-of-credit";
import { fetchCompanyLetterOfCredits } from "@/lib/dashboard/lc-documents";
import { resolveJobStatusRaw } from "@/lib/dashboard/job-status";
import { useJobStatusPolling } from "@/lib/dashboard/use-job-status-polling";

export function useCompanyLcs(companyId: string | null, limit: number | null = null) {
  const [documents, setDocuments] = useState<LcDocument[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const refreshAsync = useCallback(async () => {
    if (!companyId) return [] as LcDocument[];
    const docs = await fetchCompanyLetterOfCredits(companyId, limit);
    setDocuments(docs);
    setError(null);
    setSelectedId((id) => (id && docs.some((d) => d.id === id) ? id : (docs[0]?.id ?? null)));
    return docs;
  }, [companyId, limit]);

  const { overrides, pollLcStatus, pollDocStatus } = useJobStatusPolling(
    companyId,
    refreshAsync
  );

  useEffect(() => {
    if (!companyId) {
      setError("Company information is missing. Please log in again.");
      setIsLoading(false);
      return;
    }

    let active = true;
    setIsLoading(true);

    fetchCompanyLetterOfCredits(companyId, limit)
      .then((docs) => {
        if (!active) return;
        setDocuments(docs);
        setError(null);
        setSelectedId((id) =>
          id && docs.some((d) => d.id === id) ? id : (docs[0]?.id ?? null)
        );
      })
      .catch((err) => {
        if (!active) return;
        setError(
          err instanceof ApiError ? err.message : "Unable to load Letters of Credit."
        );
        setDocuments([]);
        setSelectedId(null);
      })
      .finally(() => active && setIsLoading(false));

    return () => {
      active = false;
    };
  }, [companyId, limit, refreshKey]);

  const selectedLc = useMemo(
    () => documents.find((d) => d.id === selectedId) ?? null,
    [documents, selectedId]
  );

  const resolveLcJobStatus = useCallback(
    (lc: LcDocument) => resolveJobStatusRaw(overrides, `lc:${lc.id}`, lc.jobStatus),
    [overrides]
  );

  const resolveDocJobStatus = useCallback(
    (docId: string, fallback: string) =>
      resolveJobStatusRaw(overrides, `doc:${docId}`, fallback),
    [overrides]
  );

  const handleLcUploadComplete = useCallback(async () => {
    const docs = await refreshAsync();
    const lcId = docs[0]?.id;
    if (lcId) await pollLcStatus(lcId);
  }, [pollLcStatus, refreshAsync]);

  const handleDocUploadComplete = useCallback(
    async (docId?: string) => {
      if (!docId) return;
      await pollDocStatus(docId);
    },
    [pollDocStatus]
  );

  return {
    documents,
    selectedLc,
    selectedId,
    setSelectedId,
    isLoading,
    error,
    refresh: () => setRefreshKey((k) => k + 1),
    refreshAsync,
    pollLcStatus,
    pollDocStatus,
    resolveLcJobStatus,
    resolveDocJobStatus,
    handleLcUploadComplete,
    handleDocUploadComplete,
  };
}
