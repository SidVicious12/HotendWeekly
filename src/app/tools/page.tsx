'use client'

import Link from 'next/link'
import { useState } from 'react'

export default function ToolsPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="border-b border-gray-200 bg-white sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex-shrink-0 flex items-center space-x-3">
              <Link href="/" className="flex items-center">
                <div className="flex items-center space-x-2">
                  <div className="w-6 h-6 md:w-8 md:h-8 bg-black rounded flex items-center justify-center">
                    <div className="w-4 h-4 md:w-6 md:h-6 bg-white rounded-sm"></div>
                  </div>
                  <span className="text-lg md:text-xl font-light tracking-wider text-black uppercase">
                    HotendWeekly
                  </span>
                </div>
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
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center mb-16">
          <h1 className="text-3xl font-light tracking-wide text-black uppercase mb-6">
            Maker Tools
          </h1>
          <p className="text-lg text-gray-600 font-light leading-relaxed max-w-2xl mx-auto">
            Evolving platform for 3D printing discovery, curation, and fulfillment. Building the future of maker tools.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          <div className="bg-gray-50 p-8">
            <h2 className="text-xl font-light tracking-wide text-black uppercase mb-4">
              Discovery Engine
            </h2>
            <p className="text-gray-600 font-light leading-relaxed mb-6">
              AI-powered search for trending, useful, and fun 3D prints via natural language prompts. Understand context, purpose, and requirements to deliver intelligent recommendations.
            </p>
            <div className="space-y-3">
              <div className="flex items-center text-sm">
                <span className="w-2 h-2 bg-gray-400 rounded-full mr-3"></span>
                <span className="text-gray-600 font-light">Natural language processing</span>
              </div>
              <div className="flex items-center text-sm">
                <span className="w-2 h-2 bg-gray-400 rounded-full mr-3"></span>
                <span className="text-gray-600 font-light">Contextual understanding</span>
              </div>
              <div className="flex items-center text-sm">
                <span className="w-2 h-2 bg-gray-400 rounded-full mr-3"></span>
                <span className="text-gray-600 font-light">Curated results</span>
              </div>
            </div>
            <div className="mt-6">
              <span className="text-xs text-gray-500 font-light uppercase tracking-wider">
                Phase 1 - Development
              </span>
            </div>
          </div>
          
          <div className="bg-gray-50 p-8">
            <h2 className="text-xl font-light tracking-wide text-black uppercase mb-4">
              Print Fulfillment
            </h2>
            <p className="text-gray-600 font-light leading-relaxed mb-6">
              On-demand printing network connecting designs to local and online print services. Seamless integration from discovery to your doorstep.
            </p>
            <div className="space-y-3">
              <div className="flex items-center text-sm">
                <span className="w-2 h-2 bg-gray-400 rounded-full mr-3"></span>
                <span className="text-gray-600 font-light">Craftcloud integration</span>
              </div>
              <div className="flex items-center text-sm">
                <span className="w-2 h-2 bg-gray-400 rounded-full mr-3"></span>
                <span className="text-gray-600 font-light">Local maker networks</span>
              </div>
              <div className="flex items-center text-sm">
                <span className="w-2 h-2 bg-gray-400 rounded-full mr-3"></span>
                <span className="text-gray-600 font-light">Secure payments</span>
              </div>
            </div>
            <div className="mt-6">
              <span className="text-xs text-gray-500 font-light uppercase tracking-wider">
                Phase 2 - Planned
              </span>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 border border-gray-200 p-8 text-center">
          <h3 className="text-lg font-light tracking-wide text-black uppercase mb-4">
            Creator Platform
          </h3>
          <p className="text-gray-600 font-light leading-relaxed mb-6 max-w-2xl mx-auto">
            Launchpad for STL creators to feature designs, manage sales, and connect with customers. Complete ecosystem supporting the maker community.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
            <div>
              <h4 className="text-sm font-light text-black uppercase tracking-wide mb-2">
                Design Showcase
              </h4>
              <p className="text-xs text-gray-600 font-light">
                Professional galleries for featuring your work with high-quality presentation tools.
              </p>
            </div>
            <div>
              <h4 className="text-sm font-light text-black uppercase tracking-wide mb-2">
                Transaction Management
              </h4>
              <p className="text-xs text-gray-600 font-light">
                Integrated payment processing, licensing, and customer relationship tools.
              </p>
            </div>
            <div>
              <h4 className="text-sm font-light text-black uppercase tracking-wide mb-2">
                Fulfillment Coordination
              </h4>
              <p className="text-xs text-gray-600 font-light">
                Connect directly with print services for automated order fulfillment.
              </p>
            </div>
          </div>
          <div className="mt-8">
            <span className="text-xs text-gray-500 font-light uppercase tracking-wider">
              Phase 3 - Future Platform
            </span>
          </div>
        </div>

        <div className="text-center mt-16">
          <Link 
            href="/newsletter" 
            className="inline-block px-8 py-3 bg-black text-white text-sm font-light uppercase tracking-wider hover:bg-gray-800 transition-colors"
          >
            Follow Development
          </Link>
        </div>
      </div>
    </div>
  )
}