import { Sidebar } from "@/components/layout/sidebar";
import { BottomTabs } from "@/components/layout/bottom-tabs";
import { PageHeader } from "@/components/layout/page-header";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Sidebar />
      <PageHeader />
      <main className="lg:pl-[220px] pt-24 pb-24 lg:pb-8 min-h-screen">
        {children}
      </main>
      <BottomTabs />
    </>
  );
}
