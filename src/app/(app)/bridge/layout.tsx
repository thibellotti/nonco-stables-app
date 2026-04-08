import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Bridge',
  description: 'Cross-chain stablecoin bridge',
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
