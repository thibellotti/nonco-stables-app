"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { navItems } from "@/lib/nav-items";

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden lg:flex flex-col fixed left-0 top-0 w-[220px] h-dvh bg-[var(--bg-card)] border-r border-[var(--border)] z-50">
      {/* Logo — aligned with header height (h-16 = 64px) */}
      <div className="h-16 flex items-center px-6 shrink-0 border-b border-[var(--border)]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/nonco-stables-logo.svg"
          alt="Nonco Stables"
          className="h-[14px] w-auto"
        />
      </div>

      {/* Navigation */}
      <nav aria-label="Main navigation" className="flex-1 space-y-1 overflow-y-auto pt-6">
        {navItems.map((item) => {
          const isActive =
            pathname === item.href || pathname.startsWith(item.href + "/");

          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive ? "page" : undefined}
              className={cn(
                "flex items-center px-6 py-3 transition-all duration-200",
                isActive
                  ? "text-[var(--cyan)] bg-[rgba(5,224,248,0.1)] font-bold border-l-4 border-[var(--cyan)]"
                  : "text-[var(--text-4)] hover:text-white hover:bg-[var(--bg-elevated)] border-l-4 border-transparent"
              )}
            >
              <span className="mr-3 shrink-0">{item.icon}</span>
              <span className="text-[11px] tracking-[0.15em] uppercase font-sans">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* User section */}
      <div className="px-6 pb-6 mt-auto">
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
            <span className="text-[10px] font-mono text-[var(--text-4)] uppercase">Verified Inst.</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
