import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Image Retouch - AI Color & Texture Modification',
  description: 'Professional color changing and texture modification for 3D print photos. AI-powered retouching for perfect product presentation. Coming soon in Q2 2025.',
  keywords: ['image retouch', 'color changer', 'texture modification', 'AI retouching', 'photo editing', 'color correction'],
  openGraph: {
    title: 'Image Retouch - AI Color & Texture Editor',
    description: 'Change colors and modify textures in your 3D print photos with professional AI retouching.',
    images: [
      {
        url: '/showcase/image-retouch.png',
        width: 1200,
        height: 630,
        alt: 'Image Retouch Tool',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Image Retouch - Coming Q2 2025',
    description: 'Professional AI-powered color and texture editing.',
    images: ['/showcase/image-retouch.png'],
  },
}

export default function ImageRetouchLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
