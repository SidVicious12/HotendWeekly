'use client';

import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      <Navigation />

      {/* Header */}
      <div className="text-center pt-24 pb-12 px-6">
        <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 italic">
            Pricing
          </span>{' '}
          Plans
        </h1>
        <p className="text-lg md:text-xl text-gray-600 max-w-4xl mx-auto">
          Choose the perfect plan for your 3D printing business.
        </p>
      </div>

      {/* Plan Toggle */}
      <div className="flex justify-center mb-12 px-6">
        <div className="bg-white rounded-full p-2 shadow-lg inline-flex">
          <button className="px-8 py-3 rounded-full bg-white text-gray-900 font-semibold shadow-md">
            Monthly
          </button>
          <button className="px-8 py-3 rounded-full text-gray-600 font-semibold hover:bg-gray-50 transition-colors">
            Yearly
            <span className="ml-2 text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">20% OFF</span>
          </button>
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="max-w-7xl mx-auto px-6 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

          {/* Free Plan */}
          <div className="bg-white rounded-3xl p-8 shadow-lg border border-gray-100 flex flex-col">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Free</h3>
            <div className="mb-6">
              <span className="text-4xl font-bold text-gray-900">$0</span>
              <p className="text-sm text-gray-500 mt-2">For Lead generation & viral growth</p>
            </div>
            <ul className="space-y-4 mb-8 flex-1">
              <li className="flex items-start gap-2">
                <span className="text-purple-600 font-bold">✓</span>
                <span className="text-gray-700">5 images/month</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-600 font-bold">✓</span>
                <span className="text-gray-700">Basic background removal</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-600 font-bold">✓</span>
                <span className="text-gray-700">Community Access</span>
              </li>
            </ul>
            <button className="w-full bg-white border-2 border-gray-900 text-gray-900 py-3 rounded-xl font-bold hover:bg-gray-50 transition-colors">
              Get Started
            </button>
          </div>

          {/* Starter Plan */}
          <div className="bg-white rounded-3xl p-8 shadow-lg border border-gray-100 flex flex-col relative overflow-hidden">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Starter</h3>
            <div className="mb-6">
              <span className="text-4xl font-bold text-gray-900">$19</span>
              <span className="text-gray-500">/mo</span>
              <p className="text-sm text-gray-500 mt-2">For Hobbyist sellers</p>
            </div>
            <ul className="space-y-4 mb-8 flex-1">
              <li className="flex items-start gap-2">
                <span className="text-purple-600 font-bold">✓</span>
                <span className="text-gray-700">100 images/month</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-600 font-bold">✓</span>
                <span className="text-gray-700">Image Enhancement</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-600 font-bold">✓</span>
                <span className="text-gray-700">Marketplace templates</span>
              </li>
            </ul>
            <button className="w-full bg-gray-900 text-white py-3 rounded-xl font-bold hover:bg-gray-800 transition-colors">
              Subscribe
            </button>
          </div>

          {/* Pro Plan */}
          <div className="bg-gradient-to-b from-purple-600 to-indigo-700 rounded-3xl p-8 shadow-xl text-white flex flex-col relative transform md:-translate-y-4">
            <div className="absolute top-0 right-0 bg-yellow-400 text-purple-900 text-xs font-bold px-3 py-1 rounded-bl-xl uppercase tracking-wide">
              Most Popular
            </div>
            <h3 className="text-2xl font-bold mb-2">Pro</h3>
            <div className="mb-6">
              <span className="text-4xl font-bold">$49</span>
              <span className="text-purple-200">/mo</span>
              <p className="text-sm text-purple-200 mt-2">For Small businesses</p>
            </div>
            <ul className="space-y-4 mb-8 flex-1">
              <li className="flex items-start gap-2">
                <span className="text-yellow-400 font-bold">✓</span>
                <span>500 images/month</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-yellow-400 font-bold">✓</span>
                <span>Scene Generation</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-yellow-400 font-bold">✓</span>
                <span>Batch processing</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-yellow-400 font-bold">✓</span>
                <span>Brand kit</span>
              </li>
            </ul>
            <button className="w-full bg-white text-purple-600 py-3 rounded-xl font-bold hover:bg-gray-100 transition-colors">
              Go Pro
            </button>
          </div>

          {/* Enterprise */}
          <div className="bg-white rounded-3xl p-8 shadow-lg border border-gray-100 flex flex-col">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Enterprise</h3>
            <div className="mb-6">
              <span className="text-4xl font-bold text-gray-900">Custom</span>
              <p className="text-sm text-gray-500 mt-2">For Print farms & agencies</p>
            </div>
            <ul className="space-y-4 mb-8 flex-1">
              <li className="flex items-start gap-2">
                <span className="text-purple-600 font-bold">✓</span>
                <span className="text-gray-700">Unlimited images</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-600 font-bold">✓</span>
                <span className="text-gray-700">API Access</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-600 font-bold">✓</span>
                <span className="text-gray-700">White-label options</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-600 font-bold">✓</span>
                <span className="text-gray-700">Dedicated Support</span>
              </li>
            </ul>
            <button className="w-full bg-white border-2 border-gray-900 text-gray-900 py-3 rounded-xl font-bold hover:bg-gray-50 transition-colors">
              Contact Sales
            </button>
          </div>
        </div>

        {/* Premium Add-on */}
        <div className="max-w-3xl mx-auto mt-12">
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl p-6 border border-amber-200 flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl">✨</span>
                <h3 className="text-xl font-bold text-gray-900">Premium Add-on</h3>
                <span className="bg-amber-100 text-amber-800 text-xs px-2 py-1 rounded-full font-bold uppercase">For Designers</span>
              </div>
              <p className="text-gray-600 mb-1">Unlock <strong>20 Image-to-3D model conversions</strong> per month.</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="text-2xl font-bold text-gray-900">+$29</div>
                <div className="text-xs text-gray-500">/month</div>
              </div>
              <button className="bg-amber-500 hover:bg-amber-600 text-white px-6 py-2 rounded-lg font-bold transition-colors">
                Add to Plan
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="mt-20 max-w-4xl mx-auto px-6 pb-20">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
          Frequently Asked{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 italic">
            Questions
          </span>
        </h2>

        <div className="space-y-4">
          <details className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 group">
            <summary className="font-bold text-lg cursor-pointer list-none flex justify-between items-center">
              Is there a free trial?
              <svg className="w-6 h-6 text-gray-400 group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </summary>
            <p className="text-gray-600 mt-4">
              Yes, our Free plan includes 5 images per month so you can test our core features like background removal.
            </p>
          </details>

          <details className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 group">
            <summary className="font-bold text-lg cursor-pointer list-none flex justify-between items-center">
              Can I really use the images for Etsy/Shopify?
              <svg className="w-6 h-6 text-gray-400 group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </summary>
            <p className="text-gray-600 mt-4">
              Absolutely. You have full commercial rights to all images generated on paid plans (Starter, Pro, Enterprise).
            </p>
          </details>
        </div>
      </div>

      <Footer />
    </div>
  );
}
