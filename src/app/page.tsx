// src/app/page.tsx

'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import { getLatestArticles } from '@/data/articles'

const featuredContent = [
  {
    id: '1',
    title: 'BAMBU LAB DELAYS FLAGSHIP TO Q1 2025',
    category: 'EDITORIAL',
    date: 'Dec 16',
    type: 'article',
    href: '/blog/bambu-lab-flagship-delay-2025'
  },
  {
    id: '2', 
    title: 'AI-POWERED PRINT DISCOVERY',
    category: 'COMING SOON',
    date: 'Phase 1',
    type: 'feature',
    href: '#search'
  },
  {
    id: '3',
    title: 'ON-DEMAND PRINT FULFILLMENT', 
    category: 'COMING SOON',
    date: 'Phase 2',
    type: 'feature',
    href: '#fulfillment'
  }
]

export default function HomePage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const latestArticles = getLatestArticles(3)

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

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        
        {/* Hero Section */}
        <section className="text-center mb-24">
          <h1 className="text-4xl md:text-5xl font-light tracking-wide text-black leading-tight mb-8 uppercase">
            AI-Powered 3D Print Discovery
          </h1>
          <p className="text-lg text-gray-600 font-light leading-relaxed max-w-3xl mx-auto mb-12">
            More than a newsletter. An intelligent discovery engine for 3D printable content, 
            evolving into a complete maker platform with on-demand fulfillment.
          </p>
          
          {/* Search Preview */}
          <div id="discover" className="max-w-2xl mx-auto mb-16">
            <div className="border border-gray-300 rounded-none p-6 bg-gray-50">
              <div className="text-xs font-light tracking-wider text-black uppercase mb-4">
                AI Search - Coming Phase 1
              </div>
              <input
                type="text"
                placeholder="Describe what you want to print..."
                className="w-full px-4 py-3 border border-gray-300 text-sm font-light placeholder-gray-400 focus:outline-none focus:border-black transition-colors disabled:bg-gray-100"
                disabled
              />
              <Link 
                href="/discover"
                className="block w-full mt-4 px-6 py-3 bg-black text-white text-sm font-light uppercase tracking-wider hover:bg-gray-800 transition-colors text-center"
              >
                Discover Prints
              </Link>
            </div>
          </div>
        </section>

        {/* Latest from Editorial */}
        <section className="mb-24">
          <div className="flex items-center justify-between mb-12">
            <h2 className="text-2xl font-light tracking-wide text-black uppercase">
              Latest from Editorial
            </h2>
            <Link 
              href="/editorial" 
              className="text-sm font-light uppercase tracking-wider text-black hover:text-gray-600 transition-colors"
            >
              View all →
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {latestArticles.map((article, index) => (
              <article key={article.slug} className="group cursor-pointer">
                <Link href={`/editorial/${article.slug}`}>
                  <div className="aspect-[4/5] bg-gray-100 mb-4 overflow-hidden">
                    <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                      <div className="text-gray-400 text-4xl font-thin">
                        {index === 0 ? 'AI' : index === 1 ? '3D' : 'MAT'}
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-light tracking-wider text-black uppercase">
                        Editorial
                      </span>
                    </div>
                    <h3 className="text-black text-base font-light tracking-wide leading-tight group-hover:text-gray-600 transition-colors">
                      {article.title}
                    </h3>
                    <p className="text-gray-600 text-sm font-light leading-relaxed">
                      {article.excerpt}
                    </p>
                    <div className="flex items-center justify-between pt-2">
                      <span className="text-xs text-gray-500 font-light">
                        {article.author} | {new Date(article.date).toLocaleDateString('en-US', { 
                          month: 'short', 
                          day: 'numeric' 
                        })}
                      </span>
                    </div>
                  </div>
                </Link>
              </article>
            ))}
          </div>
        </section>

        {/* Featured Content Grid */}
        <section className="mb-24">
          <h2 className="text-2xl font-light tracking-wide text-black uppercase mb-12 text-center">
            Platform Features
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredContent.map((item, index) => (
              <article key={item.id} className="group cursor-pointer">
                <Link href={item.href}>
                  <div className="aspect-[4/5] bg-gray-100 mb-4 overflow-hidden">
                    <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                      <div className="text-gray-400 text-4xl font-thin">
                        {item.type === 'article' ? '📝' : item.type === 'feature' ? '🔧' : '🎯'}
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className={`text-xs font-light tracking-wider uppercase ${
                        item.category === 'COMING SOON' ? 'text-gray-400' : 'text-black'
                      }`}>
                        {item.category}
                      </span>
                    </div>
                    <h3 className={`text-base font-light tracking-wide leading-tight transition-colors ${
                      item.category === 'COMING SOON' 
                        ? 'text-gray-500' 
                        : 'text-black group-hover:text-gray-600'
                    }`}>
                      {item.title}
                    </h3>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500 font-light">
                        {item.type === 'article' ? 'Editorial' : 'Platform'} | {item.date}
                      </span>
                    </div>
                  </div>
                </Link>
              </article>
            ))}
          </div>
        </section>

        {/* Tools Section */}
        <section id="tools" className="mb-24 py-16 border-t border-gray-200">
          <div className="text-center">
            <h2 className="text-2xl font-light tracking-wide text-black uppercase mb-8">
              Maker Tools
            </h2>
            <p className="text-gray-600 font-light leading-relaxed max-w-2xl mx-auto mb-12">
              Evolving platform for 3D printing discovery, curation, and fulfillment.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              <div className="bg-gray-50 p-8 text-left">
                <h3 className="text-lg font-light tracking-wide text-black uppercase mb-4">
                  Discovery Engine
                </h3>
                <p className="text-gray-600 font-light leading-relaxed mb-4">
                  AI-powered search for trending, useful, and fun 3D prints via natural language prompts.
                </p>
                <div className="text-xs text-gray-500 font-light uppercase tracking-wider">
                  Phase 1 - Development
                </div>
              </div>
              
              <div className="bg-gray-50 p-8 text-left">
                <h3 className="text-lg font-light tracking-wide text-black uppercase mb-4">
                  Print Fulfillment
                </h3>
                <p className="text-gray-600 font-light leading-relaxed mb-4">
                  On-demand printing network connecting designs to local and online print services.
                </p>
                <div className="text-xs text-gray-500 font-light uppercase tracking-wider">
                  Phase 2 - Planned
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Newsletter Section */}
        <section id="newsletter" className="mt-24 py-16 border-t border-gray-200">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-2xl font-light tracking-wide text-black mb-6 uppercase">
              Weekly Curation
            </h2>
            <p className="text-gray-600 font-light leading-relaxed mb-8">
              Handpicked 3D printing discoveries, industry insights, and maker stories. 
              Be first to know about new tools, materials, and platform features.
            </p>
            <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto" id="newsletter-form">
              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 border border-gray-300 text-sm font-light placeholder-gray-400 focus:outline-none focus:border-black transition-colors"
                required
              />
              <button
                type="submit"
                className="px-6 py-3 bg-black text-white text-sm font-light uppercase tracking-wider hover:bg-gray-800 transition-colors"
              >
                Subscribe
              </button>
            </form>
            <p className="text-xs text-gray-500 font-light mt-4">
              Integration with Buttondown/ConvertKit coming soon
            </p>
          </div>
        </section>

        {/* Footer */}
        <footer className="mt-24 py-8 border-t border-gray-200">
          <div className="flex flex-col sm:flex-row justify-between items-center">
            <div className="text-xs text-gray-500 font-light uppercase tracking-wider mb-4 sm:mb-0">
              © 2024 HotendWeekly
            </div>
            <div className="flex space-x-6">
              <Link href="/editorial" className="text-xs text-gray-500 font-light uppercase tracking-wider hover:text-black transition-colors">
                Editorial
              </Link>
              <Link href="/discover" className="text-xs text-gray-500 font-light uppercase tracking-wider hover:text-black transition-colors">
                Discover
              </Link>
              <Link href="/tools" className="text-xs text-gray-500 font-light uppercase tracking-wider hover:text-black transition-colors">
                Tools
              </Link>
              <Link href="/newsletter" className="text-xs text-gray-500 font-light uppercase tracking-wider hover:text-black transition-colors">
                Newsletter
              </Link>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}
