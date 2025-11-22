'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'
import StatsCard from '@/components/admin/StatsCard'
import {
  Users,
  DollarSign,
  Activity,
  TrendingUp,
  ArrowRight,
  Wrench,
  BarChart3,
  FileText,
  Clock,
} from 'lucide-react'

/**
 * Activity item interface
 */
interface ActivityItem {
  id: string
  type: 'user' | 'payment' | 'tool' | 'system'
  message: string
  timestamp: Date
  icon: React.ComponentType<{ className?: string }>
}

/**
 * Quick action interface
 */
interface QuickAction {
  title: string
  description: string
  href: string
  icon: React.ComponentType<{ className?: string }>
  color: string
}

/**
 * AdminDashboard Component
 *
 * Admin dashboard home page with:
 * - Welcome message with user name
 * - Quick stats cards (users, revenue, usage)
 * - Recent activity feed
 * - Quick action buttons
 * - Links to main sections
 *
 * Features:
 * - Loading states for stats
 * - Real-time activity updates
 * - Responsive grid layout
 * - Role-based content
 */
export default function AdminDashboard() {
  const { profile } = useAuth()
  const [statsLoading, setStatsLoading] = useState(true)

  // Simulated stats data - replace with actual API calls
  const [stats, setStats] = useState({
    totalUsers: 0,
    monthlyRevenue: 0,
    activeTools: 0,
    totalUsage: 0,
  })

  /**
   * Load dashboard statistics
   */
  useEffect(() => {
    const loadStats = async () => {
      setStatsLoading(true)
      try {
        // TODO: Replace with actual API calls
        // Simulated data for now
        await new Promise((resolve) => setTimeout(resolve, 1000))
        setStats({
          totalUsers: 1234,
          monthlyRevenue: 45678,
          activeTools: 6,
          totalUsage: 8956,
        })
      } catch (error) {
        console.error('Error loading stats:', error)
      } finally {
        setStatsLoading(false)
      }
    }

    loadStats()
  }, [])

  /**
   * Quick actions for common admin tasks
   */
  const quickActions: QuickAction[] = [
    {
      title: 'Manage Users',
      description: 'View and manage user accounts',
      href: '/admin/users',
      icon: Users,
      color: 'from-blue-500 to-blue-600',
    },
    {
      title: 'View Analytics',
      description: 'Check platform analytics',
      href: '/admin/analytics',
      icon: BarChart3,
      color: 'from-purple-500 to-purple-600',
    },
    {
      title: 'Revenue Reports',
      description: 'View revenue and subscriptions',
      href: '/admin/revenue',
      icon: DollarSign,
      color: 'from-green-500 to-green-600',
    },
    {
      title: 'Tool Management',
      description: 'Configure platform tools',
      href: '/admin/tools',
      icon: Wrench,
      color: 'from-orange-500 to-orange-600',
    },
  ]

  /**
   * Recent activity items - replace with actual data
   */
  const recentActivity: ActivityItem[] = [
    {
      id: '1',
      type: 'user',
      message: 'New user registered: john@example.com',
      timestamp: new Date(Date.now() - 1000 * 60 * 5),
      icon: Users,
    },
    {
      id: '2',
      type: 'payment',
      message: 'New subscription: Pro Plan ($29/month)',
      timestamp: new Date(Date.now() - 1000 * 60 * 15),
      icon: DollarSign,
    },
    {
      id: '3',
      type: 'tool',
      message: 'Tool usage spike: Virtual Try-On (+45%)',
      timestamp: new Date(Date.now() - 1000 * 60 * 30),
      icon: TrendingUp,
    },
    {
      id: '4',
      type: 'user',
      message: '5 new users in the last hour',
      timestamp: new Date(Date.now() - 1000 * 60 * 60),
      icon: Users,
    },
  ]

  /**
   * Format timestamp for activity feed
   */
  const formatTimestamp = (date: Date): string => {
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / (1000 * 60))
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

    if (diffMins < 60) {
      return `${diffMins}m ago`
    } else if (diffHours < 24) {
      return `${diffHours}h ago`
    } else {
      return `${diffDays}d ago`
    }
  }

  /**
   * Get activity icon color
   */
  const getActivityColor = (type: ActivityItem['type']): string => {
    switch (type) {
      case 'user':
        return 'bg-blue-100 text-blue-600'
      case 'payment':
        return 'bg-green-100 text-green-600'
      case 'tool':
        return 'bg-purple-100 text-purple-600'
      case 'system':
        return 'bg-gray-100 text-gray-600'
      default:
        return 'bg-gray-100 text-gray-600'
    }
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Welcome back, {profile?.full_name || 'Admin'}!
        </h1>
        <p className="text-gray-600">
          Here's what's happening with your platform today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatsCard
          title="Total Users"
          value={stats.totalUsers.toLocaleString()}
          icon={Users}
          trend={{ value: 12.5, direction: 'up', label: 'vs last month' }}
          loading={statsLoading}
        />
        <StatsCard
          title="Monthly Revenue"
          value={`$${stats.monthlyRevenue.toLocaleString()}`}
          icon={DollarSign}
          trend={{ value: 8.3, direction: 'up', label: 'vs last month' }}
          loading={statsLoading}
        />
        <StatsCard
          title="Active Tools"
          value={stats.activeTools}
          icon={Wrench}
          trend={{ value: 0, direction: 'neutral', label: 'all operational' }}
          loading={statsLoading}
        />
        <StatsCard
          title="Total Usage"
          value={stats.totalUsage.toLocaleString()}
          icon={Activity}
          trend={{ value: 15.2, direction: 'up', label: 'vs last month' }}
          loading={statsLoading}
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Actions */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Quick Actions</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {quickActions.map((action) => {
                const Icon = action.icon
                return (
                  <Link
                    key={action.href}
                    href={action.href}
                    className="group p-4 rounded-xl border-2 border-gray-200 hover:border-purple-300 transition-all duration-200 hover:shadow-md"
                  >
                    <div className="flex items-start space-x-4">
                      <div
                        className={`w-12 h-12 rounded-lg bg-gradient-to-br ${action.color} flex items-center justify-center flex-shrink-0`}
                      >
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900 mb-1 group-hover:text-purple-600 transition-colors">
                          {action.title}
                        </h3>
                        <p className="text-sm text-gray-600">{action.description}</p>
                      </div>
                      <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-purple-600 transition-colors flex-shrink-0" />
                    </div>
                  </Link>
                )
              })}
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Recent Activity</h2>
              <Link
                href="/admin/audit-logs"
                className="text-sm text-purple-600 hover:text-purple-700 font-medium flex items-center space-x-1"
              >
                <span>View All</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="space-y-4">
              {recentActivity.map((item) => {
                const Icon = item.icon
                return (
                  <div key={item.id} className="flex items-start space-x-3">
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${getActivityColor(
                        item.type
                      )}`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-900">{item.message}</p>
                      <div className="flex items-center space-x-1 mt-1">
                        <Clock className="w-3 h-3 text-gray-400" />
                        <span className="text-xs text-gray-500">
                          {formatTimestamp(item.timestamp)}
                        </span>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Additional Info Section */}
      <div className="mt-6 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold mb-1">Need Help?</h3>
            <p className="text-purple-100 text-sm">
              Check out our admin documentation or contact support
            </p>
          </div>
          <Link
            href="/admin/settings"
            className="px-6 py-2 bg-white text-purple-600 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
          >
            Go to Settings
          </Link>
        </div>
      </div>
    </div>
  )
}
