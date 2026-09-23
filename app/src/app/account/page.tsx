import type { Metadata } from "next";
import Link from "next/link";

import { signedInAs } from "@/session";

export const metadata: Metadata = { title: "Account", robots: { index: false } };

export default async function AccountPage() {
  const name = await signedInAs();
  return (
    <>
      <h1>Account</h1>
      <p>Signed in as {name}. A real site would list past stays here; this one keeps nothing.</p>
      <p>
        <Link href="/book">Book another room</Link>
      </p>
    </>
  );
}
