import { Sidebar } from "@/components/layout/sidebar";
import { BottomTabs } from "@/components/layout/bottom-tabs";
import { PageHeader } from "@/components/layout/page-header";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
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
  );
}
