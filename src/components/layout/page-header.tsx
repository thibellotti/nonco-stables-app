"use client";

import { usePathname } from "next/navigation";
import { NotificationCenter } from "./notification-center";
import { tickerItems } from "@/lib/mock-data";

const pageTitles: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/rfq": "RFQ",
  "/bank": "Bank",
  "/trades": "Trades",
  "/settlements": "Settlements",
  "/wallet": "Wallet",
  "/fx": "FX Stables",
  "/yield": "Yield Vault",
  "/payments": "Payments",
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
    <header className="fixed top-0 right-0 left-0 lg:left-[220px] h-16 z-40 bg-[rgba(0,0,0,0.85)] backdrop-blur-xl border-b border-[var(--border)]">
      <div className="flex items-center h-full px-6 lg:px-8 gap-4">
        {/* LEFT: Page title */}
        <div className="flex items-center gap-1.5 shrink-0">
          <span className="text-[13px] text-[var(--text-4)] font-sans hidden sm:inline">Nonco</span>
          <span className="text-[13px] text-[var(--text-4)] font-sans hidden sm:inline">/</span>
          <span className="text-[13px] text-white font-medium font-sans">{title}</span>
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

        {/* RIGHT: Notifications + Avatar */}
        <div className="flex items-center gap-3 shrink-0 ml-auto">
          <NotificationCenter />
          <div className="w-7 h-7 rounded-full bg-[rgba(5,224,248,0.1)] border border-[var(--border)] flex items-center justify-center text-[9px] font-bold text-[var(--cyan)]">
            FM
          </div>
        </div>
      </div>
    </header>
  );
}
