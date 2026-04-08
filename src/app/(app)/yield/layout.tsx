import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Yield',
  description: 'Stablecoin yield vaults and earnings',
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
