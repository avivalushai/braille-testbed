# braille-testbed

Test sites for Braille AI's Traffic feature. Each one is invented, sells
nothing, and exists so we can send known AI traffic at a site we control and
check that the dashboard reports it correctly.

## Sites

| Site | Where | What it tests |
|---|---|---|
| `site/` — Larkfield Supply | Netlify | An ordinary content site: crawler reads, robots.txt, sitemap, coverage |

Two more follow: an app with a login and a checkout, for agent sessions and
funnels, and a documentation site for coverage across many pages.

## How capture works here

`netlify/edge-functions/traffic-logger.ts` records each page request and posts
it to Braille's ingest endpoint after the page is served. It never delays a
response, keeps an allowlist of headers, drops query-string values, and skips
background fetches. Requests identifying as BrailleAI are marked synthetic, so
our own checks never count as real traffic.

Set in Netlify's environment settings, never in this repository:

```
TRAFFIC_INGEST_SECRET   the shared secret the ingest endpoint checks
TRAFFIC_INGEST_URL      https://braille-ai-ebon.vercel.app/api/traffic/ingest
```

## Deploying

Netlify builds from the default branch and publishes `site/` as it is. There is
no build step. A push updates the live URL within about a minute.
