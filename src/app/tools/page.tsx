import Link from 'next/link';
import Navigation from '@/components/Navigation';
import { ToolStatusBadge, type ToolStatus } from '@/components/ToolStatusBadge';

interface Tool {
  name: string;
  href: string;
  image: string;
  description: string;
  status: ToolStatus;
  credits?: string;
  turnaround?: string;
}

export default function ToolsPage() {
  // Live/Working Tools
  const liveTools: Tool[] = [
    {
      name: 'Background Remover',
      href: '/tools/background-remover',
      image: '/showcase/magic-eraser.png',
      description: 'AI-powered background removal using Replicate RMBG-2.0',
      status: 'live',
      credits: '1 credit per image',
      turnaround: '~3-5 seconds'
    },
    {
      name: '3D Print Simplifier',
      href: '/tools/3d-print-simplifier',
      image: '/showcase/goku-transformation.png',
      description: 'Convert photos to simplified vector-style illustrations for multi-color 3D printing',
      status: 'live',
      credits: '5 credits per image',
      turnaround: '~15-20 seconds'
    }
  ];

  // Coming Soon Tools
  const comingSoonTools: Tool[] = [
    {
      name: 'Magic Eraser',
      href: '#',
      image: '/showcase/magic-eraser.jpeg',
      description: 'Remove unwanted objects and fix flaws automatically',
      status: 'planned-q2'
    },
    {
      name: 'Image Retouch',
      href: '#',
      image: '/showcase/image-retouch.png',
      description: 'Color changing & texture modifications',
      status: 'planned-q2'
    },
    {
      name: 'Image Enhancer',
      href: '#',
      image: '/showcase/image-enhancer.png',
      description: 'AI-powered clarity & detail enhancement',
      status: 'planned-q3'
    },
    {
      name: 'Image Extender',
      href: '#',
      image: '/showcase/image-extender.png',
      description: 'Intelligent image scaling & background expansion',
      status: 'planned-q3'
    },
    {
      name: 'Fashion Model Database',
      href: '#',
      image: '/showcase/fashion-model-database.jpeg',
      description: 'Diverse AI fashion models for virtual try-on',
      status: 'planned-q3'
    },
    {
      name: 'Transform to 3D',
      href: '#',
      image: '/showcase/transform-to-3d.jpeg',
      description: 'Convert 2D images to interactive 3D models',
      status: 'planned-q4'
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <Navigation />

      {/* Hero Section - Hidden on Mobile */}
      <section className="hidden md:block bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 py-20">
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

      {/* Mobile-Only Simple Header */}
      <section className="md:hidden pt-6 pb-4">
        <div className="max-w-7xl mx-auto px-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            AI Tools
          </h1>
          <p className="text-sm text-gray-600">Transform your photos instantly</p>
        </div>
      </section>

      {/* Live Tools Section */}
      <section className="py-12 md:py-12">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="mb-8 hidden md:block">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-600">
                Live Tools
              </span>
            </h2>
            <p className="text-gray-600">Ready to use now with working API integrations</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {liveTools.map((tool) => (
              <Link
                key={tool.href}
                href={tool.href}
                className="block group"
              >
                <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border-2 border-green-200 hover:border-green-400">
                  {/* Tool Image */}
                  <div className="relative h-64 bg-gray-100 overflow-hidden">
                    <img
                      src={tool.image}
                      alt={tool.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    {/* Status Badge Overlay */}
                    <div className="absolute top-4 right-4">
                      <ToolStatusBadge status={tool.status} />
                    </div>
                  </div>

                  {/* Tool Info */}
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-green-600 transition-colors">
                      {tool.name}
                    </h3>
                    <p className="text-gray-600 mb-4">
                      {tool.description}
                    </p>

                    {/* Tool Specs */}
                    {(tool.credits || tool.turnaround) && (
                      <div className="flex flex-wrap gap-3 text-sm">
                        {tool.credits && (
                          <div className="flex items-center gap-1.5 text-gray-500">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                            </svg>
                            <span>{tool.credits}</span>
                          </div>
                        )}
                        {tool.turnaround && (
                          <div className="flex items-center gap-1.5 text-gray-500">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span>{tool.turnaround}</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Coming Soon Section - Hidden on Mobile */}
      <section className="hidden md:block py-12 pb-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">
                Coming Soon
              </span>
            </h2>
            <p className="text-gray-600">Planned tools in our development roadmap</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {comingSoonTools.map((tool) => (
              <div
                key={tool.name}
                className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200 opacity-75 hover:opacity-100 transition-opacity duration-300"
              >
                {/* Tool Image */}
                <div className="relative h-48 bg-gray-100 overflow-hidden">
                  <img
                    src={tool.image}
                    alt={tool.name}
                    className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500"
                  />
                  {/* Status Badge Overlay */}
                  <div className="absolute top-4 right-4">
                    <ToolStatusBadge status={tool.status} />
                  </div>
                </div>

                {/* Tool Info */}
                <div className="p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-2">
                    {tool.name}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {tool.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section - Hidden on Mobile */}
      <section className="hidden md:block bg-gradient-to-br from-purple-600 via-pink-600 to-blue-600 py-20">
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
