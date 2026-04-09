"use client";

import { ToastProvider } from "@/components/ui/toast";
import { useKeyboardShortcuts } from "@/hooks/use-keyboard-shortcuts";
import { ServiceWorkerRegister } from "@/components/layout/sw-register";

export function AppProviders({ children }: { children: React.ReactNode }) {
  useKeyboardShortcuts();
  return (
    <ToastProvider>
      <ServiceWorkerRegister />
      {children}
    </ToastProvider>
  );
}
