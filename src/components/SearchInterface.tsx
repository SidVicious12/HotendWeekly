'use client'

import { useState } from 'react'

interface SearchResult {
  id: string
  title: string
  description: string
  thumbnail: string
  downloadUrl: string
  tags: string[]
}

export default function SearchInterface() {
  const [query, setQuery] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [results, setResults] = useState<SearchResult[]>([])

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!query.trim()) return

    setIsLoading(true)
    
    // Simulate API call - replace with actual API
    setTimeout(() => {
      const mockResults: SearchResult[] = [
        {
          id: '1',
          title: 'Phone Stand with Cable Management',
          description: 'Modern phone stand with built-in cable routing',
          thumbnail: '/api/placeholder/300/200',
          downloadUrl: '#',
          tags: ['phone', 'stand', 'cable', 'desk']
        },
        {
          id: '2', 
          title: 'Adjustable Desktop Organizer',
          description: 'Modular desktop organizer with customizable compartments',
          thumbnail: '/api/placeholder/300/200',
          downloadUrl: '#',
          tags: ['organizer', 'desk', 'modular']
        }
      ]
      setResults(mockResults)
      setIsLoading(false)
    }, 1500)
  }

  return (
    <div className="bg-gray-950 py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-white mb-4">
            Find Your Perfect 3D Print
          </h2>
          <p className="text-gray-300 text-lg">
            Describe what you're looking for and let AI find the best models
          </p>
        </div>

        <form onSubmit={handleSearch} className="mb-8">
          <div className="flex gap-3">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="e.g., phone stand with cable management, miniature dragon, cookie cutter..."
              className="flex-1 px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button
              type="submit"
              disabled={isLoading || !query.trim()}
              className="px-8 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 text-white rounded-lg font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-950"
            >
              {isLoading ? 'Searching...' : 'Search'}
            </button>
          </div>
        </form>

        {isLoading && (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          </div>
        )}

        {results.length > 0 && !isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {results.map((result) => (
              <div key={result.id} className="bg-gray-800 rounded-lg overflow-hidden hover:bg-gray-750 transition-colors">
                <div className="h-48 bg-gray-700"></div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-white mb-2">
                    {result.title}
                  </h3>
                  <p className="text-gray-300 mb-4">
                    {result.description}
                  </p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {result.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-1 bg-gray-700 text-gray-300 text-sm rounded"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-3">
                    <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded font-semibold transition-colors">
                      Download STL
                    </button>
                    <button className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded font-semibold transition-colors">
                      Get This Printed
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}