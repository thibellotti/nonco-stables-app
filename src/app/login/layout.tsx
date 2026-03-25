import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign In — Nonco Stables",
  description: "Sign in to your institutional account",
};

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
