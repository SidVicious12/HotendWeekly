/**
 * Admin Revenue Analytics API Endpoint
 *
 * Provides detailed revenue analytics including:
 * - Revenue over time (daily, monthly, yearly)
 * - MRR (Monthly Recurring Revenue)
 * - ARR (Annual Recurring Revenue)
 * - Revenue by tier
 * - Churn rate
 * - Customer Lifetime Value (LTV)
 *
 * @route GET /api/admin/analytics/revenue
 * @access Admin only
 */

import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin, checkUserRole } from '@/middleware/admin'
import { createServerClient } from '@/lib/supabase-server'
import { createAuditLog } from '@/lib/admin'

export interface RevenueAnalytics {
  // Current metrics
  current: {
    mrr: number // Monthly Recurring Revenue
    arr: number // Annual Recurring Revenue
    totalRevenue: number
    averageRevenuePerUser: number
  }

  // Revenue over time
  timeline: {
    daily: Array<{ date: string; revenue: number; subscriptions: number }>
    monthly: Array<{ month: string; revenue: number; mrr: number; subscriptions: number }>
    yearly: Array<{ year: string; revenue: number; arr: number; subscriptions: number }>
  }

  // Revenue by tier
  byTier: {
    tinkerer: { revenue: number; subscribers: number; percentage: number }
    creator: { revenue: number; subscribers: number; percentage: number }
    professional: { revenue: number; subscribers: number; percentage: number }
  }

  // Churn metrics
  churn: {
    rate: number // Monthly churn rate as percentage
    canceledThisMonth: number
    canceledLastMonth: number
    revenueChurn: number // Revenue lost to churn
  }

  // Growth metrics
  growth: {
    mrrGrowth: number // Month-over-month MRR growth percentage
    arrGrowth: number // Year-over-year ARR growth percentage
    newMrr: number // New MRR this month
    expansionMrr: number // MRR from upgrades
    contractionMrr: number // MRR from downgrades
  }

  // Customer metrics
  customer: {
    lifetimeValue: number // Average LTV
    acquisitionCost: number // Average CAC (if available)
    paybackPeriod: number // Months to recover CAC
  }
}

/**
 * GET handler for revenue analytics
 * Supports query parameters:
 * - period: 30d, 90d, 1y, all (default: 90d)
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
    const period = searchParams.get('period') || '90d'

    // Calculate date range
    const endDate = new Date()
    const startDate = new Date()

    switch (period) {
      case '30d':
        startDate.setDate(startDate.getDate() - 30)
        break
      case '1y':
        startDate.setFullYear(startDate.getFullYear() - 1)
        break
      case '90d':
      default:
        startDate.setDate(startDate.getDate() - 90)
    }

    // Get active subscriptions with tier information
    const { data: activeSubscriptions } = await supabase
      .from('user_profiles')
      .select(`
        id,
        billing_cycle,
        subscription_tier_id,
        subscription_status,
        subscription_start_date,
        subscription_tiers (
          name,
          slug,
          price_monthly,
          price_yearly
        )
      `)
      .eq('subscription_status', 'active')

    // Calculate current MRR and ARR
    let currentMrr = 0
    let currentArr = 0
    const tierRevenue: Record<string, { revenue: number; subscribers: number }> = {
      tinkerer: { revenue: 0, subscribers: 0 },
      creator: { revenue: 0, subscribers: 0 },
      professional: { revenue: 0, subscribers: 0 }
    }

    activeSubscriptions?.forEach((sub: any) => {
      const tier = sub.subscription_tiers
      if (!tier) return

      const tierSlug = tier.slug as string
      const priceMonthly = Number(tier.price_monthly) || 0
      const priceYearly = Number(tier.price_yearly) || 0

      if (sub.billing_cycle === 'monthly') {
        currentMrr += priceMonthly
        if (tierSlug in tierRevenue) {
          tierRevenue[tierSlug].revenue += priceMonthly
          tierRevenue[tierSlug].subscribers++
        }
      } else if (sub.billing_cycle === 'yearly') {
        const monthlyEquivalent = priceYearly / 12
        currentMrr += monthlyEquivalent
        if (tierSlug in tierRevenue) {
          tierRevenue[tierSlug].revenue += monthlyEquivalent
          tierRevenue[tierSlug].subscribers++
        }
      }
    })

    currentArr = currentMrr * 12

    // Calculate total revenue percentage by tier
    const totalRevenue = currentMrr
    const byTier = {
      tinkerer: {
        ...tierRevenue.tinkerer,
        percentage: totalRevenue > 0 ? Math.round((tierRevenue.tinkerer.revenue / totalRevenue) * 100) : 0
      },
      creator: {
        ...tierRevenue.creator,
        percentage: totalRevenue > 0 ? Math.round((tierRevenue.creator.revenue / totalRevenue) * 100) : 0
      },
      professional: {
        ...tierRevenue.professional,
        percentage: totalRevenue > 0 ? Math.round((tierRevenue.professional.revenue / totalRevenue) * 100) : 0
      }
    }

    // Get subscription history for timeline and churn analysis
    const { data: subscriptionHistory } = await supabase
      .from('subscription_history')
      .select('*')
      .gte('created_at', startDate.toISOString())
      .order('created_at', { ascending: true })

    // Build monthly timeline
    const monthlyMap = new Map<string, { revenue: number; mrr: number; subscriptions: number }>()

    subscriptionHistory?.forEach(event => {
      const date = new Date(event.created_at)
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`

      if (!monthlyMap.has(monthKey)) {
        monthlyMap.set(monthKey, { revenue: 0, mrr: 0, subscriptions: 0 })
      }

      const monthData = monthlyMap.get(monthKey)!

      if (event.action === 'created' || event.action === 'renewed' || event.action === 'upgraded') {
        monthData.revenue += Number(event.amount_paid) || 0
        monthData.subscriptions++
      }
    })

    const monthlyTimeline = Array.from(monthlyMap.entries()).map(([month, data]) => ({
      month,
      revenue: data.revenue,
      mrr: data.mrr,
      subscriptions: data.subscriptions
    }))

    // Calculate churn
    const thisMonth = new Date()
    thisMonth.setDate(1)
    thisMonth.setHours(0, 0, 0, 0)

    const lastMonth = new Date(thisMonth)
    lastMonth.setMonth(lastMonth.getMonth() - 1)

    const { count: canceledThisMonth } = await supabase
      .from('subscription_history')
      .select('*', { count: 'exact', head: true })
      .eq('action', 'canceled')
      .gte('created_at', thisMonth.toISOString())

    const { count: canceledLastMonth } = await supabase
      .from('subscription_history')
      .select('*', { count: 'exact', head: true })
      .eq('action', 'canceled')
      .gte('created_at', lastMonth.toISOString())
      .lt('created_at', thisMonth.toISOString())

    const { count: totalActiveLastMonth } = await supabase
      .from('subscription_history')
      .select('*', { count: 'exact', head: true })
      .in('action', ['created', 'renewed', 'upgraded'])
      .lt('created_at', thisMonth.toISOString())

    const churnRate = totalActiveLastMonth
      ? Math.round(((canceledThisMonth || 0) / totalActiveLastMonth) * 100 * 100) / 100
      : 0

    // Calculate MRR growth (simplified)
    const previousMrr = monthlyTimeline.length > 1
      ? monthlyTimeline[monthlyTimeline.length - 2].mrr
      : 0

    const mrrGrowth = previousMrr > 0
      ? Math.round(((currentMrr - previousMrr) / previousMrr) * 100 * 100) / 100
      : 0

    // Calculate average revenue per user
    const { count: totalUsers } = await supabase
      .from('user_profiles')
      .select('*', { count: 'exact', head: true })
      .eq('subscription_status', 'active')

    const averageRevenuePerUser = totalUsers
      ? Math.round((currentMrr / totalUsers) * 100) / 100
      : 0

    // Calculate Customer Lifetime Value (simplified)
    // LTV = Average Revenue Per User / Churn Rate
    const lifetimeValue = churnRate > 0
      ? Math.round((averageRevenuePerUser / (churnRate / 100)) * 100) / 100
      : 0

    // Build analytics response
    const analytics: RevenueAnalytics = {
      current: {
        mrr: Math.round(currentMrr * 100) / 100,
        arr: Math.round(currentArr * 100) / 100,
        totalRevenue: Math.round(currentMrr * 100) / 100,
        averageRevenuePerUser
      },

      timeline: {
        daily: [], // TODO: Implement daily breakdown
        monthly: monthlyTimeline,
        yearly: [] // TODO: Implement yearly breakdown
      },

      byTier,

      churn: {
        rate: churnRate,
        canceledThisMonth: canceledThisMonth || 0,
        canceledLastMonth: canceledLastMonth || 0,
        revenueChurn: 0 // TODO: Calculate revenue lost to churn
      },

      growth: {
        mrrGrowth,
        arrGrowth: 0, // TODO: Calculate year-over-year ARR growth
        newMrr: 0, // TODO: Calculate new MRR from new subscriptions
        expansionMrr: 0, // TODO: Calculate MRR from upgrades
        contractionMrr: 0 // TODO: Calculate MRR from downgrades
      },

      customer: {
        lifetimeValue,
        acquisitionCost: 0, // TODO: Integrate marketing data
        paybackPeriod: 0 // TODO: Calculate CAC payback period
      }
    }

    // Create audit log
    if (userId) {
      await createAuditLog({
        user_id: userId,
        action: 'admin.login',
        resource_type: 'analytics',
        resource_id: 'revenue',
        details: {
          endpoint: '/api/admin/analytics/revenue',
          period
        }
      })
    }

    return NextResponse.json({
      success: true,
      data: analytics,
      params: { period },
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('Error fetching revenue analytics:', error)

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch revenue analytics',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
