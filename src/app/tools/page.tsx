'use client';

import Link from 'next/link';
import Navigation from '@/components/Navigation';

export default function ToolsPage() {
  // Tool categories organized in columns
  const toolCategories = {
    'AI Model Generation': [
      {
        name: 'Diversified Fashion Model Database',
        href: '/tools/fashion-model-database',
        image: '/showcase/fashion-model-database.jpeg',
        description: 'Diverse AI fashion models'
      }
    ],
    '3D & Spatial': [
      {
        name: 'Transform to 3D',
        href: '/tools/transform-to-3d',
        image: '/showcase/transform-to-3d.jpeg',
        description: '2D to interactive 3D models'
      }
    ],
    'Image Enhancement': [
      {
        name: 'Magic Eraser',
        href: '/tools/magic-eraser',
        image: '/showcase/magic-eraser.jpeg',
        description: 'Fix flaws automatically'
      },
      {
        name: 'Image Retouch',
        href: '/tools/image-retouch',
        image: '/showcase/image-retouch.png',
        description: 'Color changing & textures'
      },
      {
        name: 'Image Enhancer',
        href: '/tools/image-enhancer',
        image: '/showcase/image-enhancer.png',
        description: 'Clarity & detail boost'
      },
      {
        name: 'Image Extender',
        href: '/tools/image-extender',
        image: '/showcase/image-extender.png',
        description: 'Scale & background expansion'
      }
    ],
    'Coming Soon': []
  };

  return (
    <div className="min-h-screen bg-white">
      <Navigation />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 py-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6">
              Transform Your Photos with the Best{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 italic">
                AI Photo Editing
              </span>{' '}
              Tools
            </h1>
            <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
              More than just model shots—HotendWeekly offers a full suite of AI-powered tools to handle every aspect of your product visuals.
            </p>
          </div>
        </div>
      </section>

      {/* Tools Grid - 4 Column Layout */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {Object.entries(toolCategories).map(([category, tools]) => (
              <div key={category}>
                {/* Category Header */}
                <div className="mb-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-2">{category}</h2>
                  <div className="h-1 w-12 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full"></div>
                </div>

                {/* Tools in this category */}
                <div className="space-y-6">
                  {tools.length > 0 ? (
                    tools.map((tool) => (
                      <Link
                        key={tool.href}
                        href={tool.href}
                        className="block group"
                      >
                        <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100">
                          {/* Tool Image */}
                          <div className="relative h-48 bg-gray-100 overflow-hidden">
                            <img
                              src={tool.image}
                              alt={tool.name}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                            />
                          </div>

                          {/* Tool Info */}
                          <div className="p-6">
                            <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-purple-600 transition-colors">
                              {tool.name}
                            </h3>
                            <p className="text-sm text-gray-600">
                              {tool.description}
                            </p>
                          </div>
                        </div>
                      </Link>
                    ))
                  ) : (
                    <div className="bg-gray-50 rounded-2xl p-8 border-2 border-dashed border-gray-300 text-center">
                      <div className="text-4xl mb-4">🚀</div>
                      <p className="text-sm text-gray-500 font-medium">
                        New tools launching soon
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-br from-purple-600 via-pink-600 to-blue-600 py-20">
        <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Transform Your Product Photos?
          </h2>
          <p className="text-lg text-white/90 mb-8">
            Join thousands of creators using HotendWeekly to create stunning product visuals in seconds.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/auth/signup"
              className="bg-white text-purple-600 px-8 py-4 rounded-full text-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Get Started Free
            </Link>
            <Link
              href="/pricing"
              className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-white/10 transition-colors"
            >
              View Pricing
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
