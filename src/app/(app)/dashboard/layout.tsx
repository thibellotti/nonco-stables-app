import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard — Nonco Stables",
  description: "Portfolio overview and recent transactions",
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
