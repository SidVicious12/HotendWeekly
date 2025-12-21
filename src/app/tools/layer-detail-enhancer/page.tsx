'use client';

import { useState } from 'react';
import Link from 'next/link';
import Navigation from '@/components/Navigation';
import { ToolStatusBadge } from '@/components/ToolStatusBadge';

export default function LayerDetailEnhancerPage() {
    const [uploadedImage, setUploadedImage] = useState<string | null>(null);
    const [processedImage, setProcessedImage] = useState<string | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (e) => {
            setUploadedImage(e.target?.result as string);
            setProcessedImage(null);
        };
        reader.readAsDataURL(file);
    };

    const handleEnhance = async () => {
        if (!uploadedImage) return;
        setIsProcessing(true);
        setError(null);

        try {
            const imageBlob = await fetch(uploadedImage).then(r => r.blob());
            const imageFile = new File([imageBlob], 'image.png', { type: 'image/png' });
            const formData = new FormData();
            formData.append('image', imageFile);

            const response = await fetch('/api/layer-detail-enhancer', {
                method: 'POST',
                body: formData,
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.error || 'Failed');
            setProcessedImage(data.image);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error');
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
            <Navigation />
            <section className="pt-20 pb-12 px-6 text-center">
                <Link href="/tools" className="text-purple-600 mb-6 inline-block">← Back to Tools</Link>
                <div className="flex justify-center mb-4"><ToolStatusBadge status="live" /></div>
                <h1 className="text-5xl font-bold mb-4">Layer Detail <span className="text-gradient from-blue-600 to-green-600 italic">Enhancer</span></h1>
                <p className="text-xl text-gray-600">Smooth layer lines and refine 3D print details.</p>
            </section>

            <section className="pb-20 px-6">
                <div className="max-w-6xl mx-auto bg-white rounded-3xl p-8 shadow-2xl">
                    {!uploadedImage && (
                        <label className="cursor-pointer block border-4 border-dashed border-purple-200 rounded-2xl p-16 text-center hover:border-purple-400">
                            <span className="text-xl font-semibold text-gray-700">Upload Print Photo</span>
                            <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                        </label>
                    )}

                    {uploadedImage && (
                        <div className="space-y-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div>
                                    <h3 className="font-bold mb-2">Original</h3>
                                    <img src={uploadedImage} alt="Original" className="w-full rounded-2xl" />
                                </div>
                                <div>
                                    <h3 className="font-bold mb-2">Smoothed Result</h3>
                                    {processedImage ? (
                                        <img src={processedImage} alt="Result" className="w-full rounded-2xl shadow-lg" />
                                    ) : (
                                        <div className="h-64 bg-gray-100 rounded-2xl flex items-center justify-center text-gray-400">
                                            {isProcessing ? 'Smoothing layers...' : 'Result here'}
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="text-center">
                                <button
                                    onClick={handleEnhance}
                                    disabled={isProcessing}
                                    className="bg-purple-600 text-white px-12 py-4 rounded-xl font-bold hover:bg-purple-700 disabled:opacity-50 text-lg"
                                >
                                    {isProcessing ? 'Processing...' : '✨ Smooth Layer Lines'}
                                </button>
                                {error && <p className="text-red-500 mt-4">{error}</p>}
                            </div>
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
}
