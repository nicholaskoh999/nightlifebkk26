"use client";
import { Flame, MapPin } from "lucide-react";
import { fitBadge, type Venue } from "../data/nightlife";

export const statusClass = (s: string) => `status s-${s.toLowerCase().replaceAll(" ", "-")}`;

export function StatusTag({ venue }: { venue: Venue }) {
  return <b className={statusClass(venue.status)} title={venue.statusNote}>{venue.status}</b>;
}

/** External links always open safely in a new tab. */
export function MapsLink({ venue, className = "btn-ghost" }: { venue: Venue; className?: string }) {
  return (
    <a className={className} href={venue.mapsUrl} target="_blank" rel="noopener noreferrer">
      <MapPin size={15} aria-hidden />Maps<span className="sr-only"> — {venue.venue} on Google Maps</span>
    </a>
  );
}

export function CrowdMeter({ venue }: { venue: Venue }) {
  const label = venue.crowd === 5 ? "VERY HIGH" : venue.crowd === 4 ? "HIGH" : "EVENT-DEPENDENT";
  return (
    <span className="flames" role="img" aria-label={`Crowd ${venue.crowd} of 5 — ${label}`}>
      {[3, 4, 5].map(i => <Flame key={i} size={14} fill={i <= venue.crowd ? "currentColor" : "none"} aria-hidden />)}
    </span>
  );
}

/** The five axes, kept separate so no single star rating means five things. */
export function FitGrid({ venue }: { venue: Venue }) {
  const crowdText = venue.crowd === 5 ? "Very high" : venue.crowd === 4 ? "High" : "Event-dependent";
  const cells: [string, string, string][] = [
    ["CROWD", crowdText, `crowd-${venue.crowd}`],
    ["USER FIT", `${fitBadge(venue)} / 5`, "fit"],
    ["SOLO", venue.solo, `v-${venue.solo.toLowerCase().replaceAll(" ", "-")}`],
    ["SOCIAL", venue.social, `v-${venue.social.toLowerCase().replaceAll(" ", "-")}`],
    ["TABLE", venue.tableCulture, `v-table-${venue.tableCulture.toLowerCase()}`],
  ];
  return (
    <dl className="fitgrid">
      {cells.map(([k, v, cls]) => (
        <div key={k} className={cls}>
          <dt>{k}</dt>
          <dd>{v}</dd>
        </div>
      ))}
    </dl>
  );
}

export function Budget({ venue }: { venue: Venue }) {
  const p = venue.pricing;
  return (
    <dl className="budget" aria-label="Budget">
      <div><dt>ENTRY</dt><dd>{p.entry}</dd></div>
      <div><dt>DRINK</dt><dd>{p.drink}</dd></div>
      <div><dt>SOLO NIGHT</dt><dd>{p.soloNight}</dd></div>
      <div><dt>TABLE</dt><dd>{p.table}</dd></div>
    </dl>
  );
}
