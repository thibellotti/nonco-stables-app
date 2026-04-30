"use client";

import { useState, useCallback, useRef, useEffect } from "react";

interface CopyButtonProps {
  value: string;
  label?: string;
  // Visual variant: "icon" = small icon-only button, "pill" = label "Copy" / "Copied"
  variant?: "icon" | "pill";
  className?: string;
}

// Self-contained copy-to-clipboard button that shows a brief "Copied!" state.
// Intentionally does not depend on the toast context — feedback is local.
export function CopyButton({ value, label, variant = "icon", className }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const onCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => setCopied(false), 1800);
    } catch {
      /* ignore — user can still long-press to copy */
    }
  }, [value]);

  if (variant === "pill") {
    return (
      <button
        type="button"
        onClick={onCopy}
        aria-label={label ? `Copy ${label}` : "Copy"}
        className={
          "shrink-0 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-sans uppercase tracking-[.12em] transition-colors cursor-pointer " +
          (copied
            ? "bg-[var(--cyan-dim)] text-[var(--cyan)]"
            : "text-[var(--text-3)] hover:text-[var(--cyan)] hover:bg-[var(--cyan-wash)]") +
          (className ? ` ${className}` : "")
        }
      >
        {copied ? (
          <>
            <svg width="11" height="11" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M3 8.5l3 3 7-7" />
            </svg>
            Copied
          </>
        ) : (
          <>
            <svg width="11" height="11" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
              <rect x="5" y="5" width="9" height="9" rx="1.5" />
              <path d="M5 11H3a1 1 0 01-1-1V3a1 1 0 011-1h7a1 1 0 011 1v2" />
            </svg>
            Copy
          </>
        )}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={onCopy}
      aria-label={label ? `Copy ${label}` : "Copy"}
      className={
        "shrink-0 p-1 rounded transition-colors cursor-pointer " +
        (copied
          ? "text-[var(--cyan)] bg-[var(--cyan-wash)]"
          : "text-[var(--text-4)] hover:text-[var(--cyan)] hover:bg-[var(--cyan-wash)]") +
        (className ? ` ${className}` : "")
      }
    >
      {copied ? (
        <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M3 8.5l3 3 7-7" />
        </svg>
      ) : (
        <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden="true">
          <rect x="5" y="5" width="9" height="9" rx="1.5" />
          <path d="M5 11H3a1 1 0 01-1-1V3a1 1 0 011-1h7a1 1 0 011 1v2" />
        </svg>
      )}
    </button>
  );
}
