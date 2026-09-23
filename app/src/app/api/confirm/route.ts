import { NextResponse } from "next/server";

import { BOOKING_COOKIE } from "@/session";

/** The conversion: a right answer and a ticked box send the visitor to /thank-you. */
export async function POST(request: Request) {
  const form = await request.formData();
  const answer = String(form.get("answer") ?? "").trim();
  const human = form.get("human") === "yes";
  if (answer !== "12" || !human) return NextResponse.redirect(new URL("/book/verify?error=1", request.url), 303);

  const response = NextResponse.redirect(new URL("/thank-you", request.url), 303);
  response.cookies.delete(BOOKING_COOKIE);
  return response;
}
