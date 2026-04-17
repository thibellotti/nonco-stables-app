import type { Metadata } from "next";

const TITLE = "Reports";
const DESC = "Exportable reports for accounting and compliance.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESC,
  alternates: { canonical: "/reports" },
  openGraph: {
    title: TITLE,
    description: DESC,
    url: "https://stables.nonco.com/reports",
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
