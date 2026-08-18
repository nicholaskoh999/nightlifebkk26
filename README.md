# Bangkok Nightlife 2026

Production: `https://nightlifebkk.nkmwei.de`

Fallback hosting URL: `https://bangkok-nightlife-2026.nicholaskoh999.chatgpt.site`

Trip: `19–22 Aug 2026` (Wed–Sat, 4 club nights)

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

This is an independent website and is not part of bangkok26.

## Tech stack

React, TypeScript, Vite/Vinext, Tailwind CSS, Framer Motion, and Lucide.

## Local development

```bash
npm install
npm run dev
npm run typecheck
npm run lint
npm run build
```

## Deploy

Build the current `main` commit, save it as a version in the existing Bangkok Nightlife Sites project, then publish that saved version. Configure `nightlifebkk.nkmwei.de` through the Sites custom-domain flow; the fallback hosting URL remains available.
