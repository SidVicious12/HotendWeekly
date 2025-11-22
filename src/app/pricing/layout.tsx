import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Pricing Plans - Affordable AI Photo Tools',
  description: 'Choose the perfect plan for your 3D print business. From free tier to enterprise, get AI-powered photo editing tools at competitive prices starting at $14.5/month.',
  keywords: ['pricing', 'subscription plans', 'AI tools pricing', '3D printing tools cost', 'photo editing pricing'],
  openGraph: {
    title: 'Pricing Plans - Affordable AI Photo Tools',
    description: 'Flexible pricing for every 3D print seller. Start free or choose from Starter ($14.5), Growth ($39.5), or Advanced ($49.5) plans.',
    images: [
      {
        url: '/og-pricing.png',
        width: 1200,
        height: 630,
        alt: 'HotendWeekly Pricing Plans',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Pricing Plans - Affordable AI Photo Tools',
    description: 'Flexible pricing for every 3D print seller. Start free or upgrade for more credits and features.',
    images: ['/og-pricing.png'],
  },
}

export default function PricingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
