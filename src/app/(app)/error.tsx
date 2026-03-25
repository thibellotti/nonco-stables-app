"use client";

import { Button } from "@/components/ui/button";

// Shared error boundary for all (app) routes

export default function AppError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-6 text-center">
      {/* Warning icon — triangle with exclamation */}
      <div className="w-16 h-16 rounded-full bg-[rgba(245,158,11,0.1)] flex items-center justify-center mb-6">
        <svg
          width="32"
          height="32"
          viewBox="0 0 24 24"
          fill="none"
          stroke="var(--amber)"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
          <line x1="12" y1="9" x2="12" y2="13" />
          <line x1="12" y1="17" x2="12.01" y2="17" />
        </svg>
      </div>

      {/* Heading */}
      <h2 className="text-2xl font-bold text-white tracking-tight mb-3">
        Something went wrong
      </h2>

      {/* Error message */}
      <p className="font-mono text-xs text-[var(--text-4)] max-w-md truncate mb-8">
        {error.message || "An unexpected error occurred"}
      </p>

      {/* Try Again button */}
      <Button variant="cyan" onClick={reset}>
        Try Again
      </Button>

      {/* Digest for support */}
      {error.digest && (
        <p className="font-mono text-[11px] text-[var(--text-4)] mt-6 tracking-wider">
          Error ID: {error.digest}
        </p>
      )}
    </div>
  );
}
