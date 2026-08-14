"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ChevronRight, MapPin, Music2, Users, X } from "lucide-react";
import { useMemo, useState } from "react";
import { days, venues, type Venue } from "./data/nightlife";

const filters = ["最多人", "Ladies Night", "Special Event", "Dancefloor", "Solo", "No table required", "Hip-Hop", "EDM", "Hard Techno", "Near hotel"] as const;
const distanceRank = { "VERY NEAR": 0, NEAR: 1, MODERATE: 2, FARTHER: 3 };
const fire = (n: number) => "🔥".repeat(n);

function matches(venue: Venue, filter: string) {
  const text = `${venue.event} ${venue.music}`.toLowerCase();
  if (filter === "最多人") return venue.crowd === 5;
  if (filter === "Ladies Night") return text.includes("ladies");
  if (filter === "Special Event") return venue.status === "VERIFIED" && !!venue.event;
  if (filter === "Dancefloor") return venue.dancefloor === "Excellent" || venue.dancefloor === "Good";
  if (filter === "Solo") return venue.solo === "Very Easy" || venue.solo === "Easy";
  if (filter === "No table required") return venue.tableRequired === "No";
  if (filter === "Near hotel") return venue.distance === "VERY NEAR" || venue.distance === "NEAR";
  return text.includes(filter.toLowerCase());
}

function Card({ venue, chosen, onChoose, onOpen }: { venue: Venue; chosen: boolean; onChoose: () => void; onOpen: () => void }) {
  return <motion.article initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className={`card ${venue.role} ${chosen ? "chosen" : ""}`}>
    <div className="cardtop"><div><p>{venue.role === "primary" ? "PRIMARY" : "BACKUP"}</p><h2>{venue.venue}</h2></div><b className="status">{venue.status}</b></div>
    {venue.event && <div className="event">{venue.event}</div>}
    <div className="crowd"><span>Crowd Confidence <i title="Estimate based on programming and recurring patterns, never live occupancy.">{fire(venue.crowd)}</i></span><strong>{venue.crowd === 5 ? "VERY HIGH" : venue.crowd === 4 ? "HIGH" : "EVENT-DEPENDENT"}</strong></div>
    <p className="why">{venue.why}</p>{venue.warning && <p className="warning">{venue.warning}</p>}
    <div className="metrics"><span><small>Dancefloor</small>{venue.dancefloor}</span><span><small>Solo</small>{venue.solo}</span><span><small>Table required</small>{venue.tableRequired}</span><span><small>Table culture</small>{venue.tableCulture}</span></div>
    <div className="actions"><button onClick={onOpen}>Details</button><a href={venue.officialVenueUrl} target="_blank" rel="noreferrer">Maps</a><button className="choose" onClick={onChoose}>{chosen ? "Selected" : "Choose"}</button></div>
  </motion.article>;
}

export default function NightlifeApp() {
  const reduce = useReducedMotion();
  const [day, setDay] = useState(1);
  const [active, setActive] = useState<string[]>([]);
  const [selected, setSelected] = useState<Record<number, string>>(() => {
    if (typeof window === "undefined") return {};
    try { return JSON.parse(localStorage.getItem("nightlife-venue-keys") || "{}"); } catch { return {}; }
  });
  const [drawer, setDrawer] = useState<Venue | null>(null);
  const [near, setNear] = useState(false);
  const all = useMemo(() => venues.filter(v => v.day === day).filter(v => active.every(f => matches(v, f))).sort((a, b) => near ? distanceRank[a.distance] - distanceRank[b.distance] || a.role.localeCompare(b.role) : a.role.localeCompare(b.role)), [day, active, near]);
  const select = (venue: Venue) => { const next = { ...selected, [venue.day]: venue.venueKey }; setSelected(next); localStorage.setItem("nightlife-venue-keys", JSON.stringify(next)); };
  const duplicate = drawer && Object.entries(selected).some(([d, key]) => Number(d) !== drawer.day && key === drawer.venueKey);
  return <main>
    <header><b>BANGKOK / NIGHT</b><span>18–21 AUG 2026</span></header>
    <section className="hero"><p>PERSONAL CLUB DECISION GUIDE</p><h1>Bangkok<br /><em>Nightlife</em></h1><strong>人多优先 · 不开桌也能玩 · solo-first</strong></section>
    <nav className="days">{days.map(d => <button className={day === d.id ? "on" : ""} onClick={() => { setDay(d.id); setNear(false); }} key={d.id}><b>D{d.id}</b><span>{d.label.split(" · ")[0]}</span></button>)}</nav>
    <section className="control"><div className="quick"><b>{days.find(d => d.id === day)?.pick}</b><span>{day === 1 ? "✈ Arrival Night · realistic start 00:15–01:00" : "人多概率最高 + 当晚活动 + 不用一定开桌"}</span></div><div className="chips">{filters.map(f => <button className={active.includes(f) ? "on" : ""} key={f} onClick={() => setActive(x => x.includes(f) ? x.filter(y => y !== f) : [...x, f])}>{f}</button>)}</div></section>
    <section className="guide"><div className="headline"><div><p>{days.find(d => d.id === day)?.label}</p><h2>Tonight&apos;s pick</h2></div><span>Last verified · 14 Aug 2026</span></div>{day === 1 && <p className="arrival">✈ Arrival Night: proximity is weighted higher. Dope &amp; Dirty remains event-dependent until a specific Tue programme is confirmed.</p>}<div className="cards">{all.map(v => <Card key={v.id} venue={v} chosen={selected[v.day] === v.venueKey} onChoose={() => select(v)} onOpen={() => setDrawer(v)} />)}</div></section>
    <section className="helper"><p>QUICK DECISION</p><h2>懒得选？按现在的心情。</h2><div>{[["我要最多人", "最多人"], ["比较容易 social", "Ladies Night"], ["真正 dancefloor", "Dancefloor"], ["不要 Techno", "Hip-Hop"], ["不要开桌", "No table required"]].map(([label, filter]) => <button key={label} onClick={() => { setActive([filter]); setNear(false); }}>{label}<ChevronRight size={16} /></button>)}<button onClick={() => { setNear(true); setActive([]); }}>今晚很累，只想近<MapPin size={16} /></button></div></section>
    <section className="drinks"><p>ONE-PERSON DRINK GUIDE</p><h2>Easy to order. Easy to judge.</h2><div>{[["Whisky Highball", "Simple and easy to judge."], ["Vodka Soda", "Single spirit + mixer."], ["Gin & Tonic", "Universal, predictable single."], ["Beer", "Slowest and easiest to control."], ["Cocktails", "Sweet drinks can hide strength."]].map(([name, note]) => <article key={name}><Music2 size={17} /><b>{name}</b><span>{note}</span></article>)}</div><strong>1 drink → enjoy the club → water → decide whether to order another</strong></section>
    <footer><Users size={18} /> Crowd confidence is an estimate, not live occupancy. Budget: ฿ ≤800 · ฿฿ 800–1,500 · ฿฿฿ 1,500–2,500+ (ESTIMATE)</footer>
    <AnimatePresence>{drawer && <motion.div className="backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setDrawer(null)}><motion.aside initial={reduce ? {} : { x: 480 }} animate={{ x: 0 }} exit={reduce ? {} : { x: 480 }} onClick={e => e.stopPropagation()}><button className="close" onClick={() => setDrawer(null)} aria-label="Close"><X /></button><p>{drawer.area} · {drawer.distance} from TRIBE Sukhumvit 39</p><h2>{drawer.venue}</h2>{drawer.event && <div className="event">{drawer.event}</div>}<b className="status">{drawer.status}</b><dl><div><dt>Why tonight</dt><dd>{drawer.why}</dd></div><div><dt>Music</dt><dd>{drawer.music}</dd></div><div><dt>Dancefloor</dt><dd>{drawer.dancefloor}</dd></div><div><dt>Table model</dt><dd>Required: {drawer.tableRequired} · Culture: {drawer.tableCulture}</dd></div><div><dt>Solo</dt><dd>{drawer.solo}</dd></div><div><dt>Budget</dt><dd>{drawer.budget} · ESTIMATE, no VIP table</dd></div><div><dt>Arrival</dt><dd>{drawer.arrival}</dd></div><div><dt>Sources</dt><dd><a href={drawer.officialVenueUrl} target="_blank" rel="noreferrer">Official venue / map</a>{drawer.eventSourceUrl && <> · <a href={drawer.eventSourceUrl} target="_blank" rel="noreferrer">Event source</a></>}</dd></div></dl>{duplicate && <p className="repeat">你已经去过这家了<br />建议选下一个 Backup</p>}</motion.aside></motion.div>}</AnimatePresence>
  </main>;
}
