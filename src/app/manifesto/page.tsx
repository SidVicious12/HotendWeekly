'use client';

import Navigation from '@/components/Navigation';
import Link from 'next/link';

export default function ManifestoPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      {/* Navigation */}
      <Navigation />

      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-6 pt-32 pb-16 text-center">
          <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6">
            The{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 italic">
              Maker's
            </span>{' '}
            Manifesto
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            A declaration for every creator who believes that innovation should be accessible to all
          </p>
        </div>
      </div>

      {/* Main Manifesto Content */}
      <div className="max-w-4xl mx-auto px-6 pb-20">
        <div className="bg-white rounded-3xl p-10 md:p-16 shadow-xl">
          <div className="prose prose-lg max-w-none">
            <div className="text-gray-800 space-y-6 text-lg leading-relaxed">
              <p className="text-2xl font-semibold text-gray-900 mb-8">
                We believe in the power of making.
              </p>

              <p>
                Every layer printed, every design refined, every prototype brought to life represents more than just plastic and precision. It represents human creativity unleashed. It represents the democratization of manufacturing. It represents the future being built in garages, makerspaces, and kitchen tables around the world.
              </p>

              <p>
                For too long, professional-quality product photography has been a barrier between makers and their markets. Studio lighting, expensive equipment, professional photographers—these gatekeepers stood between your creations and the customers who needed to see them. <strong>We're changing that.</strong>
              </p>

              <p>
                HotendWeekly exists because we believe that <strong>technology should empower creators, not exclude them</strong>. AI shouldn't be a black box controlled by corporations. It should be a tool in every maker's hands—as accessible as a slicer, as essential as a well-calibrated bed.
              </p>

              <p className="text-xl font-semibold text-purple-700 italic my-8 py-6 border-l-4 border-purple-600 pl-6">
                "If you can print it, you should be able to showcase it beautifully."
              </p>

              <p>
                This is our commitment to the maker community: <strong>AI-powered tools that are as intuitive as they are powerful</strong>. No learning curve steeper than your first benchy. No subscription more expensive than a roll of premium filament. No barrier between your workshop and the world market.
              </p>

              <p>
                We celebrate the tinkerers who spend hours dialing in that perfect temperature. We honor the creators who iterate dozens of times to get it just right. We support the entrepreneurs who turn their passion projects into sustainable businesses. <strong>You are the innovators. You are the future of manufacturing. You are why we build.</strong>
              </p>

              <p>
                Whether you're printing miniatures for tabletop games, functional parts that solve real problems, artistic sculptures that push boundaries, or custom products that serve niche markets—<strong>your work deserves to be seen in its best light</strong>. Not just by your local community, but by the global marketplace that's hungry for unique, custom, made-to-order solutions.
              </p>

              <p>
                The barrier to entry for quality has never been lower. A $200 printer can produce parts that would have cost thousands a decade ago. Your smartphone has more computing power than the machines that sent humans to the moon. And now, <strong>AI tools can give you photography capabilities that rival professional studios</strong>—all with a single click.
              </p>

              <p className="text-2xl font-semibold text-gray-900 mt-10 mb-6">
                This is the maker revolution.
              </p>

              <p>
                It's not about having the biggest print farm or the most expensive equipment. It's about creativity, persistence, and community. It's about solving problems and sharing solutions. It's about making what the world needs, even before the world knows it needs it.
              </p>

              <p>
                <strong>We stand with every maker who believes that the future is something you create, layer by layer.</strong> We provide the tools. You provide the vision. Together, we're building a world where anyone with an idea, a 3D printer, and the determination to bring it to life can compete on the global stage.
              </p>

              <p className="text-xl font-semibold text-purple-700 mt-10">
                Welcome to HotendWeekly.
              </p>

              <p className="text-xl font-semibold text-purple-700">
                Welcome to the maker revolution.
              </p>

              <p className="text-xl font-semibold text-purple-700 mb-12">
                Let's build the future together.
              </p>

              <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-8 mt-12">
                <p className="text-center text-gray-700 italic">
                  "The best way to predict the future is to create it. And the best way to showcase your creations is to let the world see them at their finest."
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="mt-16 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            Ready to showcase your creations?
          </h2>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/"
              className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-xl font-semibold hover:opacity-90 transition-opacity shadow-lg"
            >
              Start Creating
            </Link>
            <Link
              href="/pricing"
              className="bg-white text-gray-900 px-8 py-4 rounded-xl font-semibold hover:bg-gray-50 transition-colors shadow-lg border-2 border-gray-200"
            >
              View Pricing
            </Link>
          </div>
          <p className="text-gray-600 mt-6">
            Join thousands of makers transforming their 3D printing business
          </p>
        </div>

        {/* Community Values Section */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white rounded-2xl p-8 shadow-lg text-center">
            <div className="text-4xl mb-4">🛠️</div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Empower Makers</h3>
            <p className="text-gray-600">
              Professional tools accessible to everyone, from hobbyists to established businesses
            </p>
          </div>
          <div className="bg-white rounded-2xl p-8 shadow-lg text-center">
            <div className="text-4xl mb-4">🚀</div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Innovation First</h3>
            <p className="text-gray-600">
              Continuously pushing boundaries to bring cutting-edge AI tools to the maker community
            </p>
          </div>
          <div className="bg-white rounded-2xl p-8 shadow-lg text-center">
            <div className="text-4xl mb-4">🤝</div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Community Driven</h3>
            <p className="text-gray-600">
              Built by makers, for makers. Your feedback shapes the tools we create
            </p>
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
                <li><a href="/manifesto" className="text-gray-400 hover:text-white transition-colors">Manifesto</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Blog</a></li>
                <li><a href="/tools" className="text-gray-400 hover:text-white transition-colors">Tools</a></li>
                <li><a href="/pricing" className="text-gray-400 hover:text-white transition-colors">Pricing</a></li>
              </ul>
            </div>

            {/* TOOLS Column */}
            <div>
              <h4 className="font-bold text-white mb-4">TOOLS</h4>
              <ul className="space-y-3">
                <li><a href="/tools" className="text-gray-400 hover:text-white transition-colors">All Tools</a></li>
                <li><a href="/tools/background-remover" className="text-gray-400 hover:text-white transition-colors">Background Remover</a></li>
                <li><a href="/tools/image-extender" className="text-gray-400 hover:text-white transition-colors">Image Extender</a></li>
                <li><a href="/tools/image-enhancer" className="text-gray-400 hover:text-white transition-colors">Image Enhancer</a></li>
              </ul>
            </div>

            {/* Second TOOLS Column */}
            <div>
              <h4 className="font-bold text-white mb-4 opacity-0">TOOLS</h4>
              <ul className="space-y-3">
                <li><a href="/tools/magic-eraser" className="text-gray-400 hover:text-white transition-colors">Magic Eraser</a></li>
                <li><a href="/tools/image-retouch" className="text-gray-400 hover:text-white transition-colors">Image Retouch</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Transform to 3D</a></li>
              </ul>
            </div>

            {/* COMPANY Column */}
            <div>
              <h4 className="font-bold text-white mb-4">COMPANY</h4>
              <ul className="space-y-3">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Terms of Service</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Privacy Policy</a></li>
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
