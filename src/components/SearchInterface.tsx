'use client'

import { useState } from 'react'

interface SearchResult {
  id: string
  title: string
  description: string
  thumbnail: string
  downloadUrl: string
  tags: string[]
}

export default function SearchInterface() {
  const [query, setQuery] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: Phase 1 - Integrate with OpenAI GPT-4 API
    // TODO: Phase 1 - Connect to Supabase for STL metadata
    // TODO: Phase 2 - Add Stripe integration for print fulfillment
    console.log('Search query:', query)
  }

  return (
    <div className="bg-white border-t border-gray-200 py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-2xl font-light tracking-wide text-black uppercase mb-6">
            AI Print Discovery
          </h2>
          <p className="text-gray-600 font-light leading-relaxed mb-12">
            Natural language search for 3D printable content. Describe what you need and discover curated models with AI-powered recommendations.
          </p>
        </div>
        <div className="mx-auto max-w-2xl">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="border border-gray-300 p-6 bg-gray-50">
              <label htmlFor="search" className="block text-xs font-light tracking-wider text-black uppercase mb-4">
                Search Query
              </label>
              <input
                id="search"
                name="search"
                type="text"
                placeholder="Describe what you want to print..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 text-sm font-light placeholder-gray-400 focus:outline-none focus:border-black transition-colors"
                disabled
              />
              <button
                type="submit"
                className="w-full mt-4 px-6 py-3 bg-gray-300 text-gray-500 text-sm font-light uppercase tracking-wider cursor-not-allowed"
                disabled
              >
                Discover Prints - Coming Phase 1
              </button>
            </div>
          </form>
          
          {/* Preview of future functionality */}
          <div className="mt-8 text-center">
            <p className="text-xs text-gray-500 font-light uppercase tracking-wider mb-4">
              Planned Integration
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
              <div className="bg-gray-50 p-4">
                <h4 className="text-sm font-light text-black uppercase tracking-wide mb-2">
                  OpenAI GPT-4 Turbo
                </h4>
                <p className="text-xs text-gray-600 font-light">
                  Natural language processing for intelligent model recommendations and search result curation
                </p>
              </div>
              <div className="bg-gray-50 p-4">
                <h4 className="text-sm font-light text-black uppercase tracking-wide mb-2">
                  Supabase + Postgres
                </h4>
                <p className="text-xs text-gray-600 font-light">
                  STL metadata storage, user preferences, and search result caching for optimal performance
                </p>
              </div>
              <div className="bg-gray-50 p-4">
                <h4 className="text-sm font-light text-black uppercase tracking-wide mb-2">
                  Print Service APIs
                </h4>
                <p className="text-xs text-gray-600 font-light">
                  Direct integration with Craftcloud, Hubs, and local maker networks for instant fulfillment
                </p>
              </div>
              <div className="bg-gray-50 p-4">
                <h4 className="text-sm font-light text-black uppercase tracking-wide mb-2">
                  Stripe Payments
                </h4>
                <p className="text-xs text-gray-600 font-light">
                  Secure payment processing for STL purchases and print-on-demand services
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}