'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import dynamic from 'next/dynamic'
import { useAuth } from '@/contexts/AuthContext'
import ContactForm from '@/components/ContactForm'

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
      <nav className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-pink-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">H</span>
              </div>
              <span className="text-xl font-semibold text-gray-900">HotendWeekly</span>
            </Link>

            <div className="hidden md:flex items-center space-x-8">
              <button className="text-gray-700 hover:text-gray-900 text-sm font-medium flex items-center">
                Tools
                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <Link href="#pricing" className="text-gray-700 hover:text-gray-900 text-sm font-medium">
                Pricing
              </Link>
              <Link href="#inspiration" className="text-gray-700 hover:text-gray-900 text-sm font-medium">
                Inspiration
              </Link>
              <Link href="#contact" className="text-gray-700 hover:text-gray-900 text-sm font-medium">
                Contact
              </Link>
              <Link href="#api" className="text-gray-700 hover:text-gray-900 text-sm font-medium">
                API
              </Link>
            </div>

            <div className="flex items-center space-x-4">
              {/* Language Selector */}
              <button className="hidden md:flex items-center space-x-2 text-gray-700 hover:text-gray-900 text-sm font-medium">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                </svg>
                <span>English</span>
              </button>

              {user ? (
                <div className="relative">
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center space-x-2 text-gray-700 hover:text-gray-900"
                  >
                    <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-semibold">
                        {user.email?.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  </button>

                  {showUserMenu && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-50">
                      <div className="px-4 py-2 border-b border-gray-200">
                        <p className="text-sm font-medium text-gray-900 truncate">{user.email}</p>
                      </div>
                      <button
                        onClick={() => {
                          signOut()
                          setShowUserMenu(false)
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-50"
                      >
                        Sign Out
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  href="/auth/login"
                  className="bg-black text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors"
                >
                  LOG IN / SIGN UP
                </Link>
              )}
            </div>
          </div>
        </div>
      </nav>

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

      {/* Hassle-Free Feature Section */}
      <section className="max-w-7xl mx-auto px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Skip the shoots. Just upload.{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 italic">
              Hassle-free.
            </span>
          </h2>
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
            Instantly generate professional product shots without expensive equipment or complicated setups.
          </p>
        </div>

        {/* Two Column Feature Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left Feature: Swap Backgrounds */}
          <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-3xl p-12 relative overflow-hidden">
            <div className="relative z-10">
              <h3 className="text-3xl font-bold text-gray-900 mb-4">
                Swap Backgrounds Instantly
              </h3>
              <p className="text-lg text-gray-600 mb-8 max-w-md">
                Cut down on expenses associated with traditional photography setups and studio rentals, making your budget go further.
              </p>
              <button className="bg-gray-900 text-white px-8 py-4 rounded-2xl font-semibold hover:bg-gray-800 transition-colors">
                Learn More
              </button>
            </div>

            {/* Visual Demo */}
            <div className="mt-12 relative">
              <div className="flex items-center justify-center gap-8">
                {/* Before Image */}
                <div className="relative">
                  <div className="w-40 h-40 bg-white rounded-2xl shadow-lg overflow-hidden">
                    <img
                      src="https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=400&h=400&fit=crop"
                      alt="Original 3D print"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="absolute -top-2 -right-2 bg-white px-3 py-1 rounded-full text-xs font-semibold shadow-md">
                    Before
                  </div>
                </div>

                {/* Arrow */}
                <div className="text-4xl text-gray-400">→</div>

                {/* After Image with background swap */}
                <div className="relative">
                  <div className="w-40 h-40 bg-gradient-to-br from-purple-200 to-pink-200 rounded-2xl shadow-xl overflow-hidden flex items-center justify-center">
                    <img
                      src="https://images.unsplash.com/photo-1612036782180-6f0b6cd846fe?w=400&h=400&fit=crop"
                      alt="Enhanced 3D print"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="absolute -top-2 -right-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-md">
                    After
                  </div>
                </div>
              </div>

              {/* Background Options */}
              <div className="mt-6 flex justify-center gap-3">
                <div className="w-12 h-12 bg-white rounded-lg shadow-md border-2 border-purple-600"></div>
                <div className="w-12 h-12 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg shadow-md"></div>
                <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-pink-100 rounded-lg shadow-md"></div>
                <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-lg shadow-md"></div>
              </div>
            </div>
          </div>

          {/* Right Feature: Add Lifestyle Scenes */}
          <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-3xl p-12 relative overflow-hidden">
            <div className="relative z-10">
              <h3 className="text-3xl font-bold text-gray-900 mb-4">
                Add Lifestyle Scenes to Product Photos
              </h3>
              <p className="text-lg text-gray-600 mb-8 max-w-md">
                No need for elaborate photoshoots—easily incorporate realistic scenes into your current product images.
              </p>
              <button className="bg-gray-900 text-white px-8 py-4 rounded-2xl font-semibold hover:bg-gray-800 transition-colors">
                Learn More
              </button>
            </div>

            {/* Scene Examples */}
            <div className="mt-12">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white rounded-2xl shadow-lg overflow-hidden aspect-square">
                  <img
                    src="https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?w=300&h=300&fit=crop"
                    alt="Lifestyle scene 1"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="bg-white rounded-2xl shadow-lg overflow-hidden aspect-square">
                  <img
                    src="https://images.unsplash.com/photo-1595246140625-573b715d11dc?w=300&h=300&fit=crop"
                    alt="Lifestyle scene 2"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="bg-white rounded-2xl shadow-lg overflow-hidden aspect-square">
                  <img
                    src="https://images.unsplash.com/photo-1615876234886-fd9a39fda97f?w=300&h=300&fit=crop"
                    alt="Lifestyle scene 3"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="bg-white rounded-2xl shadow-lg overflow-hidden aspect-square">
                  <img
                    src="https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=300&h=300&fit=crop"
                    alt="Lifestyle scene 4"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Additional Features Section */}
      <section className="max-w-7xl mx-auto px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Multi-Angle Feature */}
          <div className="bg-gray-50 rounded-3xl p-12 relative overflow-hidden">
            <div className="relative z-10 mb-12">
              <h3 className="text-3xl font-bold text-gray-900 mb-4">
                Generate Multi-Angle Product Shots
              </h3>
              <p className="text-lg text-gray-600 max-w-md">
                Showcase your 3D print from every angle—automatically create left, front, and right views without the need for multiple photoshoots.
              </p>
            </div>

            {/* Multi-angle preview grid */}
            <div className="grid grid-cols-4 gap-4">
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden aspect-[3/4]">
                <img
                  src="https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=300&h=400&fit=crop"
                  alt="Left angle view"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden aspect-[3/4]">
                <img
                  src="https://images.unsplash.com/photo-1612036782180-6f0b6cd846fe?w=300&h=400&fit=crop"
                  alt="Front view"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden aspect-[3/4]">
                <img
                  src="https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=300&h=400&fit=crop"
                  alt="Right angle view"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden aspect-[3/4]">
                <img
                  src="https://images.unsplash.com/photo-1595246140625-573b715d11dc?w=300&h=400&fit=crop"
                  alt="Back view"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Angle indicators */}
            <div className="mt-4 flex justify-between px-2 text-xs text-gray-500 font-medium">
              <span>Left</span>
              <span>Front</span>
              <span>Right</span>
              <span>Back</span>
            </div>
          </div>

          {/* Promo Creation Feature */}
          <div className="bg-gray-900 rounded-3xl p-12 relative overflow-hidden text-white">
            <div className="relative z-10 mb-12">
              <h3 className="text-3xl font-bold mb-4">
                Polish and Create Promo Posters
              </h3>
              <p className="text-lg text-gray-300 max-w-md">
                Customize your final images with branded text and layouts—perfect for ads, banners, and social media using tools like Canva.
              </p>
            </div>

            {/* Promo Preview */}
            <div className="bg-white rounded-2xl p-6 shadow-2xl">
              <div className="space-y-4">
                {/* Toolbar mockup */}
                <div className="flex items-center justify-between pb-4 border-b border-gray-200">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gray-200 rounded-lg flex items-center justify-center">
                      <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div className="w-8 h-8 bg-gray-200 rounded-lg flex items-center justify-center">
                      <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
                      </svg>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {/* Canva logo mockup */}
                    <div className="bg-gradient-to-r from-cyan-400 to-blue-500 text-white px-3 py-1.5 rounded-lg text-xs font-bold">
                      Canva
                    </div>
                  </div>
                </div>

                {/* Preview content */}
                <div className="bg-gradient-to-br from-purple-100 to-pink-100 rounded-xl p-6 aspect-video flex items-center justify-center relative overflow-hidden">
                  <div className="absolute top-4 left-4 text-gray-900">
                    <h4 className="text-2xl font-bold">NEW ARRIVAL</h4>
                    <p className="text-sm">Limited Edition Print</p>
                  </div>
                  <img
                    src="https://images.unsplash.com/photo-1612036782180-6f0b6cd846fe?w=400&h=400&fit=crop"
                    alt="Product in promo"
                    className="w-40 h-40 object-cover rounded-lg shadow-lg"
                  />
                  <div className="absolute bottom-4 right-4 bg-white text-gray-900 px-4 py-2 rounded-full text-sm font-bold">
                    Shop Now →
                  </div>
                </div>

                {/* Export options */}
                <div className="flex items-center gap-2 pt-2">
                  <div className="text-xs text-gray-500 font-medium">Export for:</div>
                  <div className="flex gap-2">
                    <span className="px-2 py-1 bg-gray-100 rounded text-xs text-gray-700">Instagram</span>
                    <span className="px-2 py-1 bg-gray-100 rounded text-xs text-gray-700">Facebook</span>
                    <span className="px-2 py-1 bg-gray-100 rounded text-xs text-gray-700">Pinterest</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Marketing Videos Section */}
      <section className="bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 py-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Ready-to-share marketing videos.{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 italic">
                Lightning-fast.
              </span>
            </h2>
            <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
              Instantly generate model-on-image shots without hiring anyone or booking a studio.
            </p>
          </div>

          {/* Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left: Text Content */}
            <div className="space-y-8">
              <div>
                <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                  Transform static images into short videos
                </h3>
                <p className="text-lg text-gray-600 mb-8">
                  Easily convert still images into high-quality, dynamic videos without any hassle, bringing your 3D prints to life.
                </p>
                <button className="bg-gray-900 text-white px-8 py-4 rounded-2xl font-semibold hover:bg-gray-800 transition-colors">
                  Learn More
                </button>
              </div>
            </div>

            {/* Right: Video Display */}
            <div className="relative">
              <div className="bg-white rounded-3xl p-6 shadow-2xl">
                <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 aspect-[9/16]">
                  {/* Video element */}
                  <video
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-full h-full object-cover"
                  >
                    <source src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4" type="video/mp4" />
                    {/* Fallback image */}
                    <img
                      src="https://images.unsplash.com/photo-1612036782180-6f0b6cd846fe?w=600&h=1000&fit=crop"
                      alt="Product video preview"
                      className="w-full h-full object-cover"
                    />
                  </video>

                  {/* Video overlay elements */}
                  <div className="absolute inset-0 pointer-events-none">
                    {/* Top gradient overlay */}
                    <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-black/30 to-transparent"></div>

                    {/* Bottom gradient overlay */}
                    <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/30 to-transparent"></div>
                  </div>

                  {/* Play indicator */}
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-lg">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                      <span className="text-xs font-semibold text-gray-900">LIVE</span>
                    </div>
                  </div>
                </div>

                {/* Video metadata */}
                <div className="mt-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1">
                      <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
                      </svg>
                      <span className="text-sm font-semibold text-gray-700">Video</span>
                    </div>
                    <div className="flex items-center gap-1 text-gray-500">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      <span className="text-xs">1.2K views</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium">Instagram</span>
                    <span className="px-3 py-1 bg-pink-100 text-pink-700 rounded-full text-xs font-medium">TikTok</span>
                  </div>
                </div>
              </div>

              {/* Floating badge */}
              <div className="absolute -top-4 -left-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-2xl shadow-xl">
                <div className="text-xs font-medium">Auto-Generated</div>
                <div className="text-lg font-bold">in 30 seconds</div>
              </div>
            </div>
          </div>

          {/* Features grid */}
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h4 className="text-lg font-bold text-gray-900 mb-2">Instant Creation</h4>
              <p className="text-sm text-gray-600">Generate videos in seconds, not hours</p>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <div className="w-12 h-12 bg-pink-100 rounded-xl flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
                </svg>
              </div>
              <h4 className="text-lg font-bold text-gray-900 mb-2">Platform Ready</h4>
              <p className="text-sm text-gray-600">Optimized for Instagram, TikTok, and more</p>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h4 className="text-lg font-bold text-gray-900 mb-2">No Skills Needed</h4>
              <p className="text-sm text-gray-600">No video editing experience required</p>
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
              <div className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-3xl p-8 shadow-2xl">
                {/* Multiple content variations display */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  {/* Product flat lay */}
                  <div className="bg-white rounded-2xl overflow-hidden shadow-lg aspect-square">
                    <img
                      src="https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=400&h=400&fit=crop"
                      alt="Product flat lay"
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Lifestyle shot */}
                  <div className="bg-white rounded-2xl overflow-hidden shadow-lg aspect-square relative">
                    <img
                      src="https://images.unsplash.com/photo-1612036782180-6f0b6cd846fe?w=400&h=400&fit=crop"
                      alt="Lifestyle shot"
                      className="w-full h-full object-cover"
                    />
                    {/* Avatar overlay */}
                    <div className="absolute top-3 left-3 w-10 h-10 bg-white rounded-full shadow-lg overflow-hidden border-2 border-white">
                      <img
                        src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop"
                        alt="User avatar"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                </div>

                {/* Mobile preview mockup */}
                <div className="bg-gray-900 rounded-3xl p-4 shadow-2xl">
                  <div className="bg-white rounded-2xl overflow-hidden aspect-[9/16]">
                    <img
                      src="https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?w=400&h=700&fit=crop"
                      alt="Mobile content preview"
                      className="w-full h-full object-cover"
                    />

                    {/* Mobile UI overlay */}
                    <div className="absolute inset-0 flex flex-col justify-between p-4 pointer-events-none">
                      {/* Top bar */}
                      <div className="flex items-center justify-between">
                        <div className="bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-lg">
                          <span className="text-xs font-semibold text-gray-900">@maker</span>
                        </div>
                        <button className="bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-lg">
                          <svg className="w-4 h-4 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                          </svg>
                        </button>
                      </div>

                      {/* Bottom bar */}
                      <div className="flex items-center justify-between bg-black/50 backdrop-blur-sm rounded-2xl p-3">
                        <button className="p-2">
                          <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                          </svg>
                        </button>
                        <button className="p-2">
                          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                          </svg>
                        </button>
                        <button className="p-2">
                          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                          </svg>
                        </button>
                        <button className="p-2">
                          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                          </svg>
                        </button>
                        <button className="p-2">
                          <div className="w-6 h-6 bg-white rounded-full border-2 border-white"></div>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
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
                    <p className="text-sm text-gray-600">Perfect for marketplace listings and catalogs</p>
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
                    <p className="text-sm text-gray-600">AI-powered scenes that showcase your prints in context</p>
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
                    <p className="text-sm text-gray-600">Instagram, Pinterest, TikTok ready in one click</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                    <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 mb-1">Video Content Creation</h4>
                    <p className="text-sm text-gray-600">Transform stills into engaging video content</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Additional Tools Section 1 */}
      <section className="bg-gradient-to-br from-gray-50 to-gray-100 py-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Left: Content */}
            <div className="space-y-6">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900">
                All-in-One Solution
              </h2>
              <p className="text-lg text-gray-600">
                Access everything you need in one comprehensive toolkit, from Color Changer, Background Replacer to video production, simplifying your workflow.
              </p>
              <button className="bg-gray-900 text-white px-8 py-4 rounded-2xl font-semibold hover:bg-gray-800 transition-colors">
                Learn More
              </button>
            </div>

            {/* Right: Visual with background swap demo */}
            <div className="relative">
              <div className="bg-white rounded-3xl p-6 shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1612036782180-6f0b6cd846fe?w=800&h=600&fit=crop"
                  alt="Background swap demo"
                  className="rounded-2xl w-full"
                />
                {/* Dashed selection box overlay */}
                <div className="absolute inset-0 m-6 border-2 border-dashed border-white rounded-2xl pointer-events-none">
                  <div className="absolute top-1/2 right-0 transform translate-x-full -translate-y-1/2 ml-4">
                    <div className="bg-white rounded-2xl p-4 shadow-xl flex flex-col gap-2">
                      <div className="w-16 h-16 bg-gray-200 rounded-lg"></div>
                      <div className="w-16 h-16 bg-blue-100 rounded-lg"></div>
                      <div className="w-16 h-16 bg-purple-100 rounded-lg"></div>
                    </div>
                  </div>
                </div>
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
              <div className="grid grid-cols-4 gap-3">
                {[1, 2, 3, 4, 5, 6, 7].map((i) => (
                  <div key={i} className="bg-white rounded-xl overflow-hidden shadow-lg aspect-square">
                    <img
                      src={`https://images.unsplash.com/photo-${
                        [
                          '1565193566173-7a0ee3dbe261',
                          '1612036782180-6f0b6cd846fe',
                          '1581092160562-40aa08e78837',
                          '1595246140625-573b715d11dc',
                          '1581833971358-2c8b550f87b3',
                          '1615876234886-fd9a39fda97f',
                          '1581092918056-0c4c3acd3789'
                        ][i - 1]
                      }?w=200&h=200&fit=crop`}
                      alt={`Product variation ${i}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
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
            <div className="bg-white rounded-3xl p-8 shadow-lg">
              <div className="bg-gray-100 rounded-2xl p-6 mb-6 aspect-square">
                <div className="grid grid-cols-3 gap-2">
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => (
                    <div key={i} className="bg-gray-200 rounded-lg overflow-hidden">
                      <img
                        src={`https://images.unsplash.com/photo-${
                          [
                            '1494790108377-be9c29b29330',
                            '1507003211169-0a1dd7228f2d',
                            '1438761681033-6461ffad8d80',
                            '1500648767791-00dcc994a43e',
                            '1534528741775-53994a69daeb',
                            '1506794778202-cad84cf45f1d',
                            '1517841905240-472988babdf9',
                            '1544005313-94ddf0286df2',
                            '1573496359142-b8d87734a5a2'
                          ][i - 1]
                        }?w=150&h=150&fit=crop&crop=faces`}
                        alt={`Model ${i}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Diversified Fashion Model Database</h3>
              <p className="text-sm text-gray-600">
                Discover the industry's most diverse AI fashion models - representing all body types, ethnicities, and generations.
              </p>
            </div>

            {/* Transform to 3D */}
            <div className="bg-white rounded-3xl p-8 shadow-lg">
              <div className="bg-gray-100 rounded-2xl p-6 mb-6 aspect-square flex items-center justify-center">
                <div className="grid grid-cols-2 gap-4 w-full">
                  <img
                    src="https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=300&h=300&fit=crop"
                    alt="2D product"
                    className="rounded-xl shadow-lg"
                  />
                  <img
                    src="https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=300&h=300&fit=crop"
                    alt="3D product"
                    className="rounded-xl shadow-lg"
                  />
                </div>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Transform to 3D</h3>
              <p className="text-sm text-gray-600">
                Transform 2D product images into interactive 3D models with AI-powered depth reconstruction.
              </p>
            </div>

            {/* Magic Eraser */}
            <div className="bg-white rounded-3xl p-8 shadow-lg">
              <div className="bg-gray-100 rounded-2xl p-6 mb-6 aspect-square flex items-center justify-center relative overflow-hidden">
                <div className="grid grid-cols-2 gap-4 w-full">
                  <div className="relative rounded-xl overflow-hidden shadow-lg">
                    <img
                      src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300&h=300&fit=crop"
                      alt="Before eraser"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 border-2 border-dashed border-purple-500 m-4 rounded-lg"></div>
                  </div>
                  <img
                    src="https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=300&h=300&fit=crop"
                    alt="After eraser"
                    className="rounded-xl shadow-lg"
                  />
                </div>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Magic Eraser</h3>
              <p className="text-sm text-gray-600">
                Automatically fix flaws and enhance your visuals with a professional finish.
              </p>
            </div>
          </div>

          {/* Bottom row - 3 tools */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Image Extender */}
            <div className="bg-white rounded-3xl p-8 shadow-lg">
              <div className="bg-gray-100 rounded-2xl p-6 mb-6 aspect-square flex items-center justify-center">
                <div className="relative w-full h-full">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-purple-200 to-transparent opacity-50"></div>
                  <img
                    src="https://images.unsplash.com/photo-1595246140625-573b715d11dc?w=400&h=400&fit=crop"
                    alt="Extended image"
                    className="w-full h-full object-cover rounded-xl"
                  />
                  <div className="absolute top-1/2 left-4 right-4 -translate-y-1/2">
                    <div className="flex justify-between">
                      <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                      <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                    </div>
                  </div>
                </div>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Image Extender</h3>
              <p className="text-sm text-gray-600">
                Extend your image background naturally by filling in missing parts of the scene.
              </p>
            </div>

            {/* Image Retouch */}
            <div className="bg-white rounded-3xl p-8 shadow-lg">
              <div className="bg-gray-100 rounded-2xl p-6 mb-6 aspect-square flex items-center justify-center">
                <div className="grid grid-cols-2 gap-4 w-full">
                  <img
                    src="https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=300&h=300&fit=crop"
                    alt="Before retouch"
                    className="rounded-xl shadow-lg"
                  />
                  <img
                    src="https://images.unsplash.com/photo-1562183241-b937e95585b6?w=300&h=300&fit=crop"
                    alt="After retouch"
                    className="rounded-xl shadow-lg"
                  />
                </div>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Image Retouch</h3>
              <p className="text-sm text-gray-600">
                AI modifies selected image regions based on your text instructions.
              </p>
            </div>

            {/* Image Enhancer */}
            <div className="bg-white rounded-3xl p-8 shadow-lg">
              <div className="bg-gray-100 rounded-2xl p-6 mb-6 aspect-square flex items-center justify-center">
                <img
                  src="https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?w=400&h=400&fit=crop"
                  alt="Enhanced image"
                  className="rounded-xl shadow-lg w-full h-full object-cover"
                />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Image Enhancer</h3>
              <p className="text-sm text-gray-600">
                Improve lighting, sharpness, and resolution for platform-ready, high-quality images.
              </p>
            </div>
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

      {/* Final CTA Section */}
      <section className="bg-gradient-to-br from-gray-900 via-gray-800 to-black py-20 my-20 mx-6 lg:mx-8 rounded-[3rem]">
        <div className="max-w-5xl mx-auto px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Create Stunning{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 italic">
              Images
            </span>{' '}
            in Minutes
          </h2>
          <p className="text-lg md:text-xl text-gray-300 mb-12 max-w-3xl mx-auto">
            From product photos to dynamic videos, HotendWeekly has everything you need to stand out.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button className="bg-white text-gray-900 px-10 py-4 rounded-2xl text-lg font-bold hover:bg-gray-100 transition-colors shadow-xl w-full sm:w-auto">
              Try Now
            </button>
            <button className="bg-white/10 backdrop-blur-sm text-white px-10 py-4 rounded-2xl text-lg font-semibold hover:bg-white/20 transition-colors border border-white/20 flex items-center justify-center gap-3 w-full sm:w-auto">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18.71 19.5C17.88 20.74 17 21.95 15.66 21.97C14.32 22 13.89 21.18 12.37 21.18C10.84 21.18 10.37 21.95 9.09997 22C7.78997 22.05 6.79997 20.68 5.95997 19.47C4.24997 17 2.93997 12.45 4.69997 9.39C5.56997 7.87 7.12997 6.91 8.81997 6.88C10.1 6.86 11.32 7.75 12.11 7.75C12.89 7.75 14.37 6.68 15.92 6.84C16.57 6.87 18.39 7.1 19.56 8.82C19.47 8.88 17.39 10.1 17.41 12.63C17.44 15.65 20.06 16.66 20.09 16.67C20.06 16.74 19.67 18.11 18.71 19.5ZM13 3.5C13.73 2.67 14.94 2.04 15.94 2C16.07 3.17 15.6 4.35 14.9 5.19C14.21 6.04 13.07 6.7 11.95 6.61C11.8 5.46 12.36 4.26 13 3.5Z" />
              </svg>
              <div className="text-left">
                <div className="text-xs opacity-80">Download on the</div>
                <div className="text-base font-bold">App Store</div>
              </div>
            </button>
          </div>
        </div>
      </section>


      {/* Footer */}
      <footer className="bg-black text-white py-16">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-12">
            {/* Brand Section */}
            <div className="lg:col-span-1">
              <h3 className="text-xl font-bold mb-4">
                Supercharge Your Photos with AI<br />
                Boost Sales in Minutes.
              </h3>
              <p className="text-gray-400 mb-6">support@hotendweekly.com</p>

              {/* Social Icons */}
              <div className="flex items-center space-x-3">
                <a href="#" className="w-10 h-10 rounded-full bg-gray-800 hover:bg-gray-700 flex items-center justify-center transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                  </svg>
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-gray-800 hover:bg-gray-700 flex items-center justify-center transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-gray-800 hover:bg-gray-700 flex items-center justify-center transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                  </svg>
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-gray-800 hover:bg-gray-700 flex items-center justify-center transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678c-3.405 0-6.162 2.76-6.162 6.162 0 3.405 2.76 6.162 6.162 6.162 3.405 0 6.162-2.76 6.162-6.162 0-3.405-2.76-6.162-6.162-6.162zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405c0 .795-.646 1.44-1.44 1.44-.795 0-1.44-.646-1.44-1.44 0-.794.646-1.439 1.44-1.439.793-.001 1.44.645 1.44 1.439z"/>
                  </svg>
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-gray-800 hover:bg-gray-700 flex items-center justify-center transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M4.98 3.5c0 1.381-1.11 2.5-2.48 2.5s-2.48-1.119-2.48-2.5c0-1.38 1.11-2.5 2.48-2.5s2.48 1.12 2.48 2.5zm.02 4.5h-5v16h5v-16zm7.982 0h-4.968v16h4.969v-8.399c0-4.67 6.029-5.052 6.029 0v8.399h4.988v-10.131c0-7.88-8.922-7.593-11.018-3.714v-2.155z"/>
                  </svg>
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-gray-800 hover:bg-gray-700 flex items-center justify-center transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                  </svg>
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-gray-800 hover:bg-gray-700 flex items-center justify-center transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 640 512">
                    <path d="M524.531,69.836a1.5,1.5,0,0,0-.764-.7A485.065,485.065,0,0,0,404.081,32.03a1.816,1.816,0,0,0-1.923.91,337.461,337.461,0,0,0-14.9,30.6,447.848,447.848,0,0,0-134.426,0,309.541,309.541,0,0,0-15.135-30.6,1.89,1.89,0,0,0-1.924-.91A483.689,483.689,0,0,0,116.085,69.137a1.712,1.712,0,0,0-.788.676C39.068,183.651,18.186,294.69,28.43,404.354a2.016,2.016,0,0,0,.765,1.375A487.666,487.666,0,0,0,176.02,479.918a1.9,1.9,0,0,0,2.063-.676A348.2,348.2,0,0,0,208.12,430.4a1.86,1.86,0,0,0-1.019-2.588,321.173,321.173,0,0,1-45.868-21.853,1.885,1.885,0,0,1-.185-3.126c3.082-2.309,6.166-4.711,9.109-7.137a1.819,1.819,0,0,1,1.9-.256c96.229,43.917,200.41,43.917,295.5,0a1.812,1.812,0,0,1,1.924.233c2.944,2.426,6.027,4.851,9.132,7.16a1.884,1.884,0,0,1-.162,3.126,301.407,301.407,0,0,1-45.89,21.83,1.875,1.875,0,0,0-1,2.611,391.055,391.055,0,0,0,30.014,48.815,1.864,1.864,0,0,0,2.063.7A486.048,486.048,0,0,0,610.7,405.729a1.882,1.882,0,0,0,.765-1.352C623.729,277.594,590.933,167.465,524.531,69.836ZM222.491,337.58c-28.972,0-52.844-26.587-52.844-59.239S193.056,219.1,222.491,219.1c29.665,0,53.306,26.82,52.843,59.239C275.334,310.993,251.924,337.58,222.491,337.58Zm195.38,0c-28.971,0-52.843-26.587-52.843-59.239S388.437,219.1,417.871,219.1c29.667,0,53.307,26.82,52.844,59.239C470.715,310.993,447.538,337.58,417.871,337.58Z"/>
                  </svg>
                </a>
              </div>
            </div>

            {/* PAGES Column */}
            <div>
              <h4 className="font-bold text-white mb-4">PAGES</h4>
              <ul className="space-y-3">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Home</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Inspiration</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Tools</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Compare</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Partners</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Glossary</a></li>
              </ul>
            </div>

            {/* TOOLS Column */}
            <div>
              <h4 className="font-bold text-white mb-4">TOOLS</h4>
              <ul className="space-y-3">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">All Tools</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Background Swap</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Lifestyle Scene</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Multi-Angle Views</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Promo Posters</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">AI Pose Generator</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Image to Video</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Image Retouch</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Image Extender</a></li>
              </ul>
            </div>

            {/* Second TOOLS Column */}
            <div>
              <h4 className="font-bold text-white mb-4 opacity-0">TOOLS</h4>
              <ul className="space-y-3">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Background Replacer</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Background Remover</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Color Changer</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Magic Eraser</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Image Enhancer</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Product Spotlight</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Lifestyle Scene</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Instruct Edit</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">LipSync Video</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Product In Hand</a></li>
              </ul>
            </div>

            {/* COMPANY Column */}
            <div>
              <h4 className="font-bold text-white mb-4">COMPANY</h4>
              <ul className="space-y-3">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Term of Service</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Cookie Policy</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">DMCA Policy</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Security</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Contact Us</a></li>
              </ul>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center mb-4 md:mb-0">
              <svg className="w-6 h-6 text-purple-500 mr-2" fill="currentColor" viewBox="0 0 24 24">
                <path d="M13 3L4 14h7l-1 7 9-11h-7l1-7z"/>
              </svg>
              <span className="text-xl font-bold">HotendWeekly</span>
            </div>
            <p className="text-gray-400 text-sm">
              Copyright 2025 © HOTENDWEEKLY. | All rights reserved
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
