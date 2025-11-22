import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'AI Background Remover - Remove Backgrounds Instantly',
  description: 'Professional AI-powered background removal tool using RMBG-2.0. Remove backgrounds from 3D print photos in 3-5 seconds. 1 credit per image. Perfect for product photography.',
  keywords: ['background remover', 'remove background', 'AI background removal', 'product photo background', '3D print photography', 'transparent background'],
  openGraph: {
    title: 'AI Background Remover - Professional Photo Editing',
    description: 'Remove backgrounds from your 3D print photos instantly with AI. Lightning-fast processing in 3-5 seconds using RMBG-2.0 model.',
    images: [
      {
        url: '/showcase/magic-eraser.png',
        width: 1200,
        height: 630,
        alt: 'Background Remover Tool',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI Background Remover for 3D Print Photos',
    description: 'Professional background removal in 3-5 seconds. Perfect for product listings.',
    images: ['/showcase/magic-eraser.png'],
  },
}

export default function BackgroundRemoverLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
