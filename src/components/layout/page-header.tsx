"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const pageTitles: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/rfq": "RFQ",
  "/bank": "Bank",
  "/trades": "Trades",
  "/settlements": "Settlements",
  "/wallet": "Wallet",
};

const navLinks = [
  { label: "Dashboard", href: "/dashboard" },
  { label: "RFQ", href: "/rfq" },
  { label: "Trades", href: "/trades" },
  { label: "Settlements", href: "/settlements" },
  { label: "Bank", href: "/bank" },
  { label: "Wallet", href: "/wallet" },
];

export function PageHeader() {
  const pathname = usePathname();

  // Match the first segment to get the page title
  const segment = "/" + (pathname.split("/")[1] || "");
  const title = pageTitles[segment] || "Dashboard";

  return (
    <header className="fixed top-0 right-0 left-0 lg:left-[220px] h-16 z-40 bg-[rgba(0,0,0,0.8)] backdrop-blur-xl border-b border-[rgba(255,255,255,0.1)]">
      <div className="flex items-center justify-between h-full px-6 lg:px-8">
        {/* LEFT: Breadcrumb */}
        <div className="flex items-center gap-1.5">
          <span className="text-sm text-[#525252] font-mono">Nonco /</span>
          <span className="text-sm text-[var(--cyan)] font-bold">{title}</span>
        </div>

        {/* CENTER: Inline nav links (hidden on mobile) */}
        <nav className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => {
            const isActive =
              pathname === link.href || pathname.startsWith(link.href + "/");

            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "text-sm font-medium transition-opacity duration-200",
                  isActive
                    ? "text-[var(--cyan)] border-b-2 border-[var(--cyan)] pb-1"
                    : "text-[#525252] hover:text-[var(--cyan)]"
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* RIGHT: Notifications + Avatar */}
        <div className="flex items-center gap-4">
          {/* Notification bell */}
          <button
            className="relative text-[#525252] hover:text-white transition-colors duration-150"
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
              aria-hidden="true"
            >
              <path d="M13.73 13a2 2 0 01-1.46.63H5.73A2 2 0 014.27 13 6.27 6.27 0 013 9V7.5a6 6 0 0112 0V9a6.27 6.27 0 01-1.27 4z" />
              <path d="M7 14a2 2 0 004 0" />
            </svg>
            {/* Notification dot */}
            <span className="w-2 h-2 bg-[var(--cyan)] rounded-full absolute -top-0.5 -right-0.5 border-2 border-black" />
          </button>

          {/* User avatar */}
          <div className="w-8 h-8 rounded-full bg-[var(--bg-elevated)] border border-[rgba(255,255,255,0.1)] flex items-center justify-center text-[10px] font-bold text-white">
            TB
          </div>
        </div>
      </div>
    </header>
  );
}
