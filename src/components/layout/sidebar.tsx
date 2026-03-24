"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const navItems = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <rect x="2" y="2" width="7" height="7" rx="1" />
        <rect x="11" y="2" width="7" height="7" rx="1" />
        <rect x="2" y="11" width="7" height="7" rx="1" />
        <rect x="11" y="11" width="7" height="7" rx="1" />
      </svg>
    ),
  },
  {
    label: "RFQ",
    href: "/rfq",
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M2 14l4-4 3 3 5-5 4 4" />
        <path d="M14 6h4v4" />
      </svg>
    ),
  },
  {
    label: "Bank",
    href: "/bank",
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M3 8L10 3l7 5" />
        <path d="M5 8v7" />
        <path d="M9 8v7" />
        <path d="M13 8v7" />
        <path d="M17 8v7" />
        <path d="M3 15h14" />
        <path d="M2 18h16" />
      </svg>
    ),
  },
  {
    label: "Trades",
    href: "/trades",
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M2 6h12m0 0l-3-3m3 3l-3 3" />
        <path d="M18 14H6m0 0l3-3m-3 3l3 3" />
      </svg>
    ),
  },
  {
    label: "Settlements",
    href: "/settlements",
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <circle cx="10" cy="10" r="8" />
        <path d="M10 6v4l3 2" />
      </svg>
    ),
  },
  {
    label: "Wallet",
    href: "/wallet",
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <rect x="2" y="5" width="16" height="12" rx="2" />
        <path d="M2 9h16" />
        <circle cx="14" cy="13" r="1" fill="currentColor" />
        <path d="M5 5V4a2 2 0 012-2h6a2 2 0 012 2v1" />
      </svg>
    ),
  },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden lg:flex flex-col fixed left-0 top-0 w-[220px] h-dvh bg-[#141414] border-r border-[#333] z-50">
      {/* Logo — aligned with header height (h-16 = 64px) */}
      <div className="h-16 flex items-center px-6 shrink-0 border-b border-[rgba(255,255,255,0.05)]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/nonco-stables-logo.svg"
          alt="Nonco Stables"
          className="h-[14px] w-auto"
        />
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 overflow-y-auto pt-6">
        {navItems.map((item) => {
          const isActive =
            pathname === item.href || pathname.startsWith(item.href + "/");

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center px-6 py-3 transition-all duration-200",
                isActive
                  ? "text-[var(--cyan)] bg-[rgba(5,224,248,0.1)] font-bold border-l-4 border-[var(--cyan)]"
                  : "text-[#737373] hover:text-white hover:bg-[var(--bg-elevated)]"
              )}
            >
              <span className="mr-3 shrink-0">{item.icon}</span>
              <span className="text-[10px] tracking-[0.15em] uppercase font-mono">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* User section */}
      <div className="px-6 mt-auto">
        <div className="bg-[var(--bg-elevated)] rounded-lg p-3 flex items-center gap-3">
          {/* Avatar */}
          <div className="w-8 h-8 rounded-full bg-[rgba(5,224,248,0.2)] border border-[rgba(5,224,248,0.3)] flex items-center justify-center shrink-0">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <circle cx="8" cy="5.5" r="3" stroke="var(--cyan)" strokeWidth="1.2" />
              <path d="M2.5 14.5c0-3 2.5-4.5 5.5-4.5s5.5 1.5 5.5 4.5" stroke="var(--cyan)" strokeWidth="1.2" strokeLinecap="round" />
            </svg>
          </div>
          {/* User info */}
          <div className="flex flex-col min-w-0">
            <span className="text-[10px] font-mono text-white truncate">TREASURY_01</span>
            <span className="text-[8px] font-mono text-[#737373] uppercase">Verified Inst.</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
