'use client'

import { TrendingUp, TrendingDown, Minus, Loader2, AlertCircle } from 'lucide-react'

/**
 * Trend direction type
 */
export type TrendDirection = 'up' | 'down' | 'neutral'

/**
 * StatsCard Props
 */
interface StatsCardProps {
  title: string
  value: string | number
  icon?: React.ComponentType<{ className?: string }>
  trend?: {
    value: number
    direction: TrendDirection
    label?: string
  }
  loading?: boolean
  error?: string
  onClick?: () => void
  className?: string
}

/**
 * StatsCard Component
 *
 * Reusable statistics card for displaying metrics
 * Features:
 * - Support for trends (up/down/neutral) with visual indicators
 * - Loading states with animated spinner
 * - Error states with error message
 * - Optional click handler for navigation
 * - Customizable with icons and styling
 *
 * @example
 * <StatsCard
 *   title="Total Users"
 *   value="1,234"
 *   icon={Users}
 *   trend={{ value: 12.5, direction: 'up', label: 'vs last month' }}
 * />
 *
 * @example
 * <StatsCard
 *   title="Revenue"
 *   value="$45,678"
 *   loading={true}
 * />
 *
 * @example
 * <StatsCard
 *   title="Active Users"
 *   value="0"
 *   error="Failed to load data"
 * />
 */
export default function StatsCard({
  title,
  value,
  icon: Icon,
  trend,
  loading = false,
  error,
  onClick,
  className = '',
}: StatsCardProps) {
  /**
   * Get trend icon based on direction
   */
  const getTrendIcon = () => {
    switch (trend?.direction) {
      case 'up':
        return TrendingUp
      case 'down':
        return TrendingDown
      case 'neutral':
      default:
        return Minus
    }
  }

  /**
   * Get trend color classes based on direction
   */
  const getTrendColor = () => {
    switch (trend?.direction) {
      case 'up':
        return 'text-green-600 bg-green-50'
      case 'down':
        return 'text-red-600 bg-red-50'
      case 'neutral':
      default:
        return 'text-gray-600 bg-gray-50'
    }
  }

  const TrendIcon = trend ? getTrendIcon() : null
  const trendColor = trend ? getTrendColor() : ''

  return (
    <div
      className={`
        bg-white rounded-xl border border-gray-200 p-6 transition-all duration-200
        ${onClick ? 'cursor-pointer hover:shadow-lg hover:border-purple-200' : ''}
        ${className}
      `}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>

          {/* Loading State */}
          {loading && (
            <div className="flex items-center space-x-2 mt-2">
              <Loader2 className="w-5 h-5 text-purple-600 animate-spin" />
              <span className="text-sm text-gray-500">Loading...</span>
            </div>
          )}

          {/* Error State */}
          {error && !loading && (
            <div className="flex items-start space-x-2 mt-2">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm text-red-600 font-medium">Error</p>
                <p className="text-xs text-red-500 mt-1">{error}</p>
              </div>
            </div>
          )}

          {/* Value Display */}
          {!loading && !error && (
            <div className="mt-2">
              <p className="text-3xl font-bold text-gray-900">{value}</p>
            </div>
          )}
        </div>

        {/* Icon */}
        {Icon && (
          <div className="flex-shrink-0 ml-4">
            <div className="w-12 h-12 bg-purple-50 rounded-lg flex items-center justify-center">
              <Icon className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        )}
      </div>

      {/* Trend Indicator */}
      {trend && !loading && !error && (
        <div className="flex items-center">
          <div className={`flex items-center space-x-1 px-2 py-1 rounded-full ${trendColor}`}>
            {TrendIcon && <TrendIcon className="w-3 h-3" />}
            <span className="text-xs font-semibold">
              {trend.value > 0 ? '+' : ''}
              {trend.value}%
            </span>
          </div>
          {trend.label && (
            <span className="ml-2 text-xs text-gray-500">{trend.label}</span>
          )}
        </div>
      )}
    </div>
  )
}
