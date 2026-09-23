import { NextResponse } from "next/server";

import { roomBySlug } from "@/rooms";
import { BOOKING_COOKIE } from "@/session";

/** Keeps the choice in a cookie and sends the visitor to the verification step. Nothing is reserved. */
export async function POST(request: Request) {
  const form = await request.formData();
  const room = roomBySlug(String(form.get("room") ?? ""));
  const from = String(form.get("from") ?? "");
  const to = String(form.get("to") ?? "");
  const guests = Number(form.get("guests") ?? 0);
  if (!room || !from || !to) return NextResponse.redirect(new URL("/book?error=1", request.url), 303);

  const response = NextResponse.redirect(new URL("/book/verify", request.url), 303);
  response.cookies.set(BOOKING_COOKIE, JSON.stringify({ room: room.slug, from, to, guests: Number.isFinite(guests) ? guests : 2 }), {
    httpOnly: true,
    sameSite: "lax",
    secure: true,
    path: "/",
    maxAge: 60 * 30,
  });
  return response;
}
