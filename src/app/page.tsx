// src/app/page.tsx

'use client'

import SearchInterface from '@/components/SearchInterface'
import NewsletterSignup from '@/components/NewsletterSignup'
import { useState } from 'react'

export default function HomePage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Navigation */}
      <nav className="border-b border-gray-800 bg-gray-950/90 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex-shrink-0">
              <h1 className="text-xl font-bold text-white">HotendWeekly</h1>
            </div>
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                <a href="#search" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors">
                  AI Search
                </a>
                <a href="#trending" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors">
                  Trending
                </a>
                <a href="#newsletter" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors">
                  Newsletter
                </a>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button className="hidden sm:block bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors">
                Get Started
              </button>
              <button 
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 rounded-md text-gray-300 hover:text-white hover:bg-gray-800 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
          
          {/* Mobile menu */}
          {mobileMenuOpen && (
            <div className="md:hidden border-t border-gray-800">
              <div className="px-2 pt-2 pb-3 space-y-1">
                <a href="#search" className="block text-gray-300 hover:text-white px-3 py-2 rounded-md text-base font-medium">
                  AI Search
                </a>
                <a href="#trending" className="block text-gray-300 hover:text-white px-3 py-2 rounded-md text-base font-medium">
                  Trending
                </a>
                <a href="#newsletter" className="block text-gray-300 hover:text-white px-3 py-2 rounded-md text-base font-medium">
                  Newsletter
                </a>
                <button className="w-full text-left bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-md text-base font-medium transition-colors">
                  Get Started
                </button>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <main className="relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16 text-center lg:pt-32">
          <h1 className="mx-auto max-w-4xl font-display text-5xl font-medium tracking-tight text-slate-100 sm:text-7xl">
            Turn{' '}
            <span className="relative whitespace-nowrap text-blue-400">
              ideas into prints
            </span>{' '}
            in minutes
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg tracking-tight text-slate-300">
            Discover trending 3D models with AI-powered search. From concept to your doorstep.
          </p>
          <div className="mt-10 flex justify-center gap-x-6">
            <button className="group inline-flex items-center justify-center rounded-full py-4 px-8 text-sm font-semibold focus:outline-none bg-blue-600 text-white hover:bg-blue-500 active:bg-blue-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600">
              Find my first print
            </button>
            <button className="group inline-flex ring-1 items-center justify-center rounded-full py-4 px-8 text-sm focus:outline-none ring-slate-200 text-slate-200 hover:text-slate-100 hover:ring-slate-300 active:bg-slate-100 active:text-slate-600 focus-visible:outline-blue-600 focus-visible:ring-slate-300">
              <svg className="h-3 w-3 flex-none fill-blue-300 group-active:fill-current" viewBox="0 0 16 16" aria-hidden="true">
                <path d="M8 0a8 8 0 1 1 0 16A8 8 0 0 1 8 0ZM1.5 8a6.5 6.5 0 1 0 13 0 6.5 6.5 0 0 0-13 0Zm7-3.25v2.992l2.69.348a.75.75 0 0 1-.138 1.49l-3.25-.42a.75.75 0 0 1-.652-.732V4.75a.75.75 0 0 1 1.5 0Z"/>
              </svg>
              <span className="ml-3">Watch demo</span>
            </button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="py-24 sm:py-32">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-2xl lg:text-center">
              <h2 className="text-base font-semibold leading-7 text-blue-400">Smart Discovery</h2>
              <p className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">
                AI-powered 3D printing discovery
              </p>
              <p className="mt-6 text-lg leading-8 text-gray-300">
                Our intelligent platform connects you with the perfect 3D models and printing services.
              </p>
            </div>
            <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
              <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
                <div className="flex flex-col">
                  <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-white">
                    <div className="h-5 w-5 flex-none bg-blue-400 rounded-full" />
                    AI Search
                  </dt>
                  <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-300">
                    <p className="flex-auto">Natural language search for 3D models. Just describe what you need.</p>
                  </dd>
                </div>
                <div className="flex flex-col">
                  <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-white">
                    <div className="h-5 w-5 flex-none bg-blue-400 rounded-full" />
                    Instant Printing
                  </dt>
                  <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-300">
                    <p className="flex-auto">Connect to local and online print services for immediate fulfillment.</p>
                  </dd>
                </div>
                <div className="flex flex-col">
                  <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-white">
                    <div className="h-5 w-5 flex-none bg-blue-400 rounded-full" />
                    Weekly Curation
                  </dt>
                  <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-300">
                    <p className="flex-auto">Handpicked trending models delivered to your inbox every week.</p>
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-gray-900 py-16 sm:py-24">
          <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
            <div className="relative isolate overflow-hidden bg-gray-800 px-6 pt-16 shadow-2xl sm:rounded-3xl sm:px-16 md:pt-24 lg:flex lg:gap-x-20 lg:px-24 lg:pt-0">
              <div className="mx-auto max-w-md text-center lg:mx-0 lg:flex-auto lg:py-32 lg:text-left">
                <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                  Start discovering amazing prints today
                </h2>
                <p className="mt-6 text-lg leading-8 text-gray-300">
                  Join thousands of makers finding their next favorite 3D print.
                </p>
                <div className="mt-10 flex items-center justify-center gap-x-6 lg:justify-start">
                  <button className="rounded-md bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600">
                    Get started for free
                  </button>
                </div>
              </div>
              <div className="relative mt-16 h-80 lg:mt-8">
                <div className="absolute left-0 top-0 w-[57rem] max-w-none rounded-md bg-gray-700 ring-1 ring-white/10"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Search Interface */}
        <section id="search">
          <SearchInterface />
        </section>

        {/* Newsletter Signup */}
        <section id="newsletter">
          <NewsletterSignup />
        </section>
      </main>
    </div>
  );
}
