export function CTASection() {
  return (
    <section className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 py-20 mx-6 lg:mx-8 rounded-3xl">
      <div className="max-w-5xl mx-auto px-6 lg:px-8 text-center">
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
          Create Stunning{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 italic">
            Images
          </span>{' '}
          in Minutes
        </h2>
        <p className="text-lg md:text-xl text-gray-300 mb-10 max-w-3xl mx-auto">
          From product photos to dynamic videos, HotendWeekly has everything you need to stand out.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <button className="bg-white text-gray-900 px-8 py-4 rounded-2xl font-semibold hover:bg-gray-100 transition-colors text-lg">
            Try Now
          </button>
          <button className="bg-gray-800 text-white px-8 py-4 rounded-2xl font-semibold hover:bg-gray-700 transition-colors text-lg flex items-center gap-3 border border-gray-700">
            <AppleIcon />
            Download on the App Store
          </button>
        </div>
      </div>
    </section>
  )
}

function AppleIcon() {
  return (
    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
    </svg>
  )
}
