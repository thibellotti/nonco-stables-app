"use client";

import { usePathname } from "next/navigation";
import { NotificationCenter } from "./notification-center";

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
    <header className="fixed top-0 right-0 left-0 lg:left-[220px] h-16 z-40 bg-[rgba(0,0,0,0.8)] backdrop-blur-xl border-b border-[var(--border)]">
      <div className="flex items-center justify-between h-full px-6 lg:px-8">
        {/* LEFT: Breadcrumb */}
        <div className="flex items-center gap-1.5">
          <span className="text-sm text-[var(--text-4)] font-sans">Nonco /</span>
          <span className="text-sm text-white font-medium">{title}</span>
        </div>

        {/* RIGHT: Notifications + Avatar */}
        <div className="flex items-center gap-4">
          {/* Notification center */}
          <NotificationCenter />

          {/* User avatar */}
          <div className="w-8 h-8 rounded-full bg-[var(--bg-elevated)] border border-[var(--border)] flex items-center justify-center text-[10px] font-bold text-white">
            TB
          </div>
        </div>
      </div>
    </header>
  );
}
