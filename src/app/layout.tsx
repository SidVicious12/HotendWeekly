import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'HotendWeekly - Discover Trending 3D Prints',
  description: 'AI-powered 3D printing discovery and fulfillment platform',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  )
}