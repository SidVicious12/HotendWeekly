'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import Navigation from '@/components/Navigation';
import { ToolStatusBadge } from '@/components/ToolStatusBadge';

interface Background {
  id: string;
  name: string;
  description: string;
  color: string;
  gradient: string | null;
}

export default function BackgroundRemoverPage() {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [removedBgImage, setRemovedBgImage] = useState<string | null>(null);
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedBackground, setSelectedBackground] = useState<string>('transparent');
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);

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
  ];

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      setUploadedImage(e.target?.result as string);
      setRemovedBgImage(null);
      setProcessedImage(null);
      setError(null);
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveBackground = async () => {
    if (!uploadedImage) {
      setError('Please upload an image first');
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      // Convert uploaded image to File
      const imageBlob = await fetch(uploadedImage).then(r => r.blob());
      const imageFile = new File([imageBlob], 'image.png', { type: 'image/png' });

      const formData = new FormData();
      formData.append('image', imageFile);

      const response = await fetch('/api/remove-bg', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Background removal failed');
      }

      if (data.simulated) {
        setError(data.message);
        setIsProcessing(false);
        return;
      }

      // Store the removed background image
      setRemovedBgImage(data.image);

      // Composite with selected background
      compositeImage(data.image, selectedBackground);

      setIsProcessing(false);

    } catch (err) {
      console.error('Background removal error:', err);
      setError(err instanceof Error ? err.message : 'Failed to remove background');
      setIsProcessing(false);
    }
  };

  const compositeImage = async (bgRemovedImage: string, backgroundId: string) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    img.crossOrigin = 'anonymous';

    await new Promise((resolve, reject) => {
      img.onload = resolve;
      img.onerror = reject;
      img.src = bgRemovedImage;
    });

    // Set canvas size to image size
    canvas.width = img.width;
    canvas.height = img.height;

    // Draw background
    const bg = backgrounds.find(b => b.id === backgroundId);
    if (bg) {
      if (bg.gradient) {
        const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
        // Simple gradient parsing
        if (bg.id === 'gray') {
          gradient.addColorStop(0, '#f3f4f6');
          gradient.addColorStop(1, '#e5e7eb');
        } else if (bg.id === 'wood') {
          gradient.addColorStop(0, '#d4a574');
          gradient.addColorStop(1, '#b8956a');
        } else if (bg.id === 'gradient-purple') {
          gradient.addColorStop(0, '#9333ea');
          gradient.addColorStop(1, '#ec4899');
        } else if (bg.id === 'gradient-blue') {
          gradient.addColorStop(0, '#3b82f6');
          gradient.addColorStop(1, '#06b6d4');
        }
        ctx.fillStyle = gradient;
      } else if (bg.color !== 'transparent') {
        ctx.fillStyle = bg.color;
      }

      if (bg.color !== 'transparent') {
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
    }

    // Draw image on top
    ctx.drawImage(img, 0, 0);

    // Add watermark
    ctx.font = 'bold 24px Arial';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.fillText('HotendWeekly', canvas.width - 200, canvas.height - 20);

    // Convert to data URL
    const finalImage = canvas.toDataURL('image/png');
    setProcessedImage(finalImage);
  };

  // Re-composite when background changes
  useEffect(() => {
    if (removedBgImage) {
      compositeImage(removedBgImage, selectedBackground);
    }
  }, [selectedBackground, removedBgImage]);

  const handleDownload = () => {
    if (!processedImage) return;

    const link = document.createElement('a');
    link.href = processedImage;
    link.download = `hotendweekly-bg-removed-${Date.now()}.png`;
    link.click();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      <Navigation />

      <canvas ref={canvasRef} className="hidden" />

      {/* Header */}
      <section className="pt-20 pb-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8">
            <Link href="/tools" className="inline-flex items-center gap-2 text-purple-600 hover:text-purple-700 mb-6">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Tools
            </Link>

            <div className="flex justify-center mb-4">
              <ToolStatusBadge status="live" />
            </div>

            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 italic">
                Background
              </span>{' '}
              Remover
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 max-w-4xl mx-auto">
              AI-powered background removal using Replicate RMBG-2.0 • 1 credit per image • ~3-5 seconds
            </p>
          </div>
        </div>
      </section>

      {/* Tool Interface */}
      <section className="pb-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-3xl p-8 shadow-2xl">

            {/* Upload Section */}
            {!uploadedImage && (
              <div className="text-center">
                <label htmlFor="image-upload" className="cursor-pointer">
                  <div className="border-4 border-dashed border-purple-200 rounded-2xl p-16 hover:border-purple-400 transition-colors">
                    <svg className="w-20 h-20 mx-auto text-purple-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    <p className="text-xl font-semibold text-gray-700 mb-2">
                      Click to upload an image
                    </p>
                    <p className="text-gray-500">
                      PNG, JPG up to 10MB
                    </p>
                  </div>
                </label>
                <input
                  id="image-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </div>
            )}

            {/* Processing Interface */}
            {uploadedImage && (
              <div className="space-y-6">
                {/* Image Preview */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Original */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Original Image</h3>
                    <div className="relative bg-gray-100 rounded-2xl overflow-hidden">
                      <img
                        src={uploadedImage}
                        alt="Original"
                        className="w-full h-auto"
                      />
                    </div>
                  </div>

                  {/* Result */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">
                      {removedBgImage ? 'Background Removed' : 'Preview'}
                    </h3>
                    <div className="relative bg-gray-100 rounded-2xl overflow-hidden" style={{
                      backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'20\' height=\'20\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Crect width=\'10\' height=\'10\' fill=\'%23f0f0f0\'/%3E%3Crect x=\'10\' width=\'10\' height=\'10\' fill=\'%23ffffff\'/%3E%3Crect y=\'10\' width=\'10\' height=\'10\' fill=\'%23ffffff\'/%3E%3Crect x=\'10\' y=\'10\' width=\'10\' height=\'10\' fill=\'%23f0f0f0\'/%3E%3C/svg%3E")',
                      backgroundSize: '20px 20px'
                    }}>
                      {processedImage ? (
                        <img
                          src={processedImage}
                          alt="Processed"
                          className="w-full h-auto"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-64 text-gray-400">
                          {isProcessing ? 'Processing...' : 'Click "Remove Background" to start'}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Controls */}
                <div className="space-y-4">
                  {/* Background Selector */}
                  {removedBgImage && (
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">Select Background</h3>
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                        {backgrounds.map((bg) => (
                          <button
                            key={bg.id}
                            onClick={() => setSelectedBackground(bg.id)}
                            className={`p-4 rounded-xl border-2 transition-all ${
                              selectedBackground === bg.id
                                ? 'border-purple-600 shadow-lg'
                                : 'border-gray-200 hover:border-purple-300'
                            }`}
                          >
                            <div
                              className="w-full h-16 rounded-lg mb-2"
                              style={{
                                background: bg.gradient || bg.color,
                                border: bg.color === 'transparent' ? '1px dashed #ccc' : 'none',
                                backgroundImage: bg.color === 'transparent'
                                  ? 'url("data:image/svg+xml,%3Csvg width=\'20\' height=\'20\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Crect width=\'10\' height=\'10\' fill=\'%23f0f0f0\'/%3E%3Crect x=\'10\' width=\'10\' height=\'10\' fill=\'%23ffffff\'/%3E%3Crect y=\'10\' width=\'10\' height=\'10\' fill=\'%23ffffff\'/%3E%3Crect x=\'10\' y=\'10\' width=\'10\' height=\'10\' fill=\'%23f0f0f0\'/%3E%3C/svg%3E")'
                                  : undefined,
                                backgroundSize: bg.color === 'transparent' ? '20px 20px' : undefined
                              }}
                            />
                            <p className="text-xs font-medium text-gray-700">{bg.name}</p>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Error Display */}
                  {error && (
                    <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-700">
                      {error}
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex flex-wrap gap-4">
                    {!removedBgImage && (
                      <button
                        onClick={handleRemoveBackground}
                        disabled={isProcessing}
                        className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-2xl font-semibold hover:from-purple-700 hover:to-pink-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isProcessing ? '🔄 Processing...' : '✨ Remove Background'}
                      </button>
                    )}

                    {removedBgImage && (
                      <>
                        <button
                          onClick={handleDownload}
                          className="flex-1 bg-green-600 text-white px-8 py-4 rounded-2xl font-semibold hover:bg-green-700 transition-all"
                        >
                          ⬇️ Download Image
                        </button>
                        <button
                          onClick={() => {
                            setUploadedImage(null);
                            setRemovedBgImage(null);
                            setProcessedImage(null);
                            setError(null);
                          }}
                          className="bg-gray-200 text-gray-700 px-8 py-4 rounded-2xl font-semibold hover:bg-gray-300 transition-all"
                        >
                          🔄 New Image
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* How to Use Section */}
      <section className="pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-4">
            How to Use Background Remover in{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 italic">
              3 Easy Steps
            </span>
          </h2>
          <p className="text-center text-gray-600 mb-16 text-lg">
            Remove backgrounds from your images in seconds with AI-powered precision
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="bg-white rounded-3xl p-8 shadow-xl border-2 border-gray-100">
              <div className="mb-6">
                <span className="text-purple-600 font-bold text-sm mb-2 block">Step 1</span>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Upload Your Image</h3>
                <p className="text-gray-600 mb-6">
                  Simply select your photo from device or cloud storage using our AI background remover.
                </p>
              </div>

              <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-6 border-2 border-dashed border-gray-300">
                <div className="flex justify-center gap-4 mb-6">
                  <div className="w-24 h-24 bg-white rounded-xl shadow-md overflow-hidden">
                    <img src="/showcase/goku-base.jpeg" alt="Upload example 1" className="w-full h-full object-cover" />
                  </div>
                  <div className="w-24 h-24 bg-white rounded-xl shadow-md overflow-hidden">
                    <img src="/showcase/astronaut-earth.jpg" alt="Upload example 2" className="w-full h-full object-cover" />
                  </div>
                </div>
                <div className="flex gap-2">
                  <button className="flex-1 bg-white border-2 border-gray-300 rounded-xl py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors flex items-center justify-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    Upload
                  </button>
                  <button className="flex-1 bg-gray-900 rounded-xl py-2.5 text-sm font-semibold text-white hover:bg-gray-800 transition-colors flex items-center justify-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    Device
                  </button>
                </div>
              </div>
            </div>

            {/* Step 2 */}
            <div className="bg-white rounded-3xl p-8 shadow-xl border-2 border-gray-100">
              <div className="mb-6">
                <span className="text-pink-600 font-bold text-sm mb-2 block">Step 2</span>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Click "Remove Background"</h3>
                <p className="text-gray-600 mb-6">
                  Let our AI automatically remove background from image in seconds with precision.
                </p>
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 relative">
                <div className="relative">
                  <div className="absolute inset-0 bg-white/40 backdrop-blur-sm rounded-xl flex items-center justify-center z-10">
                    <div className="bg-white rounded-xl shadow-lg p-4 border-2 border-purple-200">
                      <div className="text-center mb-3">
                        <span className="text-xs font-semibold text-purple-600">AI Processing</span>
                      </div>
                      <div className="grid grid-cols-3 gap-2">
                        <div className="bg-purple-100 rounded-lg p-2 text-center">
                          <div className="w-8 h-8 mx-auto mb-1 bg-purple-600 rounded-lg flex items-center justify-center">
                            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                          <span className="text-xs font-medium text-gray-700">Default</span>
                        </div>
                        <div className="bg-gray-50 rounded-lg p-2 text-center opacity-60">
                          <div className="w-8 h-8 mx-auto mb-1 bg-gray-200 rounded-lg"></div>
                          <span className="text-xs font-medium text-gray-500">Portrait</span>
                        </div>
                        <div className="bg-gray-50 rounded-lg p-2 text-center opacity-60">
                          <div className="w-8 h-8 mx-auto mb-1 bg-gray-200 rounded-lg"></div>
                          <span className="text-xs font-medium text-gray-500">Product</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <img src="/showcase/goku-base.jpeg" alt="Processing" className="w-full h-32 object-cover rounded-xl" />
                </div>
                <button className="w-full mt-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl py-3 font-semibold hover:from-purple-700 hover:to-pink-700 transition-all">
                  ✨ Remove Background
                </button>
              </div>
            </div>

            {/* Step 3 */}
            <div className="bg-white rounded-3xl p-8 shadow-xl border-2 border-gray-100">
              <div className="mb-6">
                <span className="text-blue-600 font-bold text-sm mb-2 block">Step 3</span>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Download & Use</h3>
                <p className="text-gray-600 mb-6">
                  Preview, adjust if needed, then download your image with transparent background.
                </p>
              </div>

              <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-6">
                <div className="relative mb-4">
                  <div
                    className="w-full h-32 rounded-xl overflow-hidden"
                    style={{
                      backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'20\' height=\'20\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Crect width=\'10\' height=\'10\' fill=\'%23f0f0f0\'/%3E%3Crect x=\'10\' width=\'10\' height=\'10\' fill=\'%23ffffff\'/%3E%3Crect y=\'10\' width=\'10\' height=\'10\' fill=\'%23ffffff\'/%3E%3Crect x=\'10\' y=\'10\' width=\'10\' height=\'10\' fill=\'%23f0f0f0\'/%3E%3C/svg%3E")',
                      backgroundSize: '20px 20px'
                    }}
                  >
                    <img src="/showcase/goku-base.jpeg" alt="Result" className="w-full h-full object-contain" />
                  </div>
                  <div className="absolute top-2 right-2 bg-white rounded-lg shadow-md p-2 text-xs font-semibold text-gray-700 flex items-center gap-1">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    PNG
                  </div>
                </div>
                <div className="space-y-2">
                  <button className="w-full bg-green-600 text-white rounded-xl py-3 font-semibold hover:bg-green-700 transition-colors flex items-center justify-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    Download
                  </button>
                  <div className="flex gap-2 text-xs text-gray-500 justify-center">
                    <span className="bg-gray-100 px-2 py-1 rounded">PNG</span>
                    <span className="bg-gray-100 px-2 py-1 rounded">JPG</span>
                    <span className="bg-gray-100 px-2 py-1 rounded">WebP</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Before/After Showcase Section */}
      <section className="pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-16">
            See the{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 italic">
              Results
            </span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {/* Example 1 */}
            <div className="bg-white rounded-2xl overflow-hidden shadow-lg">
              <div className="relative">
                <div className="absolute top-4 left-4 bg-purple-600 text-white px-3 py-1 rounded-full text-sm font-semibold z-10">
                  3D Print
                </div>
                <img
                  src="/showcase/goku-base.jpeg"
                  alt="3D Print Background Removed"
                  className="w-full h-64 object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="font-semibold text-gray-900 mb-2">3D Printed Miniatures</h3>
                <p className="text-sm text-gray-600">Perfect for product listings and marketing materials</p>
              </div>
            </div>

            {/* Example 2 */}
            <div className="bg-white rounded-2xl overflow-hidden shadow-lg">
              <div className="relative">
                <div className="absolute top-4 left-4 bg-pink-600 text-white px-3 py-1 rounded-full text-sm font-semibold z-10">
                  Product Photo
                </div>
                <img
                  src="/showcase/astronaut-earth.jpg"
                  alt="Product Photo Background Removed"
                  className="w-full h-64 object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="font-semibold text-gray-900 mb-2">E-Commerce Products</h3>
                <p className="text-sm text-gray-600">Clean, professional images for online stores</p>
              </div>
            </div>

            {/* Example 3 */}
            <div className="bg-white rounded-2xl overflow-hidden shadow-lg">
              <div className="relative">
                <div className="absolute top-4 left-4 bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-semibold z-10">
                  Creative
                </div>
                <img
                  src="/showcase/planet-scene.png"
                  alt="Creative Background Removed"
                  className="w-full h-64 object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="font-semibold text-gray-900 mb-2">Creative Projects</h3>
                <p className="text-sm text-gray-600">Perfect for posters, social media, and marketing</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-16">
            Powerful{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 italic">
              AI Features
            </span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Lightning Fast</h3>
              <p className="text-gray-600">
                Process images in 3-5 seconds using Replicate's RMBG-2.0 model. No waiting, instant results.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <div className="w-14 h-14 bg-gradient-to-br from-pink-500 to-blue-500 rounded-2xl flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Custom Backgrounds</h3>
              <p className="text-gray-600">
                Choose from studio-quality backgrounds or export with transparency. Perfect for product photos.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Production Ready</h3>
              <p className="text-gray-600">
                Enterprise-grade AI model with consistent, high-quality results. Perfect for e-commerce and marketing.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Use Cases Section */}
      <section className="pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-16">
            Perfect{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 italic">
              For Every Use Case
            </span>
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* E-Commerce */}
            <div className="bg-white rounded-3xl p-8 shadow-xl">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl flex items-center justify-center mb-6">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">E-Commerce & Product Listings</h3>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Amazon, eBay, Etsy product photos</span>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Shopify & WooCommerce stores</span>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>3D print marketplaces</span>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Catalog photography</span>
                </li>
              </ul>
            </div>

            {/* Marketing */}
            <div className="bg-white rounded-3xl p-8 shadow-xl">
              <div className="w-16 h-16 bg-gradient-to-br from-pink-600 to-blue-600 rounded-2xl flex items-center justify-center mb-6">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Marketing & Social Media</h3>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Instagram & Facebook posts</span>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Promotional banners & ads</span>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Email marketing campaigns</span>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Website hero images</span>
                </li>
              </ul>
            </div>

            {/* Creative */}
            <div className="bg-white rounded-3xl p-8 shadow-xl">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center mb-6">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Personal & Creative Projects</h3>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Digital art & collages</span>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Graphic design projects</span>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Presentation slides</span>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Portfolio & resume photos</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Technical Specifications */}
      <section className="pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-3xl p-12 text-white">
            <h2 className="text-4xl md:text-5xl font-bold text-center mb-12">
              Technical{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 italic">
                Specifications
              </span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-2">Supported Formats</h3>
                <p className="text-gray-300">PNG, JPG, JPEG, WebP</p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-pink-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-2">Max File Size</h3>
                <p className="text-gray-300">Up to 10MB per image</p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-2">Processing Speed</h3>
                <p className="text-gray-300">3-5 seconds average</p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-2">Credits</h3>
                <p className="text-gray-300">1 credit per image</p>
              </div>
            </div>

            <div className="mt-12 bg-white/10 rounded-2xl p-8">
              <h3 className="text-2xl font-bold mb-4 text-center">Powered by RMBG-2.0</h3>
              <p className="text-gray-300 text-center max-w-3xl mx-auto">
                Our background removal tool uses Replicate's RMBG-2.0, a state-of-the-art AI model trained on millions of images.
                It delivers enterprise-grade accuracy with edge detection, hair and fur precision, and complex object handling.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="pb-20 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-4">
            Frequently Asked{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 italic">
              Questions
            </span>
          </h2>
          <p className="text-center text-gray-600 mb-12 text-lg">
            Everything you need to know about our AI background remover
          </p>

          <div className="space-y-4">
            {/* FAQ 1 */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
              <button
                onClick={() => setOpenFaqIndex(openFaqIndex === 0 ? null : 0)}
                className="w-full px-8 py-6 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
              >
                <span className="text-lg font-bold text-gray-900 pr-8">
                  How does the AI background remover work?
                </span>
                <svg
                  className={`w-6 h-6 text-purple-600 flex-shrink-0 transition-transform ${openFaqIndex === 0 ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {openFaqIndex === 0 && (
                <div className="px-8 pb-6 text-gray-600">
                  Our background remover uses Replicate's RMBG-2.0, a state-of-the-art AI model trained on millions of images.
                  It automatically detects the subject in your image and removes the background with precision, handling complex
                  edges like hair and fur. The entire process takes just 3-5 seconds.
                </div>
              )}
            </div>

            {/* FAQ 2 */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
              <button
                onClick={() => setOpenFaqIndex(openFaqIndex === 1 ? null : 1)}
                className="w-full px-8 py-6 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
              >
                <span className="text-lg font-bold text-gray-900 pr-8">
                  What image formats are supported?
                </span>
                <svg
                  className={`w-6 h-6 text-purple-600 flex-shrink-0 transition-transform ${openFaqIndex === 1 ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {openFaqIndex === 1 && (
                <div className="px-8 pb-6 text-gray-600">
                  We support all common image formats including PNG, JPG, JPEG, and WebP. You can upload images up to 10MB in size.
                  For best results, use high-resolution images with clear subjects. The output can be downloaded in PNG (with transparency),
                  JPG, or WebP formats.
                </div>
              )}
            </div>

            {/* FAQ 3 */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
              <button
                onClick={() => setOpenFaqIndex(openFaqIndex === 2 ? null : 2)}
                className="w-full px-8 py-6 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
              >
                <span className="text-lg font-bold text-gray-900 pr-8">
                  How many credits does background removal cost?
                </span>
                <svg
                  className={`w-6 h-6 text-purple-600 flex-shrink-0 transition-transform ${openFaqIndex === 2 ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {openFaqIndex === 2 && (
                <div className="px-8 pb-6 text-gray-600">
                  Background removal costs 1 credit per image. This is one of the most affordable tools in our suite, perfect for
                  processing large batches of product photos. New users get free credits to try the tool, and you can purchase
                  additional credits through our flexible pricing plans.
                </div>
              )}
            </div>

            {/* FAQ 4 */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
              <button
                onClick={() => setOpenFaqIndex(openFaqIndex === 3 ? null : 3)}
                className="w-full px-8 py-6 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
              >
                <span className="text-lg font-bold text-gray-900 pr-8">
                  Can I add custom backgrounds after removal?
                </span>
                <svg
                  className={`w-6 h-6 text-purple-600 flex-shrink-0 transition-transform ${openFaqIndex === 3 ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {openFaqIndex === 3 && (
                <div className="px-8 pb-6 text-gray-600">
                  Yes! After removing the background, you can choose from our pre-designed backgrounds including Studio White,
                  Studio Gray, Wood Desk, Modern Purple gradient, and Cool Blue gradient. You can also download the image with
                  a transparent background (PNG) to use your own custom backgrounds in any image editor.
                </div>
              )}
            </div>

            {/* FAQ 5 */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
              <button
                onClick={() => setOpenFaqIndex(openFaqIndex === 4 ? null : 4)}
                className="w-full px-8 py-6 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
              >
                <span className="text-lg font-bold text-gray-900 pr-8">
                  Is the background remover suitable for product photography?
                </span>
                <svg
                  className={`w-6 h-6 text-purple-600 flex-shrink-0 transition-transform ${openFaqIndex === 4 ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {openFaqIndex === 4 && (
                <div className="px-8 pb-6 text-gray-600">
                  Absolutely! Our AI background remover is specifically optimized for e-commerce and product photography. It handles
                  complex product shapes, reflective surfaces, and fine details with precision. Perfect for Amazon, eBay, Etsy, Shopify,
                  and other marketplaces that require clean white backgrounds or transparent product images.
                </div>
              )}
            </div>

            {/* FAQ 6 */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
              <button
                onClick={() => setOpenFaqIndex(openFaqIndex === 5 ? null : 5)}
                className="w-full px-8 py-6 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
              >
                <span className="text-lg font-bold text-gray-900 pr-8">
                  How accurate is the edge detection for complex subjects?
                </span>
                <svg
                  className={`w-6 h-6 text-purple-600 flex-shrink-0 transition-transform ${openFaqIndex === 5 ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {openFaqIndex === 5 && (
                <div className="px-8 pb-6 text-gray-600">
                  The RMBG-2.0 AI model excels at detecting complex edges including hair, fur, transparent objects, and intricate details.
                  It's been trained on millions of images to handle challenging scenarios like wispy hair, fine jewelry, glass products,
                  and textured surfaces. The edge detection is production-ready and suitable for professional use.
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="pb-20 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-3xl p-12 text-center shadow-2xl">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Start Removing Backgrounds
            </h2>
            <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto">
              Professional background removal powered by AI. Perfect for product photos, portraits, and marketing materials.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/auth/signup"
                className="bg-white text-gray-900 px-8 py-4 rounded-2xl font-semibold hover:bg-gray-100 transition-colors text-lg"
              >
                Get Started Free
              </Link>
              <Link
                href="/pricing"
                className="bg-gray-800 text-white px-8 py-4 rounded-2xl font-semibold hover:bg-gray-700 transition-colors text-lg border border-gray-700"
              >
                View Pricing
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
            {/* Tools Column */}
            <div>
              <h3 className="font-bold text-lg mb-4">All Tools</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/tools/background-remover" className="hover:text-white transition-colors">Background Remover</Link></li>
                <li><Link href="/tools/3d-print-simplifier" className="hover:text-white transition-colors">3D Print Simplifier</Link></li>
                <li><Link href="/tools/magic-eraser" className="hover:text-white transition-colors">Magic Eraser</Link></li>
                <li><Link href="/tools/image-enhancer" className="hover:text-white transition-colors">Image Enhancer</Link></li>
                <li><Link href="/tools/image-extender" className="hover:text-white transition-colors">Image Extender</Link></li>
                <li><Link href="/tools" className="hover:text-white transition-colors">View All Tools</Link></li>
              </ul>
            </div>

            {/* Pages Column */}
            <div>
              <h3 className="font-bold text-lg mb-4">Pages</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/" className="hover:text-white transition-colors">Home</Link></li>
                <li><Link href="/tools" className="hover:text-white transition-colors">Tools</Link></li>
                <li><Link href="/pricing" className="hover:text-white transition-colors">Pricing</Link></li>
                <li><Link href="/about" className="hover:text-white transition-colors">About</Link></li>
              </ul>
            </div>

            {/* Company Column */}
            <div>
              <h3 className="font-bold text-lg mb-4">Company</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/about" className="hover:text-white transition-colors">About</Link></li>
                <li><Link href="/contact" className="hover:text-white transition-colors">Contact Us</Link></li>
                <li><Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
                <li><Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link></li>
              </ul>
            </div>

            {/* Resources Column */}
            <div>
              <h3 className="font-bold text-lg mb-4">Resources</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/help" className="hover:text-white transition-colors">Help Center</Link></li>
                <li><Link href="/blog" className="hover:text-white transition-colors">Blog</Link></li>
                <li><Link href="/tutorials" className="hover:text-white transition-colors">Tutorials</Link></li>
                <li><Link href="/api" className="hover:text-white transition-colors">API Documentation</Link></li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-gray-800 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="text-2xl font-bold">
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
                    HotendWeekly
                  </span>
                </div>
              </div>

              <div className="text-gray-400 text-sm text-center md:text-right">
                Copyright 2025 © HotendWeekly. All rights reserved
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
