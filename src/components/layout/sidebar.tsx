"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { navGroups } from "@/lib/nav-items";

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

      {/* Account selector */}
      <div className="mx-3 mt-3">
        <div className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg border border-[var(--border)] bg-[var(--bg-elevated)] cursor-pointer hover:border-[var(--border-outline)] transition-colors">
          <div className="w-2 h-2 rounded-full bg-[var(--cyan)] shrink-0" />
          <span className="text-[12px] font-medium text-[var(--text)] flex-1">Treasury 01</span>
          <span className="text-[10px] font-bold text-[var(--cyan)] bg-[var(--cyan-dim)] px-1.5 py-0.5 rounded">Verified</span>
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true" className="shrink-0 text-[var(--text-4)]">
            <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </div>

      {/* Navigation */}
      <nav aria-label="Main navigation" className="flex-1 overflow-y-auto scrollbar-none pt-3 pb-3">
        {navGroups.map((group) => (
          <div key={group.label} className="mb-1">
            <div className="px-5 pt-3 pb-1.5">
              <span className="text-[11px] font-bold uppercase tracking-[0.1em] text-[var(--text-4)]">
                {group.label}
              </span>
            </div>
            {group.items.map((item) => {
              const isActive =
                pathname === item.href || pathname.startsWith(item.href + "/");

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={isActive ? "page" : undefined}
                  className={cn(
                    "relative flex items-center px-5 py-2 transition-all duration-200",
                    isActive
                      ? "text-[var(--cyan)] bg-[rgba(5,224,248,0.08)]"
                      : "text-[var(--text-4)] hover:text-[var(--text)] hover:bg-[var(--bg-elevated)]"
                  )}
                >
                  {isActive && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 rounded-r-full bg-[var(--cyan)]" />
                  )}
                  <span className="mr-3 shrink-0">{item.icon}</span>
                  <span className="text-[12.5px] tracking-normal font-sans">{item.label}</span>
                  {item.badge && (
                    <span className="ml-auto text-[10px] font-bold bg-[var(--red-dim)] text-[var(--red)] px-1.5 py-0.5 rounded-full">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      {/* User section */}
      <div className="px-4 pb-4 mt-auto">
        <div className="flex items-center gap-3 py-3 border-t border-[var(--border)]">
          <div className="w-8 h-8 rounded-full bg-[rgba(5,224,248,0.12)] flex items-center justify-center shrink-0">
            <span className="text-[10px] font-bold text-[var(--cyan)]">FM</span>
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-[12px] font-medium text-[var(--text)] truncate">Fernando M.</span>
            <span className="text-[10px] text-[var(--text-4)]">Admin</span>
          </div>
          <div className="ml-auto w-1.5 h-1.5 rounded-full bg-[var(--cyan)]" />
        </div>
      </div>
    </aside>
  );
}
