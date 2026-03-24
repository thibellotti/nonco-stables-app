"use client";

import { ToastProvider } from "@/components/ui/toast";
import { useKeyboardShortcuts } from "@/hooks/use-keyboard-shortcuts";

export function AppProviders({ children }: { children: React.ReactNode }) {
  useKeyboardShortcuts();
  return <ToastProvider>{children}</ToastProvider>;
}
