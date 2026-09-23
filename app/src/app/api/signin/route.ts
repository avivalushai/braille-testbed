import { NextResponse } from "next/server";

import { SESSION_COOKIE } from "@/session";

/** Accepts any name. A test site's wall, not an authentication system. */
export async function POST(request: Request) {
  const form = await request.formData();
  const name = String(form.get("name") ?? "").trim().slice(0, 60);
  const next = String(form.get("next") ?? "/book");
  const safeNext = next.startsWith("/") && !next.startsWith("//") ? next : "/book";
  if (!name) return NextResponse.redirect(new URL(`/signin?error=1&next=${encodeURIComponent(safeNext)}`, request.url), 303);

  const response = NextResponse.redirect(new URL(safeNext, request.url), 303);
  response.cookies.set(SESSION_COOKIE, name, { httpOnly: true, sameSite: "lax", secure: true, path: "/", maxAge: 60 * 60 * 6 });
  return response;
}
