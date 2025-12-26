// ... (imports)
import { useState } from 'react';
import Link from 'next/link';
import Navigation from '@/components/Navigation';
import { ToolStatusBadge } from '@/components/ToolStatusBadge';
import { ChevronUp, ChevronDown, Download, Image as ImageIcon, Wand2 } from 'lucide-react';

export default function PrintSceneGeneratorPage() {
    const [description, setDescription] = useState('');
    const [uploadedImage, setUploadedImage] = useState<string | null>(null);
    const [generatedImage, setGeneratedImage] = useState<string | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isControlsOpen, setIsControlsOpen] = useState(true);

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (e) => {
            setUploadedImage(e.target?.result as string);
            setGeneratedImage(null);
        };
        reader.readAsDataURL(file);
    };

    const handleGenerate = async () => {
        if (!description && !uploadedImage) {
            setError('Please provide a description or upload an image');
            return;
        }
        setIsProcessing(true);
        setError(null);
        setIsControlsOpen(false); // Auto collapse on generate

        try {
            const formData = new FormData();
            formData.append('description', description);

            if (uploadedImage) {
                const imageBlob = await fetch(uploadedImage).then(r => r.blob());
                formData.append('image', new File([imageBlob], 'image.png', { type: 'image/png' }));
            }

            const response = await fetch('/api/print-scene-generator', {
                method: 'POST',
                body: formData,
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.error || 'Generation failed');
            setGeneratedImage(data.image);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to generate');
            setIsControlsOpen(true); // Re-open on error
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className="h-[100dvh] flex flex-col bg-gray-50 overflow-hidden">
            <div className="hidden md:block">
                <Navigation />
            </div>

            {/* Main Viewer Area */}
            <main className="flex-1 relative flex items-center justify-center bg-gray-100 overflow-hidden">
                {(generatedImage || uploadedImage) ? (
                    <img
                        src={generatedImage || uploadedImage || ''}
                        alt="Scene"
                        className="max-w-full max-h-full object-contain"
                    />
                ) : (
                    <div className="text-gray-400 text-center p-6">
                        <ImageIcon className="w-16 h-16 mx-auto mb-4 opacity-50" />
                        <p className="text-lg">Upload an object or describe a scene</p>
                    </div>
                )}

                {/* Mobile Header Overlay */}
                <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-start pointer-events-none md:hidden">
                    <div className="pointer-events-auto bg-white/80 backdrop-blur-md rounded-full px-3 py-1 text-xs font-semibold shadow-sm border border-gray-200">
                        Scene Gen
                    </div>
                </div>
            </main>

            {/* Controls Sheet */}
            <div
                className={`
                    bg-white shadow-[0_-4px_20px_-5px_rgba(0,0,0,0.1)] 
                    transition-all duration-300 ease-in-out z-20
                    ${isControlsOpen ? 'h-auto max-h-[60vh]' : 'h-16'}
                    rounded-t-3xl border-t border-gray-100 flex flex-col
                `}
            >
                {/* Handle / Toggle */}
                <button
                    onClick={() => setIsControlsOpen(!isControlsOpen)}
                    className="w-full flex items-center justify-center h-8 hover:bg-gray-50 rounded-t-3xl shrink-0"
                >
                    <div className="w-12 h-1 bg-gray-300 rounded-full" />
                </button>

                <div className="p-6 pt-2 overflow-y-auto flex-1 pb-24 md:pb-6">
                    {/* Collapsed View Summary */}
                    {!isControlsOpen && (
                        <div className="flex justify-between items-center -mt-2" onClick={() => setIsControlsOpen(true)}>
                            <span className="font-semibold text-gray-900">
                                {isProcessing ? 'Generating...' : (generatedImage ? 'Scene Ready' : 'Configure Scene')}
                            </span>
                            <button
                                className="bg-purple-600 text-white p-2 rounded-full"
                                onClick={(e) => { e.stopPropagation(); setIsControlsOpen(true); }}
                            >
                                <ChevronUp className="w-5 h-5" />
                            </button>
                        </div>
                    )}

                    {/* Expanded Controls */}
                    <div className={`${!isControlsOpen ? 'hidden' : 'block'} space-y-4`}>
                        {/* File Upload */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">My Object (Optional)</label>
                            <div className="flex items-center gap-3">
                                <label className="flex-1 cursor-pointer bg-gray-50 border border-gray-200 text-gray-600 rounded-xl px-4 py-3 text-sm font-medium hover:bg-gray-100 transition-colors flex items-center justify-center gap-2">
                                    <ImageIcon className="w-4 h-4" />
                                    {uploadedImage ? 'Change Image' : 'Upload Image'}
                                    <input type="file" onChange={handleImageUpload} className="hidden" accept="image/*" />
                                </label>
                                {uploadedImage && (
                                    <button onClick={() => setUploadedImage(null)} className="p-3 text-gray-500 hover:text-red-500 bg-gray-50 rounded-xl border border-gray-200">
                                        <span className="sr-only">Remove</span>
                                        ✕
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Description */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Scene Description</label>
                            <textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="E.g. A futuristic workshop..."
                                className="w-full p-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:border-purple-500 transition-all text-sm h-24 resize-none"
                            />
                        </div>

                        {/* Actions */}
                        <div className="flex gap-3 pt-2">
                            <button
                                onClick={handleGenerate}
                                disabled={isProcessing}
                                className="flex-1 bg-purple-600 text-white py-3.5 rounded-xl font-bold hover:bg-purple-700 disabled:opacity-70 flex items-center justify-center gap-2 shadow-lg shadow-purple-200"
                            >
                                {isProcessing ? (
                                    <>
                                        <div className="animate-spin w-5 h-5 border-2 border-white/30 border-t-white rounded-full" />
                                        Creating...
                                    </>
                                ) : (
                                    <>
                                        <Wand2 className="w-5 h-5" />
                                        Generate Scene
                                    </>
                                )}
                            </button>

                            {generatedImage && (
                                <a
                                    href={generatedImage}
                                    download="scene.png"
                                    className="bg-gray-900 text-white p-3.5 rounded-xl hover:bg-gray-800 flex items-center justify-center"
                                >
                                    <Download className="w-5 h-5" />
                                </a>
                            )}
                        </div>

                        {error && <p className="text-red-500 text-sm text-center bg-red-50 p-2 rounded-lg">{error}</p>}
                    </div>
                </div>
            </div>
        </div>
    );
}

