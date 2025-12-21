'use client'

import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import {
  HeroSection,
  CategoryShowcase,
  TrustedBySection,
  StatsSection,
  TestimonialsSection,
  ToolkitSection,
  CTASection,
  FAQSection,
  SkipTheShootsSection,
  VideoMarketingSection
} from '@/components/landing'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-purple-50">
      <Navigation />

      <main>
        <HeroSection />
        <TrustedBySection />
        <div id="how-it-works" className="py-24 bg-gray-50">
          <div className="max-w-7xl mx-auto px-6 lg:px-8 mb-16 text-center">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">How it Works</h2>
            <p className="text-gray-600">Three simple steps to professional product photos.</p>
          </div>
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <CategoryShowcase />
          </div>
        </div>

        {/* <SkipTheShootsSection /> */}
        {/* <VideoMarketingSection /> */}

        <StatsSection />
        <ToolkitSection />
        <TestimonialsSection />
        <CTASection />
        <FAQSection />
      </main>

      <Footer />
    </div>
  )
}
