import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main className="relative flex min-h-dvh items-center justify-center bg-black overflow-hidden">
      {/* Decorative glow — matches login page */}
      <div
        className="pointer-events-none fixed top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px]"
        style={{
          background: "rgba(5,224,248,0.05)",
          filter: "blur(120px)",
        }}
      />

      {/* Subtle grid background */}
      <div className="pointer-events-none fixed inset-0 data-grid-bg opacity-30" />

      {/* Content */}
      <div className="relative flex flex-col items-center text-center max-w-md px-6">
        {/* Logo */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/nonco-stables-logo.svg"
          alt="Nonco Stables"
          className="h-7 w-auto mb-12"
        />

        {/* 404 number */}
        <p className="font-mono text-8xl font-bold text-[var(--bg-bright)] leading-none tracking-tighter select-none">
          404
        </p>

        {/* Headline */}
        <h1 className="text-xl font-bold text-white mt-6">
          Page not found
        </h1>

        {/* Description */}
        <p className="text-sm text-[var(--text-3)] mt-3 leading-relaxed">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>

        {/* CTA */}
        <Link href="/dashboard" className="mt-8">
          <Button variant="cyan" size="md">
            Back to Dashboard
          </Button>
        </Link>
      </div>
    </main>
  );
}
