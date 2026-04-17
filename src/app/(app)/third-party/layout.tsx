import type { Metadata } from "next";

const TITLE = "Third-party";
const DESC = "Third-party integrations and webhooks.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESC,
  alternates: { canonical: "/third-party" },
  openGraph: {
    title: TITLE,
    description: DESC,
    url: "https://stables.nonco.com/third-party",
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
