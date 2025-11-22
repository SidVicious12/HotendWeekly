'use client'

import { useState, useEffect } from 'react'
import {
  BarChart3,
  TrendingUp,
  Users,
  DollarSign,
  Activity,
  Download,
  Calendar,
  Wrench,
} from 'lucide-react'
import StatsCard from '@/components/admin/StatsCard'
import UserGrowthChart from '@/components/admin/analytics/UserGrowthChart'
import RevenueChart from '@/components/admin/analytics/RevenueChart'
import ToolUsageChart from '@/components/admin/analytics/ToolUsageChart'
import GeographicDistribution from '@/components/admin/analytics/GeographicDistribution'
import TopToolsTable from '@/components/admin/analytics/TopToolsTable'
import UserEngagementMetrics from '@/components/admin/analytics/UserEngagementMetrics'

/**
 * Time range options for analytics
 */
type TimeRange = '7d' | '30d' | '90d' | '1y' | 'all'

/**
 * Analytics data interface
 */
interface AnalyticsData {
  totalUsers: number
  activeUsers: number
  totalRevenue: number
  averageRevenue: number
  toolUsage: number
  conversionRate: number
  userGrowth: number
  revenueGrowth: number
}

/**
 * AdminAnalytics Component
 *
 * Comprehensive analytics dashboard with:
 * - Key metrics and KPIs
 * - User growth charts
 * - Revenue analytics
 * - Tool usage statistics
 * - Geographic distribution
 * - Engagement metrics
 * - Time range filters
 * - Export functionality
 */
export default function AdminAnalytics() {
  const [timeRange, setTimeRange] = useState<TimeRange>('30d')
  const [loading, setLoading] = useState(true)
  const [analytics, setAnalytics] = useState<AnalyticsData>({
    totalUsers: 0,
    activeUsers: 0,
    totalRevenue: 0,
    averageRevenue: 0,
    toolUsage: 0,
    conversionRate: 0,
    userGrowth: 0,
    revenueGrowth: 0,
  })

  /**
   * Load analytics data based on time range
   */
  useEffect(() => {
    const loadAnalytics = async () => {
      setLoading(true)
      try {
        const response = await fetch(`/api/admin/analytics/overview?range=${timeRange}`)
        if (response.ok) {
          const data = await response.json()
          setAnalytics(data)
        }
      } catch (error) {
        console.error('Error loading analytics:', error)
      } finally {
        setLoading(false)
      }
    }

    loadAnalytics()
  }, [timeRange])

  /**
   * Export analytics data
   */
  const handleExport = async () => {
    try {
      const response = await fetch(`/api/admin/analytics/export?range=${timeRange}`)
      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `analytics-${timeRange}-${new Date().toISOString().split('T')[0]}.csv`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
      }
    } catch (error) {
      console.error('Error exporting analytics:', error)
    }
  }

  /**
   * Time range options
   */
  const timeRangeOptions: { value: TimeRange; label: string }[] = [
    { value: '7d', label: 'Last 7 Days' },
    { value: '30d', label: 'Last 30 Days' },
    { value: '90d', label: 'Last 90 Days' },
    { value: '1y', label: 'Last Year' },
    { value: 'all', label: 'All Time' },
  ]

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Analytics Dashboard</h1>
          <p className="text-gray-600">
            Track platform performance, user behavior, and revenue metrics
          </p>
        </div>
        <button
          onClick={handleExport}
          className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
        >
          <Download className="w-4 h-4" />
          <span>Export Data</span>
        </button>
      </div>

      {/* Time Range Filter */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6">
        <div className="flex items-center space-x-2">
          <Calendar className="w-5 h-5 text-gray-400" />
          <span className="text-sm font-medium text-gray-700">Time Range:</span>
          <div className="flex space-x-2">
            {timeRangeOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => setTimeRange(option.value)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  timeRange === option.value
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatsCard
          title="Total Users"
          value={analytics.totalUsers.toLocaleString()}
          icon={Users}
          trend={{
            value: analytics.userGrowth,
            direction: analytics.userGrowth >= 0 ? 'up' : 'down',
            label: 'vs previous period',
          }}
          loading={loading}
        />
        <StatsCard
          title="Active Users"
          value={analytics.activeUsers.toLocaleString()}
          icon={Activity}
          trend={{
            value: ((analytics.activeUsers / analytics.totalUsers) * 100) || 0,
            direction: 'neutral',
            label: 'engagement rate',
          }}
          loading={loading}
        />
        <StatsCard
          title="Total Revenue"
          value={`$${analytics.totalRevenue.toLocaleString()}`}
          icon={DollarSign}
          trend={{
            value: analytics.revenueGrowth,
            direction: analytics.revenueGrowth >= 0 ? 'up' : 'down',
            label: 'vs previous period',
          }}
          loading={loading}
        />
        <StatsCard
          title="Avg Revenue/User"
          value={`$${analytics.averageRevenue.toFixed(2)}`}
          icon={TrendingUp}
          trend={{
            value: analytics.conversionRate,
            direction: 'neutral',
            label: 'conversion rate',
          }}
          loading={loading}
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* User Growth Chart */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">User Growth</h2>
            <Users className="w-5 h-5 text-gray-400" />
          </div>
          <UserGrowthChart timeRange={timeRange} />
        </div>

        {/* Revenue Chart */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Revenue Trends</h2>
            <DollarSign className="w-5 h-5 text-gray-400" />
          </div>
          <RevenueChart timeRange={timeRange} />
        </div>
      </div>

      {/* Tool Usage & Geographic Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Tool Usage Chart */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Tool Usage</h2>
            <Wrench className="w-5 h-5 text-gray-400" />
          </div>
          <ToolUsageChart timeRange={timeRange} />
        </div>

        {/* Geographic Distribution */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Geographic Distribution</h2>
            <BarChart3 className="w-5 h-5 text-gray-400" />
          </div>
          <GeographicDistribution timeRange={timeRange} />
        </div>
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Tools Table */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Top Performing Tools</h2>
          <TopToolsTable timeRange={timeRange} />
        </div>

        {/* User Engagement Metrics */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">User Engagement</h2>
          <UserEngagementMetrics timeRange={timeRange} />
        </div>
      </div>
    </div>
  )
}
