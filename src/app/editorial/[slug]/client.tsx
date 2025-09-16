'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Article } from '@/data/articles'

interface ArticlePageClientProps {
  article: Article
}

export default function ArticlePageClient({ article }: ArticlePageClientProps) {
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

      {/* Article Content */}
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Back to Editorial */}
        <div className="mb-12">
          <Link href="/editorial" className="inline-flex items-center text-black hover:text-gray-600 transition-colors text-sm font-light uppercase tracking-wider">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            Editorial
          </Link>
        </div>

        {/* Article Header */}
        <header className="mb-16">
          <div className="flex items-center gap-x-4 text-xs text-gray-500 font-light uppercase tracking-wider mb-8">
            <span>Editorial</span>
            <time dateTime={article.date}>
              {new Date(article.date).toLocaleDateString('en-US', { 
                month: 'short', 
                day: 'numeric',
                year: 'numeric'
              })}
            </time>
          </div>
          
          <h1 className="text-3xl md:text-4xl font-light tracking-wide text-black leading-tight mb-8 uppercase">
            {article.title}
          </h1>
          
          <p className="text-lg text-gray-600 font-light leading-relaxed max-w-3xl">
            {article.excerpt}
          </p>
          
          <div className="mt-8 flex flex-wrap gap-2">
            {article.tags.map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 bg-gray-100 text-gray-600 text-xs font-light uppercase tracking-wider"
              >
                {tag}
              </span>
            ))}
          </div>
        </header>

        {/* Article Body */}
        <div className="prose prose-lg max-w-none">
          <div 
            className="text-gray-800 leading-relaxed font-light"
            dangerouslySetInnerHTML={{ 
              __html: article.content
                .split('\n\n')
                .map(paragraph => {
                  if (paragraph.startsWith('# ')) {
                    return `<h1 class="text-2xl font-light text-black mt-16 mb-6 uppercase tracking-wide">${paragraph.slice(2)}</h1>`
                  } else if (paragraph.startsWith('## ')) {
                    return `<h2 class="text-xl font-light text-black mt-12 mb-4 uppercase tracking-wide">${paragraph.slice(3)}</h2>`
                  } else if (paragraph.startsWith('### ')) {
                    return `<h3 class="text-lg font-light text-black mt-8 mb-3 uppercase tracking-wide">${paragraph.slice(4)}</h3>`
                  } else if (paragraph.startsWith('**') && paragraph.endsWith('**')) {
                    return `<p class="text-gray-800 leading-relaxed mb-6 font-normal">${paragraph.slice(2, -2)}</p>`
                  } else if (paragraph.includes('**')) {
                    return `<p class="text-gray-800 leading-relaxed mb-6 font-light">${paragraph.replace(/\*\*(.*?)\*\*/g, '<strong class="font-normal">$1</strong>')}</p>`
                  } else if (paragraph.startsWith('*') && paragraph.endsWith('*')) {
                    return `<p class="text-gray-600 leading-relaxed mb-6 font-light italic">${paragraph.slice(1, -1)}</p>`
                  } else {
                    return `<p class="text-gray-800 leading-relaxed mb-6 font-light">${paragraph}</p>`
                  }
                })
                .join('')
            }}
          />
        </div>

        {/* Article Footer */}
        <footer className="mt-24 pt-8 border-t border-gray-200">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
            <div className="text-xs text-gray-500 font-light uppercase tracking-wider mb-4 sm:mb-0">
              By {article.author} | {new Date(article.date).toLocaleDateString('en-US', { 
                month: 'long', 
                day: 'numeric',
                year: 'numeric'
              })}
            </div>
            <div className="text-xs text-gray-500 font-light uppercase tracking-wider">
              HotendWeekly Editorial
            </div>
          </div>
        </footer>
      </article>
    </div>
  )
}