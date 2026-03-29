import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Wallet",
  description: "Digital asset management",
};

export default function WalletLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
