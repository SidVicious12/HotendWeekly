import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Image Extender - AI Background Expansion Tool',
  description: 'Intelligently expand and scale images with AI-powered background generation. Perfect for creating wider product shots. Coming soon in Q3 2025.',
  keywords: ['image extender', 'expand image', 'AI background generation', 'image scaling', 'outpainting', 'photo expansion'],
  openGraph: {
    title: 'Image Extender - Intelligent Photo Expansion',
    description: 'Expand your photos with AI-generated backgrounds that match your original image seamlessly.',
    images: [
      {
        url: '/showcase/image-extender.png',
        width: 1200,
        height: 630,
        alt: 'Image Extender Tool',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Image Extender - Coming Q3 2025',
    description: 'AI-powered image expansion with intelligent background generation.',
    images: ['/showcase/image-extender.png'],
  },
}

export default function ImageExtenderLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
