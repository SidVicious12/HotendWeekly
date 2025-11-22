'use client'

import { useState, useEffect } from 'react'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts'

interface GeographicData {
  country: string
  users: number
  percentage: number
  [key: string]: string | number
}

interface GeographicDistributionProps {
  timeRange: string
}

/**
 * GeographicDistribution Component
 *
 * Displays user distribution by country with:
 * - Pie chart visualization
 * - Country breakdown
 * - Percentage labels
 * - Color-coded regions
 */
export default function GeographicDistribution({ timeRange }: GeographicDistributionProps) {
  const [data, setData] = useState<GeographicData[]>([])
  const [loading, setLoading] = useState(true)

  const COLORS = [
    '#8b5cf6',
    '#3b82f6',
    '#10b981',
    '#f59e0b',
    '#ef4444',
    '#ec4899',
    '#6366f1',
    '#14b8a6',
  ]

  useEffect(() => {
    const loadData = async () => {
      setLoading(true)
      try {
        const response = await fetch(`/api/admin/analytics/geographic?range=${timeRange}`)
        if (response.ok) {
          const result = await response.json()
          setData(result)
        }
      } catch (error) {
        console.error('Error loading geographic data:', error)
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

  if (data.length === 0) {
    return (
      <div className="h-80 flex items-center justify-center text-gray-500">
        No geographic data available
      </div>
    )
  }

  return (
    <div className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={(entry: any) => `${entry.country} (${entry.percentage.toFixed(1)}%)`}
            outerRadius={100}
            fill="#8884d8"
            dataKey="users"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              backgroundColor: '#fff',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              padding: '12px',
            }}
            formatter={(value: number, name: string, props: any) => [
              `${value.toLocaleString()} users (${props.payload.percentage.toFixed(1)}%)`,
              props.payload.country,
            ]}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}
