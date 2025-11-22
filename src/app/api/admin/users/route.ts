/**
 * Admin Users Management API Endpoint
 *
 * Provides user management functionality including:
 * - List all users with pagination
 * - Search and filter users
 * - Filter by tier, status, role
 * - Sort by various fields
 *
 * @route GET /api/admin/users
 * @access Admin only
 */

import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin, checkUserRole } from '@/middleware/admin'
import { createServerClient } from '@/lib/supabase-server'
import { createAuditLog } from '@/lib/admin'

export interface UserListItem {
  id: string
  email: string
  full_name: string | null
  avatar_url: string | null
  role: string
  subscription_status: string
  created_at: string
  last_login_at: string | null

  // Subscription details
  tier: {
    name: string
    slug: string
  } | null

  // Usage stats
  usage: {
    daily: number
    monthly: number
  }
}

export interface UserListResponse {
  users: UserListItem[]
  pagination: {
    total: number
    page: number
    limit: number
    totalPages: number
  }
  filters: {
    search?: string
    tier?: string
    status?: string
    role?: string
    sortBy?: string
    sortOrder?: 'asc' | 'desc'
  }
}

/**
 * GET handler for user list
 * Supports query parameters:
 * - page: page number (default: 1)
 * - limit: items per page (default: 20, max: 100)
 * - search: search by email or name
 * - tier: filter by subscription tier slug
 * - status: filter by subscription status
 * - role: filter by user role
 * - sortBy: field to sort by (default: created_at)
 * - sortOrder: asc or desc (default: desc)
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
    const page = Math.max(1, parseInt(searchParams.get('page') || '1'))
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') || '20')))
    const search = searchParams.get('search') || undefined
    const tierFilter = searchParams.get('tier') || undefined
    const statusFilter = searchParams.get('status') || undefined
    const roleFilter = searchParams.get('role') || undefined
    const sortBy = searchParams.get('sortBy') || 'created_at'
    const sortOrder = (searchParams.get('sortOrder') || 'desc') as 'asc' | 'desc'

    // Calculate offset for pagination
    const offset = (page - 1) * limit

    // Build query for users
    let query = supabase
      .from('user_profiles')
      .select(`
        id,
        email,
        full_name,
        avatar_url,
        role,
        subscription_status,
        created_at,
        last_login_at,
        subscription_tier_id,
        subscription_tiers (
          name,
          slug
        )
      `, { count: 'exact' })

    // Apply filters
    if (search) {
      query = query.or(`email.ilike.%${search}%,full_name.ilike.%${search}%`)
    }

    if (roleFilter) {
      query = query.eq('role', roleFilter)
    }

    if (statusFilter) {
      query = query.eq('subscription_status', statusFilter)
    }

    // Apply sorting
    const validSortFields = ['created_at', 'email', 'full_name', 'last_login_at', 'role', 'subscription_status']
    const sortField = validSortFields.includes(sortBy) ? sortBy : 'created_at'
    query = query.order(sortField, { ascending: sortOrder === 'asc' })

    // Apply pagination
    query = query.range(offset, offset + limit - 1)

    const { data: usersData, count, error } = await query

    if (error) {
      throw new Error(`Database error: ${error.message}`)
    }

    // Get user IDs for usage lookup
    const userIds = usersData?.map(u => u.id) || []

    // Get usage quotas for all users in batch
    const { data: usageData } = await supabase
      .from('usage_quotas')
      .select('user_id, daily_usage, monthly_usage')
      .in('user_id', userIds)

    // Create usage map for quick lookup
    const usageMap = new Map<string, { daily: number; monthly: number }>()
    usageData?.forEach(usage => {
      usageMap.set(usage.user_id, {
        daily: usage.daily_usage || 0,
        monthly: usage.monthly_usage || 0
      })
    })

    // Build user list with all details
    let users: UserListItem[] = (usersData || []).map((user: any) => ({
      id: user.id,
      email: user.email,
      full_name: user.full_name,
      avatar_url: user.avatar_url,
      role: user.role,
      subscription_status: user.subscription_status,
      created_at: user.created_at,
      last_login_at: user.last_login_at,
      tier: user.subscription_tiers ? {
        name: user.subscription_tiers.name,
        slug: user.subscription_tiers.slug
      } : null,
      usage: usageMap.get(user.id) || { daily: 0, monthly: 0 }
    }))

    // Apply tier filter (post-query since it's a joined field)
    if (tierFilter) {
      users = users.filter(u => u.tier?.slug === tierFilter)
    }

    // Calculate total pages
    const total = count || 0
    const totalPages = Math.ceil(total / limit)

    // Build response
    const response: UserListResponse = {
      users,
      pagination: {
        total,
        page,
        limit,
        totalPages
      },
      filters: {
        search,
        tier: tierFilter,
        status: statusFilter,
        role: roleFilter,
        sortBy,
        sortOrder
      }
    }

    // Create audit log
    if (userId) {
      await createAuditLog({
        user_id: userId,
        action: 'admin.login',
        resource_type: 'users',
        resource_id: 'list',
        details: {
          endpoint: '/api/admin/users',
          page,
          limit,
          filters: { search, tier: tierFilter, status: statusFilter, role: roleFilter }
        }
      })
    }

    return NextResponse.json({
      success: true,
      data: response,
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('Error fetching users list:', error)

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch users',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
