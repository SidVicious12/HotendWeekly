'use client'

import { useState, useEffect } from 'react'
import { Clock, Zap, Target, Users } from 'lucide-react'

interface EngagementData {
  averageSessionDuration: number
  dailyActiveUsers: number
  weeklyActiveUsers: number
  monthlyActiveUsers: number
  retentionRate: number
  churnRate: number
  averageToolsPerUser: number
  powerUsers: number
}

interface UserEngagementMetricsProps {
  timeRange: string
}

/**
 * UserEngagementMetrics Component
 *
 * Displays user engagement metrics with:
 * - Session duration
 * - Active user counts (DAU, WAU, MAU)
 * - Retention and churn rates
 * - Power user statistics
 */
export default function UserEngagementMetrics({ timeRange }: UserEngagementMetricsProps) {
  const [data, setData] = useState<EngagementData>({
    averageSessionDuration: 0,
    dailyActiveUsers: 0,
    weeklyActiveUsers: 0,
    monthlyActiveUsers: 0,
    retentionRate: 0,
    churnRate: 0,
    averageToolsPerUser: 0,
    powerUsers: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      setLoading(true)
      try {
        const response = await fetch(`/api/admin/analytics/engagement?range=${timeRange}`)
        if (response.ok) {
          const result = await response.json()
          setData(result)
        }
      } catch (error) {
        console.error('Error loading engagement data:', error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [timeRange])

  const formatDuration = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60)
    const hours = Math.floor(minutes / 60)
    if (hours > 0) {
      return `${hours}h ${minutes % 60}m`
    }
    return `${minutes}m`
  }

  if (loading) {
    return (
      <div className="h-64 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600" />
      </div>
    )
  }

  const metrics = [
    {
      label: 'Avg Session Duration',
      value: formatDuration(data.averageSessionDuration),
      icon: Clock,
      color: 'bg-blue-100 text-blue-600',
    },
    {
      label: 'Daily Active Users',
      value: data.dailyActiveUsers.toLocaleString(),
      icon: Zap,
      color: 'bg-green-100 text-green-600',
    },
    {
      label: 'Weekly Active Users',
      value: data.weeklyActiveUsers.toLocaleString(),
      icon: Users,
      color: 'bg-purple-100 text-purple-600',
    },
    {
      label: 'Monthly Active Users',
      value: data.monthlyActiveUsers.toLocaleString(),
      icon: Users,
      color: 'bg-pink-100 text-pink-600',
    },
    {
      label: 'Retention Rate',
      value: `${data.retentionRate.toFixed(1)}%`,
      icon: Target,
      color: 'bg-emerald-100 text-emerald-600',
    },
    {
      label: 'Churn Rate',
      value: `${data.churnRate.toFixed(1)}%`,
      icon: Target,
      color: 'bg-red-100 text-red-600',
    },
    {
      label: 'Avg Tools/User',
      value: data.averageToolsPerUser.toFixed(1),
      icon: Zap,
      color: 'bg-orange-100 text-orange-600',
    },
    {
      label: 'Power Users',
      value: data.powerUsers.toLocaleString(),
      icon: Users,
      color: 'bg-indigo-100 text-indigo-600',
    },
  ]

  return (
    <div className="grid grid-cols-2 gap-4">
      {metrics.map((metric, index) => {
        const Icon = metric.icon
        return (
          <div
            key={index}
            className="p-4 rounded-lg border border-gray-200 hover:border-purple-300 transition-colors"
          >
            <div className="flex items-center space-x-3">
              <div className={`w-10 h-10 rounded-lg ${metric.color} flex items-center justify-center`}>
                <Icon className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-gray-600">{metric.label}</p>
                <p className="text-lg font-bold text-gray-900">{metric.value}</p>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
