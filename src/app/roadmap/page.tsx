'use client';

import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';

export default function RoadmapPage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-purple-50">
            <Navigation />

            <main className="pt-32 pb-20">
                {/* Header */}
                <div className="max-w-4xl mx-auto px-6 text-center mb-16">
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">
                            Product Roadmap
                        </span>
                        <br />
                        2026 Vision
                    </h1>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                        Our phase-by-phase plan to revolutionize 3D printing product photography and model generation.
                    </p>
                </div>

                {/* Roadmap Content */}
                <div className="max-w-4xl mx-auto px-6 space-y-12">

                    {/* Phase 1 */}
                    <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-purple-100">
                        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 px-8 py-6 text-white">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                                <h2 className="text-2xl font-bold">Phase 1: Foundation & Launch</h2>
                                <span className="bg-white/20 px-3 py-1 rounded-full text-sm font-medium backdrop-blur-sm">
                                    Q1 2026 (Jan-Mar)
                                </span>
                            </div>
                            <p className="text-purple-100 mt-2">Establishing the core platform and building the community.</p>
                        </div>

                        <div className="p-8">
                            <div className="space-y-8">
                                {/* Jan */}
                                <div>
                                    <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center">
                                        <span className="w-8 h-8 rounded-full bg-green-100 text-green-600 flex items-center justify-center mr-3 text-sm">Jan</span>
                                        Build & Foundation
                                    </h3>
                                    <ul className="space-y-2 ml-11">
                                        <li className="flex items-start text-gray-600">
                                            <span className="mr-2 text-green-500">✅</span>
                                            <span>Entity Established (Fab3D LLC)</span>
                                        </li>
                                        <li className="flex items-start text-gray-600">
                                            <span className="mr-2 text-blue-500">⚡</span>
                                            <span>Launch updated website & SaaS pricing tiers</span>
                                        </li>
                                        <li className="flex items-start text-gray-600">
                                            <span className="mr-2 text-blue-500">⚡</span>
                                            <span>Setup Stripe payments & Cloud Infrastructure</span>
                                        </li>
                                    </ul>
                                </div>

                                {/* Feb */}
                                <div>
                                    <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center">
                                        <span className="w-8 h-8 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center mr-3 text-sm">Feb</span>
                                        Soft Launch
                                    </h3>
                                    <ul className="space-y-2 ml-11">
                                        <li className="flex items-start text-gray-600">
                                            <span className="mr-2 text-gray-400">○</span>
                                            <span>Beta launch to 100-200 users</span>
                                        </li>
                                        <li className="flex items-start text-gray-600">
                                            <span className="mr-2 text-gray-400">○</span>
                                            <span>Implement User Feedback Loop & Analytics</span>
                                        </li>
                                        <li className="flex items-start text-gray-600">
                                            <span className="mr-2 text-gray-400">○</span>
                                            <span>Build Content Library (15+ blog posts)</span>
                                        </li>
                                    </ul>
                                </div>

                                {/* Mar */}
                                <div>
                                    <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center">
                                        <span className="w-8 h-8 rounded-full bg-pink-100 text-pink-600 flex items-center justify-center mr-3 text-sm">Mar</span>
                                        Public Launch
                                    </h3>
                                    <ul className="space-y-2 ml-11">
                                        <li className="flex items-start text-gray-600">
                                            <span className="mr-2 text-gray-400">○</span>
                                            <span>Product Hunt & Public Launch</span>
                                        </li>
                                        <li className="flex items-start text-gray-600">
                                            <span className="mr-2 text-gray-400">○</span>
                                            <span>Activate Referral Program (20% discount)</span>
                                        </li>
                                        <li className="flex items-start text-gray-600">
                                            <span className="mr-2 text-gray-400">○</span>
                                            <span>Goal: 200 Paying Subscribers</span>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Phase 2 */}
                    <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100 opacity-90">
                        <div className="bg-gray-50 px-8 py-6 border-b border-gray-100">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                                <h2 className="text-2xl font-bold text-gray-800">Phase 2: Growth & Optimization</h2>
                                <span className="bg-gray-200 text-gray-600 px-3 py-1 rounded-full text-sm font-medium">
                                    Q2 2026 (Apr-Jun)
                                </span>
                            </div>
                            <p className="text-gray-500 mt-2">Scaling acquisition and optimizing conversion.</p>
                        </div>

                        <div className="p-8">
                            <ul className="grid md:grid-cols-2 gap-4">
                                <li className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                                    <div className="font-semibold text-gray-900 mb-1">Scale User Acquisition</div>
                                    <div className="text-sm text-gray-500">Facebook/Google Ads & YouTube Sponsorships</div>
                                </li>
                                <li className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                                    <div className="font-semibold text-gray-900 mb-1">Content Marketing</div>
                                    <div className="text-sm text-gray-500">20+ Blog Posts, 10+ YouTube Videos</div>
                                </li>
                                <li className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                                    <div className="font-semibold text-gray-900 mb-1">Feature Expansion</div>
                                    <div className="text-sm text-gray-500">Implement top 3 user feedback requests</div>
                                </li>
                                <li className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                                    <div className="font-semibold text-gray-900 mb-1">Enterprise Pilot</div>
                                    <div className="text-sm text-gray-500">Secure first print farm or agency customer</div>
                                </li>
                            </ul>
                        </div>
                    </div>

                    {/* Phase 3 */}
                    <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100 opacity-90">
                        <div className="bg-gray-50 px-8 py-6 border-b border-gray-100">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                                <h2 className="text-2xl font-bold text-gray-800">Phase 3: Image-to-3D Launch</h2>
                                <span className="bg-gray-200 text-gray-600 px-3 py-1 rounded-full text-sm font-medium">
                                    Q3 2026 (Jul-Sep)
                                </span>
                            </div>
                            <p className="text-gray-500 mt-2">Unlocking the next dimension of potential.</p>
                        </div>

                        <div className="p-8">
                            <ul className="grid md:grid-cols-2 gap-4">
                                <li className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                                    <div className="font-semibold text-gray-900 mb-1">Image-to-3D Premium Tier</div>
                                    <div className="text-sm text-gray-500">Beta launch to Pro subscribers</div>
                                </li>
                                <li className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                                    <div className="font-semibold text-gray-900 mb-1">Slicer Integration</div>
                                    <div className="text-sm text-gray-500">Export to Cura, PrusaSlicer, Bambu Studio</div>
                                </li>
                                <li className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                                    <div className="font-semibold text-gray-900 mb-1">API Beta Program</div>
                                    <div className="text-sm text-gray-500">Pilot customers for automated workflows</div>
                                </li>
                                <li className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                                    <div className="font-semibold text-gray-900 mb-1">Technical Validation</div>
                                    <div className="text-sm text-gray-500">Partner with advanced users for deep feedback</div>
                                </li>
                            </ul>
                        </div>
                    </div>

                    {/* Phase 4 */}
                    <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100 opacity-90">
                        <div className="bg-gray-50 px-8 py-6 border-b border-gray-100">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                                <h2 className="text-2xl font-bold text-gray-800">Phase 4: Scale & Enterprise</h2>
                                <span className="bg-gray-200 text-gray-600 px-3 py-1 rounded-full text-sm font-medium">
                                    Q4 2026 (Oct-Dec)
                                </span>
                            </div>
                            <p className="text-gray-500 mt-2">Global expansion and enterprise solutions.</p>
                        </div>

                        <div className="p-8">
                            <ul className="grid md:grid-cols-2 gap-4">
                                <li className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                                    <div className="font-semibold text-gray-900 mb-1">Enterprise Tier Launch</div>
                                    <div className="text-sm text-gray-500">Custom pricing, API access, White-label</div>
                                </li>
                                <li className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                                    <div className="font-semibold text-gray-900 mb-1">International Expansion</div>
                                    <div className="text-sm text-gray-500">Euro/GBP pricing, Multilingual support</div>
                                </li>
                                <li className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                                    <div className="font-semibold text-gray-900 mb-1">Strategic Partnerships</div>
                                    <div className="text-sm text-gray-500">Co-marketing with equipment manufacturers</div>
                                </li>
                                <li className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                                    <div className="font-semibold text-gray-900 mb-1">Profitability Goal</div>
                                    <div className="text-sm text-gray-500">Positive monthly cash flow</div>
                                </li>
                            </ul>
                        </div>
                    </div>

                </div>
            </main>

            <Footer />
        </div>
    );
}
