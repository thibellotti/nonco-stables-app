import { Sidebar } from "@/components/layout/sidebar";
import { BottomTabs } from "@/components/layout/bottom-tabs";
import { PageHeader } from "@/components/layout/page-header";
import { AppProviders } from "@/components/layout/app-providers";
import { GlobeBackground } from "@/components/layout/globe-background";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <AppProviders>
      <Sidebar />
      <PageHeader />

      {/* Nonco Stables globe — fixed background, like nonco.com/stables */}
      <GlobeBackground />

      <main className="lg:pl-[220px] pt-20 pb-28 lg:pb-8 min-h-screen relative z-10">
        {children}
      </main>
      <BottomTabs />
    </AppProviders>
  );
}
