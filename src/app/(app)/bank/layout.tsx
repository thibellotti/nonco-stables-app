import type { Metadata } from "next";

const TITLE = "Bank";
const DESC = "Connected bank accounts and fiat rails.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESC,
  alternates: { canonical: "/bank" },
  openGraph: {
    title: TITLE,
    description: DESC,
    url: "https://stables.nonco.com/bank",
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

export default function BankLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
