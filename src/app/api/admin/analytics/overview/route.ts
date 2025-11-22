/**
 * Admin Analytics Overview API Endpoint
 *
 * Provides comprehensive platform statistics including:
 * - User metrics (total, active, new)
 * - Subscription distribution by tier
 * - Revenue metrics (monthly, yearly)
 * - Tool usage statistics
 * - Growth metrics
 *
 * @route GET /api/admin/analytics/overview
 * @access Admin only
 */

import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin, checkUserRole } from '@/middleware/admin'
import { createServerClient } from '@/lib/supabase-server'
import { createAuditLog } from '@/lib/admin'

export interface OverviewAnalytics {
  // User Metrics
  totalUsers: number
  activeUsers: number // Last 30 days
  newUsers: number // Last 7 days
  inactiveUsers: number

  // Subscription Metrics
  subscriptionsByTier: {
    tinkerer: number
    creator: number
    professional: number
    none: number
  }

  // Revenue Metrics
  revenue: {
    monthly: number
    yearly: number
    mrr: number // Monthly Recurring Revenue
    arr: number // Annual Recurring Revenue
  }

  // Tool Usage Metrics
  toolUsage: {
    total: number
    today: number
    thisWeek: number
    thisMonth: number
    byTool: Record<string, number>
  }

  // Growth Metrics
  growth: {
    userGrowthRate: number // Percentage
    revenueGrowthRate: number // Percentage
    activeUserRate: number // Percentage of total
  }
}

/**
 * GET handler for platform overview analytics
 * Returns comprehensive platform statistics
 */
export async function GET(request: NextRequest) {
  try {
    // Check admin authentication
    const authError = await requireAdmin(request)
    if (authError) return authError

    const supabase = createServerClient()
    const { userId } = await checkUserRole()

    // Get total users
    const { count: totalUsers } = await supabase
      .from('user_profiles')
      .select('*', { count: 'exact', head: true })

    // Get active users (last 30 days)
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    const { count: activeUsers } = await supabase
      .from('user_profiles')
      .select('*', { count: 'exact', head: true })
      .gte('last_login_at', thirtyDaysAgo.toISOString())

    // Get new users (last 7 days)
    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

    const { count: newUsers } = await supabase
      .from('user_profiles')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', sevenDaysAgo.toISOString())

    // Get subscription distribution
    const { data: subscriptionData } = await supabase
      .from('user_subscription_details')
      .select('tier_slug')

    const subscriptionsByTier = {
      tinkerer: 0,
      creator: 0,
      professional: 0,
      none: 0
    }

    subscriptionData?.forEach((sub) => {
      const tier = sub.tier_slug || 'none'
      if (tier in subscriptionsByTier) {
        subscriptionsByTier[tier as keyof typeof subscriptionsByTier]++
      } else {
        subscriptionsByTier.none++
      }
    })

    // Get revenue metrics
    const { data: subscriptions } = await supabase
      .from('user_profiles')
      .select(`
        billing_cycle,
        subscription_tier_id,
        subscription_status,
        subscription_tiers (
          price_monthly,
          price_yearly
        )
      `)
      .eq('subscription_status', 'active')

    let monthlyRevenue = 0
    let yearlyRevenue = 0

    subscriptions?.forEach((sub: any) => {
      const tier = sub.subscription_tiers
      if (!tier) return

      if (sub.billing_cycle === 'monthly') {
        monthlyRevenue += Number(tier.price_monthly) || 0
      } else if (sub.billing_cycle === 'yearly') {
        yearlyRevenue += Number(tier.price_yearly) || 0
        monthlyRevenue += (Number(tier.price_yearly) || 0) / 12
      }
    })

    const mrr = monthlyRevenue
    const arr = mrr * 12

    // Get tool usage statistics
    const { count: totalToolUsage } = await supabase
      .from('tool_usage')
      .select('*', { count: 'exact', head: true })

    // Today's usage
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const { count: todayUsage } = await supabase
      .from('tool_usage')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', today.toISOString())

    // This week's usage
    const weekAgo = new Date()
    weekAgo.setDate(weekAgo.getDate() - 7)

    const { count: weekUsage } = await supabase
      .from('tool_usage')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', weekAgo.toISOString())

    // This month's usage
    const monthAgo = new Date()
    monthAgo.setDate(monthAgo.getDate() - 30)

    const { count: monthUsage } = await supabase
      .from('tool_usage')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', monthAgo.toISOString())

    // Tool usage by tool
    const { data: toolUsageData } = await supabase
      .from('tool_usage')
      .select('tool_name')

    const byTool: Record<string, number> = {}
    toolUsageData?.forEach((usage) => {
      const tool = usage.tool_name
      byTool[tool] = (byTool[tool] || 0) + 1
    })

    // Calculate growth metrics
    const twoMonthsAgo = new Date()
    twoMonthsAgo.setDate(twoMonthsAgo.getDate() - 60)

    const { count: previousMonthUsers } = await supabase
      .from('user_profiles')
      .select('*', { count: 'exact', head: true })
      .lt('created_at', monthAgo.toISOString())

    const currentMonthUsers = (totalUsers || 0) - (previousMonthUsers || 0)
    const userGrowthRate = previousMonthUsers
      ? ((currentMonthUsers / previousMonthUsers) * 100)
      : 0

    const activeUserRate = totalUsers
      ? ((activeUsers || 0) / totalUsers) * 100
      : 0

    // Build analytics response
    const analytics: OverviewAnalytics = {
      totalUsers: totalUsers || 0,
      activeUsers: activeUsers || 0,
      newUsers: newUsers || 0,
      inactiveUsers: (totalUsers || 0) - (activeUsers || 0),

      subscriptionsByTier,

      revenue: {
        monthly: monthlyRevenue,
        yearly: yearlyRevenue,
        mrr,
        arr
      },

      toolUsage: {
        total: totalToolUsage || 0,
        today: todayUsage || 0,
        thisWeek: weekUsage || 0,
        thisMonth: monthUsage || 0,
        byTool
      },

      growth: {
        userGrowthRate: Math.round(userGrowthRate * 100) / 100,
        revenueGrowthRate: 0, // TODO: Calculate from subscription_history
        activeUserRate: Math.round(activeUserRate * 100) / 100
      }
    }

    // Create audit log
    if (userId) {
      await createAuditLog({
        user_id: userId,
        action: 'admin.login',
        resource_type: 'analytics',
        resource_id: 'overview',
        details: { endpoint: '/api/admin/analytics/overview' }
      })
    }

    return NextResponse.json({
      success: true,
      data: analytics,
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('Error fetching analytics overview:', error)

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch analytics',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
