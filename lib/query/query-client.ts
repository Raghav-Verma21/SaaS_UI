import { QueryClient } from "@tanstack/react-query";

import { LC_GC_TIME_MS, LC_STALE_TIME_MS } from "@/lib/query/lc-query-keys";

export function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: LC_STALE_TIME_MS,
        gcTime: LC_GC_TIME_MS,
        refetchOnWindowFocus: false,
        retry: 1,
      },
    },
  });
}
