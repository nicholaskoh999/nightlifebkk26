# Bangkok Nightlife 2026

Production: `https://nightlife26.nkmwei.de`

Legacy/secondary: `https://nightlifebkk.nkmwei.de`

Fallback hosting URLs: `https://nightlife26.nicholaskohmw.workers.dev` ·
`https://bangkok-nightlife-2026.nicholaskoh999.chatgpt.site`

Trip: `18–22 Aug 2026`

Club nights: `18–21 Aug 2026` (Tue–Fri, 4 nights)

Return: `22 Aug 2026` — not a nightlife night, and not present in the data

## What this site answers

> Where should I go tonight, and where do I switch if it sucks?

Every night resolves to exactly two venues — a **primary pick** and a
**switch-to backup** — plus a collapsed *More options* list and an *Event
radar* for date-specific listings that do not fit the plan.

## Ranking

Venues are scored against one profile: solo, crowd-first, natural interaction.
Weights live in `FIT_WEIGHTS` (`src/data/nightlife.ts`) and the score is
computed by `fitScore()` — never hand-written per venue:

| Axis | Weight |
| --- | --- |
| Crowd strength | 30% |
| Solo friendliness | 20% |
| Natural social interaction | 20% |
| Young / Asian-mix fit | 15% |
| Danceability | 10% |
| Switching convenience | 5% |

DJ fame is deliberately not an axis.

## Evidence labels

`VERIFIED` · `RECURRING` · `LISTED` · `CHECK SAME DAY` · `ESTIMATE`

Each venue carries a `statusNote` saying exactly what its label rests on, plus
`lastVerified` and source links. Unconfirmed pricing is always rendered with an
explicit `EST.` marker. Nothing is upgraded to `VERIFIED` on the strength of a
third-party listing.

## Data

All venue copy, pricing and evidence lives in `src/data/nightlife.ts` and
`src/data/event-radar.ts`. It is never mutated at runtime — `src/App.tsx` only
renders and handles interaction.

Tue 18 is the **arrival night**: the flight lands late, so it carries an
`arrivalNote` banner, a realistically late arrival time and one room rather
than a programme. It is a normal night in the data, not a special case in the
UI.

This is an independent website and is not part of bangkok26.

## Tech stack

React, TypeScript, Vite/Vinext, Tailwind CSS, Framer Motion, and Lucide.

## Local development

```bash
npm install
npm run dev
npm run typecheck
npm run lint
npm run qa      # trip-data invariants — also runs as part of build
npm run build
```

## Data QA

`build/data-qa.mjs` runs before every build and fails it if the dataset drifts
from the trip. It checks the trip window (`2026-08-18` → `2026-08-21`), that
the four nights are exactly 18–21, that no venue or radar entry is pinned to
22 Aug, that each night has exactly one PRIMARY and one SWITCH matching the
agreed route, that no slot outranks a higher-scoring venue without an
`overrideNote`, and that every price still carries its `EST.` marker. Friday is
guarded by name: the old `ROUTE 66 -> ONYX` route fails the build, and ONYX must
stay on the night as a MORE OPTIONS entry.

## Deploy

Production runs as a Cloudflare Worker (`nightlife26`) built by Vinext and the
Cloudflare Vite plugin. `npm run build` emits `dist/server/wrangler.json` plus
the static assets in `dist/client`:

```bash
npm ci
npm run typecheck
npm run lint
npm run build
npx wrangler deploy -c dist/server/wrangler.json --name nightlife26
```

`nightlife26.nkmwei.de` is attached as a Workers custom domain, so Cloudflare
manages the DNS record and the certificate — no manual DNS entry is needed.

The legacy `nightlifebkk.nkmwei.de` host is still served by the separate Sites
deployment and is left untouched.

## Scope

Club-only. Social/date bars are not ranked here, even when they are easy places
to talk — a room with no dancefloor cannot be a PRIMARY or a SWITCH.

## Editorial overrides

A slot may outrank a higher-scoring venue, but never silently. Any such venue
carries an `overrideNote` and the page renders it as **WHY THIS ORDER** on the
card. The data QA fails the build if any slot sits above a higher-scoring
venue without one.

Tue 18 is the live example: Upper House scores a shade higher and is closer to
base, but Dope & Dirty is the room with an actual Tuesday hip-hop line-up — so
it takes PRIMARY and says why on the card.

Fri 21 is the second: Route 66 scores 4.4 against 404's 4.2 and has the more
reliable Friday crowd, but 404 is the standing-room, low-table, walk-in-alone
room the trip is actually optimised for. The scores are left honest — 404 takes
PRIMARY on an `overrideNote`, and Route 66 becomes the crowd-insurance SWITCH
after a 30–45 minute check.
