'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) throw error

      // Redirect to main app
      router.push('/')
    } catch (error: any) {
      setError(error.message || 'Failed to login')
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleLogin = async () => {
    setLoading(true)
    setError(null)

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/`,
        },
      })

      if (error) throw error
    } catch (error: any) {
      setError(error.message || 'Failed to login with Google')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Hero/Marketing Section */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-purple-100 via-pink-50 to-blue-100 relative overflow-hidden">
        {/* Decorative circles */}
        <div className="absolute top-20 left-10 w-32 h-32 bg-purple-200/50 rounded-full" />
        <div className="absolute top-40 right-20 w-24 h-24 bg-blue-200/50 rounded-full" />
        <div className="absolute bottom-40 left-20 w-20 h-20 bg-pink-200/50 rounded-full" />
        
        {/* Logo */}
        <div className="absolute top-8 left-8 flex items-center gap-2">
          <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-pink-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">H</span>
          </div>
          <span className="text-purple-600 font-bold text-lg">Hot End<br/>Weekly</span>
        </div>
        
        {/* Center content with images */}
        <div className="flex flex-col items-center justify-center w-full px-12">
          {/* Image grid */}
          <div className="relative w-80 h-80 mb-8">
            {/* Large circle outline */}
            <div className="absolute inset-0 border-2 border-cyan-300/50 rounded-full" />
            
            {/* Sample 3D print images in circles */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-24 rounded-full bg-gradient-to-br from-amber-100 to-amber-200 border-4 border-cyan-400 overflow-hidden shadow-lg">
              <div className="w-full h-full flex items-center justify-center text-4xl">🏺</div>
            </div>
            <div className="absolute top-1/4 right-0 w-20 h-20 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 border-4 border-cyan-400 overflow-hidden shadow-lg">
              <div className="w-full h-full flex items-center justify-center text-3xl">🗿</div>
            </div>
            <div className="absolute bottom-1/4 right-8 w-20 h-20 rounded-full bg-gradient-to-br from-amber-50 to-amber-100 border-4 border-cyan-400 overflow-hidden shadow-lg">
              <div className="w-full h-full flex items-center justify-center text-3xl">🏠</div>
            </div>
            <div className="absolute bottom-0 left-1/4 w-24 h-24 rounded-full bg-gradient-to-br from-orange-100 to-orange-200 border-4 border-cyan-400 overflow-hidden shadow-lg">
              <div className="w-full h-full flex items-center justify-center text-4xl">🐉</div>
            </div>
          </div>
          
          {/* Marketing text */}
          <div className="text-center mt-8">
            <h2 className="text-3xl font-bold text-purple-600 mb-2">
              Elevate Your 3D Prints with AI.
            </h2>
            <p className="text-2xl font-semibold text-purple-500">
              Perfect Your Models in Minutes.
            </p>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md">
          {/* Mobile Logo - only shows on small screens */}
          <div className="lg:hidden flex items-center gap-2 mb-8">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-pink-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">H</span>
            </div>
            <span className="text-purple-600 font-bold text-lg">HotendWeekly</span>
          </div>

          {/* Header */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Log in to your account</h1>
            <p className="text-gray-600">Welcome back! Please enter your details.</p>
          </div>

          {/* Google Login - moved to top like reference */}
          <button
            onClick={handleGoogleLogin}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 bg-white border-2 border-purple-500 text-gray-700 py-3 rounded-lg font-semibold hover:bg-purple-50 transition-colors disabled:opacity-50 mb-4"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            Continue with Google
          </button>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-gray-500">OR</span>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email<span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password<span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900"
              />
              <div className="flex justify-end mt-1">
                <Link href="#" className="text-sm text-purple-600 hover:text-purple-700">
                  Forgot password
                </Link>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition-colors disabled:opacity-50"
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </form>

          {/* Sign Up Link */}
          <p className="text-center text-sm text-gray-600 mt-6">
            Don't have an account?{' '}
            <Link href="/auth/signup" className="text-purple-600 font-semibold hover:text-purple-700">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
