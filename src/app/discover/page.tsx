'use client'

import Link from 'next/link'
import { useState } from 'react'

export default function DiscoverPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

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
            AI-Powered Discovery
          </h1>
          <p className="text-lg text-gray-600 font-light leading-relaxed max-w-2xl mx-auto mb-12">
            Intelligent search for 3D printable content. Describe what you need and discover curated models with AI-powered recommendations.
          </p>
          
          <div className="bg-gray-50 border border-gray-200 p-8 mb-12">
            <h2 className="text-lg font-light tracking-wide text-black uppercase mb-4">
              Coming in Phase 1
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
              <div>
                <h3 className="text-sm font-light text-black uppercase tracking-wide mb-2">
                  Natural Language Search
                </h3>
                <p className="text-xs text-gray-600 font-light">
                  Describe your needs in plain language and receive intelligent, curated results powered by OpenAI GPT-4 Turbo.
                </p>
              </div>
              <div>
                <h3 className="text-sm font-light text-black uppercase tracking-wide mb-2">
                  Smart Recommendations
                </h3>
                <p className="text-xs text-gray-600 font-light">
                  AI-powered curation that considers complexity, materials, purpose, and your personal preferences.
                </p>
              </div>
              <div>
                <h3 className="text-sm font-light text-black uppercase tracking-wide mb-2">
                  STL Metadata Database
                </h3>
                <p className="text-xs text-gray-600 font-light">
                  Comprehensive database with detailed model information, print settings, and community reviews.
                </p>
              </div>
              <div>
                <h3 className="text-sm font-light text-black uppercase tracking-wide mb-2">
                  Print Service Integration
                </h3>
                <p className="text-xs text-gray-600 font-light">
                  Direct connection to Craftcloud, Hubs, and local maker networks for instant fulfillment.
                </p>
              </div>
            </div>
          </div>
          
          <Link 
            href="/newsletter" 
            className="inline-block px-8 py-3 bg-black text-white text-sm font-light uppercase tracking-wider hover:bg-gray-800 transition-colors"
          >
            Get Notified When Ready
          </Link>
        </div>
      </div>
    </div>
  )
}