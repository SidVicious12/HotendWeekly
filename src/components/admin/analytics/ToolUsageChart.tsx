'use client'

import { useState, useEffect } from 'react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  Cell,
} from 'recharts'

interface ToolUsageData {
  name: string
  usage: number
  color: string
}

interface ToolUsageChartProps {
  timeRange: string
}

/**
 * ToolUsageChart Component
 *
 * Displays tool usage statistics with:
 * - Bar chart visualization
 * - Color-coded tools
 * - Usage counts
 * - Interactive tooltips
 */
export default function ToolUsageChart({ timeRange }: ToolUsageChartProps) {
  const [data, setData] = useState<ToolUsageData[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      setLoading(true)
      try {
        const response = await fetch(`/api/admin/analytics/tool-usage?range=${timeRange}`)
        if (response.ok) {
          const result = await response.json()
          setData(result)
        }
      } catch (error) {
        console.error('Error loading tool usage data:', error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [timeRange])

  if (loading) {
    return (
      <div className="h-80 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600" />
      </div>
    )
  }

  return (
    <div className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis
            dataKey="name"
            stroke="#9ca3af"
            style={{ fontSize: '12px' }}
            angle={-45}
            textAnchor="end"
            height={80}
          />
          <YAxis stroke="#9ca3af" style={{ fontSize: '12px' }} />
          <Tooltip
            contentStyle={{
              backgroundColor: '#fff',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              padding: '12px',
            }}
          />
          <Legend />
          <Bar dataKey="usage" name="Usage Count" radius={[8, 8, 0, 0]}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
