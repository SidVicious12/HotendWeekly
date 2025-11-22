import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'AI Photo Editing Tools for 3D Printing',
  description: 'Explore our complete suite of AI-powered photo editing tools designed for 3D print sellers. Background removal, image enhancement, and more professional tools.',
  keywords: ['AI photo tools', '3D printing tools', 'background remover', 'image enhancer', 'photo editor', 'product photography'],
  openGraph: {
    title: 'AI Photo Editing Tools for 3D Printing',
    description: 'Transform your 3D print photos with professional AI-powered tools including background removal, enhancement, and simplification.',
    images: [
      {
        url: '/og-tools.png',
        width: 1200,
        height: 630,
        alt: 'HotendWeekly AI Tools',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI Photo Editing Tools for 3D Printing',
    description: 'Professional AI-powered photo editing suite for 3D print sellers.',
    images: ['/og-tools.png'],
  },
}

export default function ToolsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
