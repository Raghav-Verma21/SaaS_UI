export const lcQueryKeys = {
  all: ["lcs"] as const,
  company: (companyId: string) => [...lcQueryKeys.all, companyId] as const,
};

export const LC_STALE_TIME_MS = 30 * 60 * 1000;
export const LC_GC_TIME_MS = 60 * 60 * 1000;
