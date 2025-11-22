'use client'

import { useEffect, useState } from 'react'
import { Activity, TrendingUp, Calendar, Zap } from 'lucide-react'

interface UsageStats {
  dailyUsage: number
  monthlyUsage: number
  dailyLimit: number
  monthlyLimit: number
  dailyRemaining: number
  monthlyRemaining: number
  tierName: string
  tierSlug: string
}

export function UsageStats() {
  const [stats, setStats] = useState<UsageStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchStats() {
      try {
        const response = await fetch('/api/usage/stats')
        if (!response.ok) {
          throw new Error('Failed to fetch stats')
        }
        const data = await response.json()
        setStats(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load stats')
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-200 rounded w-1/3"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    )
  }

  if (error || !stats) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <p className="text-red-600 text-sm">{error || 'Failed to load usage stats'}</p>
      </div>
    )
  }

  const dailyPercentage = (stats.dailyUsage / stats.dailyLimit) * 100
  const monthlyPercentage = (stats.monthlyUsage / stats.monthlyLimit) * 100

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <Activity className="w-5 h-5 text-blue-600" />
          Usage Statistics
        </h3>
        <span className="text-xs font-medium text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
          {stats.tierName}
        </span>
      </div>

      <div className="space-y-6">
        {/* Daily Usage */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-gray-500" />
              <span className="text-sm font-medium text-gray-700">Daily Usage</span>
            </div>
            <span className="text-sm font-semibold text-gray-900">
              {stats.dailyUsage} / {stats.dailyLimit}
            </span>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
            <div
              className={`h-2.5 rounded-full transition-all duration-300 ${
                dailyPercentage >= 100
                  ? 'bg-red-500'
                  : dailyPercentage >= 80
                  ? 'bg-yellow-500'
                  : 'bg-blue-600'
              }`}
              style={{ width: `${Math.min(dailyPercentage, 100)}%` }}
            />
          </div>
          <p className="text-xs text-gray-500 mt-1">
            {stats.dailyRemaining} remaining today
          </p>
        </div>

        {/* Monthly Usage */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-gray-500" />
              <span className="text-sm font-medium text-gray-700">Monthly Usage</span>
            </div>
            <span className="text-sm font-semibold text-gray-900">
              {stats.monthlyUsage} / {stats.monthlyLimit}
            </span>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
            <div
              className={`h-2.5 rounded-full transition-all duration-300 ${
                monthlyPercentage >= 100
                  ? 'bg-red-500'
                  : monthlyPercentage >= 80
                  ? 'bg-yellow-500'
                  : 'bg-purple-600'
              }`}
              style={{ width: `${Math.min(monthlyPercentage, 100)}%` }}
            />
          </div>
          <p className="text-xs text-gray-500 mt-1">
            {stats.monthlyRemaining} remaining this month
          </p>
        </div>

        {/* Usage Warning */}
        {(dailyPercentage >= 80 || monthlyPercentage >= 80) && (
          <div className="flex items-start gap-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <Zap className="w-4 h-4 text-yellow-600 mt-0.5 flex-shrink-0" />
            <div className="text-xs text-yellow-800">
              <p className="font-medium">Running low on usage</p>
              <p className="text-yellow-700 mt-0.5">
                Consider upgrading to a higher tier for more capacity
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
