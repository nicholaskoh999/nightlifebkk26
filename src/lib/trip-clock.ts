import { TRIP, days, type DayId } from "../data/nightlife";

export type TripState =
  | { phase: "before"; label: string; today: null }
  | { phase: "during"; label: string; today: DayId | null }
  | { phase: "after"; label: string; today: null };

/** Today's date in Asia/Bangkok as an ISO yyyy-mm-dd string. */
export function bangkokToday(now: Date = new Date()): string {
  // en-CA formats as yyyy-mm-dd, which sorts and compares as a plain string.
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: TRIP.timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(now);
}

const dayNumber = (iso: string) => Math.floor(Date.parse(`${iso}T00:00:00Z`) / 86400000);

/**
 * Derives the trip state from the Bangkok calendar date. Pure and
 * deterministic, so it can be called from an effect without hydration risk.
 */
export function tripState(todayIso: string): TripState {
  const today = dayNumber(todayIso);
  const start = dayNumber(TRIP.startIso);
  const end = dayNumber(TRIP.endIso);

  if (today > end) return { phase: "after", label: "TRIP COMPLETE", today: null };

  if (today >= start) {
    const day = days.find(d => d.iso === todayIso);
    if (day) return { phase: "during", label: `TONIGHT · ${day.dow} ${day.date}`, today: day.id };
    return { phase: "during", label: "TRIP IN PROGRESS", today: null };
  }

  const togo = start - today;
  if (togo === 1) return { phase: "before", label: "STARTS TOMORROW", today: null };
  return { phase: "before", label: `${togo} DAYS TO GO`, today: null };
}

/**
 * Client snapshot for `useSyncExternalStore`. Cached so the snapshot is
 * referentially stable within a session; the server snapshot is `null`, which
 * is what keeps hydration free of mismatches.
 */
let cached: TripState | null = null;
export function currentTripState(): TripState {
  if (!cached) cached = tripState(bangkokToday());
  return cached;
}

/** The trip state never changes mid-session, so there is nothing to subscribe to. */
export function subscribeTripState(): () => void {
  return () => {};
}
