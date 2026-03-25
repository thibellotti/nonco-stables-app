"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function AppError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const [detailsOpen, setDetailsOpen] = useState(false);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-6 text-center">
      {/* Red circle with exclamation mark */}
      <div className="w-16 h-16 rounded-full bg-[var(--red-dim)] flex items-center justify-center mb-6">
        <svg
          width="32"
          height="32"
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden="true"
        >
          <circle
            cx="12"
            cy="12"
            r="10"
            stroke="var(--red)"
            strokeWidth="1.5"
          />
          <line
            x1="12"
            y1="8"
            x2="12"
            y2="13"
            stroke="var(--red)"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <circle cx="12" cy="16.5" r="0.75" fill="var(--red)" />
        </svg>
      </div>

      {/* Heading */}
      <h2 className="text-2xl font-bold text-white tracking-tight mb-3">
        Something went wrong
      </h2>

      {/* Description */}
      <p className="text-sm text-[var(--text-3)] max-w-sm mb-8">
        An unexpected error occurred. Please try again.
      </p>

      {/* Actions */}
      <div className="flex items-center gap-3 mb-6">
        <Button variant="cyan" onClick={reset}>
          Try Again
        </Button>
        <Link href="/dashboard">
          <Button variant="ghost">Back to Dashboard</Button>
        </Link>
      </div>

      {/* Collapsible error details */}
      {error.message && (
        <div className="w-full max-w-md">
          <button
            type="button"
            onClick={() => setDetailsOpen(!detailsOpen)}
            className="inline-flex items-center gap-1.5 text-xs text-[var(--text-4)] hover:text-[var(--text-3)] transition-colors cursor-pointer"
          >
            <svg
              width="12"
              height="12"
              viewBox="0 0 12 12"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className={`transition-transform duration-200 ${detailsOpen ? "rotate-90" : ""}`}
              aria-hidden="true"
            >
              <path d="M4.5 2.5L8 6L4.5 9.5" />
            </svg>
            Details
          </button>

          {detailsOpen && (
            <div className="mt-2 bg-[var(--bg-elevated)] border border-[var(--border)] rounded-lg px-4 py-3 text-left">
              <p className="font-mono text-xs text-[var(--text-4)] break-all leading-relaxed">
                {error.message}
              </p>
              {error.digest && (
                <p className="font-mono text-[11px] text-[var(--text-4)] mt-2 pt-2 border-t border-[var(--border)]">
                  Digest: {error.digest}
                </p>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
