'use client'

import Link from 'next/link'
import { useState } from 'react'
import { articles } from '@/data/articles'

export default function EditorialPage() {
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

      {/* Editorial Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <h1 className="text-3xl font-light tracking-wide text-black uppercase mb-4">
            Editorial
          </h1>
          <p className="text-gray-600 font-light leading-relaxed max-w-2xl mx-auto">
            Curated insights and analysis from the world of 3D printing technology, materials innovation, and digital manufacturing.
          </p>
        </div>
      </div>

      {/* Articles Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {articles.map((article, index) => (
            <article key={article.slug} className="group cursor-pointer">
              <Link href={`/editorial/${article.slug}`}>
                <div className="aspect-[4/5] bg-gray-100 mb-4 overflow-hidden">
                  <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                    <div className="text-gray-400 text-6xl font-thin">
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
                  <h2 className="text-black text-base font-light tracking-wide leading-tight group-hover:text-gray-600 transition-colors">
                    {article.title}
                  </h2>
                  <p className="text-gray-600 text-sm font-light leading-relaxed line-clamp-3">
                    {article.excerpt}
                  </p>
                  <div className="flex items-center justify-between pt-2">
                    <span className="text-xs text-gray-500 font-light">
                      {article.author} | {new Date(article.date).toLocaleDateString('en-US', { 
                        month: 'short', 
                        day: 'numeric' 
                      })}
                    </span>
                    <span className="text-xs text-black font-light uppercase tracking-wider">
                      Read more →
                    </span>
                  </div>
                </div>
              </Link>
            </article>
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-gray-200 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
        </div>
      </footer>
    </div>
  )
}