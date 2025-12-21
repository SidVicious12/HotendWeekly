'use client';

import Link from 'next/link';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { ToolStatusBadge, type ToolStatus } from '@/components/ToolStatusBadge';

interface Feature {
  title: string;
  description: string;
}

interface ComingSoonToolProps {
  name: string;
  tagline: string;
  description: string;
  status: ToolStatus;
  category: string;
  features: Feature[];
  useCases: string[];
  gradientFrom?: string;
  gradientTo?: string;
}

export function ComingSoonTool({
  name,
  tagline,
  description,
  status,
  category,
  features,
  useCases,
  gradientFrom = 'purple-600',
  gradientTo = 'pink-600'
}: ComingSoonToolProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-purple-50">
      <Navigation />

      {/* Header */}
      <section className="pt-20 pb-12 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <Link href="/tools" className="inline-flex items-center gap-2 text-purple-600 hover:text-purple-700 mb-6">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Tools
          </Link>

          <div className="flex justify-center mb-4">
            <ToolStatusBadge status={status} />
          </div>

          <span className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2 block">
            {category}
          </span>

          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            <span className={`text-transparent bg-clip-text bg-gradient-to-r from-${gradientFrom} to-${gradientTo}`}>
              {name}
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-600 mb-4">
            {tagline}
          </p>
          
          <p className="text-lg text-gray-500 max-w-2xl mx-auto">
            {description}
          </p>
        </div>
      </section>

      {/* Notify Me Section */}
      <section className="pb-12 px-6">
        <div className="max-w-xl mx-auto">
          <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100 text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-pink-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">
              Be the First to Know
            </h3>
            <p className="text-gray-600 mb-6">
              Sign up to get notified when {name} launches.
            </p>
            <Link
              href="/auth/signup"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-full font-semibold hover:from-purple-700 hover:to-pink-700 transition-all"
            >
              <span>Get Early Access</span>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            What You'll Be Able to Do
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-gray-50 rounded-2xl p-6">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mb-4">
                  <span className="text-white font-bold text-lg">{index + 1}</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Use Cases Section */}
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            Perfect For
          </h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {useCases.map((useCase, index) => (
              <div key={index} className="flex items-center gap-3 bg-white rounded-xl p-4 shadow-sm">
                <svg className="w-6 h-6 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-gray-700">{useCase}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            Can't Wait? Try Our Live Tools
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            While you wait for {name}, check out our other AI tools that are ready to use today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/tools/background-remover"
              className="bg-green-600 text-white px-8 py-4 rounded-full font-semibold hover:bg-green-700 transition-colors"
            >
              Try Background Remover
            </Link>
            <Link
              href="/tools"
              className="bg-gray-100 text-gray-700 px-8 py-4 rounded-full font-semibold hover:bg-gray-200 transition-colors"
            >
              View All Tools
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
