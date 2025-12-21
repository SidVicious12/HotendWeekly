export function TrustedBySection() {
  const brands = [
    'Prusa Research', 'Bambu Lab', 'Creality', 'Elegoo', 'Anycubic', 'Phrozen'
  ]

  return (
    <section className="py-12 border-b border-gray-100 bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center">
        <p className="text-sm font-semibold text-gray-400 mb-8 uppercase tracking-wider">
          Trusted by top 3D Printing Creators
        </p>
        <div className="flex flex-wrap justify-center items-center gap-x-12 gap-y-8 opacity-40 hover:opacity-100 transition-opacity duration-500 grayscale">
          {brands.map((brand) => (
            <span key={brand} className="text-xl md:text-2xl font-bold text-gray-600 cursor-default">
              {brand}
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}
