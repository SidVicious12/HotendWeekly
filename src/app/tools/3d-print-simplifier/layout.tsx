import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '3D Print Simplifier - Vector Style AI Converter',
  description: 'Transform photos into simplified vector-style illustrations perfect for multi-color 3D printing. AI-powered using GPT-4 Vision and DALL-E 3. 5 credits per image, 15-20 seconds processing.',
  keywords: ['3D print simplifier', 'vector converter', 'multi-color 3D printing', 'lithophane converter', 'AI illustration', '3D print art'],
  openGraph: {
    title: '3D Print Simplifier - Convert Photos to Print-Ready Art',
    description: 'AI-powered tool converts photos to simplified vector illustrations optimized for multi-color 3D printing and lithophanes.',
    images: [
      {
        url: '/showcase/goku-transformation.png',
        width: 1200,
        height: 630,
        alt: '3D Print Simplifier Tool',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: '3D Print Simplifier - AI Vector Converter',
    description: 'Transform photos into print-optimized vector illustrations with AI.',
    images: ['/showcase/goku-transformation.png'],
  },
}

export default function ThreeDPrintSimplifierLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
