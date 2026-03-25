"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { navItems } from "@/lib/nav-items";

// Bottom tabs exclude Settlements (6 items → 5 for mobile)
const tabs = navItems.filter((item) => item.label !== "Settlements");

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
              <span className="text-[10px] font-sans uppercase tracking-widest mt-1">{tab.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
