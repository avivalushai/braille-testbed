import { notFound } from "next/navigation";

import { reportStatus } from "@/outcome";

export const dynamic = "force-dynamic";

/**
 * Every address that matches nothing else, so Traffic can say a crawler was
 * served a 404.
 *
 * Not `not-found.tsx`: that file is the boundary's fallback and React runs its
 * body on successful pages too, so reporting from there marked every page a
 * 404. This runs only when nothing matched. The reader sees the same page and
 * the same status as before.
 */
export default async function MissingPage() {
  await reportStatus(404);
  notFound();
}
