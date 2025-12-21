'use client';

import { useState } from 'react';
import Link from 'next/link';
import Navigation from '@/components/Navigation';
import { ToolStatusBadge } from '@/components/ToolStatusBadge';

export default function PrintSceneGeneratorPage() {
    const [description, setDescription] = useState('');
    const [uploadedImage, setUploadedImage] = useState<string | null>(null);
    const [generatedImage, setGeneratedImage] = useState<string | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState<string | null>(null);

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
                <h1 className="text-5xl font-bold mb-4">Print Scene <span className="text-gradient from-purple-600 to-blue-600 italic">Generator</span></h1>
                <p className="text-xl text-gray-600 mb-8">Generate lifestyle scenes for your 3D prints.</p>
            </section>

            <section className="pb-20 px-6">
                <div className="max-w-4xl mx-auto bg-white rounded-3xl p-8 shadow-2xl">
                    <div className="space-y-6">
                        <div className="bg-gray-50 p-6 rounded-2xl border border-gray-200">
                            <label className="block font-medium mb-2">Upload your object (Optional)</label>
                            <input type="file" onChange={handleImageUpload} className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100" />
                            {uploadedImage && <img src={uploadedImage} alt="Preview" className="mount-4 h-32 object-contain rounded-lg border mt-4" />}
                        </div>

                        <div>
                            <label className="block font-medium mb-2">Describe the scene</label>
                            <textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="A modern wooden desk with blueprints and coffee..."
                                className="w-full p-4 rounded-xl border-gray-300 shadow-sm focus:border-purple-500 h-32"
                            />
                        </div>

                        <button
                            onClick={handleGenerate}
                            disabled={isProcessing}
                            className="w-full bg-purple-600 text-white py-4 rounded-xl font-bold hover:bg-purple-700 disabled:opacity-50"
                        >
                            {isProcessing ? 'Generating Scene...' : 'Generate Scene'}
                        </button>

                        {error && <p className="text-red-500 text-center">{error}</p>}

                        {generatedImage && (
                            <div className="mt-8">
                                <h3 className="font-bold mb-4">Generated Scene</h3>
                                <img src={generatedImage} alt="Generated" className="w-full rounded-2xl shadow-lg" />
                                <a href={generatedImage} download="scene.png" className="block text-center mt-4 text-purple-600 font-semibold">Download Image</a>
                            </div>
                        )}
                    </div>
                </div>
            </section>
        </div>
    );
}
