import { NextRequest, NextResponse } from 'next/server'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

/**
 * Generate Report API
 * 
 * POST /api/admin/reports/generate
 * 
 * Generates a comprehensive analytics report
 * Body:
 * - reportType: 'daily' | 'weekly' | 'monthly' | 'custom'
 * - startDate: ISO date string (for custom reports)
 * - endDate: ISO date string (for custom reports)
 * - includeCharts: boolean
 * - sections: array of sections to include
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies })
    
    // Check authentication
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check admin role
    const { data: profile } = await supabase
      .from('user_profiles')
      .select('role')
      .eq('id', session.user.id)
      .single()

    if (!profile || profile.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const body = await request.json()
    const {
      reportType = 'weekly',
      startDate,
      endDate,
      sections = ['overview', 'users', 'revenue', 'tools'],
    } = body

    // Calculate date range based on report type
    const end = endDate ? new Date(endDate) : new Date()
    const start = startDate ? new Date(startDate) : new Date()

    if (!startDate) {
      switch (reportType) {
        case 'daily':
          start.setDate(end.getDate() - 1)
          break
        case 'weekly':
          start.setDate(end.getDate() - 7)
          break
        case 'monthly':
          start.setMonth(end.getMonth() - 1)
          break
      }
    }

    const report: any = {
      id: `report-${Date.now()}`,
      type: reportType,
      generatedAt: new Date().toISOString(),
      dateRange: {
        start: start.toISOString(),
        end: end.toISOString(),
      },
      sections: {},
    }

    // Overview section
    if (sections.includes('overview')) {
      const { data: totalUsers } = await supabase
        .from('user_profiles')
        .select('id', { count: 'exact' })

      const { data: newUsers } = await supabase
        .from('user_profiles')
        .select('id', { count: 'exact' })
        .gte('created_at', start.toISOString())
        .lte('created_at', end.toISOString())

      const { data: payments } = await supabase
        .from('payments')
        .select('amount')
        .eq('status', 'succeeded')
        .gte('created_at', start.toISOString())
        .lte('created_at', end.toISOString())

      const totalRevenue = payments?.reduce((sum, p) => sum + (p.amount / 100), 0) || 0

      report.sections.overview = {
        totalUsers: totalUsers?.length || 0,
        newUsers: newUsers?.length || 0,
        totalRevenue,
        averageRevenuePerUser: totalUsers?.length ? totalRevenue / totalUsers.length : 0,
      }
    }

    // Users section
    if (sections.includes('users')) {
      const { data: usersByDay } = await supabase
        .from('user_profiles')
        .select('created_at')
        .gte('created_at', start.toISOString())
        .lte('created_at', end.toISOString())
        .order('created_at', { ascending: true })

      // Group by day
      const userGrowth: { [key: string]: number } = {}
      usersByDay?.forEach((user) => {
        const date = user.created_at.split('T')[0]
        userGrowth[date] = (userGrowth[date] || 0) + 1
      })

      report.sections.users = {
        growth: userGrowth,
        totalNewUsers: usersByDay?.length || 0,
      }
    }

    // Revenue section
    if (sections.includes('revenue')) {
      const { data: payments } = await supabase
        .from('payments')
        .select('amount, payment_type, created_at')
        .eq('status', 'succeeded')
        .gte('created_at', start.toISOString())
        .lte('created_at', end.toISOString())
        .order('created_at', { ascending: true })

      // Group by day and type
      const revenueByDay: { [key: string]: { subscription: number; oneTime: number } } = {}
      payments?.forEach((payment) => {
        const date = payment.created_at.split('T')[0]
        if (!revenueByDay[date]) {
          revenueByDay[date] = { subscription: 0, oneTime: 0 }
        }
        const amount = payment.amount / 100
        if (payment.payment_type === 'subscription') {
          revenueByDay[date].subscription += amount
        } else {
          revenueByDay[date].oneTime += amount
        }
      })

      const totalRevenue = payments?.reduce((sum, p) => sum + (p.amount / 100), 0) || 0

      report.sections.revenue = {
        byDay: revenueByDay,
        total: totalRevenue,
        transactionCount: payments?.length || 0,
      }
    }

    // Tools section
    if (sections.includes('tools')) {
      const { data: usage } = await supabase
        .from('tool_usage')
        .select('tool_name')
        .gte('created_at', start.toISOString())
        .lte('created_at', end.toISOString())

      // Count by tool
      const toolCounts: { [key: string]: number } = {}
      usage?.forEach((u) => {
        toolCounts[u.tool_name] = (toolCounts[u.tool_name] || 0) + 1
      })

      // Sort by usage
      const topTools = Object.entries(toolCounts)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 10)
        .map(([name, count]) => ({ name, count }))

      report.sections.tools = {
        topTools,
        totalUsage: usage?.length || 0,
      }
    }

    // Store report in database
    await supabase.from('admin_reports').insert({
      id: report.id,
      type: reportType,
      data: report,
      generated_by: session.user.id,
      created_at: new Date().toISOString(),
    })

    return NextResponse.json(report)

  } catch (error) {
    console.error('Report generation error:', error)
    return NextResponse.json(
      { error: 'Failed to generate report' },
      { status: 500 }
    )
  }
}

/**
 * Get Reports List
 * 
 * GET /api/admin/reports/generate
 * 
 * Returns list of previously generated reports
 */
export async function GET(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies })
    
    // Check authentication
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check admin role
    const { data: profile } = await supabase
      .from('user_profiles')
      .select('role')
      .eq('id', session.user.id)
      .single()

    if (!profile || profile.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { data: reports } = await supabase
      .from('admin_reports')
      .select('id, type, created_at, generated_by')
      .order('created_at', { ascending: false })
      .limit(50)

    return NextResponse.json(reports || [])

  } catch (error) {
    console.error('Fetch reports error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch reports' },
      { status: 500 }
    )
  }
}
