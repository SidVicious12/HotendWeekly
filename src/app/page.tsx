'use client'

import { useAuth } from '@/contexts/AuthContext'
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
  UploadSection
} from '@/components/landing'

export default function HomePage() {
  const { user } = useAuth()

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      <Navigation />
      
      <HeroSection userEmail={user?.email} />
      
      <section className="max-w-7xl mx-auto px-6 lg:px-8">
        <CategoryShowcase />
      </section>
      
      <TrustedBySection />
      <StatsSection />
      <TestimonialsSection />
      <ToolkitSection />
      <CTASection />
      
      <UploadSection />
      
      <FAQSection />
      <Footer />
    </div>
  )
}
