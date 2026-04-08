import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/login',
        disallow: ['/dashboard', '/bank', '/trades', '/settlements', '/rfq', '/fx', '/bridge', '/onchain', '/onchain-activity', '/payments', '/yield', '/reports', '/api-keys', '/third-party', '/chart-options', '/illustration-preview'],
      },
    ],
    sitemap: 'https://stables.nonco.com/sitemap.xml',
  }
}
