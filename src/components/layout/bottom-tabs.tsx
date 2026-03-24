"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const tabs = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
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
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2 14l4-4 3 3 5-5 4 4" />
        <path d="M14 6h4v4" />
      </svg>
    ),
  },
  {
    label: "Bank",
    href: "/bank",
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
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
    label: "Wallet",
    href: "/wallet",
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
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
    <nav className="fixed bottom-0 inset-x-0 z-50 flex lg:hidden bg-[var(--bg-card)] border-t border-[var(--border)]">
      <div className="flex w-full justify-around items-center h-16 pb-[env(safe-area-inset-bottom)]">
        {tabs.map((tab) => {
          const isActive =
            pathname === tab.href || pathname.startsWith(tab.href + "/");

          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={cn(
                "flex flex-col items-center justify-center gap-1 flex-1 py-2 transition-colors duration-150",
                isActive
                  ? "text-[var(--cyan)]"
                  : "text-[var(--text-4)]"
              )}
            >
              {tab.icon}
              <span className="text-[10px] font-medium">{tab.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
