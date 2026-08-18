"use client";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ChevronDown, Clock, MapPin, Radar, Users } from "lucide-react";
import { useMemo, useState, useSyncExternalStore } from "react";
import { days, distanceRank, fitBadge, fitScore, venues, type DayId, type Venue } from "./data/nightlife";
import { eventRadar } from "./data/event-radar";
import { currentTripState, subscribeTripState } from "./lib/trip-clock";
import { Budget, CrowdMeter, FitGrid, MapsLink, StatusTag } from "./components/Bits";
import VenueSheet from "./components/VenueSheet";

/* Filters follow the actual decision, not music-press genres. */
const FILTERS = [
  "Crowd first", "Solo friendly", "Easy social", "No table",
  "Dancefloor", "Hip-Hop", "EDM", "Special event", "Near hotel",
] as const;
type Filter = (typeof FILTERS)[number];

function matches(v: Venue, f: Filter) {
  switch (f) {
    case "Crowd first": return v.crowd >= 4;
    case "Solo friendly": return v.solo === "Very Easy" || v.solo === "Easy";
    case "Easy social": return v.social === "Very Easy" || v.social === "Easy";
    case "No table": return v.tableCulture !== "High" && v.pricing.table === "NOT REQUIRED";
    case "Dancefloor": return v.dancefloor === "Excellent" || v.dancefloor === "Good";
    case "Special event": return !!v.event;
    case "Near hotel": return v.distance === "VERY NEAR" || v.distance === "NEAR";
    default: return v.music.toLowerCase().includes(f.toLowerCase());
  }
}

const roleRank = { primary: 0, switch: 1, more: 2 } as const;

/** A slot that outranks a higher-scoring option must always say why. */
function OverrideNote({ venue }: { venue: Venue }) {
  if (!venue.overrideNote) return null;
  return (
    <p className="override">
      <b>WHY THIS ORDER</b>
      <span lang="zh-Hans">{venue.overrideNote.zh}</span>
      <span>{venue.overrideNote.en}</span>
    </p>
  );
}

function PrimaryCard({ venue, onOpen }: { venue: Venue; onOpen: () => void }) {
  const reduce = useReducedMotion();
  return (
    <motion.article className="primary" initial={reduce ? false : { opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
      <p className="kicker"><span>TONIGHT&apos;S PICK · <span lang="zh-Hans">今晚首选</span></span><StatusTag venue={venue} /></p>
      <h1>{venue.venue}</h1>
      <p className="place"><MapPin size={13} aria-hidden />{venue.area}</p>
      {venue.event && <p className="event-chip">{venue.event}</p>}
      {venue.warning && <p className="warn">{venue.warning}</p>}

      <p className="why"><b lang="zh-Hans">为什么今晚</b><span lang="zh-Hans">{venue.whyZh}</span><span>{venue.whyEn}</span></p>
      <OverrideNote venue={venue} />
      <FitGrid venue={venue} />

      <p className="arrive"><Clock size={15} aria-hidden /><small>ARRIVE</small><b>{venue.arrival}</b></p>
      <Budget venue={venue} />

      <div className="actions">
        <MapsLink venue={venue} className="btn-solid" />
        <button className="btn-ghost" onClick={onOpen}>Details · <span lang="zh-Hans">看详情</span></button>
      </div>
    </motion.article>
  );
}

function SwitchCard({ venue, from, onOpen }: { venue: Venue; from?: string; onOpen: () => void }) {
  return (
    <article className="switch">
      <p className="kicker"><span>SWITCH TO · <span lang="zh-Hans">不对就走</span></span><StatusTag venue={venue} /></p>
      {from && <p className="route"><b>{from}</b><i aria-hidden>&rarr;</i>{venue.venue}</p>}
      <h2>{venue.venue}</h2>
      <p className="place"><MapPin size={13} aria-hidden />{venue.area}</p>
      {venue.warning && <p className="warn">{venue.warning}</p>}
      <p className="switch-why">{venue.switchReason ?? venue.whyEn}</p>
      <OverrideNote venue={venue} />
      <p className="mini"><CrowdMeter venue={venue} /> fit {fitBadge(venue)}/5 · {venue.solo} solo · {venue.tableCulture} table · {venue.pricing.entry}</p>
      <div className="actions">
        <MapsLink venue={venue} className="btn-solid" />
        <button className="btn-ghost" onClick={onOpen}>Details</button>
      </div>
    </article>
  );
}

function ThirtyMinRule({ from, to }: { from?: string; to?: string }) {
  return (
    <section className="rule" aria-label="30 minute rule">
      <p className="rule-title">30-MIN RULE</p>
      <ul>
        <li>Too many tables?</li>
        <li>No crowd movement?</li>
        <li>Feels awkward solo?</li>
      </ul>
      <p className="rule-do">→ SWITCH. Don&apos;t waste the night.</p>
      {from && to && <p className="rule-route"><b>{from}</b> → <b>{to}</b></p>}
      <p className="rule-note"><span lang="zh-Hans">最多 2 间</span> · Two venues is the whole plan. Anything else lives in More options.</p>
    </section>
  );
}

function EventRadarPanel({ day }: { day: DayId }) {
  const items = eventRadar.filter(i => i.day === day);
  if (!items.length) return null;
  return (
    <section className="radar" aria-label="Event radar">
      <p className="kicker"><span><Radar size={13} aria-hidden /> EVENT RADAR</span></p>
      {items.map(i => (
        <article key={`${i.day}-${i.venue}`}>
          <p className="radar-top"><b>{i.venue}</b><i>{i.status}</i></p>
          <strong>{i.event}</strong>
          <span className="mini">{i.area} · {i.time}</span>
          <span className="radar-note">{i.note}</span>
          <span className="radar-links">
            <a href={i.mapsUrl} target="_blank" rel="noopener noreferrer">Maps</a>
            <a href={i.eventSourceUrl} target="_blank" rel="noopener noreferrer">Listing</a>
          </span>
        </article>
      ))}
    </section>
  );
}

function MoreOptions({ list, onOpen }: { list: Venue[]; onOpen: (v: Venue) => void }) {
  const [open, setOpen] = useState(false);
  if (!list.length) return null;
  return (
    <section className="more">
      <button className="more-toggle" aria-expanded={open} onClick={() => setOpen(o => !o)}>
        <span>MORE OPTIONS · <span lang="zh-Hans">其他选择</span> ({list.length})</span>
        <ChevronDown size={18} className={open ? "flip" : ""} aria-hidden />
      </button>
      {open && (
        <ul className="more-list">
          {list.map(v => (
            <li key={v.id}>
              <button className="more-main" onClick={() => onOpen(v)}>
                <span className="more-name"><b>{v.venue}</b><StatusTag venue={v} /></span>
                <span className="mini">{v.area} · {v.music}</span>
                <span className="mini"><CrowdMeter venue={v} /> {v.solo} solo · {v.tableCulture} table · fit {fitScore(v).toFixed(1)}</span>
                <span className="more-why">{v.whyEn}</span>
              </button>
              <MapsLink venue={v} />
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

export default function NightlifeApp() {
  const [chosenDay, setChosenDay] = useState<DayId | null>(null);
  const [active, setActive] = useState<Filter[]>([]);
  const [sheet, setSheet] = useState<Venue | null>(null);

  // Read on the client only — the server snapshot is null, so there is nothing
  // to mismatch on hydration. Friday is the fallback when the trip is not live:
  // it is the one night whose crowd is not weather-dependent on evidence.
  const trip = useSyncExternalStore(subscribeTripState, currentTripState, () => null);
  const day: DayId = chosenDay ?? trip?.today ?? 21;
  const setDay = setChosenDay;

  const pool = useMemo(() => {
    const forDay = venues.filter(v => v.day === day && active.every(f => matches(v, f)));
    if (!active.length) {
      return [...forDay].sort((a, b) => roleRank[a.role] - roleRank[b.role] || fitScore(b) - fitScore(a));
    }
    // With filters on, the editorial roles no longer apply — rank by fit.
    return [...forDay].sort((a, b) => fitScore(b) - fitScore(a) || distanceRank[a.distance] - distanceRank[b.distance]);
  }, [day, active]);

  const primary = pool[0];
  const backup = pool[1];
  const rest = pool.slice(2);
  const dayData = days.find(d => d.id === day)!;
  const toggle = (f: Filter) => setActive(a => (a.includes(f) ? a.filter(x => x !== f) : [...a, f]));

  return (
    <>
      <a className="skip" href="#tonight">Skip to tonight&apos;s pick</a>
      <header className="topbar">
        <b>BKK / NIGHTLIFE</b>
        <span className="trip-state">{trip ? trip.label : " "}</span>
      </header>

      <main>
        <section className="hero">
          <h1>BANGKOK NIGHTLIFE <em>&apos;26</em></h1>
          <p>18–21 AUG · 4 NIGHTS · CROWD FIRST</p>
        </section>

        <nav className="days" aria-label="Choose night">
          {days.map(d => (
            <button key={d.id} className={day === d.id ? "on" : ""} aria-current={day === d.id} onClick={() => setDay(d.id)}>
              <b>{d.dow}</b><span>{d.date}</span>
            </button>
          ))}
        </nav>

        <div className="filterbar" role="group" aria-label="Quick filters">
          <button className={active.length ? "chip" : "chip on"} onClick={() => setActive([])}>Recommended</button>
          {FILTERS.map(f => (
            <button key={f} className={active.includes(f) ? "chip on" : "chip"} aria-pressed={active.includes(f)} onClick={() => toggle(f)}>{f}</button>
          ))}
        </div>

        <section className="dayline">
          <p>{dayData.full}</p>
          <h2>{dayData.headline}</h2>
          {dayData.arrivalNote && (
            <aside className="arrival" aria-label={dayData.arrivalNote.label}>
              <b>{dayData.arrivalNote.label}</b>
              <span lang="zh-Hans">{dayData.arrivalNote.zh}</span>
              <span>{dayData.arrivalNote.en}</span>
            </aside>
          )}
        </section>

        <div className="dashboard" id="tonight">
          {primary
            ? <PrimaryCard venue={primary} onOpen={() => setSheet(primary)} />
            : <p className="empty">No venue matches these filters. <button className="linkish" onClick={() => setActive([])}>Reset</button></p>}
          <div className="rail">
            {backup && <SwitchCard venue={backup} from={primary?.venue} onOpen={() => setSheet(backup)} />}
            <EventRadarPanel day={day} />
          </div>
        </div>

        <div className="lower">
          <ThirtyMinRule from={primary?.venue} to={backup?.venue} />
          <MoreOptions list={rest} onOpen={setSheet} />
        </div>

        <footer>
          <p>
            <Users size={15} aria-hidden />
            <span>Crowd, solo and social ratings are judgement calls from current venue reporting — not live occupancy or demographic data. Check line-ups on the day.</span>
          </p>
        </footer>
      </main>

      {primary && (
        <div className="mobilebar">
          <span>{dayData.dow} {dayData.date} · {primary.venue}</span>
          <span className="mobilebar-actions">
            <a href={primary.mapsUrl} target="_blank" rel="noopener noreferrer">Maps</a>
            <button onClick={() => setSheet(primary)}>Details</button>
          </span>
        </div>
      )}

      <AnimatePresence>{sheet && <VenueSheet key={sheet.id} venue={sheet} onClose={() => setSheet(null)} />}</AnimatePresence>
    </>
  );
}
