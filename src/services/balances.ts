import { balances, type Balance } from "@/lib/mock-data";

export async function getBalances(): Promise<Balance[]> {
  // TODO: Replace with API call
  return balances;
}

export function getTotalBalance(items: Balance[]): number {
  return items.reduce((sum, b) => sum + b.available + b.pending, 0);
}

export function getTotalAvailable(items: Balance[]): number {
  return items.reduce((sum, b) => sum + b.available, 0);
}

export function getTotalPending(items: Balance[]): number {
  return items.reduce((sum, b) => sum + b.pending, 0);
}
