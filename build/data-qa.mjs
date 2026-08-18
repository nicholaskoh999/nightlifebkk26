/**
 * Trip-data invariants, enforced before the build runs.
 *
 * The dataset is the product here: a wrong date or a silently reordered slot
 * ships as confidently as a correct one. These checks are the reason a bad
 * edit fails `npm run build` instead of reaching production.
 *
 * The data lives in TypeScript, so it is bundled in-memory with esbuild and
 * imported — no emit, no temp files.
 */
import { build } from "esbuild";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");

async function load(entry) {
  const out = await build({
    entryPoints: [resolve(root, entry)],
    bundle: true,
    write: false,
    format: "esm",
    platform: "node",
    target: "node22",
    logLevel: "silent",
  });
  const code = out.outputFiles[0].text;
  return import(`data:text/javascript;base64,${Buffer.from(code).toString("base64")}`);
}

const failures = [];
const check = (ok, message) => { if (!ok) failures.push(message); };

const { TRIP, days, venues, fitScore } = await load("src/data/nightlife.ts");
const { eventRadar } = await load("src/data/event-radar.ts");

/* ------------------------------ trip window ------------------------------ */

const EXPECTED_DAYS = [18, 19, 20, 21];

check(TRIP.startIso === "2026-08-18", `TRIP.startIso must be 2026-08-18, got ${TRIP.startIso}`);
check(TRIP.endIso === "2026-08-21", `TRIP.endIso must be 2026-08-21 — 22 Aug is the return day, got ${TRIP.endIso}`);
check(TRIP.timeZone === "Asia/Bangkok", `TRIP.timeZone must be Asia/Bangkok, got ${TRIP.timeZone}`);

const dayIds = days.map(d => d.id);
check(
  dayIds.length === EXPECTED_DAYS.length && EXPECTED_DAYS.every((d, i) => dayIds[i] === d),
  `days[] must be exactly ${EXPECTED_DAYS.join(", ")} — got ${dayIds.join(", ")}`,
);

for (const day of days) {
  const iso = `2026-08-${day.id}`;
  check(day.iso === iso, `day ${day.id} has iso ${day.iso}, expected ${iso}`);
}

/* --------------------------- no Saturday anywhere ------------------------ */

check(!venues.some(v => v.day === 22), "a venue is still pinned to day 22 — Saturday is not a nightlife night");
check(!eventRadar.some(e => e.day === 22), "an Event Radar entry is still pinned to day 22");
check(
  eventRadar.every(e => EXPECTED_DAYS.includes(e.day)),
  "Event Radar accepts days 18–21 only",
);

/* ------------------------------ night routes ----------------------------- */

const ROUTES = {
  18: { primary: "DOPE & DIRTY", switch: "UPPER HOUSE" },
  19: { primary: "MU:IN", switch: "404 CLUB NOT FOUND" },
  20: { primary: "UPPER HOUSE", switch: "HOUSE OF SAVOY" },
  21: { primary: "404 CLUB NOT FOUND", switch: "ROUTE 66" },
};

for (const day of EXPECTED_DAYS) {
  const forDay = venues.filter(v => v.day === day);
  const primary = forDay.filter(v => v.role === "primary");
  const backup = forDay.filter(v => v.role === "switch");

  check(primary.length === 1, `day ${day} must have exactly one PRIMARY, found ${primary.length}`);
  check(backup.length === 1, `day ${day} must have exactly one SWITCH, found ${backup.length}`);

  if (primary.length === 1) {
    check(primary[0].venue === ROUTES[day].primary, `day ${day} PRIMARY must be ${ROUTES[day].primary}, got ${primary[0].venue}`);
  }
  if (backup.length === 1) {
    check(backup[0].venue === ROUTES[day].switch, `day ${day} SWITCH must be ${ROUTES[day].switch}, got ${backup[0].venue}`);
    check(!!backup[0].switchReason, `day ${day} SWITCH must explain why it is the escape hatch`);
  }
}

check(
  !venues.some(v => /TICTACTOE/i.test(v.venue)),
  "TICTACTOE is not a club-planner venue",
);

/* --------------------- Friday must not regress to RCA-first -------------- */

/*
 * The old Friday route (ROUTE 66 -> ONYX) is a plausible-looking mistake: it
 * ranks by raw crowd size and quietly loses the solo / no-table intent. It is
 * called out by name so a revert fails loudly instead of shipping.
 */
{
  const fri = venues.filter(v => v.day === 21);
  const friPrimary = fri.find(v => v.role === "primary");
  const friSwitch = fri.find(v => v.role === "switch");
  check(
    !(friPrimary?.venue === "ROUTE 66" && friSwitch?.venue === "ONYX"),
    "Friday has regressed to ROUTE 66 -> ONYX; the route is 404 CLUB NOT FOUND -> ROUTE 66",
  );
  check(
    fri.some(v => v.role === "more" && v.venue === "ONYX"),
    "ONYX must stay on Friday as a MORE OPTIONS entry, not be deleted",
  );
}

/* ---------------------- ranking may never be silent ---------------------- */

const ORDER = { primary: 0, switch: 1, more: 2 };

for (const day of EXPECTED_DAYS) {
  const ranked = venues
    .filter(v => v.day === day)
    .sort((a, b) => ORDER[a.role] - ORDER[b.role] || fitScore(b) - fitScore(a));

  ranked.forEach((venue, i) => {
    const outranked = ranked.slice(i + 1).filter(other => fitScore(other) > fitScore(venue));
    check(
      !outranked.length || !!venue.overrideNote,
      `day ${day}: ${venue.venue} (fit ${fitScore(venue)}) sits above ` +
        `${outranked.map(o => `${o.venue} (${fitScore(o)})`).join(", ")} with no WHY THIS ORDER note`,
    );
  });
}

/* ------------------------- evidence and pricing -------------------------- */

for (const venue of venues) {
  const { entry, drink, soloNight } = venue.pricing;
  for (const [field, value] of Object.entries({ entry, drink, soloNight })) {
    check(
      value.includes("EST."),
      `${venue.id}: pricing.${field} lost its EST. marker ("${value}") — no price here is confirmed`,
    );
  }
  check(!!venue.statusNote, `${venue.id}: every status needs a statusNote saying what it rests on`);
}

/* --------------------------------- report -------------------------------- */

if (failures.length) {
  console.error(`\nData QA failed — ${failures.length} problem(s):\n`);
  for (const failure of failures) console.error(`  ✗ ${failure}`);
  console.error("");
  process.exit(1);
}

console.log(`Data QA passed — ${days.length} nights, ${venues.length} venues, ${eventRadar.length} radar entries.`);
