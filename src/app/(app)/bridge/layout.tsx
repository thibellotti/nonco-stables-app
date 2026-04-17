import type { Metadata } from "next";

const TITLE = "Bridge";
const DESC = "Cross-chain stablecoin bridging.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESC,
  alternates: { canonical: "/bridge" },
  openGraph: {
    title: TITLE,
    description: DESC,
    url: "https://stables.nonco.com/bridge",
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

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
