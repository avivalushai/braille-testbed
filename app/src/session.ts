import { cookies } from "next/headers";

/**
 * A pretend session. Signing in accepts anything and sets a cookie: the point
 * is that a wall stands between a visitor and the booking, not who they are.
 * Nothing is stored, and no password is ever kept or checked.
 */
export const SESSION_COOKIE = "harbourline_session";
export const BOOKING_COOKIE = "harbourline_booking";

export async function signedInAs(): Promise<string | null> {
  return (await cookies()).get(SESSION_COOKIE)?.value ?? null;
}
