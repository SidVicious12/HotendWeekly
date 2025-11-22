'use client'

import { useState, useEffect } from 'react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts'

interface UserGrowthData {
  date: string
  totalUsers: number
  newUsers: number
  activeUsers: number
}

interface UserGrowthChartProps {
  timeRange: string
}

/**
 * UserGrowthChart Component
 *
 * Displays user growth trends over time with:
 * - Total users line
 * - New users line
 * - Active users line
 * - Interactive tooltip
 * - Responsive design
 */
export default function UserGrowthChart({ timeRange }: UserGrowthChartProps) {
  const [data, setData] = useState<UserGrowthData[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      setLoading(true)
      try {
        const response = await fetch(`/api/admin/analytics/user-growth?range=${timeRange}`)
        if (response.ok) {
          const result = await response.json()
          setData(result)
        }
      } catch (error) {
        console.error('Error loading user growth data:', error)
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
        <LineChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis
            dataKey="date"
            stroke="#9ca3af"
            style={{ fontSize: '12px' }}
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
          <Line
            type="monotone"
            dataKey="totalUsers"
            stroke="#8b5cf6"
            strokeWidth={2}
            name="Total Users"
            dot={{ fill: '#8b5cf6', r: 4 }}
            activeDot={{ r: 6 }}
          />
          <Line
            type="monotone"
            dataKey="newUsers"
            stroke="#3b82f6"
            strokeWidth={2}
            name="New Users"
            dot={{ fill: '#3b82f6', r: 4 }}
            activeDot={{ r: 6 }}
          />
          <Line
            type="monotone"
            dataKey="activeUsers"
            stroke="#10b981"
            strokeWidth={2}
            name="Active Users"
            dot={{ fill: '#10b981', r: 4 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
