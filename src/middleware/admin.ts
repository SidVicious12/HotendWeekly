/**
 * Admin Middleware
 *
 * Provides middleware functions and utilities for admin authentication and authorization.
 * Supports role-based access control with 'user', 'admin', and 'super_admin' roles.
 *
 * @module middleware/admin
 */

import { createServerClient } from '@/lib/supabase-server'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

/**
 * User role types
 */
export type UserRole = 'user' | 'admin' | 'super_admin'

/**
 * Admin check result
 */
export interface AdminCheckResult {
  isAuthenticated: boolean
  isAdmin: boolean
  isSuperAdmin: boolean
  role: UserRole | null
  userId: string | null
  email: string | null
  error?: string
}

/**
 * Check if the current user is authenticated and retrieve their role
 *
 * @returns {Promise<AdminCheckResult>} Authentication and role information
 *
 * @example
 * const { isAdmin, role } = await checkUserRole()
 * if (!isAdmin) {
 *   return new Response('Unauthorized', { status: 403 })
 * }
 */
export async function checkUserRole(): Promise<AdminCheckResult> {
  try {
    const supabase = createServerClient()

    // Get current session
    const { data: { session }, error: sessionError } = await supabase.auth.getSession()

    if (sessionError || !session) {
      return {
        isAuthenticated: false,
        isAdmin: false,
        isSuperAdmin: false,
        role: null,
        userId: null,
        email: null,
        error: sessionError?.message || 'No active session'
      }
    }

    // Get user profile with role
    const { data: profile, error: profileError } = await supabase
      .from('user_profiles')
      .select('id, email, role')
      .eq('id', session.user.id)
      .single()

    if (profileError || !profile) {
      return {
        isAuthenticated: true,
        isAdmin: false,
        isSuperAdmin: false,
        role: 'user',
        userId: session.user.id,
        email: session.user.email || null,
        error: profileError?.message || 'Profile not found'
      }
    }

    const role = (profile.role as UserRole) || 'user'

    return {
      isAuthenticated: true,
      isAdmin: role === 'admin' || role === 'super_admin',
      isSuperAdmin: role === 'super_admin',
      role,
      userId: profile.id,
      email: profile.email
    }
  } catch (error) {
    console.error('Error checking user role:', error)
    return {
      isAuthenticated: false,
      isAdmin: false,
      isSuperAdmin: false,
      role: null,
      userId: null,
      email: null,
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}

/**
 * Check if the current user is an admin
 *
 * @returns {Promise<boolean>} True if user is admin or super_admin
 *
 * @example
 * const isAdmin = await isUserAdmin()
 * if (!isAdmin) {
 *   throw new Error('Admin access required')
 * }
 */
export async function isUserAdmin(): Promise<boolean> {
  const { isAdmin } = await checkUserRole()
  return isAdmin
}

/**
 * Check if the current user is a super admin
 *
 * @returns {Promise<boolean>} True if user is super_admin
 *
 * @example
 * const isSuperAdmin = await isUserSuperAdmin()
 * if (!isSuperAdmin) {
 *   return { error: 'Super admin access required' }
 * }
 */
export async function isUserSuperAdmin(): Promise<boolean> {
  const { isSuperAdmin } = await checkUserRole()
  return isSuperAdmin
}

/**
 * Middleware to protect admin routes
 * Use this in Next.js API routes or server components to ensure only admins can access
 *
 * @param {NextRequest} request - The incoming request
 * @param {boolean} requireSuperAdmin - Whether to require super admin access (default: false)
 * @returns {Promise<NextResponse | null>} Error response if unauthorized, null if authorized
 *
 * @example
 * // In an API route
 * export async function GET(request: NextRequest) {
 *   const authError = await requireAdmin(request)
 *   if (authError) return authError
 *
 *   // Admin-only logic here
 *   return NextResponse.json({ success: true })
 * }
 *
 * @example
 * // Require super admin
 * export async function DELETE(request: NextRequest) {
 *   const authError = await requireAdmin(request, true)
 *   if (authError) return authError
 *
 *   // Super admin-only logic here
 *   return NextResponse.json({ deleted: true })
 * }
 */
export async function requireAdmin(
  request: NextRequest,
  requireSuperAdmin: boolean = false
): Promise<NextResponse | null> {
  const result = await checkUserRole()

  // Not authenticated
  if (!result.isAuthenticated) {
    return NextResponse.json(
      {
        error: 'Authentication required',
        message: 'You must be logged in to access this resource'
      },
      { status: 401 }
    )
  }

  // Require super admin
  if (requireSuperAdmin && !result.isSuperAdmin) {
    return NextResponse.json(
      {
        error: 'Forbidden',
        message: 'Super admin access required',
        currentRole: result.role
      },
      { status: 403 }
    )
  }

  // Require admin (or super admin)
  if (!requireSuperAdmin && !result.isAdmin) {
    return NextResponse.json(
      {
        error: 'Forbidden',
        message: 'Admin access required',
        currentRole: result.role
      },
      { status: 403 }
    )
  }

  // Authorized
  return null
}

/**
 * Wrapper for API routes that require admin access
 *
 * @param {Function} handler - The API route handler
 * @param {boolean} requireSuperAdmin - Whether to require super admin access
 * @returns {Function} Wrapped handler with admin check
 *
 * @example
 * export const GET = withAdminAuth(async (request: NextRequest) => {
 *   // This code only runs if user is an admin
 *   return NextResponse.json({ data: 'admin data' })
 * })
 *
 * @example
 * // Require super admin
 * export const DELETE = withAdminAuth(async (request: NextRequest) => {
 *   return NextResponse.json({ deleted: true })
 * }, true)
 */
export function withAdminAuth(
  handler: (request: NextRequest, context?: any) => Promise<NextResponse>,
  requireSuperAdmin: boolean = false
) {
  return async (request: NextRequest, context?: any) => {
    const authError = await requireAdmin(request, requireSuperAdmin)
    if (authError) return authError

    return handler(request, context)
  }
}

/**
 * Get user role for a specific user ID
 * Useful for server-side checks on other users
 *
 * @param {string} userId - The user ID to check
 * @returns {Promise<UserRole | null>} The user's role or null if not found
 *
 * @example
 * const userRole = await getUserRoleById(userId)
 * if (userRole === 'admin') {
 *   // Handle admin user
 * }
 */
export async function getUserRoleById(userId: string): Promise<UserRole | null> {
  try {
    const supabase = createServerClient()

    const { data: profile, error } = await supabase
      .from('user_profiles')
      .select('role')
      .eq('id', userId)
      .single()

    if (error || !profile) {
      console.error('Error fetching user role:', error)
      return null
    }

    return (profile.role as UserRole) || 'user'
  } catch (error) {
    console.error('Error in getUserRoleById:', error)
    return null
  }
}

/**
 * Check if a specific user is an admin
 *
 * @param {string} userId - The user ID to check
 * @returns {Promise<boolean>} True if user is admin or super_admin
 *
 * @example
 * if (await isAdminById(targetUserId)) {
 *   // Cannot modify another admin
 *   throw new Error('Cannot modify admin users')
 * }
 */
export async function isAdminById(userId: string): Promise<boolean> {
  const role = await getUserRoleById(userId)
  return role === 'admin' || role === 'super_admin'
}

/**
 * Update user role (super admin only operation)
 *
 * @param {string} userId - The user ID to update
 * @param {UserRole} newRole - The new role to assign
 * @returns {Promise<{success: boolean, error?: string}>} Operation result
 *
 * @example
 * const result = await updateUserRole(userId, 'admin')
 * if (!result.success) {
 *   console.error(result.error)
 * }
 */
export async function updateUserRole(
  userId: string,
  newRole: UserRole
): Promise<{ success: boolean; error?: string }> {
  try {
    // Check if current user is super admin
    const currentUserCheck = await checkUserRole()
    if (!currentUserCheck.isSuperAdmin) {
      return {
        success: false,
        error: 'Only super admins can update user roles'
      }
    }

    const supabase = createServerClient()

    const { error } = await supabase
      .from('user_profiles')
      .update({ role: newRole })
      .eq('id', userId)

    if (error) {
      return {
        success: false,
        error: error.message
      }
    }

    return { success: true }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}
