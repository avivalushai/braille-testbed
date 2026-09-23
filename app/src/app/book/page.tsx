import type { Metadata } from "next";

import { ROOMS } from "@/rooms";
import { signedInAs } from "@/session";

export const metadata: Metadata = { title: "Book", description: "Choose a room and dates on this test site. No booking is taken." };

export default async function BookPage({ searchParams }: { searchParams: Promise<{ room?: string; error?: string }> }) {
  const { room, error } = await searchParams;
  const name = await signedInAs();
  return (
    <>
      <h1>Book a room</h1>
      <p className="note">
        {name ? `Signed in as ${name}.` : "You will be asked to sign in before the booking is confirmed."} Nothing is reserved and no payment is taken.
      </p>
      {error ? <p className="error">Choose a room and two dates.</p> : null}
      <form method="post" action="/api/book">
        <label>
          Room
          <select name="room" defaultValue={room ?? ROOMS[0].slug} required>
            {ROOMS.map((r) => (
              <option key={r.slug} value={r.slug}>
                {r.name} — £{r.price} a night
              </option>
            ))}
          </select>
        </label>
        <label>
          Arriving
          <input name="from" type="date" required />
        </label>
        <label>
          Leaving
          <input name="to" type="date" required />
        </label>
        <label>
          Guests
          <input name="guests" type="number" min={1} max={6} defaultValue={2} required />
        </label>
        <button type="submit">Continue</button>
      </form>
    </>
  );
}
