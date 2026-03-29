import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Trades",
  description: "Execution history and trade records",
};

export default function TradesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
