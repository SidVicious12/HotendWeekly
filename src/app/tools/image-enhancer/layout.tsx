import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'AI Image Enhancer - Enhance Photo Quality & Clarity',
  description: 'Enhance your 3D print photos with AI-powered clarity and detail enhancement. Improve resolution, sharpness, and quality. Coming soon in Q3 2025.',
  keywords: ['image enhancer', 'AI enhancement', 'photo quality', 'upscale images', 'improve clarity', '3D print photo quality'],
  openGraph: {
    title: 'AI Image Enhancer - Professional Photo Enhancement',
    description: 'Enhance clarity, detail, and quality of your 3D print photos with AI.',
    images: [
      {
        url: '/showcase/image-enhancer.png',
        width: 1200,
        height: 630,
        alt: 'Image Enhancer Tool',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI Image Enhancer - Coming Q3 2025',
    description: 'Professional AI-powered photo enhancement for 3D prints.',
    images: ['/showcase/image-enhancer.png'],
  },
}

export default function ImageEnhancerLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
