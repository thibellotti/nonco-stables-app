import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'On-Chain Activity',
  description: 'DeFi and on-chain transaction history',
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
