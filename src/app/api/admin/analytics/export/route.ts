import { NextRequest, NextResponse } from 'next/server'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

/**
 * Export Analytics Data API
 * 
 * GET /api/admin/analytics/export
 * 
 * Exports analytics data in CSV format
 * Query params:
 * - range: Time range (7d, 30d, 90d, 1y, all)
 * - format: Export format (csv, json) - default: csv
 * - type: Data type (overview, users, revenue, tools, all) - default: all
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

    const searchParams = request.nextUrl.searchParams
    const range = searchParams.get('range') || '30d'
    const format = searchParams.get('format') || 'csv'
    const type = searchParams.get('type') || 'all'

    // Calculate date range
    const endDate = new Date()
    const startDate = new Date()
    
    switch (range) {
      case '7d':
        startDate.setDate(endDate.getDate() - 7)
        break
      case '30d':
        startDate.setDate(endDate.getDate() - 30)
        break
      case '90d':
        startDate.setDate(endDate.getDate() - 90)
        break
      case '1y':
        startDate.setFullYear(endDate.getFullYear() - 1)
        break
      case 'all':
        startDate.setFullYear(2020, 0, 1) // Start from 2020
        break
    }

    let exportData: any = {}

    // Export overview data
    if (type === 'overview' || type === 'all') {
      const { data: users } = await supabase
        .from('user_profiles')
        .select('id, created_at')
        .gte('created_at', startDate.toISOString())
        .lte('created_at', endDate.toISOString())

      const { data: payments } = await supabase
        .from('payments')
        .select('amount, created_at, status')
        .gte('created_at', startDate.toISOString())
        .lte('created_at', endDate.toISOString())
        .eq('status', 'succeeded')

      exportData.overview = {
        totalUsers: users?.length || 0,
        totalRevenue: payments?.reduce((sum, p) => sum + (p.amount / 100), 0) || 0,
        dateRange: `${startDate.toISOString().split('T')[0]} to ${endDate.toISOString().split('T')[0]}`,
      }
    }

    // Export user data
    if (type === 'users' || type === 'all') {
      const { data: users } = await supabase
        .from('user_profiles')
        .select('id, email, full_name, created_at, subscription_status')
        .gte('created_at', startDate.toISOString())
        .lte('created_at', endDate.toISOString())
        .order('created_at', { ascending: false })

      exportData.users = users || []
    }

    // Export revenue data
    if (type === 'revenue' || type === 'all') {
      const { data: payments } = await supabase
        .from('payments')
        .select('id, amount, currency, status, payment_type, created_at, user_id')
        .gte('created_at', startDate.toISOString())
        .lte('created_at', endDate.toISOString())
        .order('created_at', { ascending: false })

      exportData.revenue = payments || []
    }

    // Export tool usage data
    if (type === 'tools' || type === 'all') {
      const { data: usage } = await supabase
        .from('tool_usage')
        .select('id, tool_name, user_id, created_at, metadata')
        .gte('created_at', startDate.toISOString())
        .lte('created_at', endDate.toISOString())
        .order('created_at', { ascending: false })

      exportData.tools = usage || []
    }

    // Format as CSV
    if (format === 'csv') {
      let csv = ''

      if (type === 'overview' || type === 'all') {
        csv += '=== OVERVIEW ===\n'
        csv += `Date Range,${exportData.overview.dateRange}\n`
        csv += `Total Users,${exportData.overview.totalUsers}\n`
        csv += `Total Revenue,$${exportData.overview.totalRevenue.toFixed(2)}\n\n`
      }

      if (type === 'users' || type === 'all') {
        csv += '=== USERS ===\n'
        csv += 'ID,Email,Full Name,Created At,Subscription Status\n'
        exportData.users?.forEach((user: any) => {
          csv += `${user.id},"${user.email}","${user.full_name || 'N/A'}",${user.created_at},${user.subscription_status || 'none'}\n`
        })
        csv += '\n'
      }

      if (type === 'revenue' || type === 'all') {
        csv += '=== REVENUE ===\n'
        csv += 'ID,Amount,Currency,Status,Type,Created At,User ID\n'
        exportData.revenue?.forEach((payment: any) => {
          csv += `${payment.id},${(payment.amount / 100).toFixed(2)},${payment.currency},${payment.status},${payment.payment_type || 'one-time'},${payment.created_at},${payment.user_id}\n`
        })
        csv += '\n'
      }

      if (type === 'tools' || type === 'all') {
        csv += '=== TOOL USAGE ===\n'
        csv += 'ID,Tool Name,User ID,Created At\n'
        exportData.tools?.forEach((usage: any) => {
          csv += `${usage.id},"${usage.tool_name}",${usage.user_id},${usage.created_at}\n`
        })
      }

      return new NextResponse(csv, {
        headers: {
          'Content-Type': 'text/csv',
          'Content-Disposition': `attachment; filename="analytics-export-${range}-${Date.now()}.csv"`,
        },
      })
    }

    // Format as JSON
    return NextResponse.json(exportData, {
      headers: {
        'Content-Disposition': `attachment; filename="analytics-export-${range}-${Date.now()}.json"`,
      },
    })

  } catch (error) {
    console.error('Export error:', error)
    return NextResponse.json(
      { error: 'Failed to export data' },
      { status: 500 }
    )
  }
}
