"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";

const actions = [
  {
    label: "Send",
    href: null,
    color: "#f9e220",
    bg: "rgba(249,226,32,0.1)",
    borderHover: "rgba(249,226,32,0.25)",
    icon: (
      <svg width="16" height="16" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 14L14 6M14 6H8M14 6v6" />
      </svg>
    ),
  },
  {
    label: "Receive",
    href: null,
    color: "#22C55E",
    bg: "rgba(34,197,94,0.1)",
    borderHover: "rgba(34,197,94,0.25)",
    icon: (
      <svg width="16" height="16" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 6L6 14M6 14h6M6 14V8" />
      </svg>
    ),
  },
  {
    label: "Convert",
    href: "/fx",
    color: "#05E0F8",
    bg: "rgba(5,224,248,0.1)",
    borderHover: "rgba(5,224,248,0.25)",
    icon: (
      <svg width="16" height="16" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 8h12M16 8l-3-3M16 12H4M4 12l3 3" />
      </svg>
    ),
  },
  {
    label: "Earn",
    href: "/yield",
    color: "#a124f8",
    bg: "rgba(161,36,248,0.1)",
    borderHover: "rgba(161,36,248,0.25)",
    icon: (
      <svg width="16" height="16" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 14l4-5 4 2.5L17 5M13 5h4v4" />
      </svg>
    ),
  },
  {
    label: "Deposit",
    href: null,
    color: "#e5e2e1",
    bg: "rgba(255,255,255,0.06)",
    borderHover: "rgba(255,255,255,0.15)",
    icon: (
      <svg width="16" height="16" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M10 4v12M10 16l-4-4M10 16l4-4" />
        <path d="M4 4h12" />
      </svg>
    ),
  },
];

export function QuickActions() {
  return (
    <div className="flex flex-wrap gap-2">
      {actions.map((a) => {
        const inner = (
          <>
            <span
              className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-colors"
              style={{ backgroundColor: a.bg, color: a.color }}
            >
              {a.icon}
            </span>
            <span className="text-[13px] font-sans font-medium text-[var(--text)]">
              {a.label}
            </span>
          </>
        );

        const classes = cn(
          "inline-flex items-center gap-3 pl-2 pr-5 py-2 rounded-full",
          "border border-[var(--border)] bg-[var(--bg-card)]",
          "hover:bg-[var(--bg-elevated)] transition-all duration-200"
        );

        if (a.href) {
          return (
            <Link
              key={a.label}
              href={a.href}
              className={classes}
              style={{ ["--hover-border" as string]: a.borderHover }}
              onMouseEnter={(e) => (e.currentTarget.style.borderColor = a.borderHover)}
              onMouseLeave={(e) => (e.currentTarget.style.borderColor = "")}
            >
              {inner}
            </Link>
          );
        }

        return (
          <button
            key={a.label}
            type="button"
            className={cn(classes, "cursor-pointer")}
            onMouseEnter={(e) => (e.currentTarget.style.borderColor = a.borderHover)}
            onMouseLeave={(e) => (e.currentTarget.style.borderColor = "")}
          >
            {inner}
          </button>
        );
      })}
    </div>
  );
}
