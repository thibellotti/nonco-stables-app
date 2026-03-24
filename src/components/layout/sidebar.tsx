"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const navItems = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <rect x="1" y="1" width="7" height="7" rx="1" />
        <rect x="10" y="1" width="7" height="7" rx="1" />
        <rect x="1" y="10" width="7" height="7" rx="1" />
        <rect x="10" y="10" width="7" height="7" rx="1" />
      </svg>
    ),
  },
  {
    label: "RFQ",
    href: "/rfq",
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M1 13l4-4 3 3 5-5 4 4" />
        <path d="M13 5h4v4" />
      </svg>
    ),
  },
  {
    label: "Bank",
    href: "/bank",
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M2 7L9 2l7 5" />
        <path d="M4 7v7" />
        <path d="M8 7v7" />
        <path d="M12 7v7" />
        <path d="M16 7v7" />
        <path d="M2 14h14" />
        <path d="M1 17h16" />
      </svg>
    ),
  },
  {
    label: "Trades",
    href: "/trades",
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M1 5h12m0 0l-3-3m3 3l-3 3" />
        <path d="M17 13H5m0 0l3-3m-3 3l3 3" />
      </svg>
    ),
  },
  {
    label: "Settlements",
    href: "/settlements",
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <circle cx="9" cy="9" r="8" />
        <path d="M9 5v4l3 2" />
      </svg>
    ),
  },
  {
    label: "Wallet",
    href: "/wallet",
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <rect x="1" y="4" width="16" height="12" rx="2" />
        <path d="M1 8h16" />
        <circle cx="13" cy="12" r="1" fill="currentColor" />
        <path d="M4 4V3a2 2 0 012-2h6a2 2 0 012 2v1" />
      </svg>
    ),
  },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden lg:flex flex-col w-[220px] h-dvh bg-[var(--bg-card)] border-r border-[var(--border)] shrink-0">
      {/* Logo */}
      <div className="flex items-center gap-1.5 px-5 h-14 shrink-0">
        <span className="font-semibold text-white tracking-wider text-sm">
          NONCO
        </span>
        <span className="font-light text-[var(--text-3)] tracking-wider text-sm">
          STABLES
        </span>
      </div>

      {/* Subtle gradient divider below logo */}
      <div className="mx-4 h-px" style={{ background: 'linear-gradient(90deg, transparent, var(--border), transparent)' }} />

      {/* Navigation */}
      <nav className="flex-1 flex flex-col gap-0.5 px-3 pt-3 overflow-y-auto">
        {navItems.map((item) => {
          const isActive =
            pathname === item.href || pathname.startsWith(item.href + "/");

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "relative flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm transition-all duration-150",
                isActive
                  ? "text-[var(--cyan)] bg-[var(--cyan-dim)]"
                  : "text-[var(--text-3)] hover:text-[var(--text-2)] hover:bg-[var(--bg-elevated)]"
              )}
              style={isActive ? { boxShadow: 'inset 3px 0 0 var(--cyan)' } : undefined}
            >
              {item.icon}
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Bottom fade gradient into user section */}
      <div className="h-8 shrink-0 pointer-events-none" style={{ background: 'linear-gradient(to top, var(--bg-card), transparent)' }} />

      {/* Divider */}
      <div className="mx-4 h-px" style={{ background: 'linear-gradient(90deg, transparent, var(--border), transparent)' }} />

      {/* User section */}
      <div className="flex items-center gap-3 px-5 py-4 shrink-0">
        <div className="w-8 h-8 rounded-full bg-[var(--bg-elevated)] border border-[var(--border-subtle)] flex items-center justify-center text-[10px] font-medium text-[var(--text-3)]">
          TB
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-medium text-[var(--text-2)] truncate">
            Thiago Bellotti
          </p>
        </div>
        {/* Settings icon */}
        <button
          className="text-[var(--text-4)] hover:text-[var(--text-3)] transition-colors duration-150"
          aria-label="Settings"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <circle cx="8" cy="8" r="2.5" />
            <path d="M6.8 1.5h2.4l.4 1.8.9.4 1.6-.9 1.7 1.7-.9 1.6.4.9 1.8.4v2.4l-1.8.4-.4.9.9 1.6-1.7 1.7-1.6-.9-.9.4-.4 1.8H6.8l-.4-1.8-.9-.4-1.6.9-1.7-1.7.9-1.6-.4-.9-1.8-.4V6.8l1.8-.4.4-.9-.9-1.6 1.7-1.7 1.6.9.9-.4z" />
          </svg>
        </button>
      </div>
    </aside>
  );
}
