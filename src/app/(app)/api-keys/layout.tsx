import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'API Keys',
  description: 'Manage API keys and permissions',
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
