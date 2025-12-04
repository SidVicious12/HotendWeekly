'use client'

import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import { categories, miniatureShowcase, type CategoryId } from '@/lib/data'

const ImageTo3DRenderer = dynamic(
  () => import('@/components/ImageTo3DRenderer').then((mod) => mod.ImageTo3DRenderer),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-full w-full items-center justify-center rounded-2xl bg-white text-sm text-gray-500">
        Preparing 3D preview...
      </div>
    )
  }
)

export function CategoryShowcase() {
  const [activeCategory, setActiveCategory] = useState<CategoryId>('miniatures')
  const [sliderPosition, setSliderPosition] = useState(0)
  const [videoFailed, setVideoFailed] = useState(false)

  useEffect(() => {
    const index = categories.findIndex(cat => cat.id === activeCategory)
    setSliderPosition(index * 25)
  }, [activeCategory])

  useEffect(() => {
    if (activeCategory !== 'miniatures') {
      setVideoFailed(false)
    }
  }, [activeCategory])

  return (
    <div className="mb-16">
      <CategoryTabs
        activeCategory={activeCategory}
        sliderPosition={sliderPosition}
        onSelect={setActiveCategory}
      />

      {activeCategory === 'miniatures' ? (
        <MiniatureShowcase videoFailed={videoFailed} setVideoFailed={setVideoFailed} />
      ) : (
        <GenericShowcase activeCategory={activeCategory} />
      )}
    </div>
  )
}

interface CategoryTabsProps {
  activeCategory: CategoryId
  sliderPosition: number
  onSelect: (id: CategoryId) => void
}

function CategoryTabs({ activeCategory, sliderPosition, onSelect }: CategoryTabsProps) {
  return (
    <div className="flex justify-center mb-8">
      <div className="inline-flex bg-white rounded-full p-1.5 shadow-lg relative gap-1">
        <div
          className="absolute top-1.5 bottom-1.5 bg-gray-900 rounded-full transition-all duration-300 ease-out"
          style={{
            left: `calc(${sliderPosition}% + 0.375rem)`,
            width: 'calc(25% - 0.5rem)'
          }}
        />
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => onSelect(cat.id)}
            className={`px-8 py-3 rounded-full text-base font-medium transition-colors relative z-10 whitespace-nowrap ${
              activeCategory === cat.id ? 'text-white' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>
    </div>
  )
}

interface MiniatureShowcaseProps {
  videoFailed: boolean
  setVideoFailed: (v: boolean) => void
}

function MiniatureShowcase({ videoFailed, setVideoFailed }: MiniatureShowcaseProps) {
  return (
    <div className="space-y-10">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <ShowcaseStep
          step={1}
          title="Upload your miniature"
          titlePosition="top"
        >
          <img
            src={miniatureShowcase.primedSrc}
            alt="Unpainted Space Marine miniature ready for upload"
            className="h-full w-full object-contain"
            onError={(e) => { e.currentTarget.src = '/examples/dragon-realistic.JPG' }}
          />
        </ShowcaseStep>

        <ShowcaseStep
          step={2}
          title="AI paint in seconds"
          titlePosition="bottom"
          variant="highlight"
        >
          <img
            src={miniatureShowcase.paintedSrc}
            alt="Fully painted miniature produced by Hotend Weekly"
            className="h-full w-full object-contain"
            onError={(e) => { e.currentTarget.src = '/examples/dragon-paper-cut.png' }}
          />
        </ShowcaseStep>

        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-gray-900">Describe the vibe</h2>
          <div className="relative aspect-[4/5] overflow-hidden rounded-3xl border border-indigo-100 bg-white shadow-xl">
            <div className="absolute inset-0 flex items-center justify-center bg-indigo-50/60">
              {videoFailed ? (
                <VideoFallback />
              ) : (
                <video
                  className="h-full w-full object-cover"
                  autoPlay loop muted playsInline
                  poster={miniatureShowcase.paintedSrc}
                  onLoadedData={() => setVideoFailed(false)}
                  onError={() => setVideoFailed(true)}
                >
                  <source src={miniatureShowcase.videoSrc} type="video/mp4" />
                </video>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function VideoFallback() {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-indigo-200 bg-white/80 px-6 text-center">
      <p className="text-sm font-semibold text-indigo-700">Preview coming soon</p>
      <p className="text-xs text-gray-500">
        Add a video at <code className="rounded bg-indigo-100 px-1 py-0.5 text-[10px]">public/media/m2-res_1920p.mp4</code>
      </p>
    </div>
  )
}

interface ShowcaseStepProps {
  step: number
  title: string
  titlePosition: 'top' | 'bottom'
  variant?: 'default' | 'highlight'
  children: React.ReactNode
}

function ShowcaseStep({ step, title, titlePosition, variant = 'default', children }: ShowcaseStepProps) {
  const isHighlight = variant === 'highlight'
  const containerClass = isHighlight
    ? 'border border-amber-100 bg-white shadow-xl'
    : 'bg-[#f0f1f5]'
  const badgeClass = isHighlight
    ? 'bg-amber-500/15 text-amber-700'
    : 'bg-white/85 text-gray-700 shadow'

  return (
    <div className="space-y-4">
      {titlePosition === 'top' && <h2 className="text-2xl font-bold text-gray-900">{title}</h2>}
      <div className={`relative flex aspect-square items-center justify-center overflow-hidden rounded-3xl p-6 ${containerClass}`}>
        <span className={`absolute left-4 top-4 inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide ${badgeClass}`}>
          Step {step}
        </span>
        {children}
      </div>
      {titlePosition === 'bottom' && <h2 className="text-2xl font-bold text-gray-900 text-center">{title}</h2>}
    </div>
  )
}

const categoryAssets: Record<Exclude<CategoryId, 'miniatures'>, { step1: string; step2: string; step3: string }> = {
  'props-cosplay': {
    step1: '/props/zelda-sword-parts.png',
    step2: '/props/zelda-sword-assembled.png',
    step3: '/zelda-test.mp4'
  },
  'generative': {
    step1: '/examples/dragon-realistic.JPG',
    step2: '/examples/dragon-paper-cut.png',
    step3: ''
  },
  'tools': {
    step1: '/tools/tools-assembled.jpg',
    step2: '/tools/tools-before.jpg',
    step3: '/tools-demo.mp4'
  }
}

function GenericShowcase({ activeCategory }: { activeCategory: Exclude<CategoryId, 'miniatures'> }) {
  const assets = categoryAssets[activeCategory]
  const isGenerative = activeCategory === 'generative'

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-gray-900">Upload your product</h2>
        <div className="bg-gray-200 rounded-2xl p-4 aspect-square flex items-center justify-center">
          <img src={assets.step1} alt="Step 1" className="w-full h-full object-contain rounded-xl p-4" />
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-gray-900">Style the Scene</h2>
        <div className="bg-white rounded-2xl p-4 aspect-square flex items-center justify-center shadow-lg border border-gray-100">
          <img src={assets.step2} alt="Step 2" className="rounded-xl object-contain max-h-full" />
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-gray-900">Create & Share</h2>
        {isGenerative && (
          <p className="text-sm text-gray-600">
            Preview a printable bas-relief generated from your artwork, spin it around, and export the STL in one click.
          </p>
        )}
        <div className={`bg-white rounded-2xl aspect-square relative ${isGenerative ? 'flex flex-col p-4' : 'flex items-center justify-center p-4'}`}
          style={isGenerative ? undefined : { backgroundImage: 'repeating-conic-gradient(#e5e7eb 0% 25%, transparent 0% 50%) 50% / 20px 20px' }}
        >
          {isGenerative ? (
            <ImageTo3DRenderer imageUrl="/examples/dragon-paper-cut.png" className="flex h-full w-full flex-col" />
          ) : (
            <video className="rounded-xl w-full h-full object-cover" autoPlay loop muted playsInline controls>
              <source src={assets.step3} type="video/mp4" />
            </video>
          )}
        </div>
      </div>
    </div>
  )
}
