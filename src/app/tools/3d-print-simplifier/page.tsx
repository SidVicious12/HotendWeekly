'use client';

import { useState } from 'react';
import Link from 'next/link';
import Navigation from '@/components/Navigation';
import { ToolStatusBadge } from '@/components/ToolStatusBadge';

export default function ThreeDPrintSimplifierPage() {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [simplifiedImage, setSimplifiedImage] = useState<string | null>(null);
  const [imageDescription, setImageDescription] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [processingStep, setProcessingStep] = useState<number>(0);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      setUploadedImage(e.target?.result as string);
      setSimplifiedImage(null);
      setImageDescription(null);
      setError(null);
    };
    reader.readAsDataURL(file);
  };

  const handleSimplify = async () => {
    if (!uploadedImage) {
      setError('Please upload an image first');
      return;
    }

    setIsProcessing(true);
    setError(null);
    setProcessingStep(1);

    try {
      // Convert uploaded image to File
      const imageBlob = await fetch(uploadedImage).then(r => r.blob());
      const imageFile = new File([imageBlob], 'image.png', { type: 'image/png' });

      const formData = new FormData();
      formData.append('image', imageFile);

      const response = await fetch('/api/simplify-image', {
        method: 'POST',
        body: formData,
      });

      setProcessingStep(2);

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Simplification failed');
      }

      if (data.simulated) {
        setError(data.message);
        setIsProcessing(false);
        setProcessingStep(0);
        return;
      }

      // Show simplified result
      setSimplifiedImage(data.image);
      setImageDescription(data.description);

      setIsProcessing(false);
      setProcessingStep(0);

    } catch (err) {
      console.error('Simplification error:', err);
      setError(err instanceof Error ? err.message : 'Failed to simplify image');
      setIsProcessing(false);
      setProcessingStep(0);
    }
  };

  const handleDownload = () => {
    if (!simplifiedImage) return;

    const link = document.createElement('a');
    link.href = simplifiedImage;
    link.download = `hotendweekly-simplified-${Date.now()}.png`;
    link.click();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      <Navigation />

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
                3D Print
              </span>{' '}
              Simplifier
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 max-w-4xl mx-auto">
              Convert photos to simplified vector-style illustrations for multi-color 3D printing • 5 credits per image • ~15-20 seconds
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
                      PNG, JPG up to 10MB • Works best with clear product photos
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
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Original Photo</h3>
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
                      {simplifiedImage ? 'Simplified Vector Style' : 'Preview'}
                    </h3>
                    <div className="relative bg-white rounded-2xl overflow-hidden border-2 border-gray-200">
                      {simplifiedImage ? (
                        <img
                          src={simplifiedImage}
                          alt="Simplified"
                          className="w-full h-auto"
                        />
                      ) : (
                        <div className="flex flex-col items-center justify-center h-96 text-gray-400">
                          {isProcessing ? (
                            <div className="text-center">
                              <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-purple-500 border-t-transparent mb-4"></div>
                              <p className="font-semibold text-gray-700">
                                {processingStep === 1 ? '👁️ Step 1/2: Analyzing with GPT-4 Vision...' : '🎨 Step 2/2: Generating simplified version with DALL-E 3...'}
                              </p>
                              <p className="text-sm text-gray-500 mt-2">This may take 15-20 seconds</p>
                            </div>
                          ) : (
                            'Click "Simplify for 3D Printing" to start'
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* AI Analysis Description */}
                {imageDescription && (
                  <div className="bg-purple-50 border border-purple-200 rounded-xl p-6">
                    <h4 className="text-sm font-semibold text-purple-900 mb-2">🤖 AI Analysis</h4>
                    <p className="text-sm text-purple-700 whitespace-pre-line">{imageDescription}</p>
                  </div>
                )}

                {/* Error Display */}
                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-700">
                    {error}
                  </div>
                )}

                {/* Info Box */}
                {!simplifiedImage && !isProcessing && (
                  <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                    <h4 className="text-sm font-semibold text-blue-900 mb-2">💡 How it works</h4>
                    <div className="text-sm text-blue-700 space-y-2">
                      <p><strong>Step 1:</strong> GPT-4 Vision analyzes your image composition, colors, and subject details</p>
                      <p><strong>Step 2:</strong> DALL-E 3 generates a simplified vector-style version optimized for multi-color 3D printing</p>
                      <p><strong>Result:</strong> Clean, flat-color illustration perfect for lithophane conversion or multi-material prints</p>
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-4">
                  {!simplifiedImage && (
                    <button
                      onClick={handleSimplify}
                      disabled={isProcessing}
                      className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-2xl font-semibold hover:from-purple-700 hover:to-pink-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isProcessing ? '🔄 Processing...' : '✨ Simplify for 3D Printing'}
                    </button>
                  )}

                  {simplifiedImage && (
                    <>
                      <button
                        onClick={handleDownload}
                        className="flex-1 bg-green-600 text-white px-8 py-4 rounded-2xl font-semibold hover:bg-green-700 transition-all"
                      >
                        ⬇️ Download Simplified Image
                      </button>
                      <button
                        onClick={() => {
                          setUploadedImage(null);
                          setSimplifiedImage(null);
                          setImageDescription(null);
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
            )}
          </div>
        </div>
      </section>

      {/* Use Cases Section */}
      <section className="pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-16">
            Perfect{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 italic">
              For 3D Printing
            </span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Multi-Color Prints</h3>
              <p className="text-gray-600">
                Flat colors and bold outlines make it perfect for multi-material or color-changing filament prints.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <div className="w-14 h-14 bg-gradient-to-br from-pink-500 to-blue-500 rounded-2xl flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Lithophane Conversion</h3>
              <p className="text-gray-600">
                Simplified images convert beautifully to lithophanes with clear depth definition and smooth transitions.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">AI-Powered Analysis</h3>
              <p className="text-gray-600">
                GPT-4 Vision analyzes composition, then DALL-E 3 generates print-optimized vector illustrations.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Tips Section */}
      <section className="pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-3xl p-12 shadow-xl">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
              💡 Tips for Best Results
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                'Use clear, well-lit photos with a simple background',
                'Photos with a single main subject work best',
                'High-contrast images produce cleaner results',
                'Avoid overly complex scenes or patterns',
                'Works great for products, logos, and characters',
                'Perfect for converting photos to print-friendly art'
              ].map((tip, index) => (
                <div key={index} className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-gray-700">{tip}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="pb-20 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-3xl p-12 text-center shadow-2xl">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Start Simplifying for 3D Prints
            </h2>
            <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto">
              Transform photos into print-optimized vector illustrations with AI. Perfect for multi-color prints and lithophanes.
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
    </div>
  );
}
