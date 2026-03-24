"use client";

import { usePathname } from "next/navigation";

const pageTitles: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/rfq": "RFQ",
  "/bank": "Bank",
  "/trades": "Trades",
  "/settlements": "Settlements",
  "/wallet": "Wallet",
};

export function PageHeader() {
  const pathname = usePathname();

  // Match the first segment to get the page title
  const segment = "/" + (pathname.split("/")[1] || "");
  const title = pageTitles[segment] || "Dashboard";

  return (
    <header className="hidden lg:flex items-center justify-between h-14 px-8 border-b border-[var(--border)] shrink-0 bg-[var(--bg)]">
      {/* Page title */}
      <h1 className="text-sm font-medium text-[var(--text)]">{title}</h1>

      {/* Right side: notification + avatar */}
      <div className="flex items-center gap-4">
        {/* Notification bell */}
        <button
          className="relative text-[var(--text-4)] hover:text-[var(--text-3)] transition-colors duration-150"
          aria-label="Notifications"
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 18 18"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M13.73 13a2 2 0 01-1.46.63H5.73A2 2 0 014.27 13 6.27 6.27 0 013 9V7.5a6 6 0 0112 0V9a6.27 6.27 0 01-1.27 4z" />
            <path d="M7 14a2 2 0 004 0" />
          </svg>
          {/* Notification dot */}
          <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-[var(--cyan)] rounded-full" />
        </button>

        {/* User avatar */}
        <div className="w-7 h-7 rounded-full bg-[var(--bg-elevated)] border border-[var(--border-subtle)] flex items-center justify-center text-[10px] font-medium text-[var(--text-3)]">
          TB
        </div>
      </div>
    </header>
  );
}
