/**
 * Admin Utilities
 *
 * Helper functions for admin operations, permission checks, and audit logging.
 * Provides client-side and server-side utilities for admin functionality.
 *
 * @module lib/admin
 */

import { createServerClient } from '@/lib/supabase-server'
import { supabase } from '@/lib/supabase'
import type { UserRole } from '@/middleware/admin'

/**
 * Admin permission types
 */
export type AdminPermission =
  | 'manage_users'
  | 'manage_subscriptions'
  | 'view_analytics'
  | 'manage_content'
  | 'manage_settings'
  | 'manage_admins'
  | 'view_audit_logs'
  | 'manage_billing'

/**
 * Permission matrix defining which roles have which permissions
 */
const PERMISSION_MATRIX: Record<UserRole, AdminPermission[]> = {
  user: [],
  admin: [
    'manage_users',
    'manage_subscriptions',
    'view_analytics',
    'manage_content',
    'view_audit_logs',
    'manage_billing'
  ],
  super_admin: [
    'manage_users',
    'manage_subscriptions',
    'view_analytics',
    'manage_content',
    'manage_settings',
    'manage_admins',
    'view_audit_logs',
    'manage_billing'
  ]
}

/**
 * Audit log action types
 */
export type AuditAction =
  | 'user.created'
  | 'user.updated'
  | 'user.deleted'
  | 'user.role_changed'
  | 'subscription.created'
  | 'subscription.updated'
  | 'subscription.canceled'
  | 'admin.login'
  | 'admin.logout'
  | 'settings.updated'
  | 'content.created'
  | 'content.updated'
  | 'content.deleted'

/**
 * Audit log entry
 */
export interface AuditLogEntry {
  id?: string
  user_id: string
  action: AuditAction
  resource_type: string
  resource_id?: string
  details?: Record<string, any>
  ip_address?: string
  user_agent?: string
  created_at?: string
}

/**
 * Get user role from client-side Supabase client
 *
 * @returns {Promise<UserRole | null>} The user's role or null if not found
 *
 * @example
 * const role = await getUserRole()
 * if (role === 'admin') {
 *   // Show admin features
 * }
 */
export async function getUserRole(): Promise<UserRole | null> {
  try {
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) return null

    const { data: profile, error } = await supabase
      .from('user_profiles')
      .select('role')
      .eq('id', session.user.id)
      .single()

    if (error || !profile) {
      console.error('Error fetching user role:', error)
      return null
    }

    return (profile.role as UserRole) || 'user'
  } catch (error) {
    console.error('Error in getUserRole:', error)
    return null
  }
}

/**
 * Check if current user has a specific permission
 *
 * @param {AdminPermission} permission - The permission to check
 * @returns {Promise<boolean>} True if user has the permission
 *
 * @example
 * const canManageUsers = await hasPermission('manage_users')
 * if (canManageUsers) {
 *   // Show user management UI
 * }
 */
export async function hasPermission(permission: AdminPermission): Promise<boolean> {
  const role = await getUserRole()
  if (!role) return false

  const permissions = PERMISSION_MATRIX[role] || []
  return permissions.includes(permission)
}

/**
 * Check if current user has all specified permissions
 *
 * @param {AdminPermission[]} permissions - Array of permissions to check
 * @returns {Promise<boolean>} True if user has all permissions
 *
 * @example
 * const canManage = await hasAllPermissions(['manage_users', 'manage_subscriptions'])
 * if (canManage) {
 *   // Show full admin panel
 * }
 */
export async function hasAllPermissions(permissions: AdminPermission[]): Promise<boolean> {
  const role = await getUserRole()
  if (!role) return false

  const userPermissions = PERMISSION_MATRIX[role] || []
  return permissions.every(permission => userPermissions.includes(permission))
}

/**
 * Check if current user has any of the specified permissions
 *
 * @param {AdminPermission[]} permissions - Array of permissions to check
 * @returns {Promise<boolean>} True if user has at least one permission
 *
 * @example
 * const hasAccess = await hasAnyPermission(['manage_users', 'view_analytics'])
 */
export async function hasAnyPermission(permissions: AdminPermission[]): Promise<boolean> {
  const role = await getUserRole()
  if (!role) return false

  const userPermissions = PERMISSION_MATRIX[role] || []
  return permissions.some(permission => userPermissions.includes(permission))
}

/**
 * Get all permissions for a role
 *
 * @param {UserRole} role - The role to get permissions for
 * @returns {AdminPermission[]} Array of permissions
 *
 * @example
 * const adminPermissions = getPermissionsForRole('admin')
 */
export function getPermissionsForRole(role: UserRole): AdminPermission[] {
  return PERMISSION_MATRIX[role] || []
}

/**
 * Create an audit log entry (server-side only)
 *
 * @param {AuditLogEntry} entry - The audit log entry to create
 * @returns {Promise<{success: boolean, error?: string}>} Operation result
 *
 * @example
 * await createAuditLog({
 *   user_id: userId,
 *   action: 'user.role_changed',
 *   resource_type: 'user',
 *   resource_id: targetUserId,
 *   details: { old_role: 'user', new_role: 'admin' }
 * })
 */
export async function createAuditLog(
  entry: AuditLogEntry
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = createServerClient()

    const { error } = await supabase.from('audit_logs').insert({
      user_id: entry.user_id,
      action: entry.action,
      resource_type: entry.resource_type,
      resource_id: entry.resource_id,
      details: entry.details || {},
      ip_address: entry.ip_address,
      user_agent: entry.user_agent,
      created_at: new Date().toISOString()
    })

    if (error) {
      console.error('Error creating audit log:', error)
      return { success: false, error: error.message }
    }

    return { success: true }
  } catch (error) {
    console.error('Error in createAuditLog:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}

/**
 * Get audit logs with filtering and pagination
 *
 * @param {Object} options - Filter and pagination options
 * @returns {Promise<{data: AuditLogEntry[], error?: string}>} Audit logs
 *
 * @example
 * const { data: logs } = await getAuditLogs({
 *   userId: 'user-id',
 *   action: 'user.role_changed',
 *   limit: 50
 * })
 */
export async function getAuditLogs(options: {
  userId?: string
  action?: AuditAction
  resourceType?: string
  resourceId?: string
  limit?: number
  offset?: number
}): Promise<{ data: AuditLogEntry[]; error?: string }> {
  try {
    const supabase = createServerClient()

    let query = supabase
      .from('audit_logs')
      .select('*')
      .order('created_at', { ascending: false })

    if (options.userId) {
      query = query.eq('user_id', options.userId)
    }

    if (options.action) {
      query = query.eq('action', options.action)
    }

    if (options.resourceType) {
      query = query.eq('resource_type', options.resourceType)
    }

    if (options.resourceId) {
      query = query.eq('resource_id', options.resourceId)
    }

    if (options.limit) {
      query = query.limit(options.limit)
    }

    if (options.offset) {
      query = query.range(options.offset, options.offset + (options.limit || 10) - 1)
    }

    const { data, error } = await query

    if (error) {
      return { data: [], error: error.message }
    }

    return { data: data || [] }
  } catch (error) {
    return {
      data: [],
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}

/**
 * Get user statistics for admin dashboard
 *
 * @returns {Promise<{total: number, active: number, admins: number, error?: string}>}
 *
 * @example
 * const stats = await getUserStats()
 * console.log(`Total users: ${stats.total}`)
 */
export async function getUserStats(): Promise<{
  total: number
  active: number
  admins: number
  error?: string
}> {
  try {
    const supabase = createServerClient()

    // Get total users
    const { count: total, error: totalError } = await supabase
      .from('user_profiles')
      .select('*', { count: 'exact', head: true })

    // Get active users (logged in within last 30 days)
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    const { count: active, error: activeError } = await supabase
      .from('user_profiles')
      .select('*', { count: 'exact', head: true })
      .gte('last_login_at', thirtyDaysAgo.toISOString())

    // Get admin users
    const { count: admins, error: adminsError } = await supabase
      .from('user_profiles')
      .select('*', { count: 'exact', head: true })
      .in('role', ['admin', 'super_admin'])

    if (totalError || activeError || adminsError) {
      const error = totalError || activeError || adminsError
      return {
        total: 0,
        active: 0,
        admins: 0,
        error: error?.message
      }
    }

    return {
      total: total || 0,
      active: active || 0,
      admins: admins || 0
    }
  } catch (error) {
    return {
      total: 0,
      active: 0,
      admins: 0,
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}

/**
 * Get subscription statistics for admin dashboard
 *
 * @returns {Promise<Record<string, number> & {error?: string}>}
 *
 * @example
 * const stats = await getSubscriptionStats()
 * console.log(`Free tier: ${stats.tinkerer}`)
 */
export async function getSubscriptionStats(): Promise<Record<string, number>> {
  try {
    const supabase = createServerClient()

    const { data, error } = await supabase
      .from('user_subscription_details')
      .select('tier_slug')

    if (error) {
      console.error('Error fetching subscription stats:', error)
      return {}
    }

    // Count by tier
    const stats: Record<string, number> = {}
    data?.forEach((row: any) => {
      const tier = row.tier_slug || 'none'
      stats[tier] = (stats[tier] || 0) + 1
    })

    return stats
  } catch (error) {
    console.error('Error in getSubscriptionStats:', error)
    return {}
  }
}

/**
 * Validate admin action before execution
 * Prevents actions like admins modifying super admins
 *
 * @param {string} actorId - ID of user performing action
 * @param {string} targetId - ID of user being acted upon
 * @param {string} action - The action being performed
 * @returns {Promise<{allowed: boolean, reason?: string}>}
 *
 * @example
 * const validation = await validateAdminAction(currentUserId, targetUserId, 'update_role')
 * if (!validation.allowed) {
 *   throw new Error(validation.reason)
 * }
 */
export async function validateAdminAction(
  actorId: string,
  targetId: string,
  action: string
): Promise<{ allowed: boolean; reason?: string }> {
  try {
    const supabase = createServerClient()

    // Get both user roles
    const { data: users, error } = await supabase
      .from('user_profiles')
      .select('id, role')
      .in('id', [actorId, targetId])

    if (error || !users || users.length !== 2) {
      return {
        allowed: false,
        reason: 'Could not verify user roles'
      }
    }

    const actor = users.find(u => u.id === actorId)
    const target = users.find(u => u.id === targetId)

    if (!actor || !target) {
      return {
        allowed: false,
        reason: 'User not found'
      }
    }

    // Super admins can do anything
    if (actor.role === 'super_admin') {
      return { allowed: true }
    }

    // Admins cannot modify super admins
    if (actor.role === 'admin' && target.role === 'super_admin') {
      return {
        allowed: false,
        reason: 'Admins cannot modify super admin accounts'
      }
    }

    // Admins cannot promote users to admin
    if (actor.role === 'admin' && action === 'update_role') {
      return {
        allowed: false,
        reason: 'Only super admins can change user roles'
      }
    }

    return { allowed: true }
  } catch (error) {
    return {
      allowed: false,
      reason: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}

/**
 * Format audit log action for display
 *
 * @param {AuditAction} action - The audit action
 * @returns {string} Human-readable action description
 *
 * @example
 * const description = formatAuditAction('user.role_changed')
 * // Returns: "User Role Changed"
 */
export function formatAuditAction(action: AuditAction): string {
  const actionMap: Record<AuditAction, string> = {
    'user.created': 'User Created',
    'user.updated': 'User Updated',
    'user.deleted': 'User Deleted',
    'user.role_changed': 'User Role Changed',
    'subscription.created': 'Subscription Created',
    'subscription.updated': 'Subscription Updated',
    'subscription.canceled': 'Subscription Canceled',
    'admin.login': 'Admin Login',
    'admin.logout': 'Admin Logout',
    'settings.updated': 'Settings Updated',
    'content.created': 'Content Created',
    'content.updated': 'Content Updated',
    'content.deleted': 'Content Deleted'
  }

  return actionMap[action] || action
}
