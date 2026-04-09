import { Suspense } from "react";
import { Sidebar } from "@/components/layout/sidebar";
import { BottomTabs } from "@/components/layout/bottom-tabs";
import { PageHeader } from "@/components/layout/page-header";
import { AppProviders } from "@/components/layout/app-providers";
import { GlobeBackground } from "@/components/layout/globe-background";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <AppProviders>
      <a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-[var(--cyan)] focus:text-black focus:rounded-lg focus:text-sm focus:font-medium">
        Skip to main content
      </a>
      <Suspense fallback={null}>
        <GlobeBackground />
      </Suspense>
      <Sidebar />
      <PageHeader />
      <main id="main-content" className="lg:pl-[220px] pt-20 pb-28 lg:pb-8 min-h-screen">
        {children}
      </main>
      <BottomTabs />
    </AppProviders>
  );
}
