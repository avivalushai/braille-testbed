import { NextResponse, type NextFetchEvent, type NextRequest } from "next/server";

import { SESSION_COOKIE } from "@/session";

/**
 * Two jobs: the login wall in front of the booking steps, and the Traffic
 * logger.
 *
 * The logger is the same one on Braille's own site, written by hand again for
 * this platform, as the SDK (C3) has not replaced it yet. It never delays a
 * response, keeps an allowlist of headers, drops query-string values, and
 * skips a page's background fetches. Middleware runs before the page answers,
 * so the status is only known where this file answers for itself.
 */

const SIGNED_IN_ONLY = ["/book/verify", "/account"];
const HEADER_ALLOWLIST = ["accept", "from", "referer", "signature", "signature-agent", "signature-input"];
const HEADER_MAX = 512;

function stripQuery(value: string): string {
  const cut = value.search(/[?#]/);
  return cut === -1 ? value : value.slice(0, cut);
}

/** A browser marks a fetch from an open page; a crawler sends no fetch metadata at all. */
function isBackgroundFetch(request: NextRequest): boolean {
  return request.headers.get("sec-fetch-dest") === "empty" || request.headers.has("next-url") || request.nextUrl.searchParams.has("_rsc");
}

function record(request: NextRequest, event: NextFetchEvent, status: number | null) {
  const secret = process.env.TRAFFIC_INGEST_SECRET;
  const ingest = process.env.TRAFFIC_INGEST_URL;
  if (!secret || !ingest || isBackgroundFetch(request)) return;

  const url = request.nextUrl;
  const headers: Record<string, string> = {};
  for (const name of HEADER_ALLOWLIST) {
    const value = request.headers.get(name);
    if (value === null) continue;
    headers[name] = (name === "referer" ? stripQuery(value) : value).slice(0, HEADER_MAX);
  }
  const userAgent = request.headers.get("user-agent");

  event.waitUntil(
    fetch(ingest, {
      method: "POST",
      headers: { authorization: `Bearer ${secret}`, "content-type": "application/json" },
      body: JSON.stringify({
        records: [
          {
            site: url.host,
            capture: "edge",
            occurredAt: new Date().toISOString(),
            method: request.method,
            path: url.pathname,
            queryKeys: [...new Set(url.searchParams.keys())].slice(0, 32),
            status,
            userAgent: userAgent?.slice(0, 1024) ?? null,
            ip: request.headers.get("x-real-ip") ?? request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? null,
            headers,
            synthetic: /brailleai/i.test(userAgent ?? ""),
            logger: "next-middleware/1",
          },
        ],
      }),
      signal: AbortSignal.timeout(3000),
    }).catch(() => {})
  );
}

export function middleware(request: NextRequest, event: NextFetchEvent) {
  const { pathname } = request.nextUrl;
  const needsSignIn = SIGNED_IN_ONLY.some((path) => pathname === path || pathname.startsWith(`${path}/`));

  if (needsSignIn && !request.cookies.get(SESSION_COOKIE)) {
    const signin = new URL("/signin", request.url);
    signin.searchParams.set("next", pathname);
    record(request, event, 307);
    return NextResponse.redirect(signin);
  }

  record(request, event, null);
  return NextResponse.next();
}

export const config = {
  matcher: [
    // Pages, and nothing static: an agent's reading, not its stylesheets.
    "/((?!_next/static|_next/image|favicon\\.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|avif|ico|css|js|map|woff|woff2|ttf)$).*)",
  ],
};
