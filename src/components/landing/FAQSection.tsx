'use client'

import { useState } from 'react'

const faqs = [
  {
    question: 'How easy is it to use HotendWeekly?',
    answer: "Very easy! HotendWeekly is designed for users of all skill levels. Whether you're a professional designer or someone with no prior editing experience, you can create stunning visuals in just a few clicks."
  },
  {
    question: 'Can I try HotendWeekly for free?',
    answer: 'Yes! HotendWeekly offers a free trial that allows you to test all features without any commitment. Start creating amazing visuals today.'
  },
  {
    question: 'What kind of images can I edit with HotendWeekly?',
    answer: 'HotendWeekly works with all types of 3D print images - from miniatures and functional prints to decorative pieces and accessories. Upload photos of your printed models, and our AI will enhance them for professional presentation.'
  },
  {
    question: 'Do I need to download any software?',
    answer: "No downloads required! HotendWeekly is a web-based platform that works directly in your browser. Just sign up and start creating immediately."
  },
  {
    question: 'Are the edits high-quality and professional?',
    answer: 'Absolutely! Our AI generates professional-grade images that are indistinguishable from traditional photography. Perfect for e-commerce, marketing, and social media.'
  },
  {
    question: 'Can I cancel my subscription anytime?',
    answer: "Yes, you can cancel your subscription at any time. There are no long-term commitments, and you'll retain access to your account until the end of your billing period."
  },
  {
    question: 'Is my data safe with HotendWeekly?',
    answer: 'Your data security is our top priority. We use enterprise-grade encryption and follow strict privacy policies to ensure your images and information are completely secure.'
  }
]

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  return (
    <section className="bg-white py-20">
      <div className="max-w-6xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            How easy is it to use{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 italic">
              HotendWeekly
            </span>
            ?
          </h2>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <FAQItem
              key={index}
              question={faq.question}
              answer={faq.answer}
              isOpen={openIndex === index}
              onToggle={() => setOpenIndex(openIndex === index ? null : index)}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

interface FAQItemProps {
  question: string
  answer: string
  isOpen: boolean
  onToggle: () => void
}

function FAQItem({ question, answer, isOpen, onToggle }: FAQItemProps) {
  return (
    <div className={`border border-gray-200 rounded-2xl overflow-hidden transition-all ${isOpen ? 'bg-purple-50' : 'bg-white'}`}>
      <button
        onClick={onToggle}
        className="w-full px-6 py-6 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
      >
        <span className="text-lg font-bold text-gray-900 pr-8">{question}</span>
        <ToggleIcon isOpen={isOpen} />
      </button>
      {isOpen && (
        <div className="px-6 pb-6">
          <p className="text-gray-600 leading-relaxed">{answer}</p>
        </div>
      )}
    </div>
  )
}

function ToggleIcon({ isOpen }: { isOpen: boolean }) {
  return (
    <div className="flex-shrink-0">
      <svg className="w-6 h-6 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d={isOpen ? 'M20 12H4' : 'M12 4v16m8-8H4'}
        />
      </svg>
    </div>
  )
}
