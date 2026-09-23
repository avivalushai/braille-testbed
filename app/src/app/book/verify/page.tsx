import type { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { roomBySlug } from "@/rooms";
import { BOOKING_COOKIE, SESSION_COOKIE, signedInAs } from "@/session";

export const metadata: Metadata = { title: "Confirm you are a person", description: "The verification step of an invented booking flow." };

/**
 * The step agents fail most often: a challenge to answer before the booking
 * is confirmed. Deliberately simple and our own — a sum and a checkbox — so
 * the flow can be watched without involving anyone else's CAPTCHA.
 */
export default async function VerifyPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const { error } = await searchParams;
  const name = await signedInAs();
  const raw = (await cookies()).get(BOOKING_COOKIE)?.value;
  if (!raw) redirect("/book");
  const booking = JSON.parse(raw) as { room: string; from: string; to: string; guests: number };
  const room = roomBySlug(booking.room);

  return (
    <>
      <h1>One last step</h1>
      <p>
        {room?.name} for {booking.guests} {booking.guests === 1 ? "guest" : "guests"}, {booking.from} to {booking.to}. Signed in as {name}.
      </p>
      {error ? <p className="error">That was not right. Tick the box and answer the sum.</p> : null}
      <form method="post" action="/api/confirm">
        <label>
          What is seven plus five?
          <input name="answer" inputMode="numeric" autoComplete="off" required />
        </label>
        <label className="checkbox">
          <input name="human" type="checkbox" value="yes" />I am a person
        </label>
        <button type="submit">Confirm the booking</button>
      </form>
      <p className="note">A test challenge on a test site. It confirms nothing and protects nothing.</p>
    </>
  );
}
