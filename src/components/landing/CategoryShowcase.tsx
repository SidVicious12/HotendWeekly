'use client'

import { useState } from 'react'
import { categories, type CategoryId } from '@/lib/data'
import { ArrowRight, Sparkles, Upload } from 'lucide-react'

export function CategoryShowcase() {
  const [activeCategory, setActiveCategory] = useState<CategoryId>('miniatures')

  return (
    <div className="mb-24">
      {/* Simple Tabs */}
      <div className="flex justify-center mb-12 overflow-x-auto pb-4">
        <div className="flex bg-gray-100 p-1.5 rounded-full">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-6 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 whitespace-nowrap ${activeCategory === cat.id
                  ? 'bg-black text-white shadow-lg transform scale-105'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200'
                }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
        {/* Left Side: Upload & Original */}
        <div className="bg-gray-50 rounded-[2.5rem] p-10 border border-gray-100 relative group overflow-hidden">
          <div className="absolute top-6 left-6 bg-white px-4 py-2 rounded-full shadow-sm text-sm font-bold flex items-center gap-2">
            <Upload className="w-4 h-4" />
            Original Photo
          </div>
          <img
            src={getAsset(activeCategory, 'before')}
            alt="Before"
            className="w-full h-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-500"
          />
        </div>

        {/* Right Side: Enhanced Result */}
        <div className="relative">
          {/* Arrow Indicator */}
          <div className="absolute -left-8 top-1/2 -translate-y-1/2 hidden lg:flex items-center justify-center w-16 h-16 bg-white rounded-full shadow-xl z-20">
            <ArrowRight className="w-6 h-6 text-gray-900" />
          </div>

          <div className="bg-white rounded-[2.5rem] p-4 shadow-2xl border border-gray-100 relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-tr from-purple-500/10 to-pink-500/10 opacity-50" />

            <div className="absolute top-6 left-6 z-10 bg-black text-white px-4 py-2 rounded-full shadow-lg text-sm font-bold flex items-center gap-2 animate-pulse">
              <Sparkles className="w-4 h-4 text-yellow-400" />
              AI Enhanced
            </div>

            <div className="aspect-square rounded-[2rem] overflow-hidden bg-white">
              <img
                src={getAsset(activeCategory, 'after')}
                alt="After"
                className="w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-110"
              />
            </div>
          </div>

          <div className="mt-8 text-center lg:text-left">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Professional Studio Quality | Holiday Edition 🎄</h3>
            <p className="text-gray-600">Instantly remove backgrounds, fix lighting, and upscale resolution.</p>
          </div>
        </div>
      </div>
    </div>
  )
}

// Helper to get assets simply
function getAsset(category: CategoryId, type: 'before' | 'after'): string {
  // Holiday Edition Assets
  const assets: Record<string, { before: string, after: string }> = {
    'miniatures': { before: '/miniatures/santa-before.png', after: '/miniatures/santa-after.png' },
    'props-cosplay': { before: '/props/ice-crown-before.png', after: '/props/ice-crown-after.png' },
    'generative': { before: '/examples/ornament-before.png', after: '/examples/ornament-after.png' },
    'tools': { before: '/tools/workspace-before.png', after: '/tools/workspace-after.png' }
  };

  return assets[category] ? assets[category][type] : assets['miniatures'][type];
}
