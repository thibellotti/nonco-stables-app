"use client";

import { ToastProvider } from "@/components/ui/toast";
import { useKeyboardShortcuts } from "@/hooks/use-keyboard-shortcuts";
import { ServiceWorkerRegister } from "@/components/layout/sw-register";
import { ThemeProvider } from "@/components/layout/theme-provider";
import { DensityProvider } from "@/components/layout/density-provider";

export function AppProviders({ children }: { children: React.ReactNode }) {
  useKeyboardShortcuts();
  return (
    <ThemeProvider>
      <DensityProvider>
        <ToastProvider>
          <ServiceWorkerRegister />
          {children}
        </ToastProvider>
      </DensityProvider>
    </ThemeProvider>
  );
}
