import type { Status } from "./nightlife";

export type RadarEvent = {
  day: number;
  venue: string;
  area: string;
  event: string;
  time: string;
  status: Extract<Status, "VERIFIED" | "LISTED">;
  crowd: "EVENT-DEPENDENT" | "NICHE";
  note: string;
  officialVenueUrl: string;
  eventSourceUrl: string;
  lastVerified: string;
};

// Intentionally separate from the ranked four: date-specific listings that
// should not distort the crowd-first recommendations.
export const eventRadar: RadarEvent[] = [
  {
    day: 1,
    venue: "CULTURE CAFE",
    area: "Phra Nakhon",
    event: "Bangkok Vinyl Minimal & Techno Sessions · MOODYBOOM / Highwire crew",
    time: "20:00",
    status: "LISTED",
    crowd: "EVENT-DEPENDENT",
    note: "Underground vinyl route. Go only if the session is still running after landing.",
    officialVenueUrl: "https://www.google.com/maps/search/?api=1&query=Culture+Cafe+Bangkok",
    eventSourceUrl: "https://bkkvibe.com/",
    lastVerified: "14 Aug 2026",
  },
  {
    day: 4,
    venue: "CULTURE CAFE",
    area: "Phra Nakhon",
    event: "HARD EDGE: Dark & Industrial Hard Techno",
    time: "20:00",
    status: "LISTED",
    crowd: "NICHE",
    note: "Harder underground alternative; the main plan remains the crowd-first choice.",
    officialVenueUrl: "https://www.google.com/maps/search/?api=1&query=Culture+Cafe+Bangkok",
    eventSourceUrl: "https://bkkvibe.com/",
    lastVerified: "14 Aug 2026",
  },
];
