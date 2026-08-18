/**
 * Bangkok Nightlife — club nights 18–21 Aug 2026.
 *
 * Bangkok 18–22 Aug 2026; 22 Aug is the return day and is deliberately not a
 * nightlife night, so it carries no DayId, no venues and no radar entries.
 *
 * All venue copy, pricing and evidence lives here so that App.tsx stays a
 * rendering layer. Nothing in this module is mutated at runtime.
 *
 * Evidence rules (see `Status`):
 *   VERIFIED       direct current first-party evidence for this exact date/event
 *   RECURRING      current evidence that this weekday/weekly pattern genuinely repeats
 *   LISTED         credible current listing, not directly confirmed by the venue
 *   CHECK SAME DAY insufficient evidence, or the line-up can still change
 *   ESTIMATE       normal venue behaviour / typical crowd only
 *
 * Researched 18 Aug 2026. Venue-operator websites were not directly reachable
 * from the build environment, so nothing here is marked VERIFIED: characteristics
 * come from current secondary reporting and are labelled accordingly.
 */

export type Status = "VERIFIED" | "RECURRING" | "LISTED" | "CHECK SAME DAY" | "ESTIMATE";
export type DayId = 18 | 19 | 20 | 21;
export type Role = "primary" | "switch" | "more";
export type Distance = "VERY NEAR" | "NEAR" | "MODERATE" | "FARTHER";
export type Social = "Very Easy" | "Easy" | "Mixed" | "Hard";
export type Solo = "Very Easy" | "Easy" | "Okay" | "Better With Group";
export type AsianMix = "High" | "Medium" | "Unknown";
export type TableCulture = "Low" | "Medium" | "High";
export type Dancefloor = "Excellent" | "Good" | "Mixed" | "Table-heavy";

export type Pricing = {
  /** Door price. Always carries its own EST. marker when unconfirmed. */
  entry: string;
  /** What the door price includes, or why it is an estimate. */
  entryNote: string;
  /** Typical single drink once inside. */
  drink: string;
  /** Realistic all-in spend for one person, no table. */
  soloNight: string;
  table: "NOT REQUIRED" | "OPTIONAL" | "RECOMMENDED";
};

export type Venue = {
  id: string;
  day: DayId;
  role: Role;
  venue: string;
  area: string;
  distance: Distance;
  /** Only set when a genuine current listing exists for this date. */
  event?: string;
  status: Status;
  /** One line saying exactly what the status is based on. */
  statusNote: string;
  music: string;
  arrival: string;
  /** User-fit axes. Displayed separately — never collapsed into one score. */
  crowd: 3 | 4 | 5;
  solo: Solo;
  social: Social;
  asianMix: AsianMix;
  tableCulture: TableCulture;
  dancefloor: Dancefloor;
  /** Short, glanceable. 1 line zh + 1 line en. */
  whyZh: string;
  whyEn: string;
  /** Only for role: "switch" — why this is the 30-minute escape hatch. */
  switchReason?: string;
  /**
   * Set whenever this venue is ranked above something with a higher fitScore.
   * The page must never show a lower score in a higher slot without saying why.
   */
  overrideNote?: { zh: string; en: string };
  crowdNote: string;
  pricing: Pricing;
  mapsUrl: string;
  officialUrl?: string;
  instagramUrl?: string;
  eventSourceUrl?: string;
  lastVerified: string;
  warning?: string;
};

export type Day = {
  id: DayId;
  /** Compact two-line selector label. */
  dow: string;
  date: string;
  full: string;
  /** ISO date in Asia/Bangkok, used for the dynamic countdown. */
  iso: string;
  headline: string;
  /**
   * Only set for a night that is not a normal full night — currently the
   * arrival night. Rendered as a compact banner, never as a venue claim.
   */
  arrivalNote?: { label: string; zh: string; en: string };
};

export const TRIP = { startIso: "2026-08-18", endIso: "2026-08-21", timeZone: "Asia/Bangkok" } as const;

export const BASE = "TRIBE Sukhumvit 39";

export const days: Day[] = [
  {
    id: 18, dow: "TUE", date: "18", full: "Tue · 18 Aug 2026", iso: "2026-08-18",
    headline: "Arrival night — land first, decide after",
    arrivalNote: {
      label: "ARRIVAL NIGHT",
      zh: "落地夜 — 先入境 / 拿行李 / Check-in。还有精神才去，不用硬冲。",
      en: "Land → hotel → decide. Don't chase a big event tonight. Go only if you still have energy.",
    },
  },
  { id: 19, dow: "WED", date: "19", full: "Wed · 19 Aug 2026", iso: "2026-08-19", headline: "Midweek — go where the crowd already is" },
  { id: 20, dow: "THU", date: "20", full: "Thu · 20 Aug 2026", iso: "2026-08-20", headline: "Thonglor/Ekkamai wakes up on Thursday" },
  { id: 21, dow: "FRI", date: "21", full: "Fri · 21 Aug 2026", iso: "2026-08-21", headline: "The main crowd night — RCA" },
];

const maps = (q: string) => `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(q)}`;

export const venues: Venue[] = [
  /* ------------------------------- TUE 18 AUG ------------------------------ */
  /* Arrival night. Researched 18 Aug 2026 — see each statusNote for what the  */
  /* label actually rests on. Nothing here is upgraded on a hunch.             */

  {
    id: "dope-18",
    day: 18,
    role: "primary",
    venue: "DOPE & DIRTY",
    area: "Ekkamai Soi 7 · Sukhumvit 63",
    distance: "NEAR",
    event: "TUESDAY LINE-UP · UNDERDOG / GAPZ / K-DROP",
    status: "LISTED",
    statusNote: "Current listings show the venue open from 19:00 on Tuesdays with a date-specific 18 Aug hip-hop line-up from 22:00. Listing is credible secondary reporting, not first-party confirmation — and sources disagree about how much floor there is to stand on.",
    music: "Hip-Hop · R&B",
    arrival: "00:15 onwards",
    crowd: 3,
    solo: "Okay",
    social: "Mixed",
    asianMix: "High",
    tableCulture: "High",
    dancefloor: "Mixed",
    whyZh: "周二真的有 hip-hop 阵容、而且是真 club；落地夜只需要一间就够。",
    whyEn: "The one genuine club with a date-specific Tuesday hip-hop line-up — on an arrival night, one room is the whole plan.",
    crowdNote: "Compact Ekkamai hip-hop room, young Thai/Asian-leaning crowd, peaks 22:00–01:00. Reports conflict on the floor: some describe a compact dancefloor plus an upstairs EDM room, others describe table seating only.",
    overrideNote: {
      zh: "Upper House 分数略高、也更近，但周二这里才有真正的 hip-hop 阵容。不行就走，十分钟车程回 Sukhumvit 24。",
      en: "Upper House scores a shade higher and sits closer to base, but Dope & Dirty is the room with an actual Tuesday line-up. If it does not land, the switch is ten minutes away.",
    },
    pricing: {
      entry: "~฿0–300 EST.",
      entryNote: "No published Tuesday door price found; listings show drink pricing only (beer ~฿200, cocktails ~฿350). Budget for a cover you may not be charged.",
      drink: "~฿200–350 EST.",
      soloNight: "~฿600–1,200 EST.",
      table: "OPTIONAL",
    },
    mapsUrl: maps("Dope and Dirty Ekkamai Soi 7 Sukhumvit 63 Bangkok"),
    instagramUrl: "https://www.instagram.com/dopeanddirtybkk/",
    eventSourceUrl: "https://bangkok-nights.com/venue/dope-dirty",
    lastVerified: "18 Aug 2026",
    warning: "Table-leaning · floor space disputed · arrival-night energy first",
  },

  {
    id: "upper-18",
    day: 18,
    role: "switch",
    venue: "UPPER HOUSE",
    area: "24BLVD 2F · Sukhumvit 24",
    distance: "VERY NEAR",
    event: "NARTEE & FRIENDS · 21:00–03:30",
    status: "LISTED",
    statusNote: "Listed as open Tue–Sun from 21:00, with a date-specific 18 Aug party-hits line-up running to 03:30. Credible secondary listing; no first-party confirmation of Tuesday density.",
    music: "R&B · Hip-Hop · party hits",
    arrival: "00:30–01:00",
    crowd: 3,
    solo: "Okay",
    social: "Mixed",
    asianMix: "High",
    tableCulture: "Medium",
    dancefloor: "Good",
    whyZh: "离酒店最近的真舞池，周二也有 line-up；累了就直接来这间，不用再跑。",
    whyEn: "The nearest real dancefloor to base, and it has its own Tuesday line-up — the low-effort version of the night.",
    switchReason: "Ten minutes back down Sukhumvit from Ekkamai, and it is the room with an actual dancefloor rather than a table plan. On an arrival night that also makes it a legitimate place to simply start.",
    crowdNote: "R&B/hip-hop room with a genuine floor plus tables. Tuesday density is unproven — it is a Tue–Sun venue, not a weekend-only one.",
    pricing: { entry: "~฿400–500 EST.", entryNote: "No current published door price found.", drink: "~฿250–400 EST.", soloNight: "~฿900–1,800 EST.", table: "OPTIONAL" },
    mapsUrl: maps("Upper House Bangkok 24BLVD Sukhumvit 24"),
    officialUrl: "https://upperhousebangkok.com/",
    eventSourceUrl: "https://bangkok-nights.com/venue/upper-house",
    lastVerified: "18 Aug 2026",
    warning: "Tuesday crowd unconfirmed",
  },

  {
    id: "savoy-18",
    day: 18,
    role: "more",
    venue: "HOUSE OF SAVOY",
    area: "SILQ Hotel · Sukhumvit 24",
    distance: "VERY NEAR",
    status: "CHECK SAME DAY",
    statusNote: "Listed as opening 21:00 on Tuesdays, but no 18 Aug programme is listed — the same source shows events only from 20 Aug onward. Walk past, do not plan around it.",
    music: "Party hits · club",
    arrival: "00:30",
    crowd: 3,
    solo: "Okay",
    social: "Mixed",
    asianMix: "Medium",
    tableCulture: "High",
    dancefloor: "Mixed",
    whyZh: "同一条 soi，走两分钟就能看一眼；但周二没有节目表。",
    whyEn: "Two minutes from Upper House, so it costs nothing to look — but nothing is programmed for a Tuesday.",
    crowdNote: "Polished hotel-club room, table-leaning. No Tuesday evidence either way.",
    pricing: { entry: "~฿500 EST.", entryNote: "Unconfirmed.", drink: "~฿400+ EST.", soloNight: "~฿1,000–2,000 EST.", table: "OPTIONAL" },
    mapsUrl: maps("House of Savoy SILQ Hotel Sukhumvit 24 Bangkok"),
    lastVerified: "18 Aug 2026",
    warning: "Table-led room · no Tuesday programme listed",
  },

  {
    id: "baccarat-18",
    day: 18,
    role: "more",
    venue: "BACCARAT",
    area: "Sukhumvit 24",
    distance: "VERY NEAR",
    status: "CHECK SAME DAY",
    statusNote: "Reported to run a weekly Tuesday hip-hop night, but sources disagree on the hours and none confirms 18 Aug. Bottle-service led.",
    music: "Hip-Hop",
    arrival: "00:30",
    crowd: 3,
    solo: "Better With Group",
    social: "Mixed",
    asianMix: "Medium",
    tableCulture: "High",
    dancefloor: "Table-heavy",
    whyZh: "周二有 hip-hop 场，但是开桌文化很重，一个人不划算。",
    whyEn: "It does run a Tuesday hip-hop night, but it is a bottle-service room — an expensive way to stand alone.",
    crowdNote: "Upscale VIP club on Sukhumvit 24. Table-first floor; solo walk-ins are not what the room is built for.",
    pricing: { entry: "~฿500+ EST.", entryNote: "Unconfirmed; minimum spend can apply.", drink: "~฿450+ EST.", soloNight: "~฿1,500–3,000 EST.", table: "RECOMMENDED" },
    mapsUrl: maps("Baccarat Bangkok Sukhumvit 24"),
    lastVerified: "18 Aug 2026",
    warning: "Table-led room",
  },

  /* ------------------------------- WED 19 AUG ------------------------------ */

  {
    id: "muin-19",
    day: 19,
    role: "primary",
    venue: "MU:IN",
    area: "DONKI Mall Thonglor 5F · Sukhumvit 63",
    distance: "NEAR",
    status: "RECURRING",
    statusNote: "Current listings agree MU:IN runs Wed–Sun, 21:00–03:00, ฿500 cover with 2 drinks. No date-specific 19 Aug line-up confirmed.",
    music: "EDM · commercial · Hip-Hop",
    arrival: "23:00–00:00",
    crowd: 4,
    solo: "Easy",
    social: "Easy",
    asianMix: "High",
    tableCulture: "Medium",
    dancefloor: "Good",
    whyZh: "周三本来就少人，这里是少数真的开、而且开就有人的 club。",
    whyEn: "Wednesday is its week-opening night, so the crowd is concentrated instead of scattered.",
    crowdNote: "Korean-brand EDM club in Thonglor; party fills after 23:00. Crowd leans Thai/Asian.",
    pricing: {
      entry: "~฿500 EST.",
      entryNote: "Listed cover including 2 drinks — confirm at the door, it varies by event.",
      drink: "~฿300+ EST.",
      soloNight: "~฿800–1,600 EST.",
      table: "NOT REQUIRED",
    },
    mapsUrl: maps("MU:IN Club Donki Mall Thonglor Sukhumvit 63 Bangkok"),
    officialUrl: "https://muinbkk.com/",
    instagramUrl: "https://www.instagram.com/muin_bangkok/",
    lastVerified: "18 Aug 2026",
  },

  {
    id: "404-19",
    day: 19,
    role: "switch",
    venue: "404 CLUB NOT FOUND",
    area: "EmSphere 5M · Phrom Phong",
    distance: "VERY NEAR",
    status: "CHECK SAME DAY",
    statusNote: "Open-format guest DJ/MC venue, but no confirmed Wednesday programme.",
    music: "Open-format",
    arrival: "23:00",
    crowd: 3,
    solo: "Easy",
    social: "Easy",
    asianMix: "High",
    tableCulture: "Low",
    dancefloor: "Good",
    whyZh: "真 club、不用开桌、离酒店最近；但周三人多不多没保证。",
    whyEn: "A real club, no table pressure, 6 minutes from base — but its Wednesday crowd is unproven.",
    switchReason: "The nearest genuine club to base. Go and look — nothing confirms a Wednesday crowd here, so treat it as a room to check, not a room that is busy.",
    crowdNote: "Asian micro-club format, standing/dancefloor led rather than table led. No evidence either way for a Wednesday.",
    pricing: { entry: "~฿300–500 EST.", entryNote: "No current published door price found.", drink: "~฿300+ EST.", soloNight: "~฿700–1,500 EST.", table: "NOT REQUIRED" },
    mapsUrl: maps("404 Club Not Found EmSphere 5M Bangkok"),
    officialUrl: "https://www.facebook.com/404clubnotfound.bkk/",
    lastVerified: "18 Aug 2026",
    warning: "Wednesday crowd unconfirmed — look before committing",
  },

  {
    id: "upper-19",
    day: 19,
    role: "more",
    venue: "UPPER HOUSE",
    area: "24BLVD 2F · Sukhumvit 24",
    distance: "VERY NEAR",
    status: "RECURRING",
    statusNote: "Opens 21:00 daily per the venue's own positioning; midweek density not confirmed.",
    music: "R&B · Hip-Hop",
    arrival: "23:00",
    crowd: 3,
    solo: "Okay",
    social: "Mixed",
    asianMix: "High",
    tableCulture: "Medium",
    dancefloor: "Good",
    whyZh: "离酒店最近，周三人不一定多，当 plan C。",
    whyEn: "Closest club to base, but a Wednesday here is crowd-dependent.",
    crowdNote: "Stylish local/expat crowd; energy builds after 23:00. Strong on Thu–Sat, unproven midweek.",
    pricing: { entry: "~฿400–500 EST.", entryNote: "No current published door price found.", drink: "~฿350+ EST.", soloNight: "~฿900–1,800 EST.", table: "OPTIONAL" },
    mapsUrl: maps("Upper House Bangkok 24BLVD Sukhumvit 24"),
    officialUrl: "https://upperhousebangkok.com/",
    lastVerified: "18 Aug 2026",
  },

  {
    id: "offmap-19",
    day: 19,
    role: "more",
    venue: "OFF THE MAP",
    area: "Sukhumvit",
    distance: "NEAR",
    status: "CHECK SAME DAY",
    statusNote: "Previously carried as a Wednesday ladies-night option; no current evidence that the promotion still runs. Do not travel for it unconfirmed.",
    music: "Commercial · dance",
    arrival: "22:00–00:00",
    crowd: 3,
    solo: "Easy",
    social: "Mixed",
    asianMix: "Medium",
    tableCulture: "Medium",
    dancefloor: "Mixed",
    whyZh: "旧资料里的周三选项，现在查不到还有没有，出门前先确认。",
    whyEn: "Held over from the old dataset — the Wednesday promotion is no longer evidenced.",
    crowdNote: "Unconfirmed. Treat as a same-day call only.",
    pricing: { entry: "~฿300 EST.", entryNote: "Unconfirmed.", drink: "~฿250+ EST.", soloNight: "~฿600–1,200 EST.", table: "NOT REQUIRED" },
    mapsUrl: maps("Off The Map Bangkok Sukhumvit"),
    lastVerified: "18 Aug 2026",
  },

  /* ------------------------------- THU 20 AUG ------------------------------ */

  {
    id: "upper-20",
    day: 20,
    role: "primary",
    venue: "UPPER HOUSE",
    area: "24BLVD 2F · Sukhumvit 24",
    distance: "VERY NEAR",
    status: "RECURRING",
    statusNote: "Opens 21:00 daily; Thonglor/Ekkamai-side venues are consistently reported busiest Thu–Sat. No 20 Aug guest confirmed.",
    music: "R&B · Hip-Hop",
    arrival: "23:00–23:30",
    crowd: 4,
    solo: "Okay",
    social: "Easy",
    asianMix: "High",
    tableCulture: "Medium",
    dancefloor: "Good",
    whyZh: "周四这一带才开始热，而且是离酒店最近的真 club。",
    whyEn: "Thursday is the first genuinely busy night on this side of town, and this is the nearest real dancefloor.",
    crowdNote: "R&B/hip-hop room with a packed floor rather than a bottle-only room; young local + expat mix.",
    pricing: { entry: "~฿400–500 EST.", entryNote: "No current published door price found.", drink: "~฿350+ EST.", soloNight: "~฿900–1,800 EST.", table: "OPTIONAL" },
    mapsUrl: maps("Upper House Bangkok 24BLVD Sukhumvit 24"),
    officialUrl: "https://upperhousebangkok.com/",
    lastVerified: "18 Aug 2026",
  },

  {
    id: "savoy-20",
    day: 20,
    role: "switch",
    venue: "HOUSE OF SAVOY",
    area: "SILQ Hotel · Sukhumvit 24",
    distance: "VERY NEAR",
    status: "CHECK SAME DAY",
    statusNote: "Previously listed GUZZ / STAYHIGH for 20 Aug; not re-confirmed, so the event claim has been removed.",
    music: "Party hits · club",
    arrival: "00:00–00:30",
    crowd: 3,
    solo: "Okay",
    social: "Mixed",
    asianMix: "Medium",
    tableCulture: "High",
    dancefloor: "Mixed",
    whyZh: "同一条 soi，走过去两分钟，不用重新叫车。",
    whyEn: "Same soi as Upper House — a two-minute walk, which is the whole point of a switch.",
    switchReason: "The only real club within walking distance of Upper House. It is table-leaning and its Thursday crowd is unconfirmed — but at 00:30 a switch you can walk to beats a 25-minute ride to RCA.",
    crowdNote: "Polished hotel-club room, table-leaning. Density unconfirmed.",
    pricing: { entry: "~฿500 EST.", entryNote: "Unconfirmed.", drink: "~฿400+ EST.", soloNight: "~฿1,000–2,000 EST.", table: "OPTIONAL" },
    mapsUrl: maps("House of Savoy SILQ Hotel Sukhumvit 24 Bangkok"),
    overrideNote: {
      zh: "ONYX 分数略高，但在 RCA，凌晨要跑 25 分钟；这里走两分钟。",
      en: "ONYX scores higher but sits 25 minutes away in RCA. A switch you can walk to in two minutes is worth more at 00:30.",
    },
    lastVerified: "18 Aug 2026",
    warning: "Table-led room · Thursday crowd unconfirmed",
  },

  {
    id: "salone-20",
    day: 20,
    role: "more",
    venue: "SALONE DI VITA",
    area: "Sukhumvit 63 · Ekkamai",
    distance: "NEAR",
    status: "CHECK SAME DAY",
    statusNote: "The old GLENFIDDICH NIGHT / SALONE INVITES: CAVIA listing for 20 Aug could not be re-confirmed and has been withdrawn. Salone runs weekly guest DJs — check their channels on the day.",
    music: "Open-format · guest DJs",
    arrival: "23:00",
    crowd: 4,
    solo: "Better With Group",
    social: "Mixed",
    asianMix: "High",
    tableCulture: "High",
    dancefloor: "Table-heavy",
    whyZh: "场子漂亮，但是 bottle-service 为主，一个人站着会很卡。",
    whyEn: "Beautiful room, but it is a boutique VIP lounge-club — good-looking crowd, hard solo floor.",
    crowdNote: "Young fashion-forward crowd, bottle-service tables. Upscale does not mean easy to talk to alone.",
    pricing: { entry: "~฿500 EST.", entryNote: "Door policy varies by guest DJ; unconfirmed.", drink: "~฿400+ EST.", soloNight: "~฿1,200–2,500 EST.", table: "RECOMMENDED" },
    mapsUrl: maps("Salone di Vita Sukhumvit 63 Ekkamai Bangkok"),
    officialUrl: "https://salonedivita.com/",
    instagramUrl: "https://www.instagram.com/salonedivita/",
    lastVerified: "18 Aug 2026",
    warning: "Table-led room",
  },

  {
    id: "onyx-20",
    day: 20,
    role: "more",
    venue: "ONYX",
    area: "RCA · Rama 9",
    distance: "MODERATE",
    status: "CHECK SAME DAY",
    statusNote: "No 20 Aug line-up confirmed. Only worth the ride if a same-day headliner justifies it.",
    music: "EDM · commercial",
    arrival: "23:30",
    crowd: 4,
    solo: "Okay",
    social: "Mixed",
    asianMix: "High",
    tableCulture: "High",
    dancefloor: "Table-heavy",
    whyZh: "周四跑 RCA 不划算，除非当天 lineup 够强。",
    whyEn: "A 25-minute ride for a table-led room is a bad Thursday trade unless the line-up is strong.",
    crowdNote: "Reviews repeatedly describe standing tables and VIP tables dominating the floor.",
    pricing: { entry: "~฿400–500 EST.", entryNote: "Widely listed door price, usually including drink vouchers. Higher for headliners.", drink: "~฿350+ EST.", soloNight: "~฿900–1,800 EST.", table: "OPTIONAL" },
    mapsUrl: maps("ONYX Bangkok RCA Royal City Avenue"),
    officialUrl: "https://onyxbangkok.club/",
    lastVerified: "18 Aug 2026",
  },

  /* ------------------------------- FRI 21 AUG ------------------------------ */

  {
    id: "route66-21",
    day: 21,
    role: "primary",
    venue: "ROUTE 66",
    area: "RCA · Royal City Avenue",
    distance: "MODERATE",
    status: "RECURRING",
    statusNote: "Weekly Friday operation is well documented: 22:30 open, three rooms (Hip-Hop / live Thai band / main EDM), ฿300 foreigner entry returned as ฿300 drink credit. No date-specific 21 Aug guest confirmed.",
    music: "Hip-Hop · Thai pop · EDM (3 rooms)",
    arrival: "23:00–23:30",
    crowd: 5,
    solo: "Easy",
    social: "Easy",
    asianMix: "High",
    tableCulture: "Medium",
    dancefloor: "Good",
    whyZh: "周五最稳的人流，三个房间可以换，Thai/Asian 为主，最符合 crowd-first。",
    whyEn: "The most reliable Friday crowd in town, and three rooms means you change the vibe without leaving.",
    crowdNote: "Thai university crowd dominant; rooms are typically packed well before midnight. Entry is effectively free once the drink credit is used.",
    pricing: {
      entry: "~฿300 EST.",
      entryNote: "Widely listed foreigner entry, returned as ฿300 in drink credit. Thai nationals reported free.",
      drink: "~฿250+ EST.",
      soloNight: "~฿700–1,500 EST.",
      table: "NOT REQUIRED",
    },
    mapsUrl: maps("Route 66 Club RCA Royal City Avenue Bangkok"),
    officialUrl: "https://www.route66club.com/",
    lastVerified: "18 Aug 2026",
  },

  {
    id: "onyx-21",
    day: 21,
    role: "switch",
    venue: "ONYX",
    area: "RCA · same strip, 2 min walk",
    distance: "MODERATE",
    status: "RECURRING",
    statusNote: "Operates every Friday on the same RCA strip. No date-specific 21 Aug line-up confirmed.",
    music: "EDM · commercial",
    arrival: "00:00–00:30",
    crowd: 5,
    solo: "Okay",
    social: "Mixed",
    asianMix: "High",
    tableCulture: "High",
    dancefloor: "Table-heavy",
    whyZh: "同一条街，走过去两分钟，不用重新叫车。",
    whyEn: "Same strip as Route 66 — a two-minute walk, no second taxi, no lost night.",
    switchReason: "The switch is operational, not aspirational: you are already on RCA, so changing rooms costs two minutes instead of half an hour.",
    crowdNote: "Bigger production, higher door, more table-led floor. Good crowd, harder to move through than Route 66.",
    pricing: { entry: "~฿400–500 EST.", entryNote: "Widely listed door price, usually including drink vouchers. Higher for headliners.", drink: "~฿350+ EST.", soloNight: "~฿900–1,800 EST.", table: "OPTIONAL" },
    mapsUrl: maps("ONYX Bangkok RCA Royal City Avenue"),
    officialUrl: "https://onyxbangkok.club/",
    overrideNote: {
      zh: "404 分数更高，但在 Phrom Phong；ONYX 就在同一条街，走两分钟。",
      en: "404 scores higher but is back in Phrom Phong. ONYX is on the same strip — a switch has to be walkable to be a switch.",
    },
    lastVerified: "18 Aug 2026",
  },

  {
    id: "404-21",
    day: 21,
    role: "more",
    venue: "404 CLUB NOT FOUND",
    area: "EmSphere 5M · Phrom Phong",
    distance: "VERY NEAR",
    status: "CHECK SAME DAY",
    statusNote: "The old DJ SHANEN listing for 21 Aug could not be re-confirmed and has been withdrawn.",
    music: "Open-format",
    arrival: "23:00",
    crowd: 4,
    solo: "Easy",
    social: "Easy",
    asianMix: "High",
    tableCulture: "Low",
    dancefloor: "Good",
    whyZh: "不想跑 RCA 就留在 Phrom Phong，这是最近的周五选择。",
    whyEn: "The stay-local Friday option if you do not feel like the RCA ride at all.",
    crowdNote: "Standing/dancefloor-led micro-club, low table pressure. Friday density unconfirmed.",
    pricing: { entry: "~฿300–500 EST.", entryNote: "No current published door price found.", drink: "~฿300+ EST.", soloNight: "~฿700–1,500 EST.", table: "NOT REQUIRED" },
    mapsUrl: maps("404 Club Not Found EmSphere 5M Bangkok"),
    officialUrl: "https://www.facebook.com/404clubnotfound.bkk/",
    lastVerified: "18 Aug 2026",
  },

  {
    id: "void-21",
    day: 21,
    role: "more",
    venue: "VOID",
    area: "ONE Complex · Rama 9",
    distance: "MODERATE",
    status: "CHECK SAME DAY",
    statusNote: "The old FACE 2 FACE | CXW listing for 21 Aug could not be re-confirmed. VOID runs Thu–Sun, 22:00–04:00; check their channels on the day.",
    music: "Techno · house · electronic",
    arrival: "23:30",
    crowd: 4,
    solo: "Easy",
    social: "Mixed",
    asianMix: "Medium",
    tableCulture: "Medium",
    dancefloor: "Excellent",
    whyZh: "纯跳舞最强，但音乐硬、聊天难，crowd-first 的话不是第一顺位。",
    whyEn: "Best pure dancefloor on this list, but harder music and a heads-down crowd — not a crowd-first pick.",
    crowdNote: "Purpose-built arena, 800–1,200 capacity, big production. Great to dance in, harder to talk in.",
    pricing: { entry: "~฿500 EST.", entryNote: "Commonly listed at around ฿500, often including drinks; varies by event.", drink: "~฿350+ EST.", soloNight: "~฿900–1,800 EST.", table: "NOT REQUIRED" },
    mapsUrl: maps("VOID Club Bangkok ONE Complex Rama 9"),
    officialUrl: "https://www.voidclubbkk.com/",
    instagramUrl: "https://www.instagram.com/voidclub.bkk/",
    lastVerified: "18 Aug 2026",
    warning: "Harder music",
  },

  {
    id: "sugar-21",
    day: 21,
    role: "more",
    venue: "SUGAR CLUB",
    area: "Sukhumvit 11",
    distance: "NEAR",
    status: "ESTIMATE",
    statusNote: "No date-specific listing. Normal weekend venue behaviour only.",
    music: "Hip-Hop",
    arrival: "23:30",
    crowd: 4,
    solo: "Easy",
    social: "Easy",
    asianMix: "Medium",
    tableCulture: "Low",
    dancefloor: "Mixed",
    whyZh: "小场、Hip-Hop、周末很挤，但空间真的小。",
    whyEn: "Small hip-hop room that packs out at weekends — energy is high, space is not.",
    crowdNote: "Reported as very crowded at weekends, little seating unless VIP, small floor in front of the DJ.",
    pricing: { entry: "~฿400 / ~฿200 EST.", entryNote: "Listed as ~฿400 men, ~฿200 women, including a drink; reports range ฿300–500.", drink: "~฿300+ EST.", soloNight: "~฿700–1,400 EST.", table: "NOT REQUIRED" },
    mapsUrl: maps("Sugar Club Bangkok Sukhumvit 11"),
    lastVerified: "18 Aug 2026",
  },
];

/* -------------------------------------------------------------------------- */
/*  User-fit scoring                                                           */
/* -------------------------------------------------------------------------- */

/**
 * Weights come straight from the trip brief: crowd first, then how easy the
 * room is to be alone in, then how easy it is to end up talking to someone.
 * DJ fame is deliberately not an axis.
 */
export const FIT_WEIGHTS = [
  { key: "Crowd strength", weight: 0.3 },
  { key: "Solo friendliness", weight: 0.2 },
  { key: "Natural social interaction", weight: 0.2 },
  { key: "Young / Asian-mix fit", weight: 0.15 },
  { key: "Danceability", weight: 0.1 },
  { key: "Switching convenience", weight: 0.05 },
] as const;

const soloScore: Record<Solo, number> = { "Very Easy": 5, Easy: 4, Okay: 3, "Better With Group": 1.5 };
const socialScore: Record<Social, number> = { "Very Easy": 5, Easy: 4, Mixed: 3, Hard: 1.5 };
const mixScore: Record<AsianMix, number> = { High: 5, Medium: 3.5, Unknown: 3 };
const danceScore: Record<Dancefloor, number> = { Excellent: 5, Good: 4, Mixed: 3, "Table-heavy": 1.5 };
const distanceScore: Record<Distance, number> = { "VERY NEAR": 5, NEAR: 4, MODERATE: 2.5, FARTHER: 1 };

export const distanceRank: Record<Distance, number> = { "VERY NEAR": 0, NEAR: 1, MODERATE: 2, FARTHER: 3 };

/** Weighted user-fit score, 0–5, one decimal. */
export function fitScore(v: Venue): number {
  const raw =
    0.3 * v.crowd +
    0.2 * soloScore[v.solo] +
    0.2 * socialScore[v.social] +
    0.15 * mixScore[v.asianMix] +
    0.1 * danceScore[v.dancefloor] +
    0.05 * distanceScore[v.distance];
  return Math.round(raw * 10) / 10;
}

/** Coarse 3–5 badge derived from the same score — never a second opinion. */
export function fitBadge(v: Venue): 3 | 4 | 5 {
  const s = fitScore(v);
  if (s >= 4.2) return 5;
  if (s >= 3.5) return 4;
  return 3;
}
