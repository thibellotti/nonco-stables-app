import type { Metadata } from "next";

const TITLE = "Sign in";
const DESC = "Sign in to Nonco Stables.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESC,
  alternates: { canonical: "/login" },
  openGraph: {
    title: TITLE,
    description: DESC,
    url: "https://stables.nonco.com/login",
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

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
