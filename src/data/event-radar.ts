import type { DayId, Status } from "./nightlife";

export type RadarEvent = {
  day: DayId;
  venue: string;
  area: string;
  event: string;
  time: string;
  status: Extract<Status, "LISTED" | "CHECK SAME DAY">;
  /** Why it is on the radar and not in the main route. */
  note: string;
  mapsUrl: string;
  eventSourceUrl: string;
  lastVerified: string;
};

const maps = (q: string) => `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(q)}`;

/**
 * Date-specific listings that are real but do not fit a crowd-first, solo,
 * natural-interaction night. Kept visible, kept out of the main route.
 */
export const eventRadar: RadarEvent[] = [
  {
    day: 19,
    venue: "AMNESIA",
    area: "Sukhumvit 63 · Ekkamai",
    event: "THE ONE AND ONLY UPLIFTING TRANCE",
    time: "21:00–04:00",
    status: "LISTED",
    note: "Genuine Wednesday listing, but trance nights are heads-down and niche — poor solo-social fit.",
    mapsUrl: maps("Amnesia Bangkok Ekkamai Sukhumvit 63"),
    eventSourceUrl: "https://expatsinbangkok.com/event/nightclubs-and-parties",
    lastVerified: "18 Aug 2026",
  },
  {
    day: 21,
    venue: "LEVELS",
    area: "Aloft Hotel 6F · Sukhumvit 11",
    event: "PERFECT FRIDAYS",
    time: "21:00–03:00",
    status: "LISTED",
    note: "Recurring Friday listing. Tourist-heavy Sukhumvit 11 room — fine as a late Plan C, weaker on Asian-mix fit.",
    mapsUrl: maps("Levels Club Bangkok Aloft Sukhumvit 11"),
    eventSourceUrl: "https://allevents.in/bangkok/parties",
    lastVerified: "18 Aug 2026",
  },
];
