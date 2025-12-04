'use client'

import { useState, useRef, useEffect } from 'react'
import { backgrounds } from '@/lib/data'

export function UploadSection() {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null)
  const [processedImage, setProcessedImage] = useState<string | null>(null)
  const [removedBgImage, setRemovedBgImage] = useState<string | null>(null)
  const [simplifiedImage, setSimplifiedImage] = useState<string | null>(null)
  const [imageDescription, setImageDescription] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [processingStatus, setProcessingStatus] = useState('')
  const [workflowStep, setWorkflowStep] = useState<1 | 2 | 3 | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [selectedBackground, setSelectedBackground] = useState('white')
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setError(null)
    setSimplifiedImage(null)
    setProcessedImage(null)
    setRemovedBgImage(null)

    const reader = new FileReader()
    reader.onload = (e) => setUploadedImage(e.target?.result as string)
    reader.readAsDataURL(file)
  }

  const handleSimplifyFor3DPrint = async () => {
    if (!uploadedImage) return setError('Please upload an image first')

    setIsProcessing(true)
    setError(null)
    setWorkflowStep(1)
    setProcessingStatus('👁️ Step 1/2: Analyzing image with GPT-4 Vision...')

    try {
      const imageBlob = await fetch(uploadedImage).then(r => r.blob())
      const imageFile = new File([imageBlob], 'image.png', { type: 'image/png' })
      const formData = new FormData()
      formData.append('image', imageFile)

      const response = await fetch('/api/simplify-image', { method: 'POST', body: formData })

      setWorkflowStep(2)
      setProcessingStatus('🎨 Step 2/2: Generating simplified version with DALL-E 3...')

      const data = await response.json()
      if (!response.ok) throw new Error(data.error || 'Simplification failed')

      if (data.simulated) {
        setError(data.message)
      } else {
        setSimplifiedImage(data.image)
        setProcessedImage(data.image)
        setImageDescription(data.description)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to simplify image')
    } finally {
      setIsProcessing(false)
      setWorkflowStep(null)
      setProcessingStatus('')
    }
  }

  const handleVirtualTryOn = async () => {
    if (!uploadedImage) return setError('Please upload a product image first')

    setIsProcessing(true)
    setError(null)
    setWorkflowStep(1)

    try {
      const productBlob = await fetch(uploadedImage).then(r => r.blob())
      const productFile = new File([productBlob], 'product.png', { type: 'image/png' })

      setProcessingStatus('🧠 Step 1/3: Analyzing your product with AI vision...')
      const formData = new FormData()
      formData.append('product_image', productFile)

      const response = await fetch('/api/flux-generate', { method: 'POST', body: formData })

      setProcessingStatus('🎨 Step 2/3: Generating perfect scene with AI...')
      setWorkflowStep(2)

      const data = await response.json()
      if (!response.ok) throw new Error(data.error || 'AI generation failed')

      if (data.simulated) {
        setError(data.message)
      } else {
        setProcessingStatus('✨ Step 3/3: Finalizing your product photography...')
        setWorkflowStep(3)
        setProcessedImage(data.image)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate AI model')
    } finally {
      setIsProcessing(false)
      setWorkflowStep(null)
      setProcessingStatus('')
    }
  }

  const handleDownload = () => {
    if (!processedImage) return
    const link = document.createElement('a')
    link.href = processedImage
    link.download = simplifiedImage ? 'hotendweekly-simplified-3dprint.png' : 'hotendweekly-enhanced-3dprint.png'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  // Composite image on background
  useEffect(() => {
    if (!removedBgImage || !canvasRef.current) return
    
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => {
      canvas.width = img.width
      canvas.height = img.height

      const bg = backgrounds.find(b => b.id === selectedBackground)
      if (bg && bg.color !== 'transparent') {
        if (bg.gradient) {
          const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height)
          const colors = getGradientColors(bg.id)
          gradient.addColorStop(0, colors[0])
          gradient.addColorStop(1, colors[1])
          ctx.fillStyle = gradient
        } else {
          ctx.fillStyle = bg.color
        }
        ctx.fillRect(0, 0, canvas.width, canvas.height)
      }

      ctx.drawImage(img, 0, 0)
      ctx.font = 'bold 24px Arial'
      ctx.fillStyle = 'rgba(255, 255, 255, 0.3)'
      ctx.fillText('HotendWeekly', canvas.width - 200, canvas.height - 20)

      setProcessedImage(canvas.toDataURL('image/png'))
    }
    img.src = removedBgImage
  }, [selectedBackground, removedBgImage])

  return (
    <section className="max-w-7xl mx-auto px-6 lg:px-8 pb-20">
      <canvas ref={canvasRef} className="hidden" />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        <UploadPanel
          uploadedImage={uploadedImage}
          isProcessing={isProcessing}
          error={error}
          simplifiedImage={simplifiedImage}
          imageDescription={imageDescription}
          workflowStep={workflowStep}
          onImageUpload={handleImageUpload}
          onSimplify={handleSimplifyFor3DPrint}
          onGenerate={handleVirtualTryOn}
        />

        <PreviewPanel
          processedImage={processedImage}
          isProcessing={isProcessing}
          processingStatus={processingStatus}
          onDownload={handleDownload}
        />
      </div>
    </section>
  )
}

function getGradientColors(id: string): [string, string] {
  const map: Record<string, [string, string]> = {
    'gray': ['#f3f4f6', '#e5e7eb'],
    'wood': ['#d4a574', '#b8956a'],
    'gradient-purple': ['#9333ea', '#ec4899'],
    'gradient-blue': ['#3b82f6', '#06b6d4']
  }
  return map[id] || ['#ffffff', '#ffffff']
}

interface UploadPanelProps {
  uploadedImage: string | null
  isProcessing: boolean
  error: string | null
  simplifiedImage: string | null
  imageDescription: string | null
  workflowStep: number | null
  onImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void
  onSimplify: () => void
  onGenerate: () => void
}

function UploadPanel({
  uploadedImage, isProcessing, error, simplifiedImage, imageDescription,
  workflowStep, onImageUpload, onSimplify, onGenerate
}: UploadPanelProps) {
  return (
    <div className="bg-white rounded-3xl p-8 shadow-xl">
      <h2 className="text-2xl font-bold text-gray-900 mb-2">Upload your product</h2>
      <p className="text-gray-600 mb-6">One image is all it takes.</p>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      <div className="border-2 border-dashed border-gray-300 rounded-2xl p-12 text-center hover:border-purple-400 transition-colors cursor-pointer">
        <input
          type="file"
          accept="image/*"
          onChange={onImageUpload}
          className="hidden"
          id="file-upload"
          disabled={isProcessing}
        />
        <label htmlFor="file-upload" className="cursor-pointer">
          {uploadedImage ? (
            <div className="space-y-4">
              <img src={uploadedImage} alt="Uploaded product" className="max-h-64 mx-auto rounded-lg" />
              <p className="text-sm text-gray-500">{isProcessing ? 'Processing...' : 'Click to change image'}</p>
            </div>
          ) : (
            <>
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <UploadIcon />
              </div>
              <p className="text-lg font-medium text-gray-900 mb-2">Drop your image here</p>
              <p className="text-sm text-gray-500">or click to browse</p>
            </>
          )}
        </label>
      </div>

      {uploadedImage && !isProcessing && (
        <div className="mt-6 space-y-4">
          <ActionButton
            onClick={onSimplify}
            disabled={isProcessing}
            gradient="from-blue-600 to-cyan-600"
            icon={<PaletteIcon />}
            label="Simplify for 3D Printing"
          />

          {simplifiedImage && (
            <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-xs font-semibold text-blue-900 mb-1">✅ Simplified Successfully!</p>
              {imageDescription && <p className="text-xs text-blue-700">{imageDescription}</p>}
            </div>
          )}

          <div className="pt-4 border-t border-gray-200">
            <ActionButton
              onClick={onGenerate}
              disabled={isProcessing}
              gradient="from-purple-600 to-pink-600"
              icon={<SparklesIcon />}
              label="Generate AI Product Photography"
            />
          </div>
        </div>
      )}

      {isProcessing && workflowStep && (
        <div className="mt-6 space-y-2">
          {[1, 2, 3].map((step) => (
            <WorkflowStep key={step} step={step} currentStep={workflowStep} />
          ))}
        </div>
      )}
    </div>
  )
}

interface PreviewPanelProps {
  processedImage: string | null
  isProcessing: boolean
  processingStatus: string
  onDownload: () => void
}

function PreviewPanel({ processedImage, isProcessing, processingStatus, onDownload }: PreviewPanelProps) {
  return (
    <div className="bg-gradient-to-br from-purple-600 to-pink-600 rounded-3xl p-8 shadow-xl text-white">
      <h2 className="text-2xl font-bold mb-2">Create & Share</h2>
      <p className="text-purple-100 mb-6">Get eye-catching photos ready for any platform!</p>

      <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 mb-6 relative">
        <div className="aspect-video bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg flex items-center justify-center relative overflow-hidden">
          {isProcessing && (
            <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center z-10">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mb-4" />
              <p className="text-white font-medium">{processingStatus}</p>
            </div>
          )}
          {processedImage ? (
            <img src={processedImage} alt="Processed" className="max-h-full rounded-lg object-contain" />
          ) : (
            <p className="text-gray-400">Upload an image and click a button to see results</p>
          )}
        </div>
      </div>

      {processedImage && !isProcessing && (
        <button onClick={onDownload} className="w-full bg-white text-purple-600 py-3 rounded-full font-semibold hover:bg-gray-100 transition-colors mb-4 flex items-center justify-center">
          <DownloadIcon />
          Download Enhanced Image
        </button>
      )}

      <FeatureList />
    </div>
  )
}

function WorkflowStep({ step, currentStep }: { step: number; currentStep: number }) {
  const labels = ['AI vision analyzing your product...', 'Creating perfect scene with FLUX...', 'Finalizing professional photo...']
  const isActive = currentStep === step
  const isComplete = currentStep > step

  return (
    <div className={`flex items-center justify-between p-3 rounded-lg ${isComplete ? 'bg-green-50' : isActive ? 'bg-purple-50' : 'bg-gray-50'}`}>
      <div className="flex items-center gap-3">
        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
          isComplete ? 'bg-green-600 text-white' : isActive ? 'bg-purple-600 text-white' : 'bg-gray-300 text-gray-600'
        }`}>
          {isComplete ? '✓' : step}
        </div>
        <p className={`text-sm ${isActive ? 'text-purple-900 font-medium' : 'text-gray-600'}`}>
          {labels[step - 1]}
        </p>
      </div>
      {isActive && <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-purple-600" />}
    </div>
  )
}

function ActionButton({ onClick, disabled, gradient, icon, label }: {
  onClick: () => void; disabled: boolean; gradient: string; icon: React.ReactNode; label: string
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`w-full bg-gradient-to-r ${gradient} text-white py-3 rounded-full font-semibold hover:opacity-90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2`}
    >
      {icon}
      {label}
    </button>
  )
}

function FeatureList() {
  const features = ['AI-powered background removal', '6 professional backgrounds', 'Optimized for Etsy, Amazon, Shopify']
  return (
    <div className="space-y-3">
      {features.map((feature) => (
        <div key={feature} className="flex items-center space-x-2 text-sm">
          <CheckIcon />
          <span>{feature}</span>
        </div>
      ))}
    </div>
  )
}

// Icons
function UploadIcon() {
  return (
    <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
    </svg>
  )
}

function PaletteIcon() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
    </svg>
  )
}

function SparklesIcon() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
    </svg>
  )
}

function DownloadIcon() {
  return (
    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
    </svg>
  )
}

function CheckIcon() {
  return (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
    </svg>
  )
}
