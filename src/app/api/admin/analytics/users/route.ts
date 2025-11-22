/**
 * Admin User Analytics API Endpoint
 *
 * Provides detailed user analytics including:
 * - User growth over time (daily, weekly, monthly)
 * - User retention metrics
 * - Cohort analysis
 * - Active vs inactive users
 * - User distribution by tier
 *
 * @route GET /api/admin/analytics/users
 * @access Admin only
 */

import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin, checkUserRole } from '@/middleware/admin'
import { createServerClient } from '@/lib/supabase-server'
import { createAuditLog } from '@/lib/admin'

export interface UserAnalytics {
  // Growth over time
  growth: {
    daily: Array<{ date: string; count: number }>
    weekly: Array<{ week: string; count: number }>
    monthly: Array<{ month: string; count: number }>
  }

  // Retention metrics
  retention: {
    day1: number // Percentage
    day7: number
    day30: number
    cohortRetention: Array<{
      cohort: string
      size: number
      retained: number
      retentionRate: number
    }>
  }

  // User activity
  activity: {
    active: number
    inactive: number
    activeRate: number
    averageSessionsPerUser: number
    averageToolUsagePerUser: number
  }

  // User distribution
  distribution: {
    byTier: Record<string, number>
    byRole: Record<string, number>
    byStatus: Record<string, number>
  }

  // Engagement metrics
  engagement: {
    highlyActive: number // >10 uses/month
    moderatelyActive: number // 3-10 uses/month
    lightlyActive: number // 1-2 uses/month
    inactive: number // 0 uses this month
  }
}

/**
 * GET handler for user analytics
 * Supports query parameters:
 * - period: 7d, 30d, 90d, 1y (default: 30d)
 * - granularity: daily, weekly, monthly (default: daily)
 */
export async function GET(request: NextRequest) {
  try {
    // Check admin authentication
    const authError = await requireAdmin(request)
    if (authError) return authError

    const supabase = createServerClient()
    const { userId } = await checkUserRole()

    // Parse query parameters
    const { searchParams } = new URL(request.url)
    const period = searchParams.get('period') || '30d'
    const granularity = searchParams.get('granularity') || 'daily'

    // Calculate date range
    const endDate = new Date()
    const startDate = new Date()

    switch (period) {
      case '7d':
        startDate.setDate(startDate.getDate() - 7)
        break
      case '90d':
        startDate.setDate(startDate.getDate() - 90)
        break
      case '1y':
        startDate.setFullYear(startDate.getFullYear() - 1)
        break
      case '30d':
      default:
        startDate.setDate(startDate.getDate() - 30)
    }

    // Get user growth data
    const { data: allUsers } = await supabase
      .from('user_profiles')
      .select('created_at, subscription_tier_id, role, last_login_at')
      .gte('created_at', startDate.toISOString())
      .order('created_at', { ascending: true })

    // Calculate growth by granularity
    const growthDaily: Array<{ date: string; count: number }> = []
    const growthWeekly: Array<{ week: string; count: number }> = []
    const growthMonthly: Array<{ month: string; count: number }> = []

    const dailyMap = new Map<string, number>()
    const weeklyMap = new Map<string, number>()
    const monthlyMap = new Map<string, number>()

    allUsers?.forEach(user => {
      const date = new Date(user.created_at)
      const dateStr = date.toISOString().split('T')[0]

      // Daily
      dailyMap.set(dateStr, (dailyMap.get(dateStr) || 0) + 1)

      // Weekly (ISO week)
      const weekStr = `${date.getFullYear()}-W${Math.ceil((date.getDate() + date.getDay()) / 7)}`
      weeklyMap.set(weekStr, (weeklyMap.get(weekStr) || 0) + 1)

      // Monthly
      const monthStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
      monthlyMap.set(monthStr, (monthlyMap.get(monthStr) || 0) + 1)
    })

    dailyMap.forEach((count, date) => {
      growthDaily.push({ date, count })
    })

    weeklyMap.forEach((count, week) => {
      growthWeekly.push({ week, count })
    })

    monthlyMap.forEach((count, month) => {
      growthMonthly.push({ month, count })
    })

    // Get total user counts for various metrics
    const { count: totalUsers } = await supabase
      .from('user_profiles')
      .select('*', { count: 'exact', head: true })

    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    const { count: activeUsers } = await supabase
      .from('user_profiles')
      .select('*', { count: 'exact', head: true })
      .gte('last_login_at', thirtyDaysAgo.toISOString())

    // Get user distribution by tier
    const { data: tierData } = await supabase
      .from('user_subscription_details')
      .select('tier_slug')

    const byTier: Record<string, number> = {}
    tierData?.forEach(user => {
      const tier = user.tier_slug || 'none'
      byTier[tier] = (byTier[tier] || 0) + 1
    })

    // Get user distribution by role
    const { data: roleData } = await supabase
      .from('user_profiles')
      .select('role')

    const byRole: Record<string, number> = {}
    roleData?.forEach(user => {
      const role = user.role || 'user'
      byRole[role] = (byRole[role] || 0) + 1
    })

    // Get user distribution by subscription status
    const { data: statusData } = await supabase
      .from('user_profiles')
      .select('subscription_status')

    const byStatus: Record<string, number> = {}
    statusData?.forEach(user => {
      const status = user.subscription_status || 'inactive'
      byStatus[status] = (byStatus[status] || 0) + 1
    })

    // Get engagement metrics (tool usage per user this month)
    const monthAgo = new Date()
    monthAgo.setDate(monthAgo.getDate() - 30)

    const { data: toolUsage } = await supabase
      .from('tool_usage')
      .select('user_id')
      .gte('created_at', monthAgo.toISOString())

    const usageByUser = new Map<string, number>()
    toolUsage?.forEach(usage => {
      usageByUser.set(usage.user_id, (usageByUser.get(usage.user_id) || 0) + 1)
    })

    let highlyActive = 0
    let moderatelyActive = 0
    let lightlyActive = 0

    usageByUser.forEach(count => {
      if (count > 10) highlyActive++
      else if (count >= 3) moderatelyActive++
      else lightlyActive++
    })

    const inactive = (totalUsers || 0) - usageByUser.size

    // Calculate retention (simplified - actual cohort analysis would be more complex)
    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

    const oneDayAgo = new Date()
    oneDayAgo.setDate(oneDayAgo.getDate() - 1)

    const { count: day1Retained } = await supabase
      .from('user_profiles')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', oneDayAgo.toISOString())
      .not('last_login_at', 'is', null)

    const { count: day7Retained } = await supabase
      .from('user_profiles')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', sevenDaysAgo.toISOString())
      .lt('created_at', oneDayAgo.toISOString())
      .gte('last_login_at', sevenDaysAgo.toISOString())

    const { count: day30Retained } = await supabase
      .from('user_profiles')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', thirtyDaysAgo.toISOString())
      .lt('created_at', sevenDaysAgo.toISOString())
      .gte('last_login_at', thirtyDaysAgo.toISOString())

    const { count: day1Total } = await supabase
      .from('user_profiles')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', oneDayAgo.toISOString())

    const { count: day7Total } = await supabase
      .from('user_profiles')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', sevenDaysAgo.toISOString())
      .lt('created_at', oneDayAgo.toISOString())

    const { count: day30Total } = await supabase
      .from('user_profiles')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', thirtyDaysAgo.toISOString())
      .lt('created_at', sevenDaysAgo.toISOString())

    // Build analytics response
    const analytics: UserAnalytics = {
      growth: {
        daily: growthDaily.sort((a, b) => a.date.localeCompare(b.date)),
        weekly: growthWeekly.sort((a, b) => a.week.localeCompare(b.week)),
        monthly: growthMonthly.sort((a, b) => a.month.localeCompare(b.month))
      },

      retention: {
        day1: day1Total ? Math.round(((day1Retained || 0) / day1Total) * 100) : 0,
        day7: day7Total ? Math.round(((day7Retained || 0) / day7Total) * 100) : 0,
        day30: day30Total ? Math.round(((day30Retained || 0) / day30Total) * 100) : 0,
        cohortRetention: [] // TODO: Implement detailed cohort analysis
      },

      activity: {
        active: activeUsers || 0,
        inactive: (totalUsers || 0) - (activeUsers || 0),
        activeRate: totalUsers ? Math.round(((activeUsers || 0) / totalUsers) * 100) : 0,
        averageSessionsPerUser: 0, // TODO: Calculate from login logs
        averageToolUsagePerUser: totalUsers ? Math.round((toolUsage?.length || 0) / totalUsers) : 0
      },

      distribution: {
        byTier,
        byRole,
        byStatus
      },

      engagement: {
        highlyActive,
        moderatelyActive,
        lightlyActive,
        inactive
      }
    }

    // Create audit log
    if (userId) {
      await createAuditLog({
        user_id: userId,
        action: 'admin.login',
        resource_type: 'analytics',
        resource_id: 'users',
        details: {
          endpoint: '/api/admin/analytics/users',
          period,
          granularity
        }
      })
    }

    return NextResponse.json({
      success: true,
      data: analytics,
      params: { period, granularity },
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('Error fetching user analytics:', error)

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch user analytics',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
