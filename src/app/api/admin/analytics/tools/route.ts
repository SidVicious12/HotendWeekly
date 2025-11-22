/**
 * Admin Tool Usage Analytics API Endpoint
 *
 * Provides detailed tool usage analytics including:
 * - Most popular tools
 * - Usage trends over time
 * - Tool usage by tier
 * - Performance metrics (processing time, error rates)
 * - Tool adoption and retention
 *
 * @route GET /api/admin/analytics/tools
 * @access Admin only
 */

import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin, checkUserRole } from '@/middleware/admin'
import { createServerClient } from '@/lib/supabase-server'
import { createAuditLog } from '@/lib/admin'

export interface ToolAnalytics {
  // Overall statistics
  overview: {
    totalUsage: number
    uniqueUsers: number
    averageUsagePerUser: number
    totalTools: number
  }

  // Popular tools
  popular: Array<{
    toolName: string
    usageCount: number
    uniqueUsers: number
    successRate: number
    averageProcessingTime: number
  }>

  // Usage trends over time
  trends: {
    daily: Array<{ date: string; usage: number; uniqueUsers: number }>
    weekly: Array<{ week: string; usage: number; uniqueUsers: number }>
    monthly: Array<{ month: string; usage: number; uniqueUsers: number }>
  }

  // Usage by subscription tier
  byTier: {
    tinkerer: { usage: number; users: number; averagePerUser: number }
    creator: { usage: number; users: number; averagePerUser: number }
    professional: { usage: number; users: number; averagePerUser: number }
  }

  // Performance metrics
  performance: {
    averageProcessingTime: number
    medianProcessingTime: number
    p95ProcessingTime: number
    p99ProcessingTime: number
    successRate: number
    errorRate: number
    rateLimitRate: number
  }

  // Tool-specific metrics
  byTool: Record<string, {
    usage: number
    uniqueUsers: number
    successRate: number
    errorRate: number
    averageProcessingTime: number
    trend: 'up' | 'down' | 'stable'
  }>

  // Error analysis
  errors: {
    total: number
    byType: Record<string, number>
    topErrors: Array<{ tool: string; count: number; lastOccurred: string }>
  }
}

/**
 * GET handler for tool usage analytics
 * Supports query parameters:
 * - period: 7d, 30d, 90d (default: 30d)
 * - tool: filter by specific tool name
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
    const toolFilter = searchParams.get('tool')

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
      case '30d':
      default:
        startDate.setDate(startDate.getDate() - 30)
    }

    // Build query for tool usage
    let query = supabase
      .from('tool_usage')
      .select('*')
      .gte('created_at', startDate.toISOString())

    if (toolFilter) {
      query = query.eq('tool_name', toolFilter)
    }

    const { data: toolUsage } = await query.order('created_at', { ascending: true })

    // Calculate overview statistics
    const uniqueUserSet = new Set<string>()
    const toolSet = new Set<string>()

    toolUsage?.forEach(usage => {
      uniqueUserSet.add(usage.user_id)
      toolSet.add(usage.tool_name)
    })

    const totalUsage = toolUsage?.length || 0
    const uniqueUsers = uniqueUserSet.size
    const averageUsagePerUser = uniqueUsers > 0
      ? Math.round((totalUsage / uniqueUsers) * 100) / 100
      : 0

    // Calculate popular tools
    const toolStats = new Map<string, {
      count: number
      users: Set<string>
      successes: number
      totalProcessingTime: number
      processingTimeCount: number
    }>()

    toolUsage?.forEach(usage => {
      const toolName = usage.tool_name

      if (!toolStats.has(toolName)) {
        toolStats.set(toolName, {
          count: 0,
          users: new Set(),
          successes: 0,
          totalProcessingTime: 0,
          processingTimeCount: 0
        })
      }

      const stats = toolStats.get(toolName)!
      stats.count++
      stats.users.add(usage.user_id)

      if (usage.status === 'success') {
        stats.successes++
      }

      if (usage.processing_time_ms) {
        stats.totalProcessingTime += usage.processing_time_ms
        stats.processingTimeCount++
      }
    })

    const popular = Array.from(toolStats.entries())
      .map(([toolName, stats]) => ({
        toolName,
        usageCount: stats.count,
        uniqueUsers: stats.users.size,
        successRate: stats.count > 0
          ? Math.round((stats.successes / stats.count) * 100 * 100) / 100
          : 0,
        averageProcessingTime: stats.processingTimeCount > 0
          ? Math.round((stats.totalProcessingTime / stats.processingTimeCount) * 100) / 100
          : 0
      }))
      .sort((a, b) => b.usageCount - a.usageCount)
      .slice(0, 10)

    // Calculate usage trends
    const dailyMap = new Map<string, { usage: number; users: Set<string> }>()
    const weeklyMap = new Map<string, { usage: number; users: Set<string> }>()
    const monthlyMap = new Map<string, { usage: number; users: Set<string> }>()

    toolUsage?.forEach(usage => {
      const date = new Date(usage.created_at)

      // Daily
      const dateStr = date.toISOString().split('T')[0]
      if (!dailyMap.has(dateStr)) {
        dailyMap.set(dateStr, { usage: 0, users: new Set() })
      }
      const dailyData = dailyMap.get(dateStr)!
      dailyData.usage++
      dailyData.users.add(usage.user_id)

      // Weekly
      const weekStr = `${date.getFullYear()}-W${Math.ceil((date.getDate() + date.getDay()) / 7)}`
      if (!weeklyMap.has(weekStr)) {
        weeklyMap.set(weekStr, { usage: 0, users: new Set() })
      }
      const weeklyData = weeklyMap.get(weekStr)!
      weeklyData.usage++
      weeklyData.users.add(usage.user_id)

      // Monthly
      const monthStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
      if (!monthlyMap.has(monthStr)) {
        monthlyMap.set(monthStr, { usage: 0, users: new Set() })
      }
      const monthlyData = monthlyMap.get(monthStr)!
      monthlyData.usage++
      monthlyData.users.add(usage.user_id)
    })

    const trendsDaily = Array.from(dailyMap.entries()).map(([date, data]) => ({
      date,
      usage: data.usage,
      uniqueUsers: data.users.size
    })).sort((a, b) => a.date.localeCompare(b.date))

    const trendsWeekly = Array.from(weeklyMap.entries()).map(([week, data]) => ({
      week,
      usage: data.usage,
      uniqueUsers: data.users.size
    })).sort((a, b) => a.week.localeCompare(b.week))

    const trendsMonthly = Array.from(monthlyMap.entries()).map(([month, data]) => ({
      month,
      usage: data.usage,
      uniqueUsers: data.users.size
    })).sort((a, b) => a.month.localeCompare(b.month))

    // Get usage by tier
    const { data: usageWithTier } = await supabase
      .from('tool_usage')
      .select(`
        user_id,
        profiles!inner (
          subscription_tier_id,
          subscription_tiers (
            slug
          )
        )
      `)
      .gte('created_at', startDate.toISOString())

    const tierUsage: Record<string, { usage: number; users: Set<string> }> = {
      tinkerer: { usage: 0, users: new Set() },
      creator: { usage: 0, users: new Set() },
      professional: { usage: 0, users: new Set() }
    }

    usageWithTier?.forEach((record: any) => {
      const tier = record.profiles?.subscription_tiers?.slug || 'tinkerer'
      if (tier in tierUsage) {
        tierUsage[tier].usage++
        tierUsage[tier].users.add(record.user_id)
      }
    })

    const byTier = {
      tinkerer: {
        usage: tierUsage.tinkerer.usage,
        users: tierUsage.tinkerer.users.size,
        averagePerUser: tierUsage.tinkerer.users.size > 0
          ? Math.round((tierUsage.tinkerer.usage / tierUsage.tinkerer.users.size) * 100) / 100
          : 0
      },
      creator: {
        usage: tierUsage.creator.usage,
        users: tierUsage.creator.users.size,
        averagePerUser: tierUsage.creator.users.size > 0
          ? Math.round((tierUsage.creator.usage / tierUsage.creator.users.size) * 100) / 100
          : 0
      },
      professional: {
        usage: tierUsage.professional.usage,
        users: tierUsage.professional.users.size,
        averagePerUser: tierUsage.professional.users.size > 0
          ? Math.round((tierUsage.professional.usage / tierUsage.professional.users.size) * 100) / 100
          : 0
      }
    }

    // Calculate performance metrics
    const processingTimes = toolUsage
      ?.filter(u => u.processing_time_ms)
      .map(u => u.processing_time_ms)
      .sort((a, b) => a - b) || []

    const averageProcessingTime = processingTimes.length > 0
      ? Math.round((processingTimes.reduce((sum, time) => sum + time, 0) / processingTimes.length) * 100) / 100
      : 0

    const medianProcessingTime = processingTimes.length > 0
      ? processingTimes[Math.floor(processingTimes.length / 2)]
      : 0

    const p95Index = Math.floor(processingTimes.length * 0.95)
    const p95ProcessingTime = processingTimes.length > 0
      ? processingTimes[p95Index]
      : 0

    const p99Index = Math.floor(processingTimes.length * 0.99)
    const p99ProcessingTime = processingTimes.length > 0
      ? processingTimes[p99Index]
      : 0

    const successCount = toolUsage?.filter(u => u.status === 'success').length || 0
    const errorCount = toolUsage?.filter(u => u.status === 'error' || u.status === 'failed').length || 0
    const rateLimitCount = toolUsage?.filter(u => u.status === 'rate_limited').length || 0

    const successRate = totalUsage > 0
      ? Math.round((successCount / totalUsage) * 100 * 100) / 100
      : 0

    const errorRate = totalUsage > 0
      ? Math.round((errorCount / totalUsage) * 100 * 100) / 100
      : 0

    const rateLimitRate = totalUsage > 0
      ? Math.round((rateLimitCount / totalUsage) * 100 * 100) / 100
      : 0

    // Build by-tool metrics with trends
    const byTool: Record<string, any> = {}

    toolStats.forEach((stats, toolName) => {
      // Calculate trend (simplified - compare last week vs previous week)
      const lastWeekUsage = toolUsage?.filter(u =>
        u.tool_name === toolName &&
        new Date(u.created_at) >= new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
      ).length || 0

      const previousWeekUsage = toolUsage?.filter(u =>
        u.tool_name === toolName &&
        new Date(u.created_at) >= new Date(Date.now() - 14 * 24 * 60 * 60 * 1000) &&
        new Date(u.created_at) < new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
      ).length || 0

      let trend: 'up' | 'down' | 'stable' = 'stable'
      if (lastWeekUsage > previousWeekUsage * 1.1) trend = 'up'
      else if (lastWeekUsage < previousWeekUsage * 0.9) trend = 'down'

      byTool[toolName] = {
        usage: stats.count,
        uniqueUsers: stats.users.size,
        successRate: stats.count > 0
          ? Math.round((stats.successes / stats.count) * 100 * 100) / 100
          : 0,
        errorRate: stats.count > 0
          ? Math.round(((stats.count - stats.successes) / stats.count) * 100 * 100) / 100
          : 0,
        averageProcessingTime: stats.processingTimeCount > 0
          ? Math.round((stats.totalProcessingTime / stats.processingTimeCount) * 100) / 100
          : 0,
        trend
      }
    })

    // Error analysis
    const errorsByType: Record<string, number> = {}
    const errorsByTool: Record<string, { count: number; lastOccurred: string }> = {}

    toolUsage?.forEach(usage => {
      if (usage.status === 'error' || usage.status === 'failed') {
        // By type
        const errorType = usage.status
        errorsByType[errorType] = (errorsByType[errorType] || 0) + 1

        // By tool
        const toolName = usage.tool_name
        if (!errorsByTool[toolName]) {
          errorsByTool[toolName] = { count: 0, lastOccurred: usage.created_at }
        }
        errorsByTool[toolName].count++
        errorsByTool[toolName].lastOccurred = usage.created_at
      }
    })

    const topErrors = Object.entries(errorsByTool)
      .map(([tool, data]) => ({
        tool,
        count: data.count,
        lastOccurred: data.lastOccurred
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10)

    // Build analytics response
    const analytics: ToolAnalytics = {
      overview: {
        totalUsage,
        uniqueUsers,
        averageUsagePerUser,
        totalTools: toolSet.size
      },

      popular,

      trends: {
        daily: trendsDaily,
        weekly: trendsWeekly,
        monthly: trendsMonthly
      },

      byTier,

      performance: {
        averageProcessingTime,
        medianProcessingTime,
        p95ProcessingTime,
        p99ProcessingTime,
        successRate,
        errorRate,
        rateLimitRate
      },

      byTool,

      errors: {
        total: errorCount,
        byType: errorsByType,
        topErrors
      }
    }

    // Create audit log
    if (userId) {
      await createAuditLog({
        user_id: userId,
        action: 'admin.login',
        resource_type: 'analytics',
        resource_id: 'tools',
        details: {
          endpoint: '/api/admin/analytics/tools',
          period,
          toolFilter
        }
      })
    }

    return NextResponse.json({
      success: true,
      data: analytics,
      params: { period, tool: toolFilter },
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('Error fetching tool analytics:', error)

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch tool analytics',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
