'use client'

import { useState, useEffect } from 'react'
import { testimonials } from '@/lib/data'

export function TestimonialsSection() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)

  useEffect(() => {
    if (isPaused) return
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length)
    }, 4000)
    return () => clearInterval(interval)
  }, [isPaused])

  const goTo = (index: number) => setCurrentIndex(index)
  const goPrev = () => setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length)
  const goNext = () => setCurrentIndex((prev) => (prev + 1) % testimonials.length)

  return (
    <section className="bg-white py-20">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            What Our Makers Say
          </h2>
          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
            Join thousands of 3D printing creators who trust HotendWeekly
          </p>
        </div>

        <div
          className="relative max-w-6xl mx-auto"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 transition-all duration-500">
            {[0, 1, 2].map((offset) => {
              const index = (currentIndex + offset) % testimonials.length
              const testimonial = testimonials[index]
              const isCenter = offset === 1

              return (
                <TestimonialCard
                  key={index}
                  testimonial={testimonial}
                  isCenter={isCenter}
                />
              )
            })}
          </div>

          <NavigationDots
            total={testimonials.length}
            current={currentIndex}
            onSelect={goTo}
          />

          <NavArrow direction="prev" onClick={goPrev} />
          <NavArrow direction="next" onClick={goNext} />
        </div>
      </div>
    </section>
  )
}

interface TestimonialCardProps {
  testimonial: typeof testimonials[0]
  isCenter: boolean
}

function TestimonialCard({ testimonial, isCenter }: TestimonialCardProps) {
  return (
    <div
      className={`bg-white rounded-3xl p-6 shadow-lg transition-all duration-500 ${
        isCenter ? 'md:scale-105 md:shadow-2xl border-2 border-purple-200' : 'md:opacity-75'
      }`}
    >
      <div className="flex items-center mb-4">
        <img
          src={testimonial.avatar}
          alt={testimonial.name}
          className="w-12 h-12 rounded-full object-cover mr-3"
        />
        <div>
          <h4 className="font-bold text-gray-900">{testimonial.name}</h4>
          <p className="text-sm text-gray-500">{testimonial.role}</p>
        </div>
      </div>

      <p className="text-gray-700 mb-4 text-sm leading-relaxed">
        {testimonial.text}
      </p>

      <StarRating count={testimonial.rating} />

      <div className="flex items-center gap-2 mt-3">
        <StarIcon className="w-4 h-4 fill-green-600" />
        <span className="text-xs font-semibold text-gray-600">Trustpilot</span>
      </div>
    </div>
  )
}

function StarRating({ count }: { count: number }) {
  return (
    <div className="flex items-center gap-1 mb-3">
      {Array.from({ length: count }).map((_, i) => (
        <StarIcon key={i} className="w-5 h-5 fill-yellow-400" />
      ))}
    </div>
  )
}

function StarIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 20 20">
      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
    </svg>
  )
}

function NavigationDots({ total, current, onSelect }: { total: number; current: number; onSelect: (i: number) => void }) {
  return (
    <div className="flex justify-center gap-2 mt-8">
      {Array.from({ length: total }).map((_, index) => (
        <button
          key={index}
          onClick={() => onSelect(index)}
          className={`w-2 h-2 rounded-full transition-all ${
            index === current ? 'bg-purple-600 w-8' : 'bg-gray-300 hover:bg-gray-400'
          }`}
          aria-label={`Go to testimonial ${index + 1}`}
        />
      ))}
    </div>
  )
}

function NavArrow({ direction, onClick }: { direction: 'prev' | 'next'; onClick: () => void }) {
  const isPrev = direction === 'prev'
  return (
    <button
      onClick={onClick}
      className={`hidden md:block absolute top-1/2 -translate-y-1/2 ${
        isPrev ? 'left-0 -translate-x-12' : 'right-0 translate-x-12'
      } bg-white rounded-full p-3 shadow-lg hover:shadow-xl transition-shadow`}
      aria-label={`${isPrev ? 'Previous' : 'Next'} testimonial`}
    >
      <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d={isPrev ? 'M15 19l-7-7 7-7' : 'M9 5l7 7-7 7'}
        />
      </svg>
    </button>
  )
}
