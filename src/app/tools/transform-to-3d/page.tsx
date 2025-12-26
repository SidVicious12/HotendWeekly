'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Navigation from '@/components/Navigation';
import { convertGLBtoSTL, downloadBlob } from '@/lib/stl-exporter';
import { ChevronUp, ChevronDown, Download, Image as ImageIcon, Wand2, Share2, Box, Layers } from 'lucide-react';

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
  const [credits] = useState(50);
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [isExportingSTL, setIsExportingSTL] = useState(false);
  const [savedModels, setSavedModels] = useState<SavedModel[]>([]);
  const [selectedModel, setSelectedModel] = useState<string | null>(null);

  // Mobile UI States
  const [isControlsOpen, setIsControlsOpen] = useState(true);

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

  // Feedback State
  const [generationId, setGenerationId] = useState<string | null>(null);
  const [feedbackRating, setFeedbackRating] = useState<number>(0);
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);

  const handleGenerate = async () => {
    if (!uploadedImage) return;
    setIsProcessing(true);
    setError(null);
    setUploadProgress(10);
    setLoadingStage('Preparing image...');
    setIsControlsOpen(false); // Collapse controls on mobile
    setGenerationId(null);
    setFeedbackRating(0);
    setFeedbackSubmitted(false);

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
      setGenerationId(data.generationId); // Capture ID for feedback
      setUploadProgress(100);
      setLoadingStage('Complete!');

      // Save to gallery
      if (uploadedImage) {
        saveModelToGallery(uploadedImage, data.modelUrl);
      }
    } catch (err) {
      console.error('Generation error:', err);
      setError(err instanceof Error ? err.message : 'Failed to generate 3D model');
      setIsControlsOpen(true); // Re-open control panel on error
    } finally {
      setIsProcessing(false);
      setUploadProgress(0);
      setLoadingStage('');
      setIsControlsOpen(true); // Open controls to show result/feedback
    }
  };

  const handleFeedback = async (rating: number) => {
    setFeedbackRating(rating);
    if (!generationId) return;

    try {
      await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ generationId, rating })
      });
      setFeedbackSubmitted(true);
    } catch (e) {
      console.error('Failed to submit feedback', e);
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
    <div className="h-[100dvh] flex flex-col bg-gray-50 overflow-hidden">
      {/* Desktop Header */}
      <header className="hidden md:flex bg-white border-b border-gray-200 px-4 py-3 items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <Link href="/tools" className="flex items-center gap-2 text-gray-600 hover:text-gray-900 font-medium">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Image to 3D Model
          </Link>
        </div>
        <div className="flex items-center gap-4">
          {/* Credits */}
          <div className="flex items-center gap-2 bg-gradient-to-r from-amber-50 to-yellow-50 border border-amber-200 rounded-full px-4 py-1.5">
            <span className="text-amber-600">🪙</span>
            <span className="font-semibold text-amber-700">Credit: {credits}</span>
          </div>
          {/* Desktop Export */}
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
              <ChevronDown className="w-4 h-4" />
            </button>
            {showExportMenu && activeModelUrl && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50">
                <button
                  onClick={handleDownloadGLB}
                  className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center gap-3"
                >
                  <Box className="w-5 h-5" />
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
                  <Layers className="w-5 h-5" />
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

      {/* Main Container */}
      <div className="flex-1 flex flex-col md:flex-row h-full overflow-hidden relative">

        {/* Mobile Header Overlay */}
        <div className="md:hidden absolute top-0 left-0 right-0 p-4 z-10 flex justify-between items-start pointer-events-none">
          <div className="pointer-events-auto bg-white/80 backdrop-blur-md rounded-full px-3 py-1.5 text-xs font-semibold shadow-sm border border-gray-200">
            Image to 3D
          </div>
          <div className="pointer-events-auto bg-amber-50/90 backdrop-blur-md border border-amber-200 rounded-full px-3 py-1.5 flex items-center gap-1 shadow-sm">
            <span className="text-amber-600 text-xs">🪙</span>
            <span className="font-bold text-amber-700 text-xs">{credits}</span>
          </div>
        </div>

        {/* Sidebar (Desktop) / Bottom Sheet (Mobile) Controls */}

        {/* DESKTOP SIDEBAR */}
        <aside className="hidden md:flex w-80 bg-white border-r border-gray-200 p-4 flex-col overflow-y-auto">
          <h3 className="font-bold text-gray-800 mb-4">Source Image</h3>
          {/* Upload Area */}
          <div className="bg-gray-50 rounded-xl p-2 mb-4">
            {!uploadedImage ? (
              <label className="cursor-pointer block">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 hover:border-purple-400 hover:bg-purple-50/50 transition-all text-center">
                  <div className="w-12 h-12 mx-auto bg-purple-100 rounded-full flex items-center justify-center mb-3 text-purple-500">
                    <ImageIcon className="w-6 h-6" />
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
                  <span className="sr-only">Remove</span>
                  ×
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
              {isProcessing ? 'Processing... ' + uploadProgress + '%' : '✨ Generate 3D Model'}
            </button>
          )}
          {error && (
            <div className="mt-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          {/* Feedback Dialog (Desktop) */}
          {activeModelUrl && !isProcessing && (
            <div className="mt-4 bg-purple-50 rounded-xl p-4 text-center border border-purple-100">
              <p className="text-sm text-purple-800 font-medium mb-2">
                {feedbackSubmitted ? "Thanks for your feedback! 🧠" : "Rate result for AI Training"}
              </p>
              <div className="flex justify-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => handleFeedback(star)}
                    disabled={feedbackSubmitted}
                    className={`text-2xl transition-transform hover:scale-110 ${star <= feedbackRating ? 'text-amber-400' : 'text-gray-300'
                      } ${feedbackSubmitted ? 'cursor-default' : 'cursor-pointer'}`}
                  >
                    ★
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Gallery */}
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
            </div>
          </div>
        </aside>

        {/* 3D Viewer Area (Shared) */}
        <main className="flex-1 bg-gradient-to-br from-gray-100 to-gray-200 relative overflow-hidden">
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
            <div className="flex flex-col items-center justify-center h-full text-gray-400 p-8 text-center">
              {isProcessing ? (
                <div className="text-center">
                  <div className="w-20 h-20 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                  <p className="text-purple-600 font-medium text-lg">Reconstructing Geometry...</p>
                  <p className="text-sm mt-2">{loadingStage}</p>
                </div>
              ) : (
                <>
                  <ImageIcon className="w-20 h-20 opacity-30 mb-4" />
                  <p className="text-lg font-medium">Upload an image to start</p>
                  <p className="text-sm mt-1">Your 3D model will appear here</p>
                </>
              )}
            </div>
          )}
        </main>

        {/* MOBILE BOTTOM SHEET CONTROLS */}
        <div
          className={`
                md:hidden bg-white shadow-[0_-4px_20px_-5px_rgba(0,0,0,0.1)] 
                transition-all duration-300 ease-in-out z-20 pb-safe-area
                ${isControlsOpen ? 'h-auto max-h-[70vh]' : 'h-16'}
                absolute bottom-16 left-0 right-0 rounded-t-3xl border-t border-gray-100 flex flex-col
            `}
        >
          {/* Handle */}
          <button
            onClick={() => setIsControlsOpen(!isControlsOpen)}
            className="w-full flex items-center justify-center h-10 hover:bg-gray-50 rounded-t-3xl shrink-0"
          >
            <div className="w-12 h-1 bg-gray-300 rounded-full" />
          </button>

          <div className="px-6 pb-6 overflow-y-auto flex-1">
            {/* Collapsed Warning/Summary */}
            {!isControlsOpen && (
              <div className="flex justify-between items-center -mt-2" onClick={() => setIsControlsOpen(true)}>
                <span className="font-semibold text-gray-900">
                  {isProcessing ? 'Generating...' : (activeModelUrl ? 'Model Ready' : 'Configure Model')}
                </span>
                <ChevronUp className="w-5 h-5 text-gray-500" />
              </div>
            )}

            {/* Expanded Content */}
            <div className={`${!isControlsOpen ? 'hidden' : 'block'} space-y-4`}>
              {/* Upload Control */}
              <div>
                <div className="flex items-center gap-3">
                  <label className="flex-1 cursor-pointer bg-gray-50 border border-gray-200 text-gray-600 rounded-xl px-4 py-3 text-sm font-medium hover:bg-gray-100 transition-colors flex items-center justify-center gap-2 h-14">
                    <ImageIcon className="w-5 h-5" />
                    {uploadedImage ? 'Change Image' : 'Upload Image'}
                    <input type="file" onChange={handleImageUpload} className="hidden" accept="image/*" />
                  </label>
                  {uploadedImage && (
                    <button onClick={() => setUploadedImage(null)} className="p-3 bg-red-50 text-red-500 rounded-xl border border-red-100 h-14 w-14 flex items-center justify-center">
                      <span className="text-xl">×</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Generate Button */}
              <button
                onClick={handleGenerate}
                disabled={isProcessing || !uploadedImage}
                className={`w-full py-4 rounded-xl font-bold text-white flex items-center justify-center gap-2 shadow-lg transition-all ${isProcessing || !uploadedImage
                  ? 'bg-gray-300 cursor-not-allowed shadow-none'
                  : 'bg-gradient-to-r from-purple-600 to-pink-600 shadow-purple-200'
                  }`}
              >
                {isProcessing ? (
                  <>
                    <div className="animate-spin w-5 h-5 border-2 border-white/30 border-t-white rounded-full" />
                    {uploadProgress}%
                  </>
                ) : (
                  <>
                    <Wand2 className="w-5 h-5" />
                    Generate 3D
                  </>
                )}
              </button>

              {/* Feedback Widget */}
              {activeModelUrl && !isProcessing && (
                <div className="bg-purple-50 rounded-xl p-4 text-center">
                  <p className="text-sm text-purple-800 font-medium mb-2">
                    {feedbackSubmitted ? "Thanks for your help! 🧠" : "Rate the 3D Quality"}
                  </p>
                  <div className="flex justify-center gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        onClick={() => handleFeedback(star)}
                        disabled={feedbackSubmitted}
                        className={`text-2xl transition-transform hover:scale-110 ${star <= feedbackRating ? 'text-amber-400' : 'text-gray-300'
                          } ${feedbackSubmitted ? 'cursor-default' : 'cursor-pointer'}`}
                      >
                        ★
                      </button>
                    ))}
                  </div>
                  {feedbackSubmitted && <p className="text-xs text-purple-600 mt-1">Training our AI...</p>}
                </div>
              )}

              {/* Export Options (only if model ready) */}
              {activeModelUrl && !isProcessing && (
                <div className="flex gap-2">
                  <button
                    onClick={handleDownloadGLB}
                    className="flex-1 bg-gray-900 text-white py-3 rounded-xl font-medium flex items-center justify-center gap-2"
                  >
                    <Box className="w-4 h-4" /> GLB
                  </button>
                  <button
                    onClick={handleDownloadSTL}
                    disabled={isExportingSTL}
                    className="flex-1 bg-white border border-gray-200 text-gray-900 py-3 rounded-xl font-medium flex items-center justify-center gap-2"
                  >
                    <Layers className="w-4 h-4" /> STL
                  </button>
                </div>
              )}

              {error && <p className="text-red-500 text-center text-sm bg-red-50 p-2 rounded-lg">{error}</p>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

