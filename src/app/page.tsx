'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import dynamic from 'next/dynamic'
import { useAuth } from '@/contexts/AuthContext'
import ContactForm from '@/components/ContactForm'
import { ProductShowcase } from '@/components/ProductShowcase'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'

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

interface Background {
  id: string
  name: string
  description: string
  color: string
  gradient: string | null
}

export default function HomePage() {
  const router = useRouter()
  const { user, loading, signOut } = useAuth()
  const [activeCategory, setActiveCategory] = useState('miniatures')
  const [uploadedImage, setUploadedImage] = useState<string | null>(null)
  const [removedBgImage, setRemovedBgImage] = useState<string | null>(null)
  const [processedImage, setProcessedImage] = useState<string | null>(null)
  const [sliderPosition, setSliderPosition] = useState(0)

  // Update slider position when active category changes
  useEffect(() => {
    const index = categories.findIndex(cat => cat.id === activeCategory)
    setSliderPosition(index * 25)
  }, [activeCategory])
  const [isProcessing, setIsProcessing] = useState(false)
  const [showEmailModal, setShowEmailModal] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [email, setEmail] = useState('')
  const [emailSubmitted, setEmailSubmitted] = useState(false)
  const [selectedBackground, setSelectedBackground] = useState<string>('white')
  const [processingStatus, setProcessingStatus] = useState<string>('')
  const [error, setError] = useState<string | null>(null)
  const [selectedModel, setSelectedModel] = useState<string | null>(null)
  const [virtualTryOnResult, setVirtualTryOnResult] = useState<string | null>(null)
  const [showModelSelection, setShowModelSelection] = useState(false)
  const [workflowStep, setWorkflowStep] = useState<1 | 2 | 3 | null>(null)
  const [currentTestimonial, setCurrentTestimonial] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0)
  const [productAnalysis, setProductAnalysis] = useState<{
    category: string
    displayType: string
    description: string
  } | null>(null)
  const [simplifiedImage, setSimplifiedImage] = useState<string | null>(null)
  const [imageDescription, setImageDescription] = useState<string | null>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [stylizedFallback, setStylizedFallback] = useState(false)
  const [videoFailed, setVideoFailed] = useState(false)

  // Authentication is optional for now (Hostinger compatibility)
  // useEffect(() => {
  //   if (!loading && !user) {
  //     router.push('/auth/login')
  //   }
  // }, [user, loading, router])

  const categories = [
    { id: 'miniatures', label: 'Miniatures' },
    { id: 'props-cosplay', label: 'Props and Cosplay' },
    { id: 'generative', label: 'Generative 3D Model' },
    { id: 'tools', label: 'Tools' }
  ]

  const testimonials = [
    {
      name: "Sarah Mitchell",
      role: "Miniature Painter & Etsy Seller",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop",
      text: "HotendWeekly transformed my Etsy shop! My miniatures now look professional without expensive photography equipment. Sales increased 40% in just two months. The AI background removal is absolutely flawless.",
      rating: 5
    },
    {
      name: "Marcus Chen",
      role: "Functional Print Designer",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop",
      text: "As a mechanical engineer selling practical 3D prints, I needed clean product photos fast. HotendWeekly delivers studio-quality images in seconds. It's like having a professional photographer on demand. Incredible time saver!",
      rating: 5
    },
    {
      name: "Emma Rodriguez",
      role: "Decorative Print Artist",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop",
      text: "I've been using HotendWeekly for my home decor prints and I'm genuinely impressed by the quality. It's one of the few tools that actually works consistently. The results are sharp, professional, and exactly what I need for Instagram and Pinterest.",
      rating: 5
    },
    {
      name: "Jake Thompson",
      role: "Gaming Accessories Creator",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop",
      text: "This tool is a game-changer for content creators like me. The interface is sleek and user-friendly, and the image quality is outstanding. HotendWeekly provides all the features effortlessly. A must-have for anyone selling 3D prints online!",
      rating: 5
    },
    {
      name: "Olivia Park",
      role: "Jewelry & Accessories Designer",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop",
      text: "I've used many AI tools for virtual product photography, and HotendWeekly is by far the most accurate. My 3D printed jewelry looks exactly like it does in real life. The attention to detail is remarkable. Highly recommend!",
      rating: 5
    },
    {
      name: "David Kowalski",
      role: "Print Farm Owner",
      avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop",
      text: "Running a print farm means photographing dozens of products daily. HotendWeekly cut our visual production time by 90%. It generates professional images from a single photo. The Shopify integration is perfect for our workflow.",
      rating: 5
    }
  ]

  // Auto-rotate testimonials
  useEffect(() => {
    if (isPaused) return

    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length)
    }, 4000) // Change every 4 seconds
    return () => clearInterval(interval)
  }, [isPaused, testimonials.length])

  useEffect(() => {
    if (activeCategory !== 'miniatures') {
      setStylizedFallback(false)
      setVideoFailed(false)
    }
  }, [activeCategory])

  const backgrounds: Background[] = [
    {
      id: 'transparent',
      name: 'Transparent',
      description: 'No background',
      color: 'transparent',
      gradient: null
    },
    {
      id: 'white',
      name: 'Studio White',
      description: 'Clean white',
      color: '#ffffff',
      gradient: null
    },
    {
      id: 'gray',
      name: 'Studio Gray',
      description: 'Neutral gray',
      color: '#f3f4f6',
      gradient: 'linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%)'
    },
    {
      id: 'wood',
      name: 'Wood Desk',
      description: 'Natural wood',
      color: '#d4a574',
      gradient: 'linear-gradient(135deg, #d4a574 0%, #b8956a 100%)'
    },
    {
      id: 'gradient-purple',
      name: 'Modern Purple',
      description: 'Trendy purple',
      color: '#9333ea',
      gradient: 'linear-gradient(135deg, #9333ea 0%, #ec4899 100%)'
    },
    {
      id: 'gradient-blue',
      name: 'Cool Blue',
      description: 'Professional',
      color: '#3b82f6',
      gradient: 'linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)'
    }
  ]

  const miniatureShowcase = {
    primedSrc: '/miniatures/space-marine-painted.png',
    paintedSrc: '/miniatures/space-marine-primed.png',
    promptedSrc: '/miniatures/space-marine-stylized.png',
    videoSrc: '/media/m2-res_1920p.mp4'
  }

  const modelPoses = [
    {
      id: 'pose-1',
      name: 'Holding Forward',
      description: 'Product in hand',
      // Use example reference image for pose control
      poseUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=1200&fit=crop',
      previewUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=600&fit=crop'
    },
    {
      id: 'pose-2',
      name: 'Professional Display',
      description: 'Formal presentation',
      // Use example reference image for pose control
      poseUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=800&h=1200&fit=crop',
      previewUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=600&fit=crop'
    },
    {
      id: 'pose-3',
      name: 'Casual Show',
      description: 'Relaxed display',
      // Use example reference image for pose control
      poseUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=800&h=1200&fit=crop',
      previewUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=600&fit=crop'
    }
  ]

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setError(null)
    setSimplifiedImage(null) // Reset simplified image
    setProcessedImage(null) // Reset processed image
    setRemovedBgImage(null) // Reset background removal
    setVirtualTryOnResult(null) // Reset AI generation

    // Show original image
    const reader = new FileReader()
    reader.onload = (e) => {
      setUploadedImage(e.target?.result as string)
    }
    reader.readAsDataURL(file)
  }

  const compositeImage = async (bgRemovedImage: string, backgroundId: string) => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const img = new Image()
    img.crossOrigin = 'anonymous'

    await new Promise((resolve, reject) => {
      img.onload = resolve
      img.onerror = reject
      img.src = bgRemovedImage
    })

    // Set canvas size to image size
    canvas.width = img.width
    canvas.height = img.height

    // Draw background
    const bg = backgrounds.find(b => b.id === backgroundId)
    if (bg) {
      if (bg.gradient) {
        const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height)
        // Simple gradient parsing (for demo)
        if (bg.id === 'gray') {
          gradient.addColorStop(0, '#f3f4f6')
          gradient.addColorStop(1, '#e5e7eb')
        } else if (bg.id === 'wood') {
          gradient.addColorStop(0, '#d4a574')
          gradient.addColorStop(1, '#b8956a')
        } else if (bg.id === 'gradient-purple') {
          gradient.addColorStop(0, '#9333ea')
          gradient.addColorStop(1, '#ec4899')
        } else if (bg.id === 'gradient-blue') {
          gradient.addColorStop(0, '#3b82f6')
          gradient.addColorStop(1, '#06b6d4')
        }
        ctx.fillStyle = gradient
      } else if (bg.color !== 'transparent') {
        ctx.fillStyle = bg.color
      }

      if (bg.color !== 'transparent') {
        ctx.fillRect(0, 0, canvas.width, canvas.height)
      }
    }

    // Draw image on top
    ctx.drawImage(img, 0, 0)

    // Add watermark
    ctx.font = 'bold 24px Arial'
    ctx.fillStyle = 'rgba(255, 255, 255, 0.3)'
    ctx.fillText('HotendWeekly', canvas.width - 200, canvas.height - 20)

    // Convert to data URL
    const finalImage = canvas.toDataURL('image/png')
    setProcessedImage(finalImage)
  }

  // Re-composite when background changes
  useEffect(() => {
    if (removedBgImage) {
      compositeImage(removedBgImage, selectedBackground)
    }
  }, [selectedBackground, removedBgImage])

  const handleSimplifyFor3DPrint = async () => {
    if (!uploadedImage) {
      setError('Please upload an image first')
      return
    }

    setIsProcessing(true)
    setError(null)
    setWorkflowStep(1)
    setProcessingStatus('👁️ Step 1/2: Analyzing image with GPT-4 Vision...')

    try {
      // Convert uploaded image to File
      const imageBlob = await fetch(uploadedImage).then(r => r.blob())
      const imageFile = new File([imageBlob], 'image.png', { type: 'image/png' })

      const formData = new FormData()
      formData.append('image', imageFile)

      const response = await fetch('/api/simplify-image', {
        method: 'POST',
        body: formData,
      })

      setWorkflowStep(2)
      setProcessingStatus('🎨 Step 2/2: Generating simplified version with DALL-E 3...')

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Simplification failed')
      }

      if (data.simulated) {
        setError(data.message)
        setIsProcessing(false)
        setWorkflowStep(null)
        return
      }

      // Show simplified result
      setSimplifiedImage(data.image)
      setProcessedImage(data.image)
      setImageDescription(data.description)

      setIsProcessing(false)
      setWorkflowStep(null)
      setProcessingStatus('')

    } catch (err) {
      console.error('Simplification error:', err)
      setError(err instanceof Error ? err.message : 'Failed to simplify image')
      setIsProcessing(false)
      setWorkflowStep(null)
      setProcessingStatus('')
    }
  }

  const handleVirtualTryOn = async () => {
    if (!uploadedImage) {
      setError('Please upload a product image first')
      return
    }

    setIsProcessing(true)
    setError(null)
    setWorkflowStep(1)
    setProductAnalysis(null)

    try {
      // Convert uploaded image to File
      const productBlob = await fetch(uploadedImage).then(r => r.blob())
      const productFile = new File([productBlob], 'product.png', { type: 'image/png' })

      // Step 1: AI Analysis
      setProcessingStatus('🧠 Step 1/3: Analyzing your product with AI vision...')
      setWorkflowStep(1)

      const formData = new FormData()
      formData.append('product_image', productFile)

      const response = await fetch('/api/flux-generate', {
        method: 'POST',
        body: formData,
      })

      // Step 2: Scene Generation (happens on backend)
      setProcessingStatus('🎨 Step 2/3: Generating perfect scene with AI...')
      setWorkflowStep(2)

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'AI generation failed')
      }

      if (data.simulated) {
        setError(data.message)
        setIsProcessing(false)
        setWorkflowStep(null)
        return
      }

      // Step 3: Compositing (future enhancement)
      setProcessingStatus('✨ Step 3/3: Finalizing your product photography...')
      setWorkflowStep(3)

      // Store analysis results
      if (data.analysis) {
        setProductAnalysis(data.analysis)
      }

      // Show final result
      setVirtualTryOnResult(data.image)
      setProcessedImage(data.image)

      setIsProcessing(false)
      setWorkflowStep(null)
      setProcessingStatus('')

    } catch (err) {
      console.error('AI generation error:', err)
      setError(err instanceof Error ? err.message : 'Failed to generate AI model')
      setIsProcessing(false)
      setWorkflowStep(null)
      setProcessingStatus('')
    }
  }

  const handleDownload = () => {
    if (processedImage) {
      const link = document.createElement('a')
      link.href = processedImage
      // Use different filename based on what type of processing was done
      const filename = simplifiedImage
        ? 'hotendweekly-simplified-3dprint.png'
        : 'hotendweekly-enhanced-3dprint.png'
      link.download = filename
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setEmailSubmitted(true)
    setTimeout(() => {
      setShowEmailModal(false)
      setEmailSubmitted(false)
      setEmail('')
    }, 2000)
  }

  const handleCTAClick = () => {
    setShowEmailModal(true)
  }

  // Optional: Show loading while checking authentication
  // Disabled for Hostinger compatibility
  // if (loading) {
  //   return (
  //     <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 flex items-center justify-center">
  //       <div className="text-center">
  //         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
  //         <p className="text-gray-600">Loading...</p>
  //       </div>
  //     </div>
  //   )
  // }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      {/* Hidden canvas for image compositing */}
      <canvas ref={canvasRef} className="hidden" />

      {/* Navigation */}
      <Navigation />

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 lg:px-8 pt-20 pb-16">
        <div className="text-center max-w-4xl mx-auto mb-12">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-6 leading-tight">
            Turn Ordinary 3D Prints into{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 italic">
              Extraordinary
            </span>{' '}
            Creations.
          </h1>
          <p className="text-lg md:text-xl text-gray-600 mb-6 max-w-3xl mx-auto">
            Don't let dull images hide your best work. Hotend Weekly uses AI to make your 3D prints shine — clean backgrounds, studio lighting, and showcase scenes that make every model look its best.
          </p>

          {user && (
            <p className="text-sm text-purple-600 font-semibold">
              Welcome, {user.email}! Upload an image below to get started.
            </p>
          )}
          {!user && (
            <p className="text-sm text-gray-600">
              Upload an image below to get started with AI-powered background removal.
            </p>
          )}
        </div>

        {/* Category Showcase Section */}
        <div className="mb-16">
          {/* Category Tabs */}
          <div className="flex justify-center mb-8">
            <div className="inline-flex bg-white rounded-full p-1.5 shadow-lg relative gap-1">
              {/* Animated slider background */}
              <div
                className="absolute top-1.5 bottom-1.5 bg-gray-900 rounded-full transition-all duration-300 ease-out"
                style={{
                  left: `calc(${sliderPosition}% + 0.375rem)`,
                  width: 'calc(25% - 0.5rem)'
                }}
              />

              {/* Tab buttons */}
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`px-8 py-3 rounded-full text-base font-medium transition-colors relative z-10 whitespace-nowrap ${
                    activeCategory === cat.id
                      ? 'text-white'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Three Step Workflow */}
          {activeCategory === 'miniatures' ? (
            <div className="space-y-10">
              <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                <div className="space-y-4">
                  <h2 className="text-2xl font-bold text-gray-900">Upload your miniature</h2>
                  <div className="relative flex aspect-square items-center justify-center overflow-hidden rounded-3xl bg-[#f0f1f5] p-6">
                    <span className="absolute left-4 top-4 inline-flex items-center gap-2 rounded-full bg-white/85 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-gray-700 shadow">
                      Step 1
                    </span>
                    <img
                      src={miniatureShowcase.primedSrc}
                      alt="Unpainted Space Marine miniature ready for upload"
                      className="h-full w-full object-contain"
                      onError={(event) => {
                        event.currentTarget.onerror = null
                        event.currentTarget.src = '/examples/dragon-realistic.JPG'
                      }}
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="relative flex aspect-square items-center justify-center overflow-hidden rounded-3xl border border-amber-100 bg-white p-6 shadow-xl">
                    <span className="absolute left-4 top-4 inline-flex items-center gap-2 rounded-full bg-amber-500/15 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-amber-700">
                      Step 2
                    </span>
                    <img
                      src={miniatureShowcase.paintedSrc}
                      alt="Fully painted miniature produced by Hotend Weekly"
                      className="h-full w-full object-contain"
                      onError={(event) => {
                        event.currentTarget.onerror = null
                        event.currentTarget.src = '/examples/dragon-paper-cut.png'
                      }}
                    />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 text-center">AI paint in seconds</h2>
                </div>

                <div className="space-y-4">
                  <h2 className="text-2xl font-bold text-gray-900">Describe the vibe</h2>
                  <div className="space-y-4">
                    <div className="relative aspect-[4/5] overflow-hidden rounded-3xl border border-indigo-100 bg-white shadow-xl">
                      <div className="absolute inset-0 flex items-center justify-center bg-indigo-50/60">
                        {videoFailed ? (
                          <div className="flex h-full w-full flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-indigo-200 bg-white/80 px-6 text-center">
                            <p className="text-sm font-semibold text-indigo-700">Preview coming soon</p>
                            <p className="text-xs text-gray-500">
                              Add a video at <code className="rounded bg-indigo-100 px-1 py-0.5 text-[10px]">public/media/m2-res_1920p.mp4</code> or a styled render at{' '}
                              <code className="rounded bg-indigo-100 px-1 py-0.5 text-[10px]">public/miniatures/space-marine-stylized.png</code>.
                            </p>
                          </div>
                        ) : (
                          <video
                            className="h-full w-full object-cover"
                            autoPlay
                            loop
                            muted
                            playsInline
                            controls={false}
                            preload="metadata"
                            poster={miniatureShowcase.paintedSrc}
                            onLoadedData={() => setVideoFailed(false)}
                            onError={() => setVideoFailed(true)}
                          >
                            <source src={miniatureShowcase.videoSrc} type="video/mp4" />
                            Your browser does not support the video tag.
                          </video>
                        )}
                      </div>
                    </div>

                    <div aria-hidden className="h-0" />
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
              {/* Step 1: Upload your product */}
              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-gray-900">Upload your product</h2>

                <div className="bg-gray-200 rounded-2xl p-4 aspect-square flex items-center justify-center relative overflow-hidden">
                  {activeCategory === 'props-cosplay' && (
                    <img
                      src="/props/zelda-sword-parts.png"
                      alt="Zelda sword 3D printed parts"
                      className="w-full h-full object-contain rounded-xl p-4"
                    />
                  )}
                  {activeCategory === 'generative' && (
                    <img
                      src="/examples/dragon-realistic.JPG"
                      alt="Realistic dragon for generation"
                      className="w-[80%] h-[80%] object-cover object-[50%_30%] rounded-xl"
                    />
                  )}
                  {activeCategory === 'tools' && (
                    <img
                      src="/tools/tools-assembled.jpg"
                      alt="3D printing measuring tools"
                      className="w-full h-full object-contain rounded-xl p-4"
                    />
                  )}
                </div>
              </div>

              {/* Step 2: Style the Scene */}
              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-gray-900">Style the Scene</h2>

                <div className="bg-white rounded-2xl p-4 aspect-square flex items-center justify-center relative overflow-hidden shadow-lg border border-gray-100">
                  {activeCategory === 'props-cosplay' && (
                    <img
                      src="/props/zelda-sword-assembled.png"
                      alt="Assembled Zelda Master Sword"
                      className="rounded-xl object-contain max-h-full"
                    />
                  )}
                  {activeCategory === 'generative' && (
                    <img
                      src="/examples/dragon-paper-cut.png"
                      alt="Styled dragon scene"
                      className="rounded-xl object-contain max-h-full"
                    />
                  )}
                  {activeCategory === 'tools' && (
                    <img
                      src="/tools/tools-before.jpg"
                      alt="Colorful measuring tools parts on workbench"
                      className="rounded-xl object-contain max-h-full"
                    />
                  )}
                </div>
              </div>

              {/* Step 3: Create & Share */}
              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-gray-900">Create & Share</h2>
                {activeCategory === 'generative' && (
                  <p className="text-sm text-gray-600">
                    Preview a printable bas-relief generated from your artwork, spin it around,
                    and export the STL in one click.
                  </p>
                )}

                <div
                  className={`bg-white rounded-2xl aspect-square relative ${
                    activeCategory === 'generative'
                      ? 'flex flex-col p-4 overflow-visible'
                      : 'flex items-center justify-center p-4 overflow-hidden'
                  }`}
                  style={
                    activeCategory === 'generative'
                      ? undefined
                      : { backgroundImage: 'repeating-conic-gradient(#e5e7eb 0% 25%, transparent 0% 50%) 50% / 20px 20px' }
                  }
                >
                  {activeCategory === 'generative' ? (
                    <ImageTo3DRenderer
                      imageUrl="/examples/dragon-paper-cut.png"
                      className="flex h-full w-full flex-col"
                    />
                  ) : (
                    <>
                      {activeCategory === 'props-cosplay' && (
                        <div className="w-full h-full flex items-center justify-center">
                          <video
                            className="rounded-xl w-full h-full object-cover"
                            autoPlay
                            loop
                            muted
                            playsInline
                            controls
                          >
                            <source src="/zelda-test.mp4" type="video/mp4" />
                            Your browser does not support the video tag.
                          </video>
                        </div>
                      )}
                      {activeCategory === 'tools' && (
                        <div className="w-full h-full flex items-center justify-center">
                          <video
                            className="rounded-xl w-full h-full object-cover"
                            autoPlay
                            loop
                            muted
                            playsInline
                            controls
                          >
                            <source src="/tools-demo.mp4" type="video/mp4" />
                            Your browser does not support the video tag.
                          </video>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Trusted By Section */}
      <section className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
            Trusted by thousands of 3D printing creators
          </h2>
        </div>

        {/* Logo Grid */}
        <div className="flex items-center justify-center gap-12 md:gap-16 lg:gap-20 opacity-40 grayscale">
          {/* Etsy */}
          <div className="flex items-center justify-center h-12">
            <svg className="h-10 w-auto" viewBox="0 0 200 80" xmlns="http://www.w3.org/2000/svg">
              <text x="10" y="60" fontFamily="Georgia, serif" fontSize="56" fontWeight="400" fill="#F56400">Etsy</text>
            </svg>
          </div>

          {/* Bamboo Lab */}
          <div className="flex items-center justify-center h-12">
            <svg className="h-10 w-auto" viewBox="0 0 400 100" xmlns="http://www.w3.org/2000/svg">
              {/* Bamboo icon */}
              <g transform="translate(10, 20)">
                <rect x="0" y="0" width="30" height="60" fill="#3D3D3D"/>
                <rect x="35" y="0" width="30" height="60" fill="#3D3D3D"/>
                <path d="M 5 20 L 25 40 L 5 40 Z" fill="white"/>
                <path d="M 40 20 L 60 40 L 40 40 Z" fill="white"/>
              </g>
              {/* Text */}
              <text x="90" y="58" fontFamily="Arial, sans-serif" fontSize="36" fontWeight="600" fill="#3D3D3D">Bambu</text>
              <text x="90" y="82" fontFamily="Arial, sans-serif" fontSize="36" fontWeight="600" fill="#3D3D3D">Lab</text>
            </svg>
          </div>

          {/* Snapmaker */}
          <div className="flex items-center justify-center h-12">
            <svg className="h-10 w-auto" viewBox="0 0 400 100" xmlns="http://www.w3.org/2000/svg">
              <text x="10" y="65" fontFamily="Arial, sans-serif" fontSize="48" fontWeight="500" fill="#2B2B2B">snapmaker</text>
            </svg>
          </div>

          {/* Thingiverse */}
          <div className="flex items-center justify-center h-12">
            <svg className="h-10 w-auto" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
              <rect width="100" height="100" rx="20" fill="#248BFB"/>
              <circle cx="50" cy="50" r="35" fill="none" stroke="white" strokeWidth="6"/>
              <text x="50" y="70" fontFamily="Arial, sans-serif" fontSize="52" fontWeight="700" fill="white" textAnchor="middle">T</text>
            </svg>
          </div>
        </div>
      </section>

      {/* Real Results Section */}
      <section className="bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 py-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 italic">
                Real Results
              </span>{' '}
              with HotendWeekly
            </h2>
            <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
              Our customers achieve measurable growth with HotendWeekly's AI-powered visual creation:
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Stat 1 */}
            <div className="bg-white rounded-3xl p-8 shadow-xl text-center hover:shadow-2xl transition-shadow">
              <div className="text-5xl md:text-6xl font-bold text-gray-900 mb-4">-90%</div>
              <div className="text-lg md:text-xl font-medium text-gray-700">
                Visual Production Costs
              </div>
            </div>

            {/* Stat 2 */}
            <div className="bg-white rounded-3xl p-8 shadow-xl text-center hover:shadow-2xl transition-shadow">
              <div className="text-5xl md:text-6xl font-bold text-gray-900 mb-4">+30%</div>
              <div className="text-lg md:text-xl font-medium text-gray-700">
                Average Order Value
              </div>
            </div>

            {/* Stat 3 */}
            <div className="bg-white rounded-3xl p-8 shadow-xl text-center hover:shadow-2xl transition-shadow">
              <div className="text-5xl md:text-6xl font-bold text-gray-900 mb-4">+70%</div>
              <div className="text-lg md:text-xl font-medium text-gray-700">
                Faster Time to Market
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
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

          {/* Testimonial Cards Carousel */}
          <div
            className="relative max-w-6xl mx-auto"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            {/* Main Testimonial Display - Shows 3 cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 transition-all duration-500">
              {[0, 1, 2].map((offset) => {
                const index = (currentTestimonial + offset) % testimonials.length
                const testimonial = testimonials[index]
                const isCenter = offset === 1

                return (
                  <div
                    key={index}
                    className={`bg-white rounded-3xl p-6 shadow-lg transition-all duration-500 ${
                      isCenter ? 'md:scale-105 md:shadow-2xl border-2 border-purple-200' : 'md:opacity-75'
                    }`}
                  >
                    {/* Avatar and Info */}
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

                    {/* Testimonial Text */}
                    <p className="text-gray-700 mb-4 text-sm leading-relaxed">
                      {testimonial.text}
                    </p>

                    {/* Star Rating */}
                    <div className="flex items-center gap-1 mb-3">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <svg
                          key={i}
                          className="w-5 h-5 fill-yellow-400"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>

                    {/* Trustpilot Badge */}
                    <div className="flex items-center gap-2">
                      <svg className="w-4 h-4 fill-green-600" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      <span className="text-xs font-semibold text-gray-600">Trustpilot</span>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Navigation Dots */}
            <div className="flex justify-center gap-2 mt-8">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentTestimonial(index)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    index === currentTestimonial
                      ? 'bg-purple-600 w-8'
                      : 'bg-gray-300 hover:bg-gray-400'
                  }`}
                  aria-label={`Go to testimonial ${index + 1}`}
                />
              ))}
            </div>

            {/* Navigation Arrows */}
            <button
              onClick={() => setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length)}
              className="hidden md:block absolute left-0 top-1/2 -translate-y-1/2 -translate-x-12 bg-white rounded-full p-3 shadow-lg hover:shadow-xl transition-shadow"
              aria-label="Previous testimonial"
            >
              <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={() => setCurrentTestimonial((prev) => (prev + 1) % testimonials.length)}
              className="hidden md:block absolute right-0 top-1/2 -translate-y-1/2 translate-x-12 bg-white rounded-full p-3 shadow-lg hover:shadow-xl transition-shadow"
              aria-label="Next testimonial"
            >
              <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </section>

      {/* Showcase Feature Section - SellerPic Style */}
      <section className="max-w-7xl mx-auto px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Skip the shoots. Just upload.{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 italic">
              Hassle-free.
            </span>
          </h2>
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
            Instantly generate model-on-image shots without hiring anyone or booking a studio.
          </p>
        </div>

        {/* Transformation Showcase - Model-First Design */}
        <div className="space-y-8">
          {/* Small Header Above */}
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">
              Instantly Transform Your Model
            </h2>
            <p className="text-sm text-gray-500">
              Start with a blank slate and customize: swap colors, hairstyles, poses, or effects with a click.
            </p>
          </div>

          {/* Four Model Cards - Visually Dominant */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { src: '/showcase/goku-transformation.png', label: 'Unpainted', style: 'Base Model' },
              { src: '/showcase/goku-super-saiyan.jpeg', label: 'Style 1', style: 'Classic Paint' },
              { src: '/showcase/goku-super-saiyan-blue.jpeg', label: 'Style 2', style: 'Blue Variant' },
              { src: '/showcase/goku-ultra-instinct.jpeg', label: 'Style 3', style: 'Ultra Instinct' }
            ].map((model, index) => (
              <div
                key={index}
                className="group relative bg-white rounded-2xl overflow-hidden border border-gray-200 hover:border-gray-400 transition-all duration-300 hover:scale-105"
              >
                {/* Model Image */}
                <div className="aspect-[3/4] overflow-hidden">
                  <img
                    src={model.src}
                    alt={model.style}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
                {/* Minimal Caption */}
                <div className="p-4 text-center border-t border-gray-100">
                  <p className="text-xs font-medium text-gray-400 uppercase tracking-wide">{model.label}</p>
                  <p className="text-sm font-semibold text-gray-700 mt-1">{model.style}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Small CTA Below */}
          <div className="text-center">
            <button className="bg-black text-white px-6 py-3 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors">
              Explore Customization
            </button>
          </div>
        </div>
      </section>

      {/* Additional Features Section */}
      <section className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 space-y-20">
          <ProductShowcase />

          {/* Promo Posters */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Left: Image Display - Wider Landscape */}
            <div className="relative flex justify-start">
              <div className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-3xl p-6 shadow-2xl w-full">
                <img
                  src="/showcase/promo-poster-demo.jpeg"
                  alt="Promo poster creation interface"
                  className="w-full h-auto rounded-2xl"
                />
              </div>
            </div>

            {/* Right: Text Content */}
            <div className="space-y-6">
              <div>
                <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
                  Polish and Create Promo Posters
                </h2>
                <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                  Customize your final images with branded text and layouts—perfect for ads, banners, and social media using tools like Canva.
                </p>
                <button className="bg-black text-white px-8 py-4 rounded-xl font-semibold hover:bg-gray-800 transition-colors text-base">
                  Learn More
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Marketing Videos Section */}
      <section className="bg-gradient-to-br from-gray-50 to-gray-100 py-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 space-y-20">
          <div className="text-center space-y-4">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900">
              Ready-to-share marketing videos.{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-pink-500 to-blue-500 italic">
                Lightning-fast.
              </span>
            </h2>
            <p className="text-lg text-gray-600">
              Instantly generate model-on-image shots without hiring anyone or booking a studio.
            </p>
          </div>

          {/* First Video: Transform static images */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Left: Text Content */}
            <div className="space-y-6">
              <div>
                <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
                  Transform static images into short videos
                </h2>
                <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                  Easily convert still images into high-quality, dynamic videos without any hassle, bringing your products to life.
                </p>
                <button className="bg-black text-white px-8 py-4 rounded-xl font-semibold hover:bg-gray-800 transition-colors text-base">
                  Learn More
                </button>
              </div>
            </div>

            {/* Right: Video Display */}
            <div className="relative flex justify-end">
              <div className="bg-white rounded-3xl p-3 shadow-2xl max-w-xs w-full">
                <div className="relative rounded-2xl overflow-hidden bg-gray-200 aspect-[9/16]">
                  <video
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-full h-full object-cover"
                  >
                    <source src="/showcase/3d-printing-demo.mp4" type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                </div>
              </div>
            </div>
          </div>

          {/* Second Video: Sync voiceovers */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Left: Video Display */}
            <div className="relative flex justify-start">
              <div className="bg-white rounded-3xl p-3 shadow-2xl max-w-xs w-full">
                <div className="relative rounded-2xl overflow-hidden bg-gray-200 aspect-[9/16]">
                  <video
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-full h-full object-cover"
                  >
                    <source src="/showcase/voiceover-sync-demo.mp4" type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                </div>
              </div>
            </div>

            {/* Right: Text Content */}
            <div className="space-y-6">
              <div>
                <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
                  Sync voiceovers with mouth movement
                </h2>
                <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                  Automatically animate your model's lips to match the voiceover—making your product videos more engaging, lifelike, and persuasive.
                </p>
                <button className="bg-black text-white px-8 py-4 rounded-xl font-semibold hover:bg-gray-800 transition-colors text-base">
                  Learn More
                </button>
              </div>
            </div>
          </div>

          {/* Third Section: Social Export */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Left: Text Content */}
            <div className="space-y-6">
              <div>
                <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
                  One-click export to social media platforms
                </h2>
                <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                  Seamlessly share your videos across TikTok, Instagram, and Facebook—upload, schedule, and publish in just a few taps.
                </p>
                <button className="bg-black text-white px-8 py-4 rounded-xl font-semibold hover:bg-gray-800 transition-colors text-base">
                  Learn More
                </button>
              </div>
            </div>

            {/* Right: Image Display */}
            <div className="relative flex justify-end">
              <div className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-3xl p-8 shadow-2xl w-full">
                <img
                  src="/showcase/social-export-demo.jpeg"
                  alt="Social media export interface"
                  className="w-full h-auto rounded-2xl"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* All-in-One Toolkit Section */}
      <section className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Your Smartest E-Commerce Media Toolkit.{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 italic">
                All-in-One.
              </span>
            </h2>
            <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
              Everything you need is HotendWeekly
            </p>
          </div>

          {/* Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Left: Visual Demo */}
            <div className="relative">
              <div className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-3xl p-3 shadow-2xl">
                <video
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="w-full h-auto rounded-2xl"
                >
                  <source src="/showcase/graffiti-wall.mp4" type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              </div>

              {/* Floating "One Image" indicator */}
              <div className="absolute -bottom-6 -left-6 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-2xl shadow-2xl">
                <div className="text-sm font-medium">From Just</div>
                <div className="text-2xl font-bold">One Image</div>
              </div>
            </div>

            {/* Right: Content */}
            <div className="space-y-8">
              <div>
                <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                  Create All Your Content from One Image
                </h3>
                <p className="text-lg text-gray-600 mb-8">
                  Start with a single product photo and instantly generate lifestyle shots, white background images, and content ready for social media.
                </p>
                <button className="bg-gray-900 text-white px-8 py-4 rounded-2xl font-semibold hover:bg-gray-800 transition-colors">
                  Learn More
                </button>
              </div>

              {/* Feature list */}
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                    <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 mb-1">White Background Removal</h4>
                    <p className="text-sm text-gray-600">Marketplace-perfect cutouts and catalog imagery generated in seconds.</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-pink-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                    <svg className="w-5 h-5 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 mb-1">Lifestyle Scene Generation</h4>
                    <p className="text-sm text-gray-600">AI-crafted environments that spotlight your products in real-world moments.</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 mb-1">Social Media Formats</h4>
                    <p className="text-sm text-gray-600">Ready-to-post content tuned for Instagram, Pinterest, TikTok, and every channel you care about.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* All-in-One Solution Section */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Left: Content */}
            <div className="space-y-6">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900">
                All-in-One Solution
              </h2>
              <p className="text-lg md:text-xl text-gray-600 leading-relaxed">
                Access everything you need in one comprehensive toolkit, from Color Changer, Background Replacer to video production, simplifying your workflow.
              </p>
              <button className="bg-black text-white px-8 py-4 rounded-xl font-semibold hover:bg-gray-800 transition-colors text-base">
                Learn More
              </button>
            </div>

            {/* Right: Image with background replacement effect */}
            <div className="relative">
              <div className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-3xl overflow-hidden shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&h=600&fit=crop"
                  alt="Background replacement demonstration"
                  className="w-full h-auto"
                  style={{
                    clipPath: 'polygon(0 0, 60% 0, 60% 100%, 0 100%)',
                  }}
                />
                <div
                  className="absolute top-0 right-0 w-[40%] h-full bg-gradient-to-br from-blue-100 to-orange-100"
                  style={{
                    clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)',
                  }}
                />
                {/* Dashed line separator */}
                <div
                  className="absolute top-0 h-full border-l-4 border-dashed border-white"
                  style={{ left: '60%' }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Additional Tools Section 2 */}
      <section className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Left: Visual grid */}
            <div className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-3xl p-8 shadow-2xl">
              <img
                src="/showcase/platform-resize-showcase.jpeg"
                alt="Auto-resize platform showcase with product variations"
                className="w-full h-auto rounded-2xl"
              />
            </div>

            {/* Right: Content */}
            <div className="space-y-6">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900">
                Auto-Resize and Adapt for Every Platform
              </h2>
              <p className="text-lg text-gray-600">
                Easily export image formats tailored for Amazon, Shopify, TikTok, and more perfect sizing for every platform, no manual edits needed.
              </p>
              <button className="bg-gray-900 text-white px-8 py-4 rounded-2xl font-semibold hover:bg-gray-800 transition-colors">
                Learn More
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Ever Growing AI Toolkit Section */}
      <section className="bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 py-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Ever Growing{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 italic">
                AI Toolkit
              </span>
            </h2>
            <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
              More than just model shots—HotendWeekly offers a full suite of AI-powered tools to handle every aspect of your product visuals.
            </p>
          </div>

          {/* Top row - 3 tools */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            {/* Diversified Fashion Model Database */}
            <Link href="/tools/fashion-model-database" className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-shadow cursor-pointer group">
              <div className="bg-gray-100 rounded-2xl p-6 mb-6 aspect-square flex items-center justify-center group-hover:bg-gray-200 transition-colors">
                <img
                  src="/showcase/fashion-model-database.jpeg"
                  alt="Diversified Fashion Model Database"
                  className="w-full h-full object-contain rounded-xl"
                />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-purple-600 transition-colors">Diversified Fashion Model Database</h3>
              <p className="text-sm text-gray-600">
                Discover the industry's most diverse AI fashion models - representing all body types, ethnicities, and generations.
              </p>
            </Link>

            {/* Transform to 3D */}
            <Link href="/tools/transform-to-3d" className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-shadow cursor-pointer group">
              <div className="bg-gray-100 rounded-2xl p-6 mb-6 aspect-square flex items-center justify-center group-hover:bg-gray-200 transition-colors">
                <img
                  src="/showcase/transform-to-3d.jpeg"
                  alt="Transform to 3D"
                  className="w-full h-full object-contain rounded-xl"
                />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-purple-600 transition-colors">Transform to 3D</h3>
              <p className="text-sm text-gray-600">
                Transform 2D product images into interactive 3D models with AI-powered depth reconstruction.
              </p>
            </Link>

            {/* Magic Eraser */}
            <Link href="/tools/magic-eraser" className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-shadow cursor-pointer group">
              <div className="bg-gray-100 rounded-2xl p-6 mb-6 aspect-square flex items-center justify-center group-hover:bg-gray-200 transition-colors">
                <img
                  src="/showcase/magic-eraser.jpeg"
                  alt="Magic Eraser"
                  className="w-full h-full object-contain rounded-xl"
                />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-purple-600 transition-colors">Magic Eraser</h3>
              <p className="text-sm text-gray-600">
                Automatically fix flaws and enhance your visuals with a professional finish.
              </p>
            </Link>
          </div>

          {/* Bottom row - 3 tools */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Image Retouch */}
            <Link href="/tools/image-retouch" className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-shadow cursor-pointer group">
              <div className="bg-gray-100 rounded-2xl p-6 mb-6 aspect-square flex items-center justify-center group-hover:bg-gray-200 transition-colors">
                <img
                  src="/showcase/image-retouch.png"
                  alt="Image Retouch (Color Changing)"
                  className="w-full h-full object-contain rounded-xl"
                />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-purple-600 transition-colors">Image Retouch (Color Changing)</h3>
              <p className="text-sm text-gray-600">
                Modify specific regions of 3D model or image by changing colors, textures, or materials with simple text instructions.
              </p>
            </Link>

            {/* Image Enhancer */}
            <Link href="/tools/image-enhancer" className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-shadow cursor-pointer group">
              <div className="bg-gray-100 rounded-2xl p-6 mb-6 aspect-square flex items-center justify-center group-hover:bg-gray-200 transition-colors">
                <img
                  src="/showcase/image-enhancer.png"
                  alt="Image Enhancer (Clarity & Detail)"
                  className="w-full h-full object-contain rounded-xl"
                />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-purple-600 transition-colors">Image Enhancer (Clarity & Detail)</h3>
              <p className="text-sm text-gray-600">
                Transform low-resolution blurry 3D scans into crisp, highly detailed visuals, revealing hidden details.
              </p>
            </Link>

            {/* Image Extender */}
            <Link href="/tools/image-extender" className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-shadow cursor-pointer group">
              <div className="bg-gray-100 rounded-2xl p-6 mb-6 aspect-square flex items-center justify-center group-hover:bg-gray-200 transition-colors">
                <img
                  src="/showcase/image-extender.png"
                  alt="Image Extender (Scale & Background)"
                  className="w-full h-full object-contain rounded-xl"
                />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-purple-600 transition-colors">Image Extender (Scale & Background)</h3>
              <p className="text-sm text-gray-600">
                Expand the canvas of any 3D render by generating new content that seamlessly blends with the original scene to create larger compositions.
              </p>
            </Link>
          </div>

          {/* View All Tools Button */}
          <div className="mt-12 text-center">
            <Link
              href="/tools"
              className="inline-flex items-center gap-3 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 text-white px-10 py-4 rounded-full text-lg font-semibold hover:from-purple-700 hover:via-pink-700 hover:to-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              <span>View All Tools</span>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
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
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
              </svg>
              Download on the App Store
            </button>
          </div>
        </div>
      </section>

      {/* Upload and Preview Section */}
      <section className="max-w-7xl mx-auto px-6 lg:px-8 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Upload Section */}
          <div className="bg-white rounded-3xl p-8 shadow-xl">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Upload your product</h2>
            <p className="text-gray-600 mb-6">One image is all it takes.</p>

            {error && (
              <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-600">{error}</p>
                <p className="text-xs text-red-500 mt-1">
                  Tip: Make sure REPLICATE_API_TOKEN is configured in Vercel environment variables
                </p>
              </div>
            )}

            <div className="border-2 border-dashed border-gray-300 rounded-2xl p-12 text-center hover:border-purple-400 transition-colors cursor-pointer">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                id="file-upload"
                disabled={isProcessing}
              />
              <label htmlFor="file-upload" className="cursor-pointer">
                {uploadedImage ? (
                  <div className="space-y-4">
                    <img src={uploadedImage} alt="Uploaded product" className="max-h-64 mx-auto rounded-lg" />
                    <p className="text-sm text-gray-500">
                      {isProcessing ? 'Processing...' : 'Click to change image'}
                    </p>
                  </div>
                ) : (
                  <>
                    <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                    </div>
                    <p className="text-lg font-medium text-gray-900 mb-2">Drop your image here</p>
                    <p className="text-sm text-gray-500">or click to browse</p>
                  </>
                )}
              </label>
            </div>

            {/* Intelligent AI Generation */}
            {uploadedImage && !isProcessing && (
              <div className="mt-6 space-y-4">
                {/* Simplify for 3D Printing */}
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 mb-3">Simplify for 3D Printing 🖨️</h3>
                  <p className="text-xs text-gray-600 mb-4">Convert your image to a simplified, vector-style design perfect for multi-color 3D printing</p>

                  <button
                    onClick={handleSimplifyFor3DPrint}
                    disabled={isProcessing}
                    className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 text-white py-3 rounded-full font-semibold hover:from-blue-700 hover:to-cyan-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                    </svg>
                    Simplify for 3D Printing
                  </button>

                  {simplifiedImage && (
                    <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                      <p className="text-xs font-semibold text-blue-900 mb-1">✅ Simplified Successfully!</p>
                      {imageDescription && (
                        <p className="text-xs text-blue-700 mb-2">
                          <span className="font-medium">AI Analysis:</span> {imageDescription}
                        </p>
                      )}
                      <p className="text-xs text-blue-700">
                        Your image has been converted to a clean, vector-style design. Download it below and use with Vectorizer.ai → Figma → Tinkercad for 3D printing.
                      </p>
                    </div>
                  )}
                </div>

                {/* AI Product Photography */}
                <div className="pt-4 border-t border-gray-200">
                  <h3 className="text-sm font-semibold text-gray-900 mb-3">Generate AI Product Photography 🎨</h3>
                  <p className="text-xs text-gray-600 mb-4">AI will analyze your product and create the perfect scene automatically</p>

                  <button
                    onClick={handleVirtualTryOn}
                    disabled={isProcessing}
                    className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-full font-semibold hover:from-purple-700 hover:to-pink-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    Generate with AI
                  </button>

                  {productAnalysis && (
                    <div className="mt-4 p-3 bg-purple-50 rounded-lg border border-purple-200">
                      <p className="text-xs font-semibold text-purple-900 mb-1">AI Analysis Results:</p>
                      <p className="text-xs text-purple-700">
                        <span className="font-medium">Category:</span> {productAnalysis.category}
                      </p>
                      <p className="text-xs text-purple-700">
                        <span className="font-medium">Display:</span> {productAnalysis.displayType}
                      </p>
                      <p className="text-xs text-purple-700">
                        <span className="font-medium">Description:</span> {productAnalysis.description}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Progress Steps Indicator */}
            {isProcessing && workflowStep && (
              <div className="mt-6 space-y-3">
                {simplifiedImage !== null ? (
                  // 2-step workflow for simplification
                  [1, 2].map((step) => (
                    <div
                      key={step}
                      className={`flex items-center gap-3 p-3 rounded-lg transition-all ${
                        workflowStep === step
                          ? 'bg-blue-100 border-2 border-blue-500'
                          : workflowStep > step
                          ? 'bg-green-50 border-2 border-green-500'
                          : 'bg-gray-50 border-2 border-gray-200'
                      }`}
                    >
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                          workflowStep === step
                            ? 'bg-blue-600 text-white animate-pulse'
                            : workflowStep > step
                            ? 'bg-green-500 text-white'
                            : 'bg-gray-300 text-gray-600'
                        }`}
                      >
                        {workflowStep > step ? '✓' : step}
                      </div>
                      <div className="flex-1">
                        <p className={`text-sm font-semibold ${
                          workflowStep === step ? 'text-blue-900' : workflowStep > step ? 'text-green-900' : 'text-gray-600'
                        }`}>
                          {step === 1 && '👁️ Analyzing Image'}
                          {step === 2 && '🎨 Generating Simplified Version'}
                        </p>
                        <p className="text-xs text-gray-500">
                          {step === 1 && 'GPT-4 Vision analyzing your image...'}
                          {step === 2 && 'DALL-E 3 creating vector-style illustration...'}
                        </p>
                      </div>
                      {workflowStep === step && (
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
                      )}
                    </div>
                  ))
                ) : (
                  // 3-step workflow for AI product photography
                  [1, 2, 3].map((step) => (
                    <div
                      key={step}
                      className={`flex items-center gap-3 p-3 rounded-lg transition-all ${
                        workflowStep === step
                          ? 'bg-purple-100 border-2 border-purple-500'
                          : workflowStep > step
                          ? 'bg-green-50 border-2 border-green-500'
                          : 'bg-gray-50 border-2 border-gray-200'
                      }`}
                    >
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                          workflowStep === step
                            ? 'bg-purple-600 text-white animate-pulse'
                            : workflowStep > step
                            ? 'bg-green-500 text-white'
                            : 'bg-gray-300 text-gray-600'
                        }`}
                      >
                        {workflowStep > step ? '✓' : step}
                      </div>
                      <div className="flex-1">
                        <p className={`text-sm font-semibold ${
                          workflowStep === step ? 'text-purple-900' : workflowStep > step ? 'text-green-900' : 'text-gray-600'
                        }`}>
                          {step === 1 && '🧠 Analyzing Product'}
                          {step === 2 && '🎨 Generating Scene'}
                          {step === 3 && '✨ Final Compositing'}
                        </p>
                        <p className="text-xs text-gray-500">
                          {step === 1 && 'AI vision analyzing your product...'}
                          {step === 2 && 'Creating perfect scene with FLUX...'}
                          {step === 3 && 'Finalizing professional photo...'}
                        </p>
                      </div>
                      {workflowStep === step && (
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-purple-600"></div>
                      )}
                    </div>
                  ))
                )}
              </div>
            )}

            {/* Background Selection */}
            {removedBgImage && !isProcessing && !virtualTryOnResult && (
              <div className="mt-6">
                <h3 className="text-sm font-semibold text-gray-900 mb-3">Choose Background</h3>
                <div className="grid grid-cols-3 gap-3">
                  {backgrounds.map((bg) => (
                    <button
                      key={bg.id}
                      onClick={() => setSelectedBackground(bg.id)}
                      className={`relative p-3 rounded-lg border-2 transition-all ${
                        selectedBackground === bg.id
                          ? 'border-purple-600 shadow-lg'
                          : 'border-gray-200 hover:border-purple-300'
                      }`}
                    >
                      <div
                        className="w-full h-16 rounded mb-2"
                        style={{
                          background: bg.gradient || bg.color,
                          border: bg.color === 'transparent' ? '1px dashed #ccc' : 'none'
                        }}
                      />
                      <p className="text-xs font-medium text-gray-900">{bg.name}</p>
                      <p className="text-xs text-gray-500">{bg.description}</p>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Create & Share Section */}
          <div className="bg-gradient-to-br from-purple-600 to-pink-600 rounded-3xl p-8 shadow-xl text-white">
            <h2 className="text-2xl font-bold mb-2">Create & Share</h2>
            <p className="text-purple-100 mb-6">
              Get eye-catching photos ready for any platform!
            </p>

            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 mb-6 relative">
              <div className="aspect-video bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg flex items-center justify-center relative overflow-hidden">
                {isProcessing && (
                  <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center z-10">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mb-4"></div>
                    <p className="text-white font-medium">{processingStatus}</p>
                  </div>
                )}
                {processedImage ? (
                  <img
                    src={processedImage}
                    alt="Processed"
                    className="max-h-full rounded-lg object-contain"
                  />
                ) : (
                  <p className="text-gray-400">Upload an image and click a button to see results</p>
                )}
              </div>
            </div>

            {processedImage && !isProcessing && (
              <button
                onClick={handleDownload}
                className="w-full bg-white text-purple-600 py-3 rounded-full font-semibold hover:bg-gray-100 transition-colors mb-4 flex items-center justify-center"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Download Enhanced Image
              </button>
            )}

            <div className="space-y-3">
              <div className="flex items-center space-x-2 text-sm">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>AI-powered background removal</span>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>6 professional backgrounds</span>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>Optimized for Etsy, Amazon, Shopify</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Email Modal */}
      {showEmailModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full relative">
            <button
              onClick={() => setShowEmailModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {emailSubmitted ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">You're on the list!</h3>
                <p className="text-gray-600">We'll notify you when we launch.</p>
              </div>
            ) : (
              <>
                <div className="text-center mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-pink-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <span className="text-white font-bold text-xl">H</span>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Get Early Access</h3>
                  <p className="text-gray-600">Join the waitlist for AI-powered 3D print photography</p>
                </div>

                <form onSubmit={handleEmailSubmit} className="space-y-4">
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-full font-semibold hover:from-purple-700 hover:to-pink-700 transition-colors"
                  >
                    Join Waitlist
                  </button>

                  <p className="text-xs text-gray-500 text-center">
                    Be the first to know when we launch. No spam, ever.
                  </p>
                </form>
              </>
            )}
          </div>
        </div>
      )}

      {/* FAQ Section */}
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

          {/* FAQ Accordion */}
          <div className="space-y-4">
            {[
              {
                question: 'How easy is it to use HotendWeekly?',
                answer:
                  "Very easy! HotendWeekly is designed for users of all skill levels. Whether you're a professional designer or someone with no prior editing experience, you can create stunning visuals in just a few clicks.",
              },
              {
                question: 'Can I try HotendWeekly for free?',
                answer:
                  'Yes! HotendWeekly offers a free trial that allows you to test all features without any commitment. Start creating amazing visuals today.',
              },
              {
                question: 'What kind of images can I edit with HotendWeekly?',
                answer:
                  'HotendWeekly works with all types of 3D print images - from miniatures and functional prints to decorative pieces and accessories. Upload photos of your printed models, and our AI will enhance them for professional presentation.',
              },
              {
                question: 'Do I need to download any software?',
                answer:
                  "No downloads required! HotendWeekly is a web-based platform that works directly in your browser. Just sign up and start creating immediately.",
              },
              {
                question: 'Are the edits high-quality and professional?',
                answer:
                  'Absolutely! Our AI generates professional-grade images that are indistinguishable from traditional photography. Perfect for e-commerce, marketing, and social media.',
              },
              {
                question: 'Can I cancel my subscription anytime?',
                answer:
                  "Yes, you can cancel your subscription at any time. There are no long-term commitments, and you'll retain access to your account until the end of your billing period.",
              },
              {
                question: 'Is my data safe with HotendWeekly?',
                answer:
                  'Your data security is our top priority. We use enterprise-grade encryption and follow strict privacy policies to ensure your images and information are completely secure.',
              },
            ].map((faq, index) => (
              <div
                key={index}
                className={`border border-gray-200 rounded-2xl overflow-hidden transition-all ${
                  openFaqIndex === index ? 'bg-purple-50' : 'bg-white'
                }`}
              >
                <button
                  onClick={() => setOpenFaqIndex(openFaqIndex === index ? null : index)}
                  className="w-full px-6 py-6 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
                >
                  <span className="text-lg font-bold text-gray-900 pr-8">{faq.question}</span>
                  <div className="flex-shrink-0">
                    {openFaqIndex === index ? (
                      <svg
                        className="w-6 h-6 text-gray-900"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M20 12H4"
                        />
                      </svg>
                    ) : (
                      <svg
                        className="w-6 h-6 text-gray-900"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 4v16m8-8H4"
                        />
                      </svg>
                    )}
                  </div>
                </button>
                {openFaqIndex === index && (
                  <div className="px-6 pb-6">
                    <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* Footer */}
      <Footer />
    </div>
  )
}
