import Link from 'next/link'

interface Tool {
  href: string
  title: string
  description: string
  image: string
  status?: 'new' | 'beta' | 'popular' | 'updated'
}

const tools: Tool[] = [
  {
    href: '/tools/transform-to-3d',
    title: 'Image to 3D',
    description: 'Turn 2D images into 3D models with AI.',
    image: '/showcase/transform-to-3d.jpeg',
    status: 'new'
  },
  {
    href: '/tools/layer-detail-enhancer',
    title: 'Layer Detail Enhancer',
    description: 'Smooth 3D print layer lines while preserving details.',
    image: '/showcase/layer-detail-enhancer.png',
    status: 'popular'
  },
  {
    href: '/tools/magic-eraser',
    title: 'Magic Eraser',
    description: 'Remove unwanted objects or blemishes from your photos.',
    image: '/showcase/magic-eraser.png',
    status: 'popular'
  },
  {
    href: '/tools/image-enhancer',
    title: 'Image Enhancer',
    description: 'Upscale and improve image quality with AI.',
    image: '/showcase/image-enhancer.png'
  },
  {
    href: '/tools/color-changer',
    title: 'Color Changer',
    description: 'Change the color of objects or backgrounds instantly.',
    image: '/showcase/color-changer.png',
    status: 'updated'
  },
  {
    href: '/tools/print-scene-generator',
    title: 'Print Scene Generator',
    description: 'Generate realistic lifestyle scenes for your 3D prints.',
    image: '/showcase/print-scene-generator.png',
    status: 'beta'
  },
  {
    href: '/tools/texture-preview',
    title: 'Texture Preview',
    description: 'Visualize different materials on your models.',
    image: '/showcase/texture-preview.png'
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

function ToolCard({ href, title, description, image, status }: Tool) {
  const getStatusColor = (s?: string) => {
    switch (s) {
      case 'new': return 'bg-blue-500 text-white'
      case 'beta': return 'bg-purple-500 text-white'
      case 'popular': return 'bg-amber-500 text-white'
      case 'updated': return 'bg-green-500 text-white'
      default: return null
    }
  }

  const statusColor = getStatusColor(status)

  return (
    <Link
      href={href}
      className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-shadow cursor-pointer group relative overflow-hidden"
    >
      {status && statusColor && (
        <div className={`absolute top-4 right-4 px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-full ${statusColor}`}>
          {status}
        </div>
      )}
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
