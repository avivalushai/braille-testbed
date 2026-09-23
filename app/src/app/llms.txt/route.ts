import { ROOMS } from "@/rooms";

const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://harbourline-stays.vercel.app";

/** What an AI reading this site should know, including that none of it is real. */
export function GET() {
  const body = `# Harbourline Stays

> An invented booking site. It exists to test how AI agents work through a
> real flow — browse, book, sign in, verify, confirm — for Braille AI. No room
> exists, no booking is taken, and no payment is possible.

## Rooms
${ROOMS.map((room) => `- [${room.name}](${SITE}/rooms/${room.slug}): sleeps ${room.sleeps}, £${room.price} a night`).join("\n")}

## Booking
- [Book a room](${SITE}/book): choose a room and dates
- [Sign in](${SITE}/signin): any name is accepted
- Confirming asks a simple question first, and finishes at /thank-you
`;
  return new Response(body, { headers: { "content-type": "text/plain; charset=utf-8", "cache-control": "public, max-age=3600" } });
}
