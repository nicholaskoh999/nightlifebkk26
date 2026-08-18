import type { Metadata, Viewport } from "next";
import "./styles.css";

export const viewport: Viewport = {
  themeColor: "#0a0b10",
  // viewportFit: cover is what makes env(safe-area-inset-*) resolve on iOS.
  viewportFit: "cover",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  title: "Bangkok Nightlife 2026 | Nicholas' 4-Night Club Guide",
  description: "Crowd-first, solo-friendly Bangkok club plan for 19–22 August 2026.",
  icons: { icon: [{ url: "/favicon-32.png", sizes: "32x32", type: "image/png" }, { url: "/favicon-16.png", sizes: "16x16", type: "image/png" }], apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }] },
  openGraph: { title: "Bangkok Nightlife 2026", description: "Crowd-first club picks, a switch plan for every night, and honest evidence labels.", type: "website", images: ["/og.png"] },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <html lang="en"><body>{children}</body></html>;
}
