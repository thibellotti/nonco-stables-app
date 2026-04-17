import type { Metadata } from "next";

const TITLE = "Dashboard";
const DESC = "Portfolio overview, balances, and quick actions.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESC,
  alternates: { canonical: "/dashboard" },
  openGraph: {
    title: TITLE,
    description: DESC,
    url: "https://stables.nonco.com/dashboard",
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

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
