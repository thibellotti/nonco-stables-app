import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Settlements",
  description: "Post-trade clearing and settlement tracking",
};

export default function SettlementsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
