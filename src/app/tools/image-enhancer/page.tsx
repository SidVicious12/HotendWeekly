'use client';

import Link from 'next/link';
import Navigation from '@/components/Navigation';

export default function ImageEnhancerPage() {
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
              Image{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 italic">
                Enhancer
              </span>
              <br />
              <span className="text-3xl md:text-4xl text-gray-700">(Clarity & Detail)</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 max-w-4xl mx-auto">
              Transform low-resolution blurry 3D scans into crisp, highly detailed visuals, revealing hidden details.
            </p>
          </div>
        </div>
      </section>

      {/* Main Visual Section */}
      <section className="pb-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-3xl p-12 shadow-2xl">
            <img
              src="/showcase/image-enhancer.png"
              alt="Image Enhancer Clarity & Detail Tool"
              className="w-full h-auto rounded-2xl"
            />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-16">
            AI-Powered{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 italic">
              Enhancement
            </span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Crystal Clear Quality</h3>
              <p className="text-gray-600">
                AI upscaling technology transforms blurry images into sharp, professional-quality visuals.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <div className="w-14 h-14 bg-gradient-to-br from-pink-500 to-blue-500 rounded-2xl flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Detail Recovery</h3>
              <p className="text-gray-600">
                Reveal hidden details in your product photos - textures, patterns, and fine features become visible.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Resolution Upscaling</h3>
              <p className="text-gray-600">
                Increase image resolution up to 4x without losing quality - perfect for large format printing.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Before/After Comparisons */}
      <section className="pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-3xl p-12 shadow-xl">
            <h2 className="text-4xl md:text-5xl font-bold text-center mb-16">
              See the{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 italic">
                Difference
              </span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Benefit 1 */}
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-6">
                  4x
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Resolution Increase</h3>
                <p className="text-gray-600">
                  Upscale images up to 400% larger while maintaining crisp detail.
                </p>
              </div>

              {/* Benefit 2 */}
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-pink-600 to-blue-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-6">
                  10x
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">More Detail</h3>
                <p className="text-gray-600">
                  AI reveals details invisible in the original low-resolution image.
                </p>
              </div>

              {/* Benefit 3 */}
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-6">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Print Ready</h3>
                <p className="text-gray-600">
                  Enhanced images perfect for billboards, posters, and large-format displays.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-16">
            Perfect{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 italic">
              For
            </span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Use Case 1 */}
            <div className="flex gap-4">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Old Product Photos</h3>
                <p className="text-gray-600">
                  Restore and enhance legacy product images without expensive reshoots.
                </p>
              </div>
            </div>

            {/* Use Case 2 */}
            <div className="flex gap-4">
              <div className="w-12 h-12 bg-pink-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Print Marketing</h3>
                <p className="text-gray-600">
                  Prepare images for billboards, posters, and large-format advertising.
                </p>
              </div>
            </div>

            {/* Use Case 3 */}
            <div className="flex gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">3D Scans</h3>
                <p className="text-gray-600">
                  Enhance blurry 3D scans and renders for photorealistic quality.
                </p>
              </div>
            </div>

            {/* Use Case 4 */}
            <div className="flex gap-4">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Zoom-In Details</h3>
                <p className="text-gray-600">
                  Show product details with crystal clarity for close-up examination.
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
              Enhance Your Images Today
            </h2>
            <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto">
              Transform blurry, low-resolution photos into stunning, high-quality images with AI-powered enhancement.
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
