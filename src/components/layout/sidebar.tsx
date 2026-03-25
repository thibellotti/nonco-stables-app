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
      <nav aria-label="Main navigation" className="flex-1 space-y-0.5 overflow-y-auto pt-6">
        {navItems.map((item) => {
          const isActive =
            pathname === item.href || pathname.startsWith(item.href + "/");

          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive ? "page" : undefined}
              className={cn(
                "relative flex items-center px-5 py-2.5 transition-all duration-200",
                isActive
                  ? "text-[var(--cyan)] bg-[rgba(5,224,248,0.08)]"
                  : "text-[var(--text-4)] hover:text-[var(--text)] hover:bg-[var(--bg-elevated)]"
              )}
            >
              {isActive && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 rounded-r-full bg-[var(--cyan)]" />
              )}
              <span className="mr-3 shrink-0">{item.icon}</span>
              <span className="text-[13px] tracking-normal normal-case font-sans">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* User section */}
      <div className="px-5 pb-5 mt-auto">
        <div className="flex items-center gap-3 py-3 border-t border-[var(--border)]">
          <div className="w-8 h-8 rounded-full bg-[var(--bg-highest)] flex items-center justify-center shrink-0">
            <span className="text-[11px] font-bold text-[var(--text)]">T1</span>
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-[13px] font-medium text-[var(--text)] truncate">Treasury 01</span>
            <span className="text-[11px] text-[var(--text-4)]">Verified</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
