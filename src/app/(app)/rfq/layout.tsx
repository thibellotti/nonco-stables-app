import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "RFQ — Nonco Stables",
  description: "Request for quote and pricing",
};

export default function RFQLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
