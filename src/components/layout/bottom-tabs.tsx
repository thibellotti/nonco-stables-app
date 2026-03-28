"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { mobileTabItems } from "@/lib/nav-items";

export function BottomTabs() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Mobile navigation"
      className="fixed bottom-0 inset-x-0 z-50 lg:hidden bg-[rgba(0,0,0,0.92)] backdrop-blur-xl border-t border-[var(--border)]"
      style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
    >
      <div className="flex w-full justify-around items-center h-14">
        {mobileTabItems.map((tab) => {
          const isActive =
            pathname === tab.href || pathname.startsWith(tab.href + "/");

          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={cn(
                "flex flex-col items-center justify-center gap-1 flex-1 py-1.5 min-h-[44px] transition-all duration-200",
                isActive
                  ? "text-white"
                  : "text-[var(--text-4)]"
              )}
            >
              <span
                className={cn(
                  "flex items-center justify-center w-10 h-7 rounded-full transition-colors",
                  isActive && "bg-[rgba(255,255,255,0.06)]"
                )}
              >
                {tab.icon}
              </span>
              <span className="text-[9px] font-sans font-medium uppercase tracking-[0.08em]">{tab.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
