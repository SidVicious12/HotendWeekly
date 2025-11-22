import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Magic Eraser - Remove Unwanted Objects from Photos',
  description: 'AI-powered magic eraser tool to remove unwanted objects and fix flaws automatically. Perfect for cleaning up 3D print product photos. Coming soon in Q2 2025.',
  keywords: ['magic eraser', 'remove objects', 'AI eraser', 'photo cleanup', 'object removal', '3D print photo editing'],
  openGraph: {
    title: 'Magic Eraser - AI Object Removal Tool',
    description: 'Remove unwanted objects from your 3D print photos with AI-powered precision.',
    images: [
      {
        url: '/showcase/magic-eraser.jpeg',
        width: 1200,
        height: 630,
        alt: 'Magic Eraser Tool',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Magic Eraser - Coming Q2 2025',
    description: 'AI-powered object removal for professional product photos.',
    images: ['/showcase/magic-eraser.jpeg'],
  },
}

export default function MagicEraserLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
