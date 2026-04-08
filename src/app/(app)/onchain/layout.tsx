import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'On-Chain',
  description: 'Non-custodial FX trading from your wallet',
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
