import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Reports',
  description: 'Volume, revenue, and yield reporting',
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
