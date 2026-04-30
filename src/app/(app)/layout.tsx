import { Sidebar } from "@/components/layout/sidebar";
import { BottomTabs } from "@/components/layout/bottom-tabs";
import { PageHeader } from "@/components/layout/page-header";
import { AppProviders } from "@/components/layout/app-providers";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <AppProviders>
      <a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-[var(--cyan)] focus:text-black focus:rounded-lg focus:text-sm focus:font-medium">
        Skip to main content
      </a>
      <Sidebar />
      <PageHeader />
      {/* Full-width: content flows edge-to-edge from the sidebar to the right
          viewport. Per-page padding (px-4 sm:px-6 lg:px-8 xl:px-12) handles the
          breathing room — no max-width cap so ultra-wide monitors are used in
          full. */}
      <main id="main-content" className="lg:pl-[220px] pt-20 pb-28 lg:pb-8 min-h-screen">
        {children}
      </main>
      <BottomTabs />
    </AppProviders>
  );
}
