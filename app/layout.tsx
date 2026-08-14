import type { Metadata } from "next";
import "./styles.css";
import "./day-selector.css";

export const metadata: Metadata = {
  title: "Bangkok Nightlife 2026 | Nicholas' 4-Night Club Guide",
  description: "Crowd-first Bangkok club guide for 18–21 August 2026.",
  openGraph: { title: "Bangkok Nightlife 2026", description: "Crowd-first club picks, special events, and solo-friendly backups.", type: "website", images: ["/og.png"] },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <html lang="zh-Hans"><body>{children}</body></html>;
}
