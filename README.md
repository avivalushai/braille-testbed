# braille-testbed

Test sites for Braille AI's Traffic feature. Each one is invented, sells
nothing, and exists so we can send known AI traffic at a site we control and
check that the dashboard reports it correctly.

## Sites

One repository, one folder per site. Each hosting platform builds only its own
folder: on Netlify that is the site's "base directory", on Vercel its "root
directory". Each site carries its own copy of the logger: Netlify's edge bundler will not
reach outside a site's base directory, and the SDK (C3) is what finally makes
one copy serve every site.

| Folder | Site | Where | What it tests |
|---|---|---|---|
| `marketing/` | Larkfield Supply | Netlify, base directory `marketing` | An ordinary content site: crawler reads, robots.txt, sitemap, coverage |
| `app/` | Harbourline Stays | Vercel, root directory `app` | Agent sessions: a login, a booking form, a challenge, a thank-you page |
| `docs/` | Kestrel docs | Netlify, base directory `docs` | Coverage across many pages: 40 of them, some in the sitemap and linked from nowhere, one linked and left out of it, one whose content needs JavaScript |

## How capture works here

`marketing/netlify/edge-functions/traffic-logger.ts` records each page request and posts
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

Netlify builds from the default branch. Each site sets its base directory —
`marketing` for Larkfield Supply — and publishes that folder's `site/` as it
is. There is no build step. A push updates the live URL within about a minute.
