"use client";

import { ToastProvider } from "@/components/ui/toast";
import { useKeyboardShortcuts } from "@/hooks/use-keyboard-shortcuts";
import { ServiceWorkerRegister } from "@/components/layout/sw-register";
import { ThemeProvider } from "@/components/layout/theme-provider";

export function AppProviders({ children }: { children: React.ReactNode }) {
  useKeyboardShortcuts();
  return (
    <ThemeProvider>
      <ToastProvider>
        <ServiceWorkerRegister />
        {children}
      </ToastProvider>
    </ThemeProvider>
  );
}
