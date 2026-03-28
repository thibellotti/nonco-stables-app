"use client";

import Link from "next/link";

const actions = [
  { label: "Send", href: null, icon: <path d="M6 14L14 6M14 6H8M14 6v6" /> },
  { label: "Receive", href: null, icon: <path d="M14 6L6 14M6 14h6M6 14V8" /> },
  { label: "Convert", href: "/fx" as const, icon: <path d="M4 8h12M16 8l-3-3M16 12H4M4 12l3 3" /> },
  { label: "Earn", href: "/yield" as const, icon: <path d="M3 14l4-5 4 2.5L17 5M13 5h4v4" /> },
  { label: "Deposit", href: null, icon: <><path d="M10 4v12M10 16l-4-4M10 16l4-4" /><path d="M4 4h12" /></> },
];

export function QuickActions() {
  return (
    <div className="flex flex-wrap gap-2">
      {actions.map((a) => {
        const inner = (
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[rgba(255,255,255,0.04)] hover:bg-[rgba(255,255,255,0.08)] text-[12px] font-sans font-medium text-[var(--text-3)] hover:text-[var(--text)] transition-all whitespace-nowrap cursor-pointer">
            <svg width="14" height="14" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="opacity-40">{a.icon}</svg>
            {a.label}
          </span>
        );
        if (a.href) return <Link key={a.label} href={a.href}>{inner}</Link>;
        return <button key={a.label} type="button">{inner}</button>;
      })}
    </div>
  );
}
