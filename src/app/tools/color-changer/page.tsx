'use client';

import { useState } from 'react';
import Link from 'next/link';
import Navigation from '@/components/Navigation';
import { ToolStatusBadge } from '@/components/ToolStatusBadge';

export default function ColorChangerPage() {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [targetColor, setTargetColor] = useState('red');

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      setUploadedImage(e.target?.result as string);
      setProcessedImage(null);
      setError(null);
    };
    reader.readAsDataURL(file);
  };

  const handleColorChange = async () => {
    if (!uploadedImage) return;
    setIsProcessing(true);
    setError(null);

    try {
      const imageBlob = await fetch(uploadedImage).then(r => r.blob());
      const imageFile = new File([imageBlob], 'image.png', { type: 'image/png' });
      const formData = new FormData();
      formData.append('image', imageFile);
      formData.append('color', targetColor);

      const response = await fetch('/api/color-changer', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Processing failed');
      setProcessedImage(data.image);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to process image');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = () => window.open(processedImage!, '_blank');

  const colors = ['Red', 'Blue', 'Green', 'Yellow', 'Purple', 'Black', 'White', 'Pink', 'Orange', 'Gold', 'Silver', 'Matte Black'];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      <Navigation />

      <section className="pt-20 pb-12 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <Link href="/tools" className="inline-flex items-center gap-2 text-purple-600 hover:text-purple-700 mb-6">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Tools
          </Link>

          <div className="flex justify-center mb-4"><ToolStatusBadge status="live" /></div>
          <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6">
            Color <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 italic">Changer</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 max-w-4xl mx-auto">
            Instantly change the color of objects in your photos.
          </p>
        </div>
      </section>

      <section className="pb-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-3xl p-8 shadow-2xl">
            {!uploadedImage && (
              <div className="text-center">
                <label className="cursor-pointer block">
                  <div className="border-4 border-dashed border-purple-200 rounded-2xl p-16 hover:border-purple-400 transition-colors">
                    <span className="text-xl font-semibold text-gray-700">Click to upload photo</span>
                    <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                  </div>
                </label>
              </div>
            )}

            {uploadedImage && (
              <div className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3">Original</h3>
                    <img src={uploadedImage} alt="Original" className="rounded-2xl w-full" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3">Result</h3>
                    {processedImage ? (
                      <img src={processedImage} alt="Processed" className="rounded-2xl w-full shadow-lg" />
                    ) : (
                      <div className="bg-gray-100 rounded-2xl h-64 flex items-center justify-center text-gray-400">
                        {isProcessing ? 'Applying color...' : 'Result will appear here'}
                      </div>
                    )}
                  </div>
                </div>

                <div className="bg-gray-50 p-6 rounded-2xl border border-gray-200">
                  <label className="block text-sm font-medium text-gray-700 mb-3">Select Target Color</label>
                  <div className="grid grid-cols-4 md:grid-cols-6 gap-3 mb-6">
                    {colors.map(c => (
                      <button
                        key={c}
                        onClick={() => setTargetColor(c)}
                        className={`p-3 rounded-lg border-2 text-sm font-medium transition-all ${targetColor === c ? 'border-purple-600 bg-purple-50 text-purple-700' : 'border-gray-200 bg-white hover:border-purple-300'}`}
                      >
                        {c}
                      </button>
                    ))}
                  </div>
                  <div className="text-center">
                    <button
                      onClick={handleColorChange}
                      disabled={isProcessing}
                      className="bg-purple-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-purple-700 disabled:opacity-50 transition-colors"
                    >
                      {isProcessing ? '🔄 Changing Color...' : '🎨 Change Color'}
                    </button>
                  </div>
                  {error && <p className="mt-4 text-center text-red-600 text-sm">{error}</p>}
                </div>

                {processedImage && (
                  <div className="flex justify-end gap-4">
                    <button onClick={handleDownload} className="bg-green-600 text-white px-6 py-3 rounded-xl hover:bg-green-700">Download</button>
                    <button onClick={() => { setUploadedImage(null); setProcessedImage(null); }} className="bg-gray-600 text-white px-6 py-3 rounded-xl hover:bg-gray-700">New Image</button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
