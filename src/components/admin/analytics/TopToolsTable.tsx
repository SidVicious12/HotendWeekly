'use client'

import { useState, useEffect } from 'react'
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'

interface ToolData {
  id: string
  name: string
  usage: number
  revenue: number
  trend: number
  trendDirection: 'up' | 'down' | 'neutral'
}

interface TopToolsTableProps {
  timeRange: string
}

/**
 * TopToolsTable Component
 *
 * Displays top performing tools with:
 * - Tool name and usage count
 * - Revenue generated
 * - Trend indicators
 * - Sortable columns
 */
export default function TopToolsTable({ timeRange }: TopToolsTableProps) {
  const [data, setData] = useState<ToolData[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      setLoading(true)
      try {
        const response = await fetch(`/api/admin/analytics/top-tools?range=${timeRange}`)
        if (response.ok) {
          const result = await response.json()
          setData(result)
        }
      } catch (error) {
        console.error('Error loading top tools data:', error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [timeRange])

  const getTrendIcon = (direction: string) => {
    switch (direction) {
      case 'up':
        return <TrendingUp className="w-4 h-4 text-green-600" />
      case 'down':
        return <TrendingDown className="w-4 h-4 text-red-600" />
      default:
        return <Minus className="w-4 h-4 text-gray-400" />
    }
  }

  const getTrendColor = (direction: string) => {
    switch (direction) {
      case 'up':
        return 'text-green-600'
      case 'down':
        return 'text-red-600'
      default:
        return 'text-gray-600'
    }
  }

  if (loading) {
    return (
      <div className="h-64 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600" />
      </div>
    )
  }

  if (data.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-gray-500">
        No tool data available
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-200">
            <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Tool</th>
            <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">Usage</th>
            <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">Revenue</th>
            <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">Trend</th>
          </tr>
        </thead>
        <tbody>
          {data.map((tool, index) => (
            <tr
              key={tool.id}
              className={`border-b border-gray-100 hover:bg-gray-50 transition-colors ${
                index === 0 ? 'bg-purple-50' : ''
              }`}
            >
              <td className="py-3 px-4">
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium text-gray-900">{tool.name}</span>
                  {index === 0 && (
                    <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs font-semibold rounded">
                      Top
                    </span>
                  )}
                </div>
              </td>
              <td className="py-3 px-4 text-right text-sm text-gray-900">
                {tool.usage.toLocaleString()}
              </td>
              <td className="py-3 px-4 text-right text-sm text-gray-900">
                ${tool.revenue.toLocaleString()}
              </td>
              <td className="py-3 px-4 text-right">
                <div className="flex items-center justify-end space-x-1">
                  {getTrendIcon(tool.trendDirection)}
                  <span className={`text-sm font-medium ${getTrendColor(tool.trendDirection)}`}>
                    {Math.abs(tool.trend)}%
                  </span>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
