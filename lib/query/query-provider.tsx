"use client";

import { QueryClientProvider, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState, type ReactNode } from "react";

import { useAuth } from "@/lib/auth/auth-context";
import { lcQueryKeys } from "@/lib/query/lc-query-keys";
import { makeQueryClient } from "@/lib/query/query-client";

function QueryCacheAuthSync() {
  const { isAuthenticated } = useAuth();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!isAuthenticated) {
      queryClient.removeQueries({ queryKey: lcQueryKeys.all });
    }
  }, [isAuthenticated, queryClient]);

  return null;
}

export function QueryProvider({ children }: { children: ReactNode }) {
  const [queryClient] = useState(makeQueryClient);

  return (
    <QueryClientProvider client={queryClient}>
      <QueryCacheAuthSync />
      {children}
    </QueryClientProvider>
  );
}
