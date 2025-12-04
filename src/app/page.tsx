'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { cn } from '@/lib/utils'

const showcaseImages = [
  { src: '/showcase/transform-to-3d.jpeg', alt: 'Geometric vase', bg: 'bg-gray-100' },
  { src: '/miniatures/space-marine-painted.png', alt: 'Painted miniature', bg: 'bg-gray-900' },
  { src: '/showcase/goku-base.jpeg', alt: 'Mechanical gears', bg: 'bg-gray-100' },
  { src: '/showcase/image-enhancer.png', alt: 'Architectural model', bg: 'bg-gray-100' },
]

export default function HomePage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) throw error
      router.push('/dashboard')
    } catch (err: any) {
      setError(err.message || 'Failed to sign in')
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleLogin = async () => {
    setLoading(true)
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: { redirectTo: `${window.location.origin}/dashboard` },
      })
      if (error) throw error
    } catch (err: any) {
      setError(err.message || 'Failed to sign in with Google')
      setLoading(false)
    }
  }

  return (
    <div className={cn("min-h-screen flex")}>
      {/* Left Side - Showcase */}
      <div className={cn(
        "hidden lg:flex lg:w-1/2 flex-col p-10",
        "bg-gradient-to-br from-purple-50/80 via-pink-50/60 to-blue-50/80"
      )}>
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 relative">
            <svg viewBox="0 0 48 48" className="w-full h-full">
              {/* Nozzle body */}
              <defs>
                <linearGradient id="nozzleGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#8B5CF6" />
                  <stop offset="100%" stopColor="#3B82F6" />
                </linearGradient>
              </defs>
              <path d="M24 4 L32 12 L32 20 L28 24 L28 36 L24 44 L20 36 L20 24 L16 20 L16 12 Z" fill="url(#nozzleGradient)" />
              <circle cx="24" cy="32" r="8" fill="none" stroke="#06B6D4" strokeWidth="2" />
              <circle cx="24" cy="32" r="12" fill="none" stroke="#06B6D4" strokeWidth="1" opacity="0.5" />
            </svg>
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-bold text-purple-600 leading-tight">Hot End</span>
            <span className="text-xl font-bold text-blue-600 leading-tight">Weekly</span>
          </div>
        </div>

        {/* Showcase Images Grid */}
        <div className="flex-1 flex items-center justify-center">
          <div className="relative w-[420px] h-[420px]">
            {/* Decorative rings */}
            <svg className="absolute inset-0 w-full h-full" viewBox="0 0 420 420">
              <circle cx="210" cy="210" r="200" fill="none" stroke="#06B6D4" strokeWidth="1.5" opacity="0.3" />
              <circle cx="210" cy="210" r="170" fill="none" stroke="#06B6D4" strokeWidth="1" opacity="0.2" />
              <circle cx="210" cy="210" r="140" fill="none" stroke="#06B6D4" strokeWidth="0.5" opacity="0.15" />
              {/* Partial arcs */}
              <path d="M 60 120 A 180 180 0 0 1 180 30" fill="none" stroke="#06B6D4" strokeWidth="2" opacity="0.4" />
              <path d="M 340 300 A 180 180 0 0 1 240 390" fill="none" stroke="#06B6D4" strokeWidth="2" opacity="0.4" />
            </svg>
            
            {/* Image grid - 2x2 layout */}
            <div className="absolute top-4 left-8 w-40 h-40 rounded-full overflow-hidden shadow-2xl border-4 border-white">
              <img src={showcaseImages[0].src} alt={showcaseImages[0].alt} className={cn("w-full h-full object-cover", showcaseImages[0].bg)} />
            </div>
            <div className="absolute top-8 right-8 w-36 h-36 rounded-full overflow-hidden shadow-2xl border-4 border-white bg-gray-900">
              <img src={showcaseImages[1].src} alt={showcaseImages[1].alt} className="w-full h-full object-contain p-2" />
            </div>
            <div className="absolute bottom-16 left-4 w-36 h-36 rounded-full overflow-hidden shadow-2xl border-4 border-white">
              <img src={showcaseImages[2].src} alt={showcaseImages[2].alt} className={cn("w-full h-full object-cover", showcaseImages[2].bg)} />
            </div>
            <div className="absolute bottom-4 right-12 w-40 h-40 rounded-full overflow-hidden shadow-2xl border-4 border-white">
              <img src={showcaseImages[3].src} alt={showcaseImages[3].alt} className={cn("w-full h-full object-cover", showcaseImages[3].bg)} />
            </div>
          </div>
        </div>

        {/* Tagline */}
        <div className="pb-4">
          <h1 className="text-3xl font-bold text-gray-900 leading-tight">
            Elevate Your 3D Prints with AI.
            <br />
            Perfect Your Models in Minutes.
          </h1>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className={cn("w-full lg:w-1/2 flex items-center justify-center p-8 bg-white")}>
        <div className="w-full max-w-md">
          <h2 className="text-2xl font-bold text-gray-900 mb-1">Log in to your account</h2>
          <p className="text-gray-500 mb-8">Welcome back! Please enter your details.</p>

          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {/* OAuth Buttons */}
          <div className={cn("flex flex-col gap-3 mb-6")}>
            <button
              onClick={handleGoogleLogin}
              disabled={loading}
              className={cn(
                "w-full flex items-center justify-center gap-3 px-4 py-3",
                "border border-gray-300 rounded-lg",
                "hover:bg-gray-50 transition-colors disabled:opacity-50"
              )}
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              <span className="font-medium text-gray-700">Continue with Google</span>
            </button>

            <button
              disabled={loading}
              className={cn(
                "w-full flex items-center justify-center gap-3 px-4 py-3",
                "border border-gray-300 rounded-lg",
                "hover:bg-gray-50 transition-colors disabled:opacity-50"
              )}
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#95BF47" d="M15.337 23.979l7.216-1.561s-2.604-17.613-2.625-17.741c-.021-.128-.149-.213-.256-.213s-2.176-.149-2.176-.149-.575-.574-.766-.766c-.042-.042-.085-.064-.128-.085l-1.265 21.515zm-3.128-1.799s-.553.256-1.472.256c-1.194 0-1.258-.746-1.258-.937 0-1.002.746-4.139.746-5.621 0-.128-.043-.277-.149-.447-.085-.128-.085-.128-.149-.319-.043-.107-.085-.277-.085-.49 0-.789.532-2.133.532-3.135 0-.106-.021-.213-.064-.298-.043-.085-.085-.149-.213-.256-.043-.043-.107-.085-.213-.149-.085-.064-.149-.106-.277-.192.021-.17.064-.34.064-.51 0-.021.021-.149.021-.341 0-.107 0-.256-.021-.383-.021-.128-.021-.256-.043-.362-.149-.064-.532-.256-1.216-.256-1.79 0-3.071 1.43-3.071 3.349 0 .362.043.681.128.958-1.067.362-1.834.617-1.856.639-.575.192-.596.213-.66.766-.043.426-1.558 12.012-1.558 12.012l11.664 2.176z" />
              </svg>
              <span className="font-medium text-gray-700">Continue with Shopify</span>
            </button>
          </div>

          {/* Divider */}
          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-gray-400 uppercase text-xs tracking-wider">or</span>
            </div>
          </div>

          {/* Login Form */}
          <form onSubmit={handleLogin} className={cn("flex flex-col gap-4")}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1.5">
                Email<span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                className={cn(
                  "w-full px-4 py-3 border border-gray-300 rounded-lg",
                  "focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent",
                  "text-gray-900 placeholder:text-gray-400"
                )}
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1.5">
                Password<span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                  className={cn(
                    "w-full px-4 py-3 border border-gray-300 rounded-lg pr-20",
                    "focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent",
                    "text-gray-900 placeholder:text-gray-400"
                  )}
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
                  <button
                    type="button"
                    className="p-1 text-gray-400 hover:text-gray-600"
                    title="Password generator"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                    </svg>
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="p-1 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                      </svg>
                    ) : (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>
              <div className="mt-2 text-right">
                <Link href="/auth/forgot-password" className="text-sm text-purple-600 hover:text-purple-700">
                  Forgot password
                </Link>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={cn(
                "w-full py-3 rounded-lg font-semibold transition-colors",
                "bg-purple-600 text-white hover:bg-purple-700 disabled:opacity-50"
              )}
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </form>

          <p className="text-center text-sm text-gray-600 mt-6">
            Don't have an account?
            <Link href="/auth/signup" className="text-purple-600 font-semibold hover:text-purple-700 ml-1">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
