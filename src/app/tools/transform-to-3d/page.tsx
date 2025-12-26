'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Navigation from '@/components/Navigation';
import { convertGLBtoSTL, downloadBlob } from '@/lib/stl-exporter';

// Type for model-viewer web component
declare global {
  namespace JSX {
    interface IntrinsicElements {
      'model-viewer': any;
    }
  }
}

// Type for saved model in gallery
interface SavedModel {
  id: string;
  thumbnailUrl: string;
  modelUrl: string;
  createdAt: number;
}

export default function TransformTo3DPage() {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [modelUrl, setModelUrl] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [loadingStage, setLoadingStage] = useState('');
  const [credits] = useState(50); // Display only for now
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [isExportingSTL, setIsExportingSTL] = useState(false);
  const [savedModels, setSavedModels] = useState<SavedModel[]>([]);
  const [selectedModel, setSelectedModel] = useState<string | null>(null);

  // Load model-viewer script
  useEffect(() => {
    const script = document.createElement('script');
    script.type = 'module';
    script.src = 'https://ajax.googleapis.com/ajax/libs/model-viewer/3.3.0/model-viewer.min.js';
    document.head.appendChild(script);
  }, []);

  // Load saved models from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('hotend_3d_models');
    if (saved) {
      try {
        setSavedModels(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to load saved models:', e);
      }
    }
  }, []);

  // Save model to gallery
  const saveModelToGallery = useCallback((thumbUrl: string, modelUrl: string) => {
    const newModel: SavedModel = {
      id: Date.now().toString(),
      thumbnailUrl: thumbUrl,
      modelUrl,
      createdAt: Date.now(),
    };
    const updated = [newModel, ...savedModels].slice(0, 10); // Keep last 10
    setSavedModels(updated);
    localStorage.setItem('hotend_3d_models', JSON.stringify(updated));
  }, [savedModels]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setUploadedImage(result);
      setModelUrl(null);
      setError(null);
    };
    reader.readAsDataURL(file);
  };

  const handleGenerate = async () => {
    if (!uploadedImage) return;
    setIsProcessing(true);
    setError(null);
    setUploadProgress(10);
    setLoadingStage('Preparing image...');

    try {
      const response = await fetch(uploadedImage);
      const blob = await response.blob();
      const imageFile = new File([blob], 'image.png', { type: 'image/png' });
      const formData = new FormData();
      formData.append('image', imageFile);

      setUploadProgress(20);
      setLoadingStage('Uploading to AI...');

      const apiResponse = await fetch('/api/transform-to-3d', {
        method: 'POST',
        body: formData,
      });

      setUploadProgress(40);
      setLoadingStage('Reconstructing 3D geometry...');

      // Simulate progress while waiting for response
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => Math.min(prev + 5, 90));
      }, 2000);

      const data = await apiResponse.json();
      clearInterval(progressInterval);

      if (!apiResponse.ok) throw new Error(data.error || 'Generation failed');
      if (!data.modelUrl) throw new Error('No model URL returned');

      setUploadProgress(95);
      setLoadingStage('Finalizing model...');

      setModelUrl(data.modelUrl);
      setSelectedModel(data.modelUrl);
      setUploadProgress(100);
      setLoadingStage('Complete!');

      // Save to gallery
      if (uploadedImage) {
        saveModelToGallery(uploadedImage, data.modelUrl);
      }
    } catch (err) {
      console.error('Generation error:', err);
      setError(err instanceof Error ? err.message : 'Failed to generate 3D model');
    } finally {
      setIsProcessing(false);
      setUploadProgress(0);
      setLoadingStage('');
    }
  };

  const handleDownloadGLB = () => {
    const url = selectedModel || modelUrl;
    if (!url) return;
    const link = document.createElement('a');
    link.href = url;
    link.download = `hotend-3d-model-${Date.now()}.glb`;
    link.click();
    setShowExportMenu(false);
  };

  const handleDownloadSTL = async () => {
    const url = selectedModel || modelUrl;
    if (!url) return;
    setIsExportingSTL(true);
    try {
      const stlBlob = await convertGLBtoSTL(url);
      downloadBlob(stlBlob, `hotend-3d-model-${Date.now()}.stl`);
    } catch (err) {
      console.error('STL export error:', err);
      setError('Failed to export STL. Try downloading GLB instead.');
    } finally {
      setIsExportingSTL(false);
      setShowExportMenu(false);
    }
  };

  const activeModelUrl = selectedModel || modelUrl;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col">
      {/* MakerWorld-style Header */}
      <header className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <Link href="/tools" className="flex items-center gap-2 text-gray-600 hover:text-gray-900 font-medium">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Image to 3D Model
          </Link>
        </div>

        <div className="flex items-center gap-4">
          {/* Credits Display */}
          <div className="flex items-center gap-2 bg-gradient-to-r from-amber-50 to-yellow-50 border border-amber-200 rounded-full px-4 py-1.5">
            <span className="text-amber-600">🪙</span>
            <span className="font-semibold text-amber-700">Credit: {credits}</span>
          </div>

          {/* Export Button */}
          <div className="relative">
            <button
              onClick={() => setShowExportMenu(!showExportMenu)}
              disabled={!activeModelUrl}
              className={`px-5 py-2 rounded-lg font-bold flex items-center gap-2 transition-all ${activeModelUrl
                ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white hover:shadow-lg hover:shadow-emerald-500/30'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
            >
              Export
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {showExportMenu && activeModelUrl && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50">
                <button
                  onClick={handleDownloadGLB}
                  className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center gap-3"
                >
                  <span className="text-2xl">📦</span>
                  <div>
                    <div className="font-medium">Download GLB</div>
                    <div className="text-xs text-gray-500">3D viewer compatible</div>
                  </div>
                </button>
                <button
                  onClick={handleDownloadSTL}
                  disabled={isExportingSTL}
                  className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center gap-3"
                >
                  <span className="text-2xl">🖨️</span>
                  <div>
                    <div className="font-medium">
                      {isExportingSTL ? 'Converting...' : 'Download STL'}
                    </div>
                    <div className="text-xs text-gray-500">3D print ready</div>
                  </div>
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content - Full Screen 3D Viewer */}
      <div className="flex-1 flex">
        {/* Left Sidebar - Upload */}
        <aside className="w-80 bg-white border-r border-gray-200 p-4 flex flex-col">
          <h3 className="font-bold text-gray-800 mb-4">Source Image</h3>

          {/* Upload Area */}
          <div className="bg-gray-50 rounded-xl p-2 mb-4">
            {!uploadedImage ? (
              <label className="cursor-pointer block">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 hover:border-purple-400 hover:bg-purple-50/50 transition-all text-center">
                  <div className="w-12 h-12 mx-auto bg-purple-100 rounded-full flex items-center justify-center mb-3 text-purple-500">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                  </div>
                  <span className="text-sm font-medium text-gray-700">Upload Image</span>
                  <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                </div>
              </label>
            ) : (
              <div className="relative group">
                <img src={uploadedImage} alt="Source" className="rounded-lg w-full h-auto max-h-48 object-contain bg-white" />
                <button
                  onClick={() => { setUploadedImage(null); setModelUrl(null); setSelectedModel(null); }}
                  className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            )}
          </div>

          {/* Generate Button */}
          {uploadedImage && (
            <button
              onClick={handleGenerate}
              disabled={isProcessing}
              className={`w-full py-3 rounded-xl font-bold text-white transition-all ${isProcessing
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:shadow-lg hover:shadow-purple-500/30'
                }`}
            >
              {isProcessing ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  {loadingStage || 'Processing...'} ({uploadProgress}%)
                </span>
              ) : '✨ Generate 3D Model'}
            </button>
          )}

          {/* Error */}
          {error && (
            <div className="mt-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          {/* Model Gallery */}
          <div className="mt-auto pt-4 border-t border-gray-200">
            <h4 className="font-bold text-gray-800 mb-3 flex items-center justify-between">
              <span>Recent Models</span>
              <span className="text-xs text-gray-500">{savedModels.length}/10</span>
            </h4>
            <div className="grid grid-cols-3 gap-2">
              {savedModels.slice(0, 6).map((model) => (
                <button
                  key={model.id}
                  onClick={() => setSelectedModel(model.modelUrl)}
                  className={`aspect-square rounded-lg overflow-hidden border-2 transition-all ${selectedModel === model.modelUrl ? 'border-purple-500 ring-2 ring-purple-200' : 'border-gray-200 hover:border-gray-300'
                    }`}
                >
                  <img src={model.thumbnailUrl} alt="Model" className="w-full h-full object-cover" />
                </button>
              ))}
              {savedModels.length === 0 && (
                <div className="col-span-3 text-center text-gray-400 text-sm py-4">
                  No models yet
                </div>
              )}
            </div>
          </div>
        </aside>

        {/* 3D Viewer - Full Screen */}
        <main className="flex-1 bg-gradient-to-br from-gray-100 to-gray-200 relative">
          {activeModelUrl ? (
            <model-viewer
              src={activeModelUrl}
              alt="3D model"
              auto-rotate
              camera-controls
              ar
              shadow-intensity="1"
              environment-image="neutral"
              style={{ width: '100%', height: '100%' }}
            />
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-gray-400">
              {isProcessing ? (
                <div className="text-center">
                  <div className="w-20 h-20 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                  <p className="text-purple-600 font-medium text-lg">Reconstructing Geometry...</p>
                  <p className="text-sm mt-2">This usually takes 30-60 seconds</p>
                </div>
              ) : (
                <>
                  <svg className="w-24 h-24 opacity-30 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M14 4l-2-1-2 1M4 7l2-1M4 7l2 1M4 7v2.5M12 21l-2-1m2 1l2-1m-2 1v-2.5M6 18l-2-1v-2.5M18 18l2-1v-2.5" />
                  </svg>
                  <p className="text-lg font-medium">Upload an image to generate 3D</p>
                  <p className="text-sm mt-1">Your model will appear here</p>
                </>
              )}
            </div>
          )}
        </main>
      </div>

      {/* Hide default navigation on this page for cleaner MakerWorld look */}
      <style jsx global>{`
        nav.fixed { display: none !important; }
      `}</style>
    </div>
  );
}
