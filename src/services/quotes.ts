import { generateQuote, instruments, favorites, recentTrades, type Instrument, type Quote, type Favorite, type RecentTrade } from "@/lib/mock-data";

export async function requestQuote(instrument: Instrument): Promise<Quote> {
  // TODO: Replace with API call
  // Simulate 500ms network delay
  await new Promise((resolve) => setTimeout(resolve, 500));
  return generateQuote(instrument);
}

export async function getFavorites(): Promise<Favorite[]> {
  return favorites;
}

export async function getInstruments(): Promise<Instrument[]> {
  return instruments;
}

export async function getRecentTrades(): Promise<RecentTrade[]> {
  return recentTrades;
}
