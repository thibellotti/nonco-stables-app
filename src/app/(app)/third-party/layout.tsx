import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Third Party',
  description: 'Manage third-party payees and payments',
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
