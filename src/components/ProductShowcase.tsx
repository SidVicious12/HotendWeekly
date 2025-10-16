'use client'

import { useState } from 'react'

interface ModelAngle {
  id: string
  title: string
  highlight: string
  src: string
}

const MODEL_ANGLES: ModelAngle[] = [
  {
    id: 'left',
    title: 'Left View',
    highlight: 'Confirm pose symmetry and off-hand details.',
    src: '/showcase/goku-angle-left.jpeg'
  },
  {
    id: 'front',
    title: 'Front View',
    highlight: 'Assess posture, silhouette, and facial sculpt.',
    src: '/showcase/goku-angle-front.jpeg'
  },
  {
    id: 'right',
    title: 'Right View',
    highlight: 'Check overhangs and arm clearances.',
    src: '/showcase/goku-angle-right.jpeg'
  },
  {
    id: 'back',
    title: 'Back View',
    highlight: 'Validate cape drape and support locations.',
    src: '/showcase/goku-angle-back.jpeg'
  }
]

export function ProductShowcase() {
  const [activeId, setActiveId] = useState<string>(MODEL_ANGLES[1]?.id ?? MODEL_ANGLES[0]?.id ?? '')

  return (
    <div className="grid grid-cols-1 gap-12 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:items-center">
      <header className="space-y-6">
        <span className="inline-flex items-center rounded-full bg-black px-4 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-white">
          360° Preview
        </span>
        <h2 className="text-4xl font-semibold text-gray-900 sm:text-5xl">
          Generate multi-angle model shots
        </h2>
        <p className="max-w-md text-base text-gray-600">
          Showcase your product from every angle—left, front, right, and back—auto-generated in seconds without multiple photoshoots.
        </p>
      </header>

      <div className="relative">
        <div className="absolute inset-x-6 top-10 -z-10 hidden h-[18rem] rounded-full bg-gradient-to-r from-purple-200/40 via-blue-200/30 to-purple-200/40 blur-3xl lg:block" aria-hidden />
        <div className="rounded-[3rem] bg-gradient-to-br from-white via-white to-gray-50 p-12 shadow-[0_60px_120px_-70px_rgba(59,130,246,0.55)] ring-1 ring-gray-100">
          <div className="flex flex-wrap justify-center gap-8 lg:flex-nowrap lg:justify-between">
            {MODEL_ANGLES.map((angle) => {
              const isActive = angle.id === activeId
              return (
                <button
                  key={angle.id}
                  type="button"
                  onMouseEnter={() => setActiveId(angle.id)}
                  onFocus={() => setActiveId(angle.id)}
                  className={`group relative w-full max-w-[21rem] overflow-hidden rounded-[2rem] border bg-white text-center shadow-lg transition duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-purple-400 sm:max-w-[22rem] lg:max-w-[23rem] ${
                    isActive
                      ? 'border-purple-300 shadow-[0_40px_90px_-60px_rgba(139,92,246,0.7)]'
                      : 'border-gray-200 hover:-translate-y-2 hover:border-gray-300 hover:shadow-2xl'
                  }`}
                >
                  <div className="aspect-[2/3] overflow-hidden">
                    <img
                      src={angle.src}
                      alt={`${angle.title} preview`}
                      className="h-full w-full scale-[1.28] object-cover object-center transition-transform duration-500 group-hover:scale-[1.36]"
                    />
                  </div>
                  <div className="px-6 py-6">
                    <p className="text-lg font-semibold text-gray-900">{angle.title}</p>
                  </div>
                </button>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
