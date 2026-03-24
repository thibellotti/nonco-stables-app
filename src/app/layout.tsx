import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Sidebar } from "@/components/layout/sidebar";
import { BottomTabs } from "@/components/layout/bottom-tabs";
import { PageHeader } from "@/components/layout/page-header";

export const metadata: Metadata = {
  title: "Nonco Stables",
  description: "Institutional stablecoin payments platform",
};

export const viewport: Viewport = {
  themeColor: "#05E0F8",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <div className="flex h-dvh bg-[var(--bg)]">
          <Sidebar />
          <main className="flex-1 flex flex-col min-h-0">
            <PageHeader />
            <div className="flex-1 overflow-y-auto pb-20 lg:pb-0">
              {children}
            </div>
          </main>
          <BottomTabs />
        </div>
      </body>
    </html>
  );
}
