"use client";

import { useCallback, useRef, useState } from "react";

import { getGeneratedDocumentStatus, getLCStatus } from "@/lib/api/document-status";
import { isTerminalJobStatus } from "@/lib/dashboard/job-status";

const POLL_MS = 4000;
const MAX_MS = 3 * 60 * 1000;

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function useJobStatusPolling(
  companyId: string | null,
  refreshAllLcs?: () => Promise<unknown>
) {
  const [overrides, setOverrides] = useState<Record<string, string>>({});
  const abortRef = useRef<Map<string, AbortController>>(new Map());

  const setStatus = useCallback((key: string, status: string) => {
    setOverrides((prev) => ({ ...prev, [key]: status }));
  }, []);

  const poll = useCallback(
    async (key: string, fetchStatus: () => Promise<string | undefined>) => {
      if (!companyId) return;

      abortRef.current.get(key)?.abort();
      const controller = new AbortController();
      abortRef.current.set(key, controller);
      const started = Date.now();

      try {
        while (Date.now() - started < MAX_MS) {
          if (controller.signal.aborted) return;

          try {
            const status = await fetchStatus();
            if (status) {
              setStatus(key, status);
              if (isTerminalJobStatus(status)) {
                await refreshAllLcs?.();
                return;
              }
            }
          } catch {
            // keep polling until timeout
          }

          await sleep(POLL_MS);
        }
      } finally {
        abortRef.current.delete(key);
      }
    },
    [companyId, refreshAllLcs, setStatus]
  );

  const pollLcStatus = useCallback(
    (lcId: string) => {
      setStatus(`lc:${lcId}`, "IN PROGRESS");
      return poll(`lc:${lcId}`, async () => (await getLCStatus(companyId!, lcId)).status);
    },
    [companyId, poll, setStatus]
  );

  const pollDocStatus = useCallback(
    (docId: string) => {
      setStatus(`doc:${docId}`, "IN PROGRESS");
      return poll(`doc:${docId}`, async () =>
        (await getGeneratedDocumentStatus(companyId!, docId)).status
      );
    },
    [companyId, poll, setStatus]
  );

  return { overrides, pollLcStatus, pollDocStatus };
}
