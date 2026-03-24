"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const tabs = [
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
    label: "Settle",
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

export function BottomTabs() {
  const pathname = usePathname();

  return (
    <nav aria-label="Mobile navigation" className="fixed bottom-0 inset-x-0 z-50 flex lg:hidden bg-black border-t border-[var(--border)]">
      <div className="flex w-full justify-around items-center h-16 pb-[env(safe-area-inset-bottom)]">
        {tabs.map((tab) => {
          const isActive =
            pathname === tab.href || pathname.startsWith(tab.href + "/");

          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={cn(
                "flex flex-col items-center justify-center gap-0.5 flex-1 py-2 transition-all duration-200",
                isActive
                  ? "text-[var(--cyan)]"
                  : "text-[var(--text-4)]"
              )}
            >
              <span
                className={cn(
                  "flex items-center justify-center",
                  isActive && "bg-[rgba(5,224,248,0.05)] rounded-full px-4 py-1"
                )}
              >
                {tab.icon}
              </span>
              <span className="text-[10px] font-mono uppercase tracking-widest mt-1">{tab.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
