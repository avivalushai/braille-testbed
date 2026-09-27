import { headers } from "next/headers";
import { after } from "next/server";

/**
 * What this app answered with, reported after the response has gone.
 *
 * Middleware runs before the page, so it never sees a status. It stamps an id
 * on the request instead, and this sends the status back against that id. A
 * failure overwrites a success at the other end, so a layout reporting 200 and
 * a not-found boundary reporting 404 for the same request settle correctly
 * whichever lands first.
 *
 * Every page here is rendered per request, so reading the header costs
 * nothing. On a site with static pages it would not be free — and a static
 * page served from the CDN never reaches the app to report anything anyway.
 */
const REQUEST_ID_HEADER = "x-braille-request";

export async function reportStatus(status: number): Promise<void> {
  const secret = process.env.TRAFFIC_INGEST_SECRET;
  const ingest = process.env.TRAFFIC_INGEST_URL;
  if (!secret || !ingest) return;
  const requestId = (await headers()).get(REQUEST_ID_HEADER);
  if (!requestId) return;
  const url = ingest.replace(/\/ingest$/, "/outcome");

  after(async () => {
    try {
      await fetch(url, {
        method: "POST",
        headers: { authorization: `Bearer ${secret}`, "content-type": "application/json" },
        body: JSON.stringify({ id: requestId, status }),
        signal: AbortSignal.timeout(3000),
      });
    } catch {
      // A status we could not report is a missing number, never a broken page.
    }
  });
}
