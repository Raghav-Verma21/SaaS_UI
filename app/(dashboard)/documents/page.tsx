import { Suspense } from "react";

import { DocumentsShell } from "@/components/dashboard/documents-shell";

export default function DocumentsPage() {
  return (
    <Suspense>
      <DocumentsShell />
    </Suspense>
  );
}
