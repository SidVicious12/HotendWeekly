'use client';

import { useState } from 'react';
import Link from 'next/link';
import Navigation from '@/components/Navigation';
import { ToolStatusBadge } from '@/components/ToolStatusBadge';

export default function TexturePreviewPage() {
    const [uploadedImage, setUploadedImage] = useState<string | null>(null);
    const [processedImage, setProcessedImage] = useState<string | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [selectedTexture, setSelectedTexture] = useState('wood');

    const textures = ['Wood', 'Carbon Fiber', 'Silk Gold', 'Matte Black', 'Marble', 'Concrete', 'Rusty Metal', 'Leather'];

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

    const handleApplyTexture = async () => {
        if (!uploadedImage) return;

        setIsProcessing(true);
        setError(null);

        try {
            const imageBlob = await fetch(uploadedImage).then(r => r.blob());
            const imageFile = new File([imageBlob], 'image.png', { type: 'image/png' });
            const formData = new FormData();
            formData.append('image', imageFile);
            formData.append('texture', selectedTexture);

            const response = await fetch('/api/texture-preview', {
                method: 'POST',
                body: formData,
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.error || 'Processing failed');
            setProcessedImage(data.image);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to process');
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
                <h1 className="text-5xl font-bold mb-4">Texture <span className="text-gradient from-purple-600 to-pink-600 italic">Preview</span></h1>
                <p className="text-xl text-gray-600">Visualize different 3D printing materials on your models.</p>
            </section>

            <section className="pb-20 px-6">
                <div className="max-w-6xl mx-auto bg-white rounded-3xl p-8 shadow-2xl">
                    {!uploadedImage && (
                        <label className="cursor-pointer block border-4 border-dashed border-purple-200 rounded-2xl p-16 text-center hover:border-purple-400">
                            <span className="text-xl font-semibold text-gray-700">Upload 3D Model Photo</span>
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
                                    <h3 className="font-bold mb-2">Preview</h3>
                                    {processedImage ? (
                                        <img src={processedImage} alt="Preview" className="w-full rounded-2xl shadow-lg" />
                                    ) : (
                                        <div className="h-64 bg-gray-100 rounded-2xl flex items-center justify-center text-gray-400">
                                            {isProcessing ? 'Applying Texture...' : 'Result here'}
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="p-6 bg-gray-50 rounded-2xl border">
                                <h3 className="font-bold mb-4">Select Material</h3>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                                    {textures.map(t => (
                                        <button
                                            key={t}
                                            onClick={() => setSelectedTexture(t)}
                                            className={`p-4 rounded-xl border-2 font-medium ${selectedTexture === t ? 'border-purple-600 bg-purple-50' : 'border-gray-200 bg-white hover:border-purple-300'}`}
                                        >
                                            {t}
                                        </button>
                                    ))}
                                </div>
                                <button
                                    onClick={handleApplyTexture}
                                    disabled={isProcessing}
                                    className="w-full bg-purple-600 text-white py-4 rounded-xl font-bold hover:bg-purple-700 disabled:opacity-50"
                                >
                                    {isProcessing ? 'Processing...' : 'Apply Texture'}
                                </button>
                                {error && <p className="text-red-500 text-center mt-4">{error}</p>}
                            </div>
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
}
