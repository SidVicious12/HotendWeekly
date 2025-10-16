'use client';

import Navigation from '@/components/Navigation';

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
      <footer className="bg-black text-white py-16 mt-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-12">
            {/* Brand Section */}
            <div className="lg:col-span-1">
              <h3 className="text-xl font-bold mb-4">
                Supercharge Your Photos with AI<br />
                Boost Sales in Minutes.
              </h3>
              <p className="text-gray-400 mb-6">support@hotendweekly.com</p>

              {/* Social Icons */}
              <div className="flex items-center space-x-3">
                <a href="#" className="w-10 h-10 rounded-full bg-gray-800 hover:bg-gray-700 flex items-center justify-center transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                  </svg>
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-gray-800 hover:bg-gray-700 flex items-center justify-center transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-gray-800 hover:bg-gray-700 flex items-center justify-center transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                  </svg>
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-gray-800 hover:bg-gray-700 flex items-center justify-center transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678c-3.405 0-6.162 2.76-6.162 6.162 0 3.405 2.76 6.162 6.162 6.162 3.405 0 6.162-2.76 6.162-6.162 0-3.405-2.76-6.162-6.162-6.162zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405c0 .795-.646 1.44-1.44 1.44-.795 0-1.44-.646-1.44-1.44 0-.794.646-1.439 1.44-1.439.793-.001 1.44.645 1.44 1.439z"/>
                  </svg>
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-gray-800 hover:bg-gray-700 flex items-center justify-center transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M4.98 3.5c0 1.381-1.11 2.5-2.48 2.5s-2.48-1.119-2.48-2.5c0-1.38 1.11-2.5 2.48-2.5s2.48 1.12 2.48 2.5zm.02 4.5h-5v16h5v-16zm7.982 0h-4.968v16h4.969v-8.399c0-4.67 6.029-5.052 6.029 0v8.399h4.988v-10.131c0-7.88-8.922-7.593-11.018-3.714v-2.155z"/>
                  </svg>
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-gray-800 hover:bg-gray-700 flex items-center justify-center transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 640 512">
                    <path d="M524.531,69.836a1.5,1.5,0,0,0-.764-.7A485.065,485.065,0,0,0,404.081,32.03a1.816,1.816,0,0,0-1.923.91,337.461,337.461,0,0,0-14.9,30.6,447.848,447.848,0,0,0-134.426,0,309.541,309.541,0,0,0-15.135-30.6,1.89,1.89,0,0,0-1.924-.91A483.689,483.689,0,0,0,116.085,69.137a1.712,1.712,0,0,0-.788.676C39.068,183.651,18.186,294.69,28.43,404.354a2.016,2.016,0,0,0,.765,1.375A487.666,487.666,0,0,0,176.02,479.918a1.9,1.9,0,0,0,2.063-.676A348.2,348.2,0,0,0,208.12,430.4a1.86,1.86,0,0,0-1.019-2.588,321.173,321.173,0,0,1-45.868-21.853,1.885,1.885,0,0,1-.185-3.126c3.082-2.309,6.166-4.711,9.109-7.137a1.819,1.819,0,0,1,1.9-.256c96.229,43.917,200.41,43.917,295.5,0a1.812,1.812,0,0,1,1.924.233c2.944,2.426,6.027,4.851,9.132,7.16a1.884,1.884,0,0,1-.162,3.126,301.407,301.407,0,0,1-45.89,21.83,1.875,1.875,0,0,0-1,2.611,391.055,391.055,0,0,0,30.014,48.815,1.864,1.864,0,0,0,2.063.7A486.048,486.048,0,0,0,610.7,405.729a1.882,1.882,0,0,0,.765-1.352C623.729,277.594,590.933,167.465,524.531,69.836ZM222.491,337.58c-28.972,0-52.844-26.587-52.844-59.239S193.056,219.1,222.491,219.1c29.665,0,53.306,26.82,52.843,59.239C275.334,310.993,251.924,337.58,222.491,337.58Zm195.38,0c-28.971,0-52.843-26.587-52.843-59.239S388.437,219.1,417.871,219.1c29.667,0,53.307,26.82,52.844,59.239C470.715,310.993,447.538,337.58,417.871,337.58Z"/>
                  </svg>
                </a>
              </div>
            </div>

            {/* PAGES Column */}
            <div>
              <h4 className="font-bold text-white mb-4">PAGES</h4>
              <ul className="space-y-3">
                <li><a href="/" className="text-gray-400 hover:text-white transition-colors">Home</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Inspiration</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Tools</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Compare</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Partners</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Glossary</a></li>
              </ul>
            </div>

            {/* TOOLS Column */}
            <div>
              <h4 className="font-bold text-white mb-4">TOOLS</h4>
              <ul className="space-y-3">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">All Tools</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Background Swap</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Lifestyle Scene</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Multi-Angle Views</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Promo Posters</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">AI Pose Generator</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Image to Video</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Image Retouch</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Image Extender</a></li>
              </ul>
            </div>

            {/* Second TOOLS Column */}
            <div>
              <h4 className="font-bold text-white mb-4 opacity-0">TOOLS</h4>
              <ul className="space-y-3">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Background Replacer</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Background Remover</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Color Changer</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Magic Eraser</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Image Enhancer</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Product Spotlight</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Lifestyle Scene</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Instruct Edit</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">LipSync Video</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Product In Hand</a></li>
              </ul>
            </div>

            {/* COMPANY Column */}
            <div>
              <h4 className="font-bold text-white mb-4">COMPANY</h4>
              <ul className="space-y-3">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Term of Service</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Cookie Policy</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">DMCA Policy</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Security</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Contact Us</a></li>
              </ul>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center mb-4 md:mb-0">
              <svg className="w-6 h-6 text-purple-500 mr-2" fill="currentColor" viewBox="0 0 24 24">
                <path d="M13 3L4 14h7l-1 7 9-11h-7l1-7z"/>
              </svg>
              <span className="text-xl font-bold">HotendWeekly</span>
            </div>
            <p className="text-gray-400 text-sm">
              Copyright 2025 © HOTENDWEEKLY. | All rights reserved
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
