export function TrustedBySection() {
  return (
    <section className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
      <div className="text-center mb-12">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
          Trusted by thousands of 3D printing creators
        </h2>
      </div>

      <div className="flex items-center justify-center gap-12 md:gap-16 lg:gap-20 opacity-40 grayscale">
        <LogoEtsy />
        <LogoBambuLab />
        <LogoSnapmaker />
        <LogoThingiverse />
      </div>
    </section>
  )
}

function LogoEtsy() {
  return (
    <div className="flex items-center justify-center h-12">
      <svg className="h-10 w-auto" viewBox="0 0 200 80" xmlns="http://www.w3.org/2000/svg">
        <text x="10" y="60" fontFamily="Georgia, serif" fontSize="56" fontWeight="400" fill="#F56400">Etsy</text>
      </svg>
    </div>
  )
}

function LogoBambuLab() {
  return (
    <div className="flex items-center justify-center h-12">
      <svg className="h-10 w-auto" viewBox="0 0 400 100" xmlns="http://www.w3.org/2000/svg">
        <g transform="translate(10, 20)">
          <rect x="0" y="0" width="30" height="60" fill="#3D3D3D"/>
          <rect x="35" y="0" width="30" height="60" fill="#3D3D3D"/>
          <path d="M 5 20 L 25 40 L 5 40 Z" fill="white"/>
          <path d="M 40 20 L 60 40 L 40 40 Z" fill="white"/>
        </g>
        <text x="90" y="58" fontFamily="Arial, sans-serif" fontSize="36" fontWeight="600" fill="#3D3D3D">Bambu</text>
        <text x="90" y="82" fontFamily="Arial, sans-serif" fontSize="36" fontWeight="600" fill="#3D3D3D">Lab</text>
      </svg>
    </div>
  )
}

function LogoSnapmaker() {
  return (
    <div className="flex items-center justify-center h-12">
      <svg className="h-10 w-auto" viewBox="0 0 400 100" xmlns="http://www.w3.org/2000/svg">
        <text x="10" y="65" fontFamily="Arial, sans-serif" fontSize="48" fontWeight="500" fill="#2B2B2B">snapmaker</text>
      </svg>
    </div>
  )
}

function LogoThingiverse() {
  return (
    <div className="flex items-center justify-center h-12">
      <svg className="h-10 w-auto" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        <rect width="100" height="100" rx="20" fill="#248BFB"/>
        <circle cx="50" cy="50" r="35" fill="none" stroke="white" strokeWidth="6"/>
        <text x="50" y="70" fontFamily="Arial, sans-serif" fontSize="52" fontWeight="700" fill="white" textAnchor="middle">T</text>
      </svg>
    </div>
  )
}
