'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'

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
  const [productAnalysis, setProductAnalysis] = useState<{
    category: string
    displayType: string
    description: string
  } | null>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  // Authentication is optional for now (Hostinger compatibility)
  // useEffect(() => {
  //   if (!loading && !user) {
  //     router.push('/auth/login')
  //   }
  // }, [user, loading, router])

  const categories = [
    { id: 'miniatures', label: 'Miniatures' },
    { id: 'functional', label: 'Functional Prints' },
    { id: 'decorative', label: 'Decorative' },
    { id: 'accessories', label: 'Accessories' }
  ]

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
    setIsProcessing(true)
    setProcessingStatus('Uploading image...')

    // Show original image
    const reader = new FileReader()
    reader.onload = (e) => {
      setUploadedImage(e.target?.result as string)
    }
    reader.readAsDataURL(file)

    try {
      // Call server-side background removal API (now using Replicate RMBG-2.0)
      setProcessingStatus('Removing background with AI...')
      const formData = new FormData()
      formData.append('image', file)

      const response = await fetch('/api/remove-bg', {
        method: 'POST',
        body: formData,
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to remove background')
      }

      if (data.simulated) {
        setError(data.message)
        setIsProcessing(false)
        return
      }

      // Get the processed image (already in base64 format)
      const base64Image = data.image

      setProcessingStatus('Applying background...')
      setRemovedBgImage(base64Image)

      // Composite with selected background
      await compositeImage(base64Image, selectedBackground)
      setIsProcessing(false)
      setProcessingStatus('')

    } catch (err) {
      console.error('Processing error:', err)
      setError(err instanceof Error ? err.message : 'Failed to process image')
      setIsProcessing(false)
      setProcessingStatus('')
    }
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
      link.download = 'hotendweekly-enhanced-3dprint.png'
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
              <Link href="#affiliate" className="text-gray-700 hover:text-gray-900 text-sm font-medium">
                Affiliate
              </Link>
              <Link href="#api" className="text-gray-700 hover:text-gray-900 text-sm font-medium">
                API
              </Link>
            </div>

            <div className="flex items-center space-x-4">
              {user && (
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
            Sales Drivers
          </h1>
          <p className="text-lg md:text-xl text-gray-600 mb-6 max-w-3xl mx-auto">
            Stop letting mediocre images hurt your sales. HotendWeekly uses AI to effortlessly create stunning,
            eye-converting product visuals that can boost your conversions by up to 20%.
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

        {/* Category Tabs */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex bg-white rounded-full p-1 shadow-lg">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-6 py-2 rounded-full text-sm font-medium transition-colors ${
                  activeCategory === cat.id
                    ? 'bg-gray-900 text-white'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {cat.label}
              </button>
            ))}
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
                  Tip: Add your Remove.bg API key to .env.local for real processing
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
              <div className="mt-6">
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
            )}

            {/* Progress Steps Indicator */}
            {isProcessing && workflowStep && (
              <div className="mt-6 space-y-3">
                {[1, 2, 3].map((step) => (
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
                ))}
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
                ) : uploadedImage && !isProcessing ? (
                  <img src={uploadedImage} alt="Preview" className="max-h-full rounded-lg object-contain" />
                ) : (
                  <p className="text-gray-400">Upload an image to see preview</p>
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

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-12">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center text-sm text-gray-500">
            © 2024 HotendWeekly. Made for 3D print sellers.
          </div>
        </div>
      </footer>
    </div>
  )
}
