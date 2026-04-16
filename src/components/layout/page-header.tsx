"use client";

import { usePathname } from "next/navigation";
import { NotificationCenter } from "./notification-center";
import { ThemeToggle } from "./theme-toggle";
import { PageMark } from "@/components/ui/page-mark";
import { tickerItems } from "@/lib/mock-data";

const pageTitles: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/rfq": "RFQ",
  "/bank": "Bank",
  "/trades": "Recent Activity",
  "/settlements": "Settlements",
  "/fx": "FX Stables",
  "/yield": "Yield",
  "/payments": "Swap & Send",
  "/onchain-activity": "DeFi Recent Activity",
  "/bridge": "Bridge",
  "/onchain": "FX Onchain",
  "/third-party": "Third Party",
  "/reports": "Reports",
  "/api-keys": "API Keys",
};

export function PageHeader() {
  const pathname = usePathname();
  const segment = "/" + (pathname.split("/")[1] || "");
  const title = pageTitles[segment] || "Dashboard";

  // Double items for seamless scroll
  const items = [...tickerItems, ...tickerItems];

  return (
    <header className="fixed top-0 right-0 left-0 lg:left-[220px] h-16 z-40 bg-[var(--bg)]/75 backdrop-blur-xl backdrop-saturate-150 border-b border-[var(--border)]" style={{ paddingTop: 'env(safe-area-inset-top, 0px)' }}>
      <div className="flex items-center h-full px-6 lg:px-8 gap-4">
        {/* LEFT: Page title */}
        <div className="flex items-center gap-1.5 shrink-0">
          <span className="text-[13px] text-[var(--text-4)] font-sans hidden sm:inline">Nonco</span>
          <span className="text-[13px] text-[var(--text-4)] font-sans hidden sm:inline">/</span>
          <PageMark page={segment.replace("/", "")} className="mr-1.5" />
          <h1 className="text-[13px] text-white font-medium font-sans">{title}</h1>
        </div>

        {/* Divider between breadcrumb and ticker */}
        <div className="w-px h-4 bg-[var(--border)] shrink-0 hidden md:block" />

        {/* CENTER: Ticker — fills available space */}
        <div className="flex-1 h-7 rounded-md overflow-hidden hidden md:block opacity-60 hover:opacity-100 transition-opacity">
          <div className="flex animate-ticker whitespace-nowrap h-full items-center">
            {items.map((item, i) => (
              <div
                key={`${item.pair}-${i}`}
                className="flex items-center gap-1.5 px-3 h-full shrink-0"
              >
                <span className="text-[10px] font-sans text-[var(--text-4)]">{item.pair}</span>
                <span className="text-[10px] font-mono font-bold text-[var(--text-3)]">{item.rate}</span>
                <span
                  className={`text-[9px] font-mono font-bold ${
                    item.change > 0
                      ? "text-[var(--status-positive)]"
                      : item.change < 0
                        ? "text-[var(--status-negative)]"
                        : "text-[var(--text-4)]"
                  }`}
                >
                  {item.change >= 0 ? "+" : ""}
                  {item.change.toFixed(2)}%
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT: Theme toggle + Notifications + Avatar */}
        <div className="flex items-center gap-2 shrink-0 ml-auto">
          <ThemeToggle />
          <NotificationCenter />
          <button className="p-2 -m-2 rounded-full" aria-label="User menu">
            <div className="w-7 h-7 rounded-full bg-[var(--bg-elevated)] border border-[var(--border)] flex items-center justify-center text-[9px] font-bold text-[var(--text)]">
              FM
            </div>
          </button>
        </div>
      </div>
    </header>
  );
}
