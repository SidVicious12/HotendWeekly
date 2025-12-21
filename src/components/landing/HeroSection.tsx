import Link from 'next/link';
import { Star, ArrowRight } from 'lucide-react';

export function HeroSection() {
  return (
    <section className="relative pt-32 pb-20 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center relative z-10">

        {/* Social Proof Badge */}
        <div className="inline-flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-full px-4 py-1.5 mb-8 animate-fade-in">
          <div className="flex -space-x-1">
            {[1, 2, 3, 4, 5].map((_, i) => (
              <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            ))}
          </div>
          <span className="text-sm font-medium text-gray-600">Loved by 10,000+ Makers</span>
        </div>

        {/* Main Headline */}
        <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight text-gray-900 mb-8 leading-[1.1]">
          Make Your Prints <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-pink-500 to-orange-400">
            Look Professional
          </span>
        </h1>

        <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed">
          Transform raw 3D print photos into stunning product shots with AI.
          Remove layer lines, fix lighting, and add studio backgrounds in seconds.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20">
          <Link
            href="/auth/signup"
            className="w-full sm:w-auto px-8 py-4 bg-black text-white rounded-full font-semibold text-lg hover:bg-gray-800 transition-all hover:scale-105 flex items-center justify-center gap-2"
          >
            Start Free Trial
            <ArrowRight className="w-5 h-5" />
          </Link>
          <Link
            href="/demo"
            className="w-full sm:w-auto px-8 py-4 bg-white text-gray-900 border border-gray-200 rounded-full font-semibold text-lg hover:bg-gray-50 transition-all hover:border-gray-300"
          >
            See Examples
          </Link>
        </div>

        {/* Hero Visual Match */}
        <div className="relative mx-auto max-w-5xl rounded-3xl overflow-hidden shadow-2xl border border-gray-100 bg-gray-50 aspect-[16/9] group">
          <div className="absolute inset-0 bg-gradient-to-tr from-purple-500/10 to-orange-500/10 opacity-50" />

          {/* Compare Slider Placeholder */}
          <div className="absolute inset-0 flex items-center justify-center">
            <img
              src="/hero_3d_print_showcase.png"
              alt="3D Print Transformation"
              className="w-full h-full object-cover"
            />

            {/* Floating UI Elements for decoration */}
            <div className="absolute top-8 left-8 bg-white/90 backdrop-blur px-4 py-2 rounded-xl shadow-lg flex items-center gap-2 animate-bounce hover:pause">
              <div className="w-2 h-2 rounded-full bg-green-500" />
              <span className="text-xs font-bold">Layer Lines Removed</span>
            </div>

            <div className="absolute bottom-8 right-8 bg-white/90 backdrop-blur px-4 py-2 rounded-xl shadow-lg flex items-center gap-2 delay-100 animate-pulse">
              <div className="w-2 h-2 rounded-full bg-purple-500" />
              <span className="text-xs font-bold">Studio Lighting Added</span>
            </div>
          </div>
        </div>

      </div>

      {/* Background Gradients */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-gradient-to-b from-purple-50/50 to-transparent blur-3xl -z-10" />
    </section>
  )
}
