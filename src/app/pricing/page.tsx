'use client';

import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      {/* Navigation */}
      <Navigation />

      {/* Header */}
      <div className="text-center pt-20 pb-12 px-6">
        <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 italic">
            Pricing
          </span>{' '}
          Plan
        </h1>
        <p className="text-lg md:text-xl text-gray-600 max-w-4xl mx-auto">
          Whether you need a simple image AI tool or a powerful AI tool that can drive high sales conversions, HotendWeekly is your best choice.
        </p>
      </div>

      {/* Plan Toggle */}
      <div className="flex justify-center mb-12 px-6">
        <div className="bg-white rounded-full p-2 shadow-lg inline-flex">
          <button className="px-8 py-3 rounded-full bg-white text-gray-900 font-semibold shadow-md">
            Yearly Plan
            <span className="ml-2 text-sm text-green-600">50% OFF</span>
          </button>
          <button className="px-8 py-3 rounded-full text-gray-600 font-semibold hover:bg-gray-50 transition-colors">
            Monthly Plan
          </button>
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="max-w-7xl mx-auto px-6 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Advanced Plan - Most Popular */}
          <div className="relative">
            <div className="absolute -top-4 left-0 right-0 flex justify-center">
              <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-2 rounded-full text-sm font-semibold flex items-center gap-2">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                Most Popular
              </div>
            </div>
            <div className="bg-white rounded-3xl p-8 shadow-xl border-2 border-purple-200 mt-4">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-2xl">👑</span>
                <h3 className="text-2xl font-bold text-gray-900">Advanced</h3>
                <span className="bg-orange-500 text-white text-xs px-2 py-1 rounded-full font-bold">50%OFF</span>
              </div>
              <div className="mb-6">
                <span className="text-gray-400 line-through text-xl">$99</span>
                <div className="flex items-baseline gap-1">
                  <span className="text-5xl font-bold text-gray-900">$49.5</span>
                  <span className="text-gray-600">/month</span>
                </div>
                <p className="text-sm text-gray-600 mt-2">For established brands and agencies needing advanced tools</p>
              </div>
              <button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-4 rounded-xl font-semibold hover:opacity-90 transition-opacity mb-4">
                Buy Now
              </button>
              <p className="text-xs text-gray-400 mb-6 flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Cancel anytime
              </p>
              <ul className="space-y-3">
                <li className="flex items-start gap-2">
                  <svg className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-gray-700">3,000 Credits/mo</span>
                </li>
                <li className="flex items-start gap-2">
                  <svg className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-gray-700">10 Scheduled Posts / day</span>
                </li>
                <li className="flex items-start gap-2">
                  <svg className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-gray-700">Process 5 Videos at Once</span>
                </li>
                <li className="flex items-start gap-2">
                  <svg className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-gray-700">Create Dynamic Videos up to 10s</span>
                </li>
                <li className="flex items-start gap-2">
                  <svg className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-gray-700">Pro-Level "Master Mode" Videos</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Growth Plan */}
          <div className="bg-white rounded-3xl p-8 shadow-lg">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-2xl">👑</span>
              <h3 className="text-2xl font-bold text-gray-900">Growth</h3>
              <span className="bg-orange-500 text-white text-xs px-2 py-1 rounded-full font-bold">50%OFF</span>
            </div>
            <div className="mb-6">
              <span className="text-gray-400 line-through text-xl">$79</span>
              <div className="flex items-baseline gap-1">
                <span className="text-5xl font-bold text-gray-900">$39.5</span>
                <span className="text-gray-600">/month</span>
              </div>
              <p className="text-sm text-gray-600 mt-2">For growing stores and marketing teams.</p>
            </div>
            <button className="w-full bg-black text-white py-4 rounded-xl font-semibold hover:bg-gray-800 transition-colors mb-4">
              Buy Now
            </button>
            <p className="text-xs text-gray-400 mb-6 flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Cancel anytime
            </p>
            <ul className="space-y-3">
              <li className="flex items-start gap-2">
                <svg className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-gray-700">600 Credits/mo</span>
              </li>
              <li className="flex items-start gap-2">
                <svg className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-gray-700">5 Scheduled Posts / day</span>
              </li>
              <li className="flex items-start gap-2">
                <svg className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-gray-700">Process 3 Videos at Once</span>
              </li>
              <li className="flex items-start gap-2">
                <svg className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-gray-700">Create Dynamic Videos up to 10s</span>
              </li>
              <li className="flex items-start gap-2">
                <svg className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-gray-700">Pro-Level "Master Mode" Videos</span>
              </li>
            </ul>
          </div>

          {/* Starter Plan */}
          <div className="bg-white rounded-3xl p-8 shadow-lg">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-2xl">👑</span>
              <h3 className="text-2xl font-bold text-gray-900">Starter</h3>
              <span className="bg-orange-500 text-white text-xs px-2 py-1 rounded-full font-bold">50%OFF</span>
            </div>
            <div className="mb-6">
              <span className="text-gray-400 line-through text-xl">$29</span>
              <div className="flex items-baseline gap-1">
                <span className="text-5xl font-bold text-gray-900">$14.5</span>
                <span className="text-gray-600">/month</span>
              </div>
              <p className="text-sm text-gray-600 mt-2">Perfect for new sellers and getting started.</p>
            </div>
            <button className="w-full bg-black text-white py-4 rounded-xl font-semibold hover:bg-gray-800 transition-colors mb-4">
              Buy Now
            </button>
            <p className="text-xs text-gray-400 mb-6 flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Cancel anytime
            </p>
            <ul className="space-y-3">
              <li className="flex items-start gap-2">
                <svg className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-gray-700">200 Credits/mo</span>
              </li>
              <li className="flex items-start gap-2">
                <svg className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-gray-700">5 Scheduled Posts / day</span>
              </li>
              <li className="flex items-start gap-2">
                <svg className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-gray-700">Process 3 Videos at Once</span>
              </li>
              <li className="flex items-start gap-2">
                <svg className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-gray-700">Create Dynamic Videos up to 10s</span>
              </li>
              <li className="flex items-start gap-2">
                <svg className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-gray-700">Pro-Level "Master Mode" Videos</span>
              </li>
            </ul>
          </div>

          {/* Free Plan */}
          <div className="bg-white rounded-3xl p-8 shadow-lg">
            <div className="flex items-center gap-2 mb-4">
              <h3 className="text-2xl font-bold text-gray-900">Free</h3>
            </div>
            <div className="mb-6">
              <div className="flex items-baseline gap-1">
                <span className="text-5xl font-bold text-gray-900">$0</span>
              </div>
              <p className="text-sm text-gray-600 mt-2">For solo innovators dipping their toes into AI-powered solutions.</p>
            </div>
            <button className="w-full bg-white border-2 border-gray-300 text-gray-900 py-4 rounded-xl font-semibold hover:bg-gray-50 transition-colors mb-4">
              Free Trial
            </button>
            <p className="text-xs text-transparent mb-6">.</p>
            <ul className="space-y-3">
              <li className="flex items-start gap-2">
                <svg className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-gray-700">20 Credits</span>
              </li>
              <li className="flex items-start gap-2">
                <svg className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-gray-700">5 Scheduled Posts</span>
              </li>
              <li className="flex items-start gap-2">
                <svg className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-gray-700">Process 1 Video at Once</span>
              </li>
              <li className="flex items-start gap-2">
                <svg className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-gray-700">1 Own Model in Swap Fashion Model</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Contact CTA */}
        <div className="text-center py-12">
          <p className="text-lg text-gray-700">
            Need more credits?{' '}
            <a href="#contact" className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600 font-semibold hover:underline">
              Contact us
            </a>{' '}
            for Customized Solutions
          </p>
        </div>

        {/* Compare Plans Section */}
        <div className="bg-white rounded-3xl p-8 md:p-12 shadow-xl">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-12">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 italic">
              Compare
            </span>{' '}
            Plans
          </h2>

          {/* Subscription Plans Header */}
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b-2 border-gray-200">
                  <th className="text-left py-6 px-4 align-top">
                    <div>
                      <div className="font-bold text-lg mb-4">Subscription Plans</div>
                      {/* Plan Toggle Inside Table */}
                      <div className="bg-gray-100 rounded-full p-1 inline-flex">
                        <button className="px-4 py-2 rounded-full bg-white text-gray-900 text-sm font-semibold shadow-sm">
                          Yearly Plan
                          <span className="ml-1 text-xs text-green-600">50% OFF</span>
                        </button>
                        <button className="px-4 py-2 rounded-full text-gray-600 text-sm font-semibold hover:bg-gray-50 transition-colors">
                          Monthly Plan
                        </button>
                      </div>
                    </div>
                  </th>
                  <th className="py-6 px-4 align-top">
                    <div className="relative p-4 rounded-2xl bg-gradient-to-br from-purple-600 via-pink-600 to-red-500">
                      <div className="bg-white rounded-xl p-4">
                        <div className="text-center">
                          <div className="flex items-center justify-center gap-2 mb-2">
                            <span className="text-xl">👑</span>
                            <span className="font-bold text-lg">Advanced</span>
                          </div>
                          <div className="text-sm text-gray-500 line-through">$99</div>
                          <div className="text-3xl font-bold">$49.5 <span className="text-sm font-normal text-gray-600">/month</span></div>
                          <button className="mt-3 w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-2 rounded-lg text-sm font-semibold hover:opacity-90">
                            Buy Now
                          </button>
                        </div>
                      </div>
                    </div>
                  </th>
                  <th className="py-6 px-4 align-top">
                    <div className="p-4 rounded-2xl border-2 border-gray-200">
                      <div className="bg-white rounded-xl p-4">
                        <div className="text-center">
                          <div className="flex items-center justify-center gap-2 mb-2">
                            <span className="text-xl">👑</span>
                            <span className="font-bold text-lg">Growth</span>
                          </div>
                          <div className="text-sm text-gray-500 line-through">$79</div>
                          <div className="text-3xl font-bold">$39.5 <span className="text-sm font-normal text-gray-600">/month</span></div>
                          <button className="mt-3 w-full bg-black text-white px-6 py-2 rounded-lg text-sm font-semibold hover:bg-gray-800">
                            Buy Now
                          </button>
                        </div>
                      </div>
                    </div>
                  </th>
                  <th className="py-6 px-4 align-top">
                    <div className="p-4 rounded-2xl border-2 border-gray-200">
                      <div className="bg-white rounded-xl p-4">
                        <div className="text-center">
                          <div className="flex items-center justify-center gap-2 mb-2">
                            <span className="text-xl">👑</span>
                            <span className="font-bold text-lg">Starter</span>
                          </div>
                          <div className="text-sm text-gray-500 line-through">$29</div>
                          <div className="text-3xl font-bold">$14.5 <span className="text-sm font-normal text-gray-600">/month</span></div>
                          <button className="mt-3 w-full bg-black text-white px-6 py-2 rounded-lg text-sm font-semibold hover:bg-gray-800">
                            Buy Now
                          </button>
                        </div>
                      </div>
                    </div>
                  </th>
                  <th className="py-6 px-4 align-top">
                    <div className="p-4 rounded-2xl border-2 border-gray-200">
                      <div className="bg-white rounded-xl p-4">
                        <div className="text-center">
                          <div className="font-bold text-lg mb-2">Free</div>
                          <div className="text-3xl font-bold mb-2">$0</div>
                          <button className="mt-3 w-full bg-white border-2 border-gray-300 text-gray-900 px-6 py-2 rounded-lg text-sm font-semibold hover:bg-gray-50">
                            Free Trial
                          </button>
                        </div>
                      </div>
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody>
                {/* Credits Benefits */}
                <tr className="border-b border-gray-100">
                  <td colSpan={5} className="py-4 px-4 font-bold text-lg bg-gray-50">Credits Benefits</td>
                </tr>
                <tr className="border-b border-gray-100 bg-white">
                  <td className="py-4 px-4 text-gray-700">Credits</td>
                  <td className="py-4 px-4 text-center font-semibold">3,000 credits/month</td>
                  <td className="py-4 px-4 text-center font-semibold">600 credits/month</td>
                  <td className="py-4 px-4 text-center font-semibold">200 credits/month</td>
                  <td className="py-4 px-4 text-center font-semibold">20 credits</td>
                </tr>
                <tr className="border-b border-gray-100 bg-gray-50">
                  <td className="py-4 px-4 text-gray-700">Unit Credit Price</td>
                  <td className="py-4 px-4 text-center font-semibold">$0.017 per credit</td>
                  <td className="py-4 px-4 text-center font-semibold">$0.066 per credit</td>
                  <td className="py-4 px-4 text-center font-semibold">$0.073 per credit</td>
                  <td className="py-4 px-4 text-center font-semibold">-</td>
                </tr>

                {/* Feature Benefits */}
                <tr className="border-b border-gray-100">
                  <td colSpan={5} className="py-4 px-4 font-bold text-lg bg-gray-50">Feature Benefits</td>
                </tr>
                {[
                  'Virtual Try-On (Apparel)',
                  'Virtual Try-On (Accessories)',
                  'Swap Fashion Model',
                  'Pose Changer',
                  'AI Product Image',
                  'AI Editor',
                ].map((feature, index) => (
                  <tr key={feature} className={`border-b border-gray-100 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                    <td className="py-4 px-4 text-gray-700">{feature}</td>
                    <td className="py-4 px-4 text-center">
                      <svg className="w-6 h-6 text-purple-600 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <svg className="w-6 h-6 text-purple-600 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <svg className="w-6 h-6 text-purple-600 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <svg className="w-6 h-6 text-purple-600 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </td>
                  </tr>
                ))}

                <tr className="border-b border-gray-100 bg-white">
                  <td className="py-4 px-4 text-gray-700">LipSync Video</td>
                  <td className="py-4 px-4 text-center">
                    <svg className="w-6 h-6 text-purple-600 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </td>
                  <td className="py-4 px-4 text-center">
                    <svg className="w-6 h-6 text-purple-600 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </td>
                  <td className="py-4 px-4 text-center font-semibold">-</td>
                  <td className="py-4 px-4 text-center font-semibold">-</td>
                </tr>

                {[
                  { name: 'Purchase Add-on Packages', adv: true, growth: true, starter: true, free: false },
                  { name: 'Download Without Watermark', adv: true, growth: true, starter: true, free: false },
                ].map((feature, index) => (
                  <tr key={feature.name} className={`border-b border-gray-100 ${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}`}>
                    <td className="py-4 px-4 text-gray-700">{feature.name}</td>
                    <td className="py-4 px-4 text-center">
                      {feature.adv ? (
                        <svg className="w-6 h-6 text-purple-600 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      ) : '-'}
                    </td>
                    <td className="py-4 px-4 text-center">
                      {feature.growth ? (
                        <svg className="w-6 h-6 text-purple-600 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      ) : '-'}
                    </td>
                    <td className="py-4 px-4 text-center">
                      {feature.starter ? (
                        <svg className="w-6 h-6 text-purple-600 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      ) : '-'}
                    </td>
                    <td className="py-4 px-4 text-center font-semibold">
                      {feature.free ? '✓' : '-'}
                    </td>
                  </tr>
                ))}

                {/* Other Benefits */}
                <tr className="border-b border-gray-100">
                  <td colSpan={5} className="py-4 px-4 font-bold text-lg bg-gray-50">Other Benefits</td>
                </tr>
                <tr className="border-b border-gray-100 bg-white">
                  <td className="py-4 px-4 text-gray-700">Linked Social Media Accounts</td>
                  <td className="py-4 px-4 text-center font-semibold">3</td>
                  <td className="py-4 px-4 text-center font-semibold">3</td>
                  <td className="py-4 px-4 text-center font-semibold">3</td>
                  <td className="py-4 px-4 text-center font-semibold">1</td>
                </tr>
                <tr className="border-b border-gray-100 bg-gray-50">
                  <td className="py-4 px-4 text-gray-700">Post Limit</td>
                  <td className="py-4 px-4 text-center font-semibold">10 /day</td>
                  <td className="py-4 px-4 text-center font-semibold">5 /day</td>
                  <td className="py-4 px-4 text-center font-semibold">5 /day</td>
                  <td className="py-4 px-4 text-center font-semibold">5 total</td>
                </tr>
                <tr className="border-b border-gray-100 bg-white">
                  <td className="py-4 px-4 text-gray-700">Concurrent Video Generation</td>
                  <td className="py-4 px-4 text-center font-semibold">5</td>
                  <td className="py-4 px-4 text-center font-semibold">3</td>
                  <td className="py-4 px-4 text-center font-semibold">3</td>
                  <td className="py-4 px-4 text-center font-semibold">1</td>
                </tr>
                <tr className="border-b border-gray-100 bg-gray-50">
                  <td className="py-4 px-4 text-gray-700">Max Video Length</td>
                  <td className="py-4 px-4 text-center font-semibold">10 s</td>
                  <td className="py-4 px-4 text-center font-semibold">10 s</td>
                  <td className="py-4 px-4 text-center font-semibold">10 s</td>
                  <td className="py-4 px-4 text-center font-semibold">5 s</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-20">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-12">
            Frequently Asked{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 italic">
              Questions
            </span>
          </h2>

          <div className="max-w-4xl mx-auto space-y-4">
            <details className="bg-white rounded-2xl p-6 shadow-lg group">
              <summary className="font-bold text-lg cursor-pointer list-none flex justify-between items-center">
                Is there a free trial available?
                <svg className="w-6 h-6 text-gray-600 group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <p className="text-gray-600 mt-4">
                Yes, we offer a free trial that you can start at any time without needing a credit card. This trial allows you to explore our standalone web platform and Shopify native application with 20 free credits, helping you decide if you want to upgrade to one of our paid plans.
              </p>
            </details>

            <details className="bg-white rounded-2xl p-6 shadow-lg group">
              <summary className="font-bold text-lg cursor-pointer list-none flex justify-between items-center">
                How do credits work?
                <svg className="w-6 h-6 text-gray-600 group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <p className="text-gray-600 mt-4">
                Credits are the currency used on HotendWeekly to generate images and videos. Each creation consumes a certain number of Credits:
                <br /><br />
                - Generating 1 image costs 1 Credit.<br />
                - Generating 1 video costs 10 Credits.
                <br /><br />
                Our monthly plans include a batch of credits you can use during that month. At the end of each month your credit balance will reset and you'll receive a new batch of credits according to the plan you're subscribed to.
              </p>
            </details>

            <details className="bg-white rounded-2xl p-6 shadow-lg group">
              <summary className="font-bold text-lg cursor-pointer list-none flex justify-between items-center">
                Can I use the images I create for commercial purposes?
                <svg className="w-6 h-6 text-gray-600 group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <p className="text-gray-600 mt-4">
                Absolutely, you have full ownership of the photos you create. For more details, please refer to our terms.
              </p>
            </details>

            <details className="bg-white rounded-2xl p-6 shadow-lg group">
              <summary className="font-bold text-lg cursor-pointer list-none flex justify-between items-center">
                Is my uploaded content used for AI training?
                <svg className="w-6 h-6 text-gray-600 group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <p className="text-gray-600 mt-4">
                No, we do not use uploaded or generated images for AI training. Using artificial images for training can actually reduce the photorealism of AI-generated images.
              </p>
            </details>

            <details className="bg-white rounded-2xl p-6 shadow-lg group">
              <summary className="font-bold text-lg cursor-pointer list-none flex justify-between items-center">
                Do unused image credits roll over to the next month?
                <svg className="w-6 h-6 text-gray-600 group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <p className="text-gray-600 mt-4">
                Any unused image credits will expire at the end of the month, so make sure to utilize them before your subscription renews.
              </p>
            </details>
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}
