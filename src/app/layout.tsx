import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'HotendWeekly - Turn 3D Prints into Sales',
  description: 'AI-powered product photography for 3D print sellers. Create professional listing photos in minutes.',
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