import { Suspense } from "react";

import { ReportsShell } from "@/components/dashboard/reports-shell";

export default function ReportsPage() {
  return (
    <Suspense>
      <ReportsShell />
    </Suspense>
  );
}
