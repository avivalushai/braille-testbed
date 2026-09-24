import type { Metadata } from "next";
import Link from "next/link";

import { Booked } from "./booked";

export const metadata: Metadata = { title: "Booked", description: "The end of an invented booking flow. Nothing was reserved." };

export default function ThankYouPage() {
  return (
    <>
      <Booked />
      <h1>That is booked</h1>
      <p>On a real site an email would arrive now. On this one, nothing was reserved and nothing was charged.</p>
      <p>
        <Link href="/rooms">Back to the rooms</Link>
      </p>
    </>
  );
}
