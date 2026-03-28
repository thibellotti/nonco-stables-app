// TODO: Add analytics after `npm install @vercel/analytics @vercel/speed-insights`
// import { Analytics } from "@vercel/analytics/next";
// import { SpeedInsights } from "@vercel/speed-insights/next";
// Then add <Analytics /> and <SpeedInsights /> inside <body>

import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Nonco Stables",
  description: "Institutional stablecoin settlement platform",
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
    apple: "/icon.svg",
  },
  openGraph: {
    title: "Nonco Stables",
    description: "Institutional stablecoin settlement platform",
    type: "website",
    siteName: "Nonco Stables",
  },
  twitter: {
    card: "summary",
    title: "Nonco Stables",
    description: "Institutional stablecoin settlement platform",
  },
};

export const viewport: Viewport = {
  themeColor: "#ffffff",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
