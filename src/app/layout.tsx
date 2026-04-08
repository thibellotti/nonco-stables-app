// TODO: Add analytics after `npm install @vercel/analytics @vercel/speed-insights`
// import { Analytics } from "@vercel/analytics/next";
// import { SpeedInsights } from "@vercel/speed-insights/next";
// Then add <Analytics /> and <SpeedInsights /> inside <body>

import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";

const spaceGrotesk = localFont({
  src: "../../public/fonts/SpaceGrotesk-Variable.woff2",
  variable: "--font-sans",
  display: "swap",
});

const jetbrainsMono = localFont({
  src: "../../public/fonts/JetBrainsMono-Variable.woff2",
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://stables.nonco.com"),
  title: {
    default: "Nonco Stables",
    template: "%s — Nonco Stables",
  },
  description: "Institutional stablecoin settlement platform — FX, bridge, yield, and payments across 6 chains.",
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
    apple: "/icon-192.png",
  },
  openGraph: {
    title: "Nonco Stables",
    description: "Institutional stablecoin settlement platform — FX, bridge, yield, and payments across 6 chains.",
    type: "website",
    siteName: "Nonco Stables",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "Nonco Stables" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Nonco Stables",
    description: "Institutional stablecoin settlement platform",
  },
};

export const viewport: Viewport = {
  themeColor: "#05E0F8",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${spaceGrotesk.variable} ${jetbrainsMono.variable}`} suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
