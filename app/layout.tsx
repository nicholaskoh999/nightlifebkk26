import type { Metadata } from "next";
import "./styles.css";
import "./day-selector.css";
import "./copy-pass.css";
import "./night-theme.css";

export const metadata: Metadata = {
  title: "Bangkok Nightlife 2026 | Nicholas' 4-Night Club Guide",
  description: "Crowd-first Bangkok club guide for 18–21 August 2026.",
  icons: { icon: [{ url: "/favicon-32.png", sizes: "32x32", type: "image/png" }, { url: "/favicon-16.png", sizes: "16x16", type: "image/png" }], apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }] },
  openGraph: { title: "Bangkok Nightlife 2026", description: "Crowd-first club picks, special events, and solo-friendly backups.", type: "website", images: ["/og.png"] },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <html lang="zh-Hans"><body>{children}</body></html>;
}
