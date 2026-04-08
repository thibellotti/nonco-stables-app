import { transactions, type Transaction } from "@/lib/mock-data";

export async function getTransactions(filter?: string): Promise<Transaction[]> {
  // TODO: Replace with API call
  if (!filter || filter === "all") return transactions;
  return transactions.filter((t) => t.type === filter);
}

export function getBankTransactions(): Transaction[] {
  return transactions.filter((t) => t.type === "deposit" || t.type === "withdrawal");
}

export function getSettlementTransactions(): Transaction[] {
  return transactions.filter((t) => t.type === "settlement");
}
