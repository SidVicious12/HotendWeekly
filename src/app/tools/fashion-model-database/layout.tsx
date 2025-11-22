import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Fashion Model Database - AI Models for Virtual Try-On',
  description: 'Access diverse AI fashion models for virtual try-on and product visualization. Perfect for apparel and accessory 3D prints. Coming soon in Q3 2025.',
  keywords: ['fashion models', 'AI models', 'virtual try-on', 'model database', '3D fashion', 'apparel visualization'],
  openGraph: {
    title: 'Fashion Model Database - Diverse AI Models',
    description: 'Professional AI fashion models for virtual try-on and product visualization.',
    images: [
      {
        url: '/showcase/fashion-model-database.jpeg',
        width: 1200,
        height: 630,
        alt: 'Fashion Model Database',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Fashion Model Database - Coming Q3 2025',
    description: 'Diverse AI models for virtual try-on and apparel visualization.',
    images: ['/showcase/fashion-model-database.jpeg'],
  },
}

export default function FashionModelDatabaseLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
