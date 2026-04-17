import type { Metadata } from "next";

const TITLE = "Settlements";
const DESC = "Pending and completed settlement pipeline.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESC,
  alternates: { canonical: "/settlements" },
  openGraph: {
    title: TITLE,
    description: DESC,
    url: "https://stables.nonco.com/settlements",
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

export default function SettlementsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
