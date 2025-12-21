'use client';

import Link from 'next/link';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';

const tools = [
  {
    name: 'Magic Eraser',
    href: '/tools/magic-eraser',
    image: '/showcase/magic-eraser.png',
    description: 'Remove unwanted objects or blemishes from your photos.',
    status: 'live'
  },
  {
    name: 'Image Enhancer',
    href: '/tools/image-enhancer',
    image: '/showcase/image-enhancer.png',
    description: 'Upscale and improve image quality with AI.',
    status: 'live'
  },
  {
    name: 'Color Changer',
    href: '/tools/color-changer',
    image: '/showcase/color-changer.png',
    description: 'Change the color of objects or backgrounds instantly.',
    status: 'live'
  },
  {
    name: 'Print Scene Generator',
    href: '/tools/print-scene-generator',
    image: '/showcase/print-scene-generator.png',
    description: 'Generate realistic lifestyle scenes for your 3D prints.',
    status: 'live'
  },
  {
    name: 'Texture Preview',
    href: '/tools/texture-preview',
    image: '/showcase/texture-preview.png',
    description: 'Visualize different materials on your models.',
    status: 'live'
  },
  {
    name: 'Layer Detail Enhancer',
    href: '/tools/layer-detail-enhancer',
    image: '/showcase/layer-detail-enhancer.png',
    description: 'Smooth 3D print layer lines while preserving details.',
    status: 'live'
  }
];

export default function ToolsPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navigation />

      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Our{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 italic">
                AI Toolkit
              </span>
            </h1>
            <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
              Professional tools designed specifically for 3D print creators
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {tools.map((tool) => (
              <ToolCard key={tool.href} {...tool} />
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

interface ToolCardProps {
  href: string;
  name: string;
  description: string;
  image: string;
}

function ToolCard({ href, name, description, image }: ToolCardProps) {
  return (
    <Link
      href={href}
      className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-shadow cursor-pointer group border border-gray-100"
    >
      <div className="bg-gray-100 rounded-2xl p-6 mb-6 aspect-square flex items-center justify-center group-hover:bg-gray-200 transition-colors">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-contain rounded-xl"
        />
      </div>
      <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-purple-600 transition-colors">
        {name}
      </h3>
      <p className="text-sm text-gray-600">{description}</p>
    </Link>
  );
}
