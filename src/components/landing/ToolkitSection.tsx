import Link from 'next/link'

const tools = [
  {
    href: '/tools/fashion-model-database',
    title: 'Diversified Fashion Model Database',
    description: 'Access AI-generated diverse models to display your 3D printed fashion items.',
    image: '/showcase/fashion-model-database.png'
  },
  {
    href: '/tools/transform-to-3d',
    title: 'Transform to 3D',
    description: 'Convert any 2D image of your print into an interactive 3D model preview.',
    image: '/showcase/transform-to-3d.png'
  },
  {
    href: '/tools/magic-eraser',
    title: 'Magic Eraser',
    description: 'Automatically fix flaws and enhance your visuals with a professional finish.',
    image: '/showcase/magic-eraser.jpeg'
  },
  {
    href: '/tools/image-retouch',
    title: 'Image Retouch (Color Changing)',
    description: 'Modify specific regions of 3D model or image by changing colors, textures, or materials with simple text instructions.',
    image: '/showcase/image-retouch.png'
  },
  {
    href: '/tools/image-enhancer',
    title: 'Image Enhancer (Clarity & Detail)',
    description: 'Transform low-resolution blurry 3D scans into crisp, highly detailed visuals, revealing hidden details.',
    image: '/showcase/image-enhancer.png'
  },
  {
    href: '/tools/image-extender',
    title: 'Image Extender (Scale & Background)',
    description: 'Expand the canvas of any 3D render by generating new content that seamlessly blends with the original scene.',
    image: '/showcase/image-extender.png'
  }
]

export function ToolkitSection() {
  return (
    <section className="bg-white py-20">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Ever Growing{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 italic">
              AI Toolkit
            </span>
          </h2>
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
            Professional tools designed specifically for 3D print creators
          </p>
        </div>

        {/* Top row - 3 tools */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {tools.slice(0, 3).map((tool) => (
            <ToolCard key={tool.href} {...tool} />
          ))}
        </div>

        {/* Bottom row - 3 tools */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {tools.slice(3).map((tool) => (
            <ToolCard key={tool.href} {...tool} />
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link
            href="/tools"
            className="inline-flex items-center gap-3 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 text-white px-10 py-4 rounded-full text-lg font-semibold hover:from-purple-700 hover:via-pink-700 hover:to-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            <span>View All Tools</span>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  )
}

interface ToolCardProps {
  href: string
  title: string
  description: string
  image: string
}

function ToolCard({ href, title, description, image }: ToolCardProps) {
  return (
    <Link
      href={href}
      className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-shadow cursor-pointer group"
    >
      <div className="bg-gray-100 rounded-2xl p-6 mb-6 aspect-square flex items-center justify-center group-hover:bg-gray-200 transition-colors">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-contain rounded-xl"
        />
      </div>
      <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-purple-600 transition-colors">
        {title}
      </h3>
      <p className="text-sm text-gray-600">{description}</p>
    </Link>
  )
}
