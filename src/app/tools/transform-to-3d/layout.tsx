import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Transform to 3D - 2D Image to 3D Model Converter',
  description: 'Convert 2D images into interactive 3D models with AI. Perfect for creating 3D printable files from photos. Coming soon in Q4 2025.',
  keywords: ['2D to 3D', '3D converter', 'image to 3D model', 'AI 3D generation', '3D modeling', '3D printable models'],
  openGraph: {
    title: 'Transform to 3D - AI 2D to 3D Converter',
    description: 'Transform your 2D images into interactive 3D models ready for 3D printing.',
    images: [
      {
        url: '/showcase/transform-to-3d.jpeg',
        width: 1200,
        height: 630,
        alt: 'Transform to 3D Tool',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Transform to 3D - Coming Q4 2025',
    description: 'AI-powered 2D to 3D conversion for 3D printing.',
    images: ['/showcase/transform-to-3d.jpeg'],
  },
}

export default function TransformTo3DLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
