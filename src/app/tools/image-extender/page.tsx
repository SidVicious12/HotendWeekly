'use client';

import Link from 'next/link';
import Navigation from '@/components/Navigation';

export default function ImageExtenderPage() {
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
                Extender
              </span>
              <br />
              <span className="text-3xl md:text-4xl text-gray-700">(Scale & Background)</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 max-w-4xl mx-auto">
              Expand the canvas of any 3D render by generating new content that seamlessly blends with the original scene to create larger compositions.
            </p>
          </div>
        </div>
      </section>

      {/* Main Visual Section */}
      <section className="pb-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-3xl p-12 shadow-2xl">
            <img
              src="/showcase/image-extender.png"
              alt="Image Extender Scale & Background Tool"
              className="w-full h-auto rounded-2xl"
            />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-16">
            Intelligent{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 italic">
              Extension
            </span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Canvas Expansion</h3>
              <p className="text-gray-600">
                Extend your images in any direction - create wider, taller, or panoramic compositions effortlessly.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <div className="w-14 h-14 bg-gradient-to-br from-pink-500 to-blue-500 rounded-2xl flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Seamless Blending</h3>
              <p className="text-gray-600">
                AI generates new content that perfectly matches the style, lighting, and perspective of your original image.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Aspect Ratio Freedom</h3>
              <p className="text-gray-600">
                Transform square images to widescreen, portrait to landscape, or any custom dimensions you need.
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
                <h3 className="text-xl font-bold text-gray-900 mb-4">Upload Your Image</h3>
                <p className="text-gray-600">
                  Start with any product photo or 3D render that needs expansion.
                </p>
              </div>

              {/* Step 2 */}
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-pink-600 to-blue-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-6">
                  2
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Choose Direction & Size</h3>
                <p className="text-gray-600">
                  Select which direction to extend and specify your desired canvas dimensions.
                </p>
              </div>

              {/* Step 3 */}
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-6">
                  3
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">AI Extends Seamlessly</h3>
                <p className="text-gray-600">
                  Get a perfectly extended image with natural-looking content that matches your original.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Use Cases Section */}
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
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Social Media Formats</h3>
                <p className="text-gray-600">
                  Adapt square images for Instagram Stories, Facebook banners, or YouTube thumbnails.
                </p>
              </div>
            </div>

            {/* Use Case 2 */}
            <div className="flex gap-4">
              <div className="w-12 h-12 bg-pink-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Banner Ads</h3>
                <p className="text-gray-600">
                  Create widescreen banners for websites, email headers, and digital advertising.
                </p>
              </div>
            </div>

            {/* Use Case 3 */}
            <div className="flex gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Product Photography</h3>
                <p className="text-gray-600">
                  Add context and breathing room around products for a more professional look.
                </p>
              </div>
            </div>

            {/* Use Case 4 */}
            <div className="flex gap-4">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Print Materials</h3>
                <p className="text-gray-600">
                  Extend images to fit brochures, catalogs, posters, and other print formats.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Grid */}
      <section className="pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-3xl p-12 shadow-xl">
            <h2 className="text-4xl md:text-5xl font-bold text-center mb-16">
              Key{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 italic">
                Benefits
              </span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {['No reshooting required', 'Perfect perspective matching', 'Natural lighting continuation', 'Context-aware generation', 'Multi-direction extension', 'Custom dimension support'].map((item, index) => (
                <div key={index} className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-gray-900 font-semibold">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="pb-20 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-3xl p-12 text-center shadow-2xl">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Expand Your Creative Canvas
            </h2>
            <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto">
              Transform any image into the perfect dimensions with AI-powered intelligent extension.
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
