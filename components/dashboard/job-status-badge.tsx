import { cn } from "@/lib/utils";
import { formatJobStatusLabel, jobStatusBadgeClass } from "@/lib/dashboard/job-status";

export function JobStatusBadge({ status }: { status: string }) {
  return (
    <span className={cn("status-badge shrink-0", jobStatusBadgeClass(status))}>
      {formatJobStatusLabel(status)}
    </span>
  );
}
