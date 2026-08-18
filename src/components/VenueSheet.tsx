"use client";
import { motion, useReducedMotion } from "framer-motion";
import { X } from "lucide-react";
import { useEffect, useRef } from "react";
import { BASE, fitScore, FIT_WEIGHTS, type Venue } from "../data/nightlife";
import { Budget, CrowdMeter, FitGrid, StatusTag } from "./Bits";

/** Bottom sheet on mobile, side sheet on desktop. Escape closes, body never scrolls behind it. */
export default function VenueSheet({ venue, onClose }: { venue: Venue; onClose: () => void }) {
  const reduce = useReducedMotion();
  const panel = useRef<HTMLElement>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    panel.current?.focus();
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [onClose]);

  return (
    <motion.div className="backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}>
      <motion.aside
        ref={panel}
        role="dialog"
        aria-modal="true"
        aria-label={`${venue.venue} details`}
        tabIndex={-1}
        className="sheet"
        initial={reduce ? {} : { y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={reduce ? {} : { y: 40, opacity: 0 }}
        onClick={e => e.stopPropagation()}
      >
        <header className="sheet-head">
          <span>{venue.area}</span>
          <button className="icon-btn" onClick={onClose} aria-label="Close details"><X size={20} aria-hidden /></button>
        </header>

        <div className="sheet-body">
          <p className="sheet-kicker"><StatusTag venue={venue} /> <span>{venue.distance} from {BASE}</span></p>
          <h2>{venue.venue}</h2>
          {venue.event && <p className="event-chip">{venue.event}</p>}
          {venue.warning && <p className="warn">{venue.warning}</p>}

          <p className="why"><b lang="zh-Hans">为什么</b><span lang="zh-Hans">{venue.whyZh}</span><span>{venue.whyEn}</span></p>
          <FitGrid venue={venue} />

          <dl className="rows">
            <div><dt>Crowd</dt><dd><CrowdMeter venue={venue} /> {venue.crowdNote}</dd></div>
            <div><dt>Music</dt><dd>{venue.music}</dd></div>
            <div><dt>Dancefloor</dt><dd>{venue.dancefloor}</dd></div>
            <div><dt>Asian / local mix</dt><dd>{venue.asianMix} <small>— based on venue positioning and typical reported audience, not demographic data.</small></dd></div>
            <div><dt>Arrive</dt><dd>{venue.arrival}</dd></div>
          </dl>

          <h3>Budget</h3>
          <Budget venue={venue} />
          <p className="fineprint">{venue.pricing.entryNote}</p>

          <h3>User fit · {fitScore(venue).toFixed(1)} / 5</h3>
          <ul className="weights">
            {FIT_WEIGHTS.map(w => <li key={w.key}><span>{w.key}</span><b>{Math.round(w.weight * 100)}%</b></li>)}
          </ul>

          <h3>Evidence</h3>
          <p className="fineprint">{venue.statusNote}</p>
          <p className="sources">
            <a href={venue.mapsUrl} target="_blank" rel="noopener noreferrer">Google Maps</a>
            {venue.officialUrl && <a href={venue.officialUrl} target="_blank" rel="noopener noreferrer">Official</a>}
            {venue.instagramUrl && <a href={venue.instagramUrl} target="_blank" rel="noopener noreferrer">Instagram</a>}
            {venue.eventSourceUrl && <a href={venue.eventSourceUrl} target="_blank" rel="noopener noreferrer">Event source</a>}
          </p>
          <p className="fineprint">Last checked {venue.lastVerified}.</p>
        </div>
      </motion.aside>
    </motion.div>
  );
}
