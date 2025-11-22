import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Sign In / Sign Up',
  description: 'Access your HotendWeekly account to start transforming 3D print photos with AI-powered tools. Sign up free and get 20 credits to try our tools.',
  keywords: ['sign up', 'login', 'account', 'register', 'AI tools account'],
  openGraph: {
    title: 'Join HotendWeekly - AI Photo Tools for 3D Printing',
    description: 'Create your free account and get started with professional AI-powered photo editing tools for your 3D prints.',
    images: [
      {
        url: '/og-auth.png',
        width: 1200,
        height: 630,
        alt: 'Join HotendWeekly',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Join HotendWeekly - AI Photo Tools',
    description: 'Sign up free and transform your 3D print photos with AI.',
    images: ['/og-auth.png'],
  },
  robots: {
    index: false,
    follow: true,
  },
}

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
