import type { Metadata } from 'next'
import './globals.css'
import { Providers } from '@/components/Providers'

export const metadata: Metadata = {
  metadataBase: new URL('https://hotendweekly.com'),
  title: {
    default: 'HotendWeekly - AI Photo Tools for 3D Print Sellers',
    template: '%s | HotendWeekly'
  },
  description: 'AI-powered photo editing tools for 3D print sellers. Background removal, image enhancement, and product photography tools to boost your sales.',
  keywords: ['3D printing', 'AI photo editing', 'background remover', 'product photography', '3D print marketplace', 'Etsy 3D prints', 'image enhancer', 'AI tools'],
  authors: [{ name: 'HotendWeekly' }],
  creator: 'HotendWeekly',
  publisher: 'HotendWeekly',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://hotendweekly.com',
    siteName: 'HotendWeekly',
    title: 'HotendWeekly - AI Photo Tools for 3D Print Sellers',
    description: 'Transform your 3D print photos with professional AI-powered editing tools. Background removal, enhancement, and more.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'HotendWeekly - AI Photo Tools',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'HotendWeekly - AI Photo Tools for 3D Print Sellers',
    description: 'Transform your 3D print photos with professional AI-powered editing tools.',
    images: ['/og-image.png'],
    creator: '@hotendweekly',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'google-site-verification-code',
    yandex: 'yandex-verification-code',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}