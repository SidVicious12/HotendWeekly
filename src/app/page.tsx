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
          <div className="max-w-4xl mx-auto px-6 lg:px-8 mb-16 text-center">

            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              How to photograph 3D prints for Etsy
            </h2>
            <p className="text-lg text-gray-600 mb-12">
              Hotend Weekly gives you AI tools to fix lighting, remove cluttered workbenches,
              and generate studio-quality photos for your Etsy listings in seconds.
            </p>

            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Best product photography tools for 3D printing sellers
            </h2>
            <p className="text-lg text-gray-600 mb-4">
              From background removal to print scene generation, you can process hundreds of
              listing images a month with Pro and Premium plans.
            </p>

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
