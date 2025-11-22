/**
 * Admin Individual User Management API Endpoint
 *
 * Provides individual user management functionality:
 * - GET: Get detailed user information
 * - PATCH: Update user details (role, tier, status)
 *
 * @route GET/PATCH /api/admin/users/[id]
 * @access Admin only (super_admin for role changes)
 */

import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin, checkUserRole } from '@/middleware/admin'
import { createServerClient } from '@/lib/supabase-server'
import { createAuditLog, validateAdminAction } from '@/lib/admin'
import type { UserRole } from '@/middleware/admin'

export interface UserDetails {
  // Basic info
  id: string
  email: string
  full_name: string | null
  avatar_url: string | null
  role: string
  created_at: string
  last_login_at: string | null

  // Subscription details
  subscription: {
    status: string
    tier: {
      id: string
      name: string
      slug: string
      price_monthly: number
      price_yearly: number
    } | null
    billing_cycle: string
    start_date: string | null
    end_date: string | null
    trial_end_date: string | null
    stripe_customer_id: string | null
    stripe_subscription_id: string | null
  }

  // Usage details
  usage: {
    daily: number
    monthly: number
    daily_limit: number
    monthly_limit: number
    daily_remaining: number
    monthly_remaining: number
  }

  // Activity history
  activity: {
    total_tool_usage: number
    last_30_days_usage: number
    favorite_tools: Array<{ tool: string; count: number }>
    recent_activity: Array<{
      tool: string
      created_at: string
      status: string
    }>
  }

  // Subscription history
  history: Array<{
    id: string
    action: string
    previous_tier: string | null
    new_tier: string | null
    amount_paid: number | null
    created_at: string
  }>
}

/**
 * GET handler - Get detailed user information
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check admin authentication
    const authError = await requireAdmin(request)
    if (authError) return authError

    const supabase = createServerClient()
    const { userId: adminUserId } = await checkUserRole()

    const userId = params.id

    // Validate UUID format
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
    if (!uuidRegex.test(userId)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid user ID format'
        },
        { status: 400 }
      )
    }

    // Get user profile with subscription tier
    const { data: user, error: userError } = await supabase
      .from('user_profiles')
      .select(`
        id,
        email,
        full_name,
        avatar_url,
        role,
        created_at,
        last_login_at,
        subscription_status,
        billing_cycle,
        subscription_start_date,
        subscription_end_date,
        trial_end_date,
        stripe_customer_id,
        stripe_subscription_id,
        subscription_tier_id,
        subscription_tiers (
          id,
          name,
          slug,
          price_monthly,
          price_yearly,
          daily_tool_usage_limit,
          monthly_tool_usage_limit
        )
      `)
      .eq('id', userId)
      .single()

    if (userError || !user) {
      return NextResponse.json(
        {
          success: false,
          error: 'User not found',
          message: userError?.message
        },
        { status: 404 }
      )
    }

    // Get usage quotas
    const { data: usageQuota } = await supabase
      .from('usage_quotas')
      .select('daily_usage, monthly_usage')
      .eq('user_id', userId)
      .single()

    const tier = user.subscription_tiers as any

    // Get tool usage statistics
    const { count: totalToolUsage } = await supabase
      .from('tool_usage')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)

    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    const { count: last30DaysUsage } = await supabase
      .from('tool_usage')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)
      .gte('created_at', thirtyDaysAgo.toISOString())

    // Get favorite tools
    const { data: toolUsageData } = await supabase
      .from('tool_usage')
      .select('tool_name')
      .eq('user_id', userId)

    const toolCounts = new Map<string, number>()
    toolUsageData?.forEach(usage => {
      const tool = usage.tool_name
      toolCounts.set(tool, (toolCounts.get(tool) || 0) + 1)
    })

    const favoriteTools = Array.from(toolCounts.entries())
      .map(([tool, count]) => ({ tool, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5)

    // Get recent activity
    const { data: recentActivity } = await supabase
      .from('tool_usage')
      .select('tool_name, created_at, status')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(10)

    // Get subscription history
    const { data: subscriptionHistory } = await supabase
      .from('subscription_history')
      .select('id, action, previous_tier, new_tier, amount_paid, created_at')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(20)

    // Build detailed user response
    const userDetails: UserDetails = {
      id: user.id,
      email: user.email,
      full_name: user.full_name,
      avatar_url: user.avatar_url,
      role: user.role,
      created_at: user.created_at,
      last_login_at: user.last_login_at,

      subscription: {
        status: user.subscription_status,
        tier: tier ? {
          id: tier.id,
          name: tier.name,
          slug: tier.slug,
          price_monthly: Number(tier.price_monthly) || 0,
          price_yearly: Number(tier.price_yearly) || 0
        } : null,
        billing_cycle: user.billing_cycle,
        start_date: user.subscription_start_date,
        end_date: user.subscription_end_date,
        trial_end_date: user.trial_end_date,
        stripe_customer_id: user.stripe_customer_id,
        stripe_subscription_id: user.stripe_subscription_id
      },

      usage: {
        daily: usageQuota?.daily_usage || 0,
        monthly: usageQuota?.monthly_usage || 0,
        daily_limit: tier?.daily_tool_usage_limit || 0,
        monthly_limit: tier?.monthly_tool_usage_limit || 0,
        daily_remaining: Math.max(0, (tier?.daily_tool_usage_limit || 0) - (usageQuota?.daily_usage || 0)),
        monthly_remaining: Math.max(0, (tier?.monthly_tool_usage_limit || 0) - (usageQuota?.monthly_usage || 0))
      },

      activity: {
        total_tool_usage: totalToolUsage || 0,
        last_30_days_usage: last30DaysUsage || 0,
        favorite_tools: favoriteTools,
        recent_activity: (recentActivity || []).map(activity => ({
          tool: activity.tool_name,
          created_at: activity.created_at,
          status: activity.status
        }))
      },

      history: (subscriptionHistory || []).map(event => ({
        id: event.id,
        action: event.action,
        previous_tier: event.previous_tier,
        new_tier: event.new_tier,
        amount_paid: event.amount_paid ? Number(event.amount_paid) : null,
        created_at: event.created_at
      }))
    }

    // Create audit log
    if (adminUserId) {
      await createAuditLog({
        user_id: adminUserId,
        action: 'user.updated',
        resource_type: 'user',
        resource_id: userId,
        details: {
          endpoint: '/api/admin/users/[id]',
          method: 'GET'
        }
      })
    }

    return NextResponse.json({
      success: true,
      data: userDetails,
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('Error fetching user details:', error)

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch user details',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

/**
 * PATCH handler - Update user details
 * Supports updating: role, subscription_tier_id, subscription_status
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createServerClient()
    const { userId: adminUserId, role: adminRole } = await checkUserRole()

    const userId = params.id

    // Validate UUID format
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
    if (!uuidRegex.test(userId)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid user ID format'
        },
        { status: 400 }
      )
    }

    // Parse request body
    const body = await request.json()
    const {
      role: newRole,
      subscription_tier_id: newTierId,
      subscription_status: newStatus
    } = body

    // Validate at least one field is provided
    if (!newRole && !newTierId && !newStatus) {
      return NextResponse.json(
        {
          success: false,
          error: 'No update fields provided',
          message: 'Provide at least one field to update: role, subscription_tier_id, or subscription_status'
        },
        { status: 400 }
      )
    }

    // Validate admin action permissions
    if (!adminUserId) {
      return NextResponse.json(
        {
          success: false,
          error: 'Unauthorized',
          message: 'Admin authentication required'
        },
        { status: 401 }
      )
    }

    const validation = await validateAdminAction(adminUserId, userId, 'update')
    if (!validation.allowed) {
      return NextResponse.json(
        {
          success: false,
          error: 'Forbidden',
          message: validation.reason
        },
        { status: 403 }
      )
    }

    // Get current user data
    const { data: currentUser, error: fetchError } = await supabase
      .from('user_profiles')
      .select('email, role, subscription_tier_id, subscription_status')
      .eq('id', userId)
      .single()

    if (fetchError || !currentUser) {
      return NextResponse.json(
        {
          success: false,
          error: 'User not found'
        },
        { status: 404 }
      )
    }

    // Build update object
    const updateData: any = {}
    const changes: Record<string, any> = {}

    // Handle role change (super admin only)
    if (newRole && newRole !== currentUser.role) {
      if (adminRole !== 'super_admin') {
        return NextResponse.json(
          {
            success: false,
            error: 'Forbidden',
            message: 'Only super admins can change user roles'
          },
          { status: 403 }
        )
      }

      // Validate role value
      const validRoles: UserRole[] = ['user', 'admin', 'super_admin']
      if (!validRoles.includes(newRole)) {
        return NextResponse.json(
          {
            success: false,
            error: 'Invalid role',
            message: `Role must be one of: ${validRoles.join(', ')}`
          },
          { status: 400 }
        )
      }

      updateData.role = newRole
      changes.role = { from: currentUser.role, to: newRole }
    }

    // Handle tier change
    if (newTierId && newTierId !== currentUser.subscription_tier_id) {
      // Validate tier exists
      const { data: tier, error: tierError } = await supabase
        .from('subscription_tiers')
        .select('id, slug')
        .eq('id', newTierId)
        .single()

      if (tierError || !tier) {
        return NextResponse.json(
          {
            success: false,
            error: 'Invalid subscription tier',
            message: 'The specified tier does not exist'
          },
          { status: 400 }
        )
      }

      updateData.subscription_tier_id = newTierId
      changes.subscription_tier_id = {
        from: currentUser.subscription_tier_id,
        to: newTierId
      }
    }

    // Handle status change
    if (newStatus && newStatus !== currentUser.subscription_status) {
      const validStatuses = ['inactive', 'active', 'trialing', 'past_due', 'canceled', 'unpaid']
      if (!validStatuses.includes(newStatus)) {
        return NextResponse.json(
          {
            success: false,
            error: 'Invalid status',
            message: `Status must be one of: ${validStatuses.join(', ')}`
          },
          { status: 400 }
        )
      }

      updateData.subscription_status = newStatus
      changes.subscription_status = {
        from: currentUser.subscription_status,
        to: newStatus
      }
    }

    // Perform update
    const { error: updateError } = await supabase
      .from('user_profiles')
      .update(updateData)
      .eq('id', userId)

    if (updateError) {
      throw new Error(`Update failed: ${updateError.message}`)
    }

    // Create audit log
    await createAuditLog({
      user_id: adminUserId,
      action: newRole ? 'user.role_changed' : 'user.updated',
      resource_type: 'user',
      resource_id: userId,
      details: {
        endpoint: '/api/admin/users/[id]',
        method: 'PATCH',
        changes,
        target_email: currentUser.email
      }
    })

    return NextResponse.json({
      success: true,
      message: 'User updated successfully',
      changes,
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('Error updating user:', error)

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to update user',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
