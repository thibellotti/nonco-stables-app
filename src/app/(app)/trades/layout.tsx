import type { Metadata } from "next";

const TITLE = "Trades";
const DESC = "Executed trades and fill history.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESC,
  alternates: { canonical: "/trades" },
  openGraph: {
    title: TITLE,
    description: DESC,
    url: "https://stables.nonco.com/trades",
    type: "website",
    images: [{ url: "https://stables.nonco.com/opengraph-image", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESC,
    images: ["https://stables.nonco.com/opengraph-image"],
  },
};

export default function TradesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
