"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback, useEffect, useMemo, useState } from "react";

import { ApiError } from "@/lib/api";
import type { LcDocument } from "@/lib/api/letter-of-credit";
import {
  fetchCompanyLetterOfCredits,
  pickRecentLetterOfCredits,
} from "@/lib/dashboard/lc-documents";
import { resolveJobStatusRaw } from "@/lib/dashboard/job-status";
import { useJobStatusPolling } from "@/lib/dashboard/use-job-status-polling";
import { lcQueryKeys } from "@/lib/query/lc-query-keys";

const EMPTY_LCS: LcDocument[] = [];

export function useCompanyLcs(companyId: string | null, recentLimit: number | null = null) {
  const queryClient = useQueryClient();
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const {
    data,
    isPending,
    error: queryError,
  } = useQuery({
    queryKey: lcQueryKeys.company(companyId ?? ""),
    queryFn: () => fetchCompanyLetterOfCredits(companyId!),
    enabled: Boolean(companyId),
  });

  const allDocuments = data ?? EMPTY_LCS;

  const documents = useMemo(
    () =>
      recentLimit != null
        ? pickRecentLetterOfCredits(allDocuments, recentLimit)
        : allDocuments,
    [allDocuments, recentLimit]
  );

  const error = !companyId
    ? "Company information is missing. Please log in again."
    : queryError
      ? queryError instanceof ApiError
        ? queryError.message
        : "Unable to load Letters of Credit."
      : null;

  useEffect(() => {
    if (!documents.length) {
      setSelectedId(null);
      return;
    }
    setSelectedId((id) =>
      id && documents.some((d) => d.id === id) ? id : (documents[0]?.id ?? null)
    );
  }, [documents]);

  const refreshAsync = useCallback(async () => {
    if (!companyId) return [] as LcDocument[];
    return queryClient.fetchQuery({
      queryKey: lcQueryKeys.company(companyId),
      queryFn: () => fetchCompanyLetterOfCredits(companyId),
    });
  }, [companyId, queryClient]);

  const refresh = useCallback(() => {
    if (!companyId) return;
    void queryClient.invalidateQueries({ queryKey: lcQueryKeys.company(companyId) });
  }, [companyId, queryClient]);

  const { overrides, pollLcStatus, pollDocStatus } = useJobStatusPolling(
    companyId,
    refreshAsync
  );

  const selectedLc = useMemo(
    () => allDocuments.find((d) => d.id === selectedId) ?? null,
    [allDocuments, selectedId]
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
    const lcId = pickRecentLetterOfCredits(docs, 1)[0]?.id;
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
    isLoading: isPending && data === undefined,
    error,
    refresh,
    refreshAsync,
    pollLcStatus,
    pollDocStatus,
    resolveLcJobStatus,
    resolveDocJobStatus,
    handleLcUploadComplete,
    handleDocUploadComplete,
  };
}
