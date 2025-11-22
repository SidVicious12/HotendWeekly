'use client'

import { useState, useEffect } from 'react'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts'

interface RevenueData {
  date: string
  revenue: number
  subscriptions: number
  oneTime: number
}

interface RevenueChartProps {
  timeRange: string
}

/**
 * RevenueChart Component
 *
 * Displays revenue trends with:
 * - Total revenue area
 * - Subscription revenue
 * - One-time payment revenue
 * - Stacked area visualization
 */
export default function RevenueChart({ timeRange }: RevenueChartProps) {
  const [data, setData] = useState<RevenueData[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      setLoading(true)
      try {
        const response = await fetch(`/api/admin/analytics/revenue?range=${timeRange}`)
        if (response.ok) {
          const result = await response.json()
          setData(result)
        }
      } catch (error) {
        console.error('Error loading revenue data:', error)
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
        <AreaChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
          <defs>
            <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.1} />
            </linearGradient>
            <linearGradient id="colorSubscriptions" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#10b981" stopOpacity={0.1} />
            </linearGradient>
            <linearGradient id="colorOneTime" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.1} />
            </linearGradient>
          </defs>
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
            formatter={(value: number) => `$${value.toLocaleString()}`}
          />
          <Legend />
          <Area
            type="monotone"
            dataKey="subscriptions"
            stackId="1"
            stroke="#10b981"
            fill="url(#colorSubscriptions)"
            name="Subscriptions"
          />
          <Area
            type="monotone"
            dataKey="oneTime"
            stackId="1"
            stroke="#f59e0b"
            fill="url(#colorOneTime)"
            name="One-Time"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
