import type { Config, Context } from "https://edge.netlify.com";

/**
 * Records every page request and crawler file to Braille AI's ingest endpoint.
 *
 * This is stage C1's logger for a site on Netlify, written by hand as the one
 * on Braille's own site was. The SDK (C3) is this, packaged.
 *
 * Three rules it never breaks:
 *   1. The page is served first, and nothing waits for Braille. A slow or
 *      broken ingest costs a row, not a page load.
 *   2. Only an allowlist of headers is kept, never Cookie or Authorization,
 *      and query-string values are dropped — parameter names only.
 *   3. Background fetches from an already-open page are skipped, so a page
 *      that polls does not write a row every few seconds.
 *
 * Unlike a Next.js middleware, an edge function sees the response, so the
 * status is recorded here.
 */

const HEADER_ALLOWLIST = ["accept", "from", "referer", "signature", "signature-agent", "signature-input"];
const HEADER_MAX = 512;
const INGEST_TIMEOUT_MS = 3000;

function stripQuery(value: string): string {
  const cut = value.search(/[?#]/);
  return cut === -1 ? value : value.slice(0, cut);
}

export default async function trafficLogger(request: Request, context: Context): Promise<Response> {
  const response = await context.next();

  const url = new URL(request.url);
  const secret = Netlify.env.get("TRAFFIC_INGEST_SECRET");
  const ingest = Netlify.env.get("TRAFFIC_INGEST_URL");
  // Not configured, or a background fetch from a page already open: serve and record nothing.
  if (!secret || !ingest || request.headers.get("sec-fetch-dest") === "empty") return response;

  const headers: Record<string, string> = {};
  for (const name of HEADER_ALLOWLIST) {
    const value = request.headers.get(name);
    if (value === null) continue;
    headers[name] = (name === "referer" ? stripQuery(value) : value).slice(0, HEADER_MAX);
  }

  const record = {
    site: url.host,
    capture: "edge" as const,
    occurredAt: new Date().toISOString(),
    method: request.method,
    path: url.pathname,
    queryKeys: [...new Set(url.searchParams.keys())].slice(0, 32),
    status: response.status,
    userAgent: request.headers.get("user-agent")?.slice(0, 1024) ?? null,
    ip: context.ip ?? null,
    headers,
    // Traffic Braille sent itself: its scans, its agent runs, its own checks.
    synthetic: /brailleai/i.test(request.headers.get("user-agent") ?? ""),
    logger: "netlify-edge/1",
  };

  context.waitUntil(
    fetch(ingest, {
      method: "POST",
      headers: { authorization: `Bearer ${secret}`, "content-type": "application/json" },
      body: JSON.stringify({ records: [record] }),
      signal: AbortSignal.timeout(INGEST_TIMEOUT_MS),
    }).catch(() => {})
  );

  return response;
}

/**
 * Pages and the files crawlers read first. Static assets are left out: they
 * say nothing about what an AI visitor read, and an edge function is billed
 * per invocation.
 */
export const config: Config = {
  path: "/*",
  excludedPath: ["/*.css", "/*.js", "/*.png", "/*.jpg", "/*.svg", "/*.ico", "/*.webmanifest"],
};
