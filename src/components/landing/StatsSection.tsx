import { stats } from '@/lib/data'

export function StatsSection() {
  return (
    <section className="bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 py-20">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 italic">
              Real Results
            </span>{' '}
            with HotendWeekly
          </h2>
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
            Our customers achieve measurable growth with HotendWeekly's AI-powered visual creation:
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="bg-white rounded-3xl p-8 shadow-xl text-center hover:shadow-2xl transition-shadow"
            >
              <div className="text-5xl md:text-6xl font-bold text-gray-900 mb-4">
                {stat.value}
              </div>
              <div className="text-lg md:text-xl font-medium text-gray-700">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
