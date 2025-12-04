interface HeroSectionProps {
  userEmail?: string | null
}

export function HeroSection({ userEmail }: HeroSectionProps) {
  return (
    <section className="max-w-7xl mx-auto px-6 lg:px-8 pt-20 pb-16">
      <div className="text-center max-w-4xl mx-auto mb-12">
        <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-6 leading-tight">
          Turn Ordinary 3D Prints into{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 italic">
            Extraordinary
          </span>{' '}
          Creations.
        </h1>
        <p className="text-lg md:text-xl text-gray-600 mb-6 max-w-3xl mx-auto">
          Don't let dull images hide your best work. Hotend Weekly uses AI to make your 3D prints shine — clean backgrounds, studio lighting, and showcase scenes that make every model look its best.
        </p>

        {userEmail ? (
          <p className="text-sm text-purple-600 font-semibold">
            Welcome, {userEmail}! Upload an image below to get started.
          </p>
        ) : (
          <p className="text-sm text-gray-600">
            Upload an image below to get started with AI-powered background removal.
          </p>
        )}
      </div>
    </section>
  )
}
