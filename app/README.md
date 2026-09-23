# Harbourline Stays

An invented booking site, and the second test site for Braille AI's Traffic
feature. Nothing here is real: no room exists, no booking is taken, no payment
is possible, and the sign-in accepts anything.

It exists because agents do tasks, and a task needs a flow with something in
the way of it:

| Step | Path | What it tests |
|---|---|---|
| Browse | `/rooms`, `/rooms/[slug]` | Pages an agent reads before it acts |
| Book | `/book` | A form an agent has to fill |
| Sign in | `/signin` | A login wall, enforced in middleware |
| Verify | `/book/verify` | A challenge, the step agents most often fail |
| Done | `/thank-you` | The conversion a funnel counts |

`middleware.ts` records every page request for Traffic, and protects the
booking steps. It needs two environment variables, set in Vercel and never in
this repository:

```
TRAFFIC_INGEST_SECRET   the shared secret the ingest endpoint checks
TRAFFIC_INGEST_URL      https://braille-ai-ebon.vercel.app/api/traffic/ingest
```
