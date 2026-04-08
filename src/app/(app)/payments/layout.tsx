import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Payments',
  description: 'Send and manage stablecoin payments',
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
