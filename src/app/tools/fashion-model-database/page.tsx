'use client';

import Link from 'next/link';
import Navigation from '@/components/Navigation';

export default function FashionModelDatabasePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      {/* Navigation */}
      <Navigation />

      {/* Header/Hero Section */}
      <section className="pt-20 pb-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <Link href="/" className="inline-flex items-center gap-2 text-purple-600 hover:text-purple-700 mb-6">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Home
            </Link>
            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6">
              Diversified{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 italic">
                Fashion Model
              </span>
              <br />
              Database
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 max-w-4xl mx-auto">
              Discover the industry's most diverse AI fashion models - representing all body types, ethnicities, and generations.
            </p>
          </div>
        </div>
      </section>

      {/* Main Visual Section */}
      <section className="pb-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-3xl p-12 shadow-2xl">
            <img
              src="/showcase/fashion-model-database.jpeg"
              alt="Diversified Fashion Model Database Showcase"
              className="w-full h-auto rounded-2xl"
            />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-16">
            Why Choose Our{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 italic">
              Model Database
            </span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">All Body Types</h3>
              <p className="text-gray-600">
                From petite to plus-size, our AI models represent every body type, ensuring your products resonate with all customers.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <div className="w-14 h-14 bg-gradient-to-br from-pink-500 to-blue-500 rounded-2xl flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Global Diversity</h3>
              <p className="text-gray-600">
                Represent every ethnicity and culture with our globally diverse collection of AI fashion models.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">All Generations</h3>
              <p className="text-gray-600">
                From Gen Z to seniors, showcase your fashion on models of all ages and connect with every demographic.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-3xl p-12 shadow-xl">
            <h2 className="text-4xl md:text-5xl font-bold text-center mb-16">
              How It{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 italic">
                Works
              </span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              {/* Step 1 */}
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-6">
                  1
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Upload Your Product</h3>
                <p className="text-gray-600">
                  Start with a single product image - clothing, accessories, or any fashion item.
                </p>
              </div>

              {/* Step 2 */}
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-pink-600 to-blue-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-6">
                  2
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Choose Your Model</h3>
                <p className="text-gray-600">
                  Select from our diverse database - filter by body type, ethnicity, age, and style.
                </p>
              </div>

              {/* Step 3 */}
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-6">
                  3
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Generate Instantly</h3>
                <p className="text-gray-600">
                  AI places your product on the selected model with realistic fit, lighting, and pose.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="pb-20 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-3xl p-12 text-center shadow-2xl">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Ready to Showcase Your Fashion?
            </h2>
            <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto">
              Join thousands of brands using our diverse AI model database to create inclusive, engaging product imagery.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-white text-gray-900 px-8 py-4 rounded-2xl font-semibold hover:bg-gray-100 transition-colors text-lg">
                Try It Free
              </button>
              <Link href="/pricing" className="bg-gray-800 text-white px-8 py-4 rounded-2xl font-semibold hover:bg-gray-700 transition-colors text-lg border border-gray-700">
                View Pricing
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
