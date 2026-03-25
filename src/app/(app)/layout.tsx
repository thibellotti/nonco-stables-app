import { Sidebar } from "@/components/layout/sidebar";
import { BottomTabs } from "@/components/layout/bottom-tabs";
import { PageHeader } from "@/components/layout/page-header";
import { AppProviders } from "@/components/layout/app-providers";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <AppProviders>
      <Sidebar />
      <PageHeader />
      <main className="lg:pl-[220px] pt-24 pb-24 lg:pb-8 min-h-screen">
        <div className="max-w-[1400px] mx-auto">
          {children}
        </div>
      </main>
      <BottomTabs />
    </AppProviders>
  );
}
