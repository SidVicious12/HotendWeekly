'use client'

import Link from 'next/link'
import { useState } from 'react'

export default function NewsletterPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [email, setEmail] = useState('')
  const [isSubscribed, setIsSubscribed] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: Integrate with Buttondown/ConvertKit
    console.log('Newsletter signup:', email)
    setIsSubscribed(true)
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="border-b border-gray-200 bg-white sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex-shrink-0 flex items-center space-x-3">
              <Link href="/" className="flex items-center">
                <img 
                  src="/branding/hotendweekly-logo.svg" 
                  alt="HotendWeekly" 
                  className="h-6 md:h-8 w-auto"
                />
              </Link>
            </div>
            <div className="hidden md:block">
              <div className="flex items-center space-x-8">
                <Link href="/editorial" className="text-black text-sm font-light uppercase tracking-wider hover:text-gray-600 transition-colors">
                  Editorial
                </Link>
                <Link href="/discover" className="text-black text-sm font-light uppercase tracking-wider hover:text-gray-600 transition-colors">
                  Discover
                </Link>
                <Link href="/tools" className="text-black text-sm font-light uppercase tracking-wider hover:text-gray-600 transition-colors">
                  Tools
                </Link>
                <Link href="/newsletter" className="text-black text-sm font-light uppercase tracking-wider hover:text-gray-600 transition-colors">
                  Newsletter
                </Link>
              </div>
            </div>
            <div className="flex items-center">
              <button 
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 text-black hover:text-gray-600 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
          
          {/* Mobile menu */}
          {mobileMenuOpen && (
            <div className="md:hidden border-t border-gray-200 bg-white">
              <div className="px-4 pt-4 pb-4 space-y-3">
                <Link href="/editorial" className="block text-black text-sm font-light uppercase tracking-wider">
                  Editorial
                </Link>
                <Link href="/discover" className="block text-black text-sm font-light uppercase tracking-wider">
                  Discover
                </Link>
                <Link href="/tools" className="block text-black text-sm font-light uppercase tracking-wider">
                  Tools
                </Link>
                <Link href="/newsletter" className="block text-black text-sm font-light uppercase tracking-wider">
                  Newsletter
                </Link>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Page Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center">
          <h1 className="text-3xl font-light tracking-wide text-black uppercase mb-6">
            Weekly Curation
          </h1>
          <p className="text-lg text-gray-600 font-light leading-relaxed max-w-2xl mx-auto mb-12">
            Handpicked 3D printing discoveries, industry insights, and maker stories. Be first to know about new tools, materials, and platform features.
          </p>
          
          {!isSubscribed ? (
            <div className="max-w-md mx-auto">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="border border-gray-300 p-6 bg-gray-50">
                  <label htmlFor="email" className="block text-xs font-light tracking-wider text-black uppercase mb-4">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 text-sm font-light placeholder-gray-400 focus:outline-none focus:border-black transition-colors"
                    required
                  />
                  <button
                    type="submit"
                    className="w-full mt-4 px-6 py-3 bg-black text-white text-sm font-light uppercase tracking-wider hover:bg-gray-800 transition-colors"
                  >
                    Subscribe to Newsletter
                  </button>
                </div>
              </form>
              <p className="text-xs text-gray-500 font-light mt-4">
                Integration with Buttondown/ConvertKit coming soon
              </p>
            </div>
          ) : (
            <div className="max-w-md mx-auto">
              <div className="border border-gray-300 p-6 bg-gray-50 text-center">
                <div className="text-green-600 text-4xl mb-4">✓</div>
                <h3 className="text-lg font-light tracking-wide text-black uppercase mb-2">
                  Thank You
                </h3>
                <p className="text-gray-600 font-light">
                  Your subscription request has been received. We'll notify you when the newsletter launches.
                </p>
              </div>
            </div>
          )}
          
          <div className="mt-16 max-w-2xl mx-auto">
            <h2 className="text-xl font-light tracking-wide text-black uppercase mb-8">
              What to Expect
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
              <div>
                <h3 className="text-sm font-light text-black uppercase tracking-wide mb-2">
                  Weekly Discoveries
                </h3>
                <p className="text-xs text-gray-600 font-light">
                  Curated selection of trending models, innovative designs, and practical prints worth your attention.
                </p>
              </div>
              <div>
                <h3 className="text-sm font-light text-black uppercase tracking-wide mb-2">
                  Industry Insights
                </h3>
                <p className="text-xs text-gray-600 font-light">
                  Analysis of new materials, printer technology, and manufacturing trends shaping the industry.
                </p>
              </div>
              <div>
                <h3 className="text-sm font-light text-black uppercase tracking-wide mb-2">
                  Maker Stories
                </h3>
                <p className="text-xs text-gray-600 font-light">
                  Spotlight on creators, innovative applications, and community projects pushing boundaries.
                </p>
              </div>
              <div>
                <h3 className="text-sm font-light text-black uppercase tracking-wide mb-2">
                  Platform Updates
                </h3>
                <p className="text-xs text-gray-600 font-light">
                  Early access to new features, development progress, and exclusive previews of upcoming tools.
                </p>
              </div>
            </div>
          </div>
          
          <div className="mt-16 text-center">
            <Link 
              href="/editorial" 
              className="inline-block px-8 py-3 border border-gray-300 text-black text-sm font-light uppercase tracking-wider hover:bg-gray-50 transition-colors"
            >
              Browse Editorial Content
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}