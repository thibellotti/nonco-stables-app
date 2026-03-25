import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Bank — Nonco Stables",
  description: "Treasury operations and banking flows",
};

export default function BankLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
