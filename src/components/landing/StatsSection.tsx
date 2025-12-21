import { stats } from '@/lib/data'

export function StatsSection() {
  return (
    <section className="bg-white py-24">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 tracking-tight">
            Real Results
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            See why thousands of 3D printing businesses boost their sales with professional imagery.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {stats.map((stat, i) => (
            <div
              key={stat.label}
              className={`rounded-[2rem] p-10 text-center transition-all hover:-translate-y-1 duration-300 ${i === 1
                  ? 'bg-black text-white shadow-2xl'
                  : 'bg-gray-50 text-gray-900 border border-gray-100'
                }`}
            >
              <div className={`text-6xl md:text-7xl font-bold mb-4 tracking-tighter ${i === 1 ? 'text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400' : 'text-gray-900'
                }`}>
                {stat.value}
              </div>
              <div className={`text-lg font-medium ${i === 1 ? 'text-gray-300' : 'text-gray-600'}`}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
