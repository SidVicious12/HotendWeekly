'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import {
  ArrowLeft,
  User,
  Mail,
  Calendar,
  Activity,
  CreditCard,
  Trash2,
  Save,
  Loader2,
  AlertCircle,
  TrendingUp,
  Clock,
} from 'lucide-react'
import ConfirmDialog from '@/components/admin/ConfirmDialog'
import type { UserDetails } from '@/app/api/admin/users/[id]/route'

/**
 * UserDetailPage Component
 *
 * User detail and edit page with comprehensive features:
 * - User profile information display
 * - Edit role (super admin only, with confirmation modal)
 * - Edit subscription tier
 * - Edit subscription status
 * - Usage statistics display
 * - Activity history
 * - Subscription history
 * - Delete user button (with confirmation, super admin only)
 * - Back to users list button
 *
 * Features:
 * - Real-time data updates
 * - Form validation
 * - Loading and error states
 * - Responsive design
 * - Role-based permissions
 */
export default function UserDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { isSuperAdmin } = useAuth()

  // State management
  const [user, setUser] = useState<UserDetails | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  // Form state
  const [role, setRole] = useState('')
  const [tierId, setTierId] = useState('')
  const [status, setStatus] = useState('')

  // Modal state
  const [showRoleConfirm, setShowRoleConfirm] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  // Available tiers (fetch from API in production)
  const [tiers, setTiers] = useState<Array<{ id: string; name: string; slug: string }>>([])

  /**
   * Fetch user details
   */
  const fetchUser = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch(`/api/admin/users/${params.id}`)

      if (!response.ok) {
        throw new Error('Failed to fetch user details')
      }

      const result = await response.json()

      if (!result.success) {
        throw new Error(result.error || 'Failed to fetch user details')
      }

      const userData: UserDetails = result.data

      setUser(userData)
      setRole(userData.role)
      setTierId(userData.subscription.tier?.id || '')
      setStatus(userData.subscription.status)
    } catch (err) {
      console.error('Error fetching user:', err)
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  /**
   * Fetch available subscription tiers
   */
  const fetchTiers = async () => {
    try {
      // TODO: Create dedicated API endpoint for fetching tiers
      // For now, hardcode common tiers
      setTiers([
        { id: '1', name: 'Free', slug: 'free' },
        { id: '2', name: 'Basic', slug: 'basic' },
        { id: '3', name: 'Pro', slug: 'pro' },
        { id: '4', name: 'Enterprise', slug: 'enterprise' },
      ])
    } catch (err) {
      console.error('Error fetching tiers:', err)
    }
  }

  /**
   * Load data on mount
   */
  useEffect(() => {
    fetchUser()
    fetchTiers()
  }, [params.id])

  /**
   * Handle role change (requires confirmation)
   */
  const handleRoleChange = async () => {
    if (!user || role === user.role) {
      setShowRoleConfirm(false)
      return
    }

    try {
      setSaving(true)

      const response = await fetch(`/api/admin/users/${params.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role }),
      })

      const result = await response.json()

      if (!result.success) {
        throw new Error(result.message || 'Failed to update role')
      }

      // Refresh user data
      await fetchUser()
      setShowRoleConfirm(false)
    } catch (err) {
      console.error('Error updating role:', err)
      alert(err instanceof Error ? err.message : 'Failed to update role')
      // Revert role on error
      setRole(user.role)
    } finally {
      setSaving(false)
    }
  }

  /**
   * Handle subscription update
   */
  const handleSubscriptionUpdate = async () => {
    if (!user) return

    try {
      setSaving(true)

      const updates: any = {}

      if (tierId !== user.subscription.tier?.id) {
        updates.subscription_tier_id = tierId
      }

      if (status !== user.subscription.status) {
        updates.subscription_status = status
      }

      if (Object.keys(updates).length === 0) {
        alert('No changes to save')
        return
      }

      const response = await fetch(`/api/admin/users/${params.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      })

      const result = await response.json()

      if (!result.success) {
        throw new Error(result.message || 'Failed to update subscription')
      }

      // Refresh user data
      await fetchUser()
      alert('Subscription updated successfully')
    } catch (err) {
      console.error('Error updating subscription:', err)
      alert(err instanceof Error ? err.message : 'Failed to update subscription')
    } finally {
      setSaving(false)
    }
  }

  /**
   * Handle user deletion (super admin only)
   */
  const handleDelete = async () => {
    if (!user) return

    try {
      setSaving(true)

      // TODO: Implement DELETE endpoint
      const response = await fetch(`/api/admin/users/${params.id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Failed to delete user')
      }

      // Redirect to users list
      router.push('/admin/users')
    } catch (err) {
      console.error('Error deleting user:', err)
      alert(err instanceof Error ? err.message : 'Failed to delete user')
      setSaving(false)
      setShowDeleteConfirm(false)
    }
  }

  /**
   * Format date for display
   */
  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'N/A'
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  /**
   * Format currency
   */
  const formatCurrency = (amount: number | null) => {
    if (amount === null) return 'N/A'
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount)
  }

  /**
   * Get status badge styling
   */
  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      active: 'bg-green-100 text-green-700 border-green-200',
      trialing: 'bg-blue-100 text-blue-700 border-blue-200',
      inactive: 'bg-gray-100 text-gray-700 border-gray-200',
      past_due: 'bg-yellow-100 text-yellow-700 border-yellow-200',
      canceled: 'bg-red-100 text-red-700 border-red-200',
      unpaid: 'bg-orange-100 text-orange-700 border-orange-200',
    }

    return styles[status] || styles.inactive
  }

  /**
   * Loading state
   */
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="w-8 h-8 text-purple-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading user details...</p>
        </div>
      </div>
    )
  }

  /**
   * Error state
   */
  if (error || !user) {
    return (
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <AlertCircle className="w-12 h-12 text-red-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Error Loading User</h2>
          <p className="text-gray-600 mb-6">{error || 'User not found'}</p>
          <button
            onClick={() => router.push('/admin/users')}
            className="px-6 py-2 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700"
          >
            Back to Users
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={() => router.push('/admin/users')}
          className="flex items-center space-x-2 text-purple-600 hover:text-purple-700 font-medium mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Users</span>
        </button>

        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-semibold text-2xl flex-shrink-0">
              {user.avatar_url ? (
                <img
                  src={user.avatar_url}
                  alt={user.full_name || user.email}
                  className="w-16 h-16 rounded-full object-cover"
                />
              ) : (
                <span>{(user.full_name || user.email).charAt(0).toUpperCase()}</span>
              )}
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-1">
                {user.full_name || 'No name'}
              </h1>
              <div className="flex items-center space-x-2 text-gray-600">
                <Mail className="w-4 h-4" />
                <span>{user.email}</span>
              </div>
              <div className="flex items-center space-x-2 mt-2">
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusBadge(
                    user.subscription.status
                  )}`}
                >
                  {user.subscription.status.charAt(0).toUpperCase() +
                    user.subscription.status.slice(1).replace('_', ' ')}
                </span>
                <span className="text-sm text-gray-600">
                  {user.subscription.tier?.name || 'No subscription'}
                </span>
              </div>
            </div>
          </div>

          {isSuperAdmin && (
            <button
              onClick={() => setShowDeleteConfirm(true)}
              disabled={saving}
              className="px-4 py-2 border border-red-300 text-red-600 rounded-lg text-sm font-medium hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              <Trash2 className="w-4 h-4" />
              <span>Delete User</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - User Info & Settings */}
        <div className="lg:col-span-2 space-y-6">
          {/* Profile Information */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center space-x-2">
              <User className="w-5 h-5" />
              <span>Profile Information</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  User ID
                </label>
                <p className="text-sm text-gray-900 font-mono bg-gray-50 p-2 rounded">
                  {user.id}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <p className="text-sm text-gray-900">{user.email}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                <p className="text-sm text-gray-900">{user.full_name || 'Not set'}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Joined
                </label>
                <p className="text-sm text-gray-900">{formatDate(user.created_at)}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Last Login
                </label>
                <p className="text-sm text-gray-900">{formatDate(user.last_login_at)}</p>
              </div>
            </div>
          </div>

          {/* Role Management */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Role Management</h2>

            <div className="space-y-4">
              <div>
                <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-2">
                  User Role {!isSuperAdmin && '(Super Admin Only)'}
                </label>
                <select
                  id="role"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  disabled={!isSuperAdmin || saving}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:bg-gray-50 disabled:cursor-not-allowed"
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                  <option value="super_admin">Super Admin</option>
                </select>
              </div>

              {isSuperAdmin && role !== user.role && (
                <button
                  onClick={() => setShowRoleConfirm(true)}
                  disabled={saving}
                  className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Update Role
                </button>
              )}
            </div>
          </div>

          {/* Subscription Management */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center space-x-2">
              <CreditCard className="w-5 h-5" />
              <span>Subscription Management</span>
            </h2>

            <div className="space-y-4">
              <div>
                <label htmlFor="tier" className="block text-sm font-medium text-gray-700 mb-2">
                  Subscription Tier
                </label>
                <select
                  id="tier"
                  value={tierId}
                  onChange={(e) => setTierId(e.target.value)}
                  disabled={saving}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:bg-gray-50 disabled:cursor-not-allowed"
                >
                  <option value="">No Tier</option>
                  {tiers.map((tier) => (
                    <option key={tier.id} value={tier.id}>
                      {tier.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  htmlFor="status"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Subscription Status
                </label>
                <select
                  id="status"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  disabled={saving}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:bg-gray-50 disabled:cursor-not-allowed"
                >
                  <option value="inactive">Inactive</option>
                  <option value="active">Active</option>
                  <option value="trialing">Trialing</option>
                  <option value="past_due">Past Due</option>
                  <option value="canceled">Canceled</option>
                  <option value="unpaid">Unpaid</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Billing Cycle
                  </label>
                  <p className="text-sm text-gray-900">
                    {user.subscription.billing_cycle || 'N/A'}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Start Date
                  </label>
                  <p className="text-sm text-gray-900">
                    {formatDate(user.subscription.start_date)}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    End Date
                  </label>
                  <p className="text-sm text-gray-900">
                    {formatDate(user.subscription.end_date)}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Trial End
                  </label>
                  <p className="text-sm text-gray-900">
                    {formatDate(user.subscription.trial_end_date)}
                  </p>
                </div>
              </div>

              {(tierId !== user.subscription.tier?.id || status !== user.subscription.status) && (
                <button
                  onClick={handleSubscriptionUpdate}
                  disabled={saving}
                  className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                >
                  {saving ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      <span>Save Changes</span>
                    </>
                  )}
                </button>
              )}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center space-x-2">
              <Activity className="w-5 h-5" />
              <span>Recent Activity</span>
            </h2>

            {user.activity.recent_activity.length === 0 ? (
              <p className="text-gray-600 text-center py-8">No recent activity</p>
            ) : (
              <div className="space-y-3">
                {user.activity.recent_activity.map((activity, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                        <Activity className="w-4 h-4 text-purple-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{activity.tool}</p>
                        <div className="flex items-center space-x-1 text-xs text-gray-500">
                          <Clock className="w-3 h-3" />
                          <span>{formatDate(activity.created_at)}</span>
                        </div>
                      </div>
                    </div>
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        activity.status === 'completed'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {activity.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Subscription History */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center space-x-2">
              <Calendar className="w-5 h-5" />
              <span>Subscription History</span>
            </h2>

            {user.history.length === 0 ? (
              <p className="text-gray-600 text-center py-8">No subscription history</p>
            ) : (
              <div className="space-y-3">
                {user.history.map((event) => (
                  <div
                    key={event.id}
                    className="flex items-start justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900 mb-1">{event.action}</p>
                      {event.previous_tier && event.new_tier && (
                        <p className="text-xs text-gray-600">
                          {event.previous_tier} → {event.new_tier}
                        </p>
                      )}
                      <p className="text-xs text-gray-500 mt-1">
                        {formatDate(event.created_at)}
                      </p>
                    </div>
                    {event.amount_paid !== null && (
                      <div className="text-right">
                        <p className="text-sm font-semibold text-gray-900">
                          {formatCurrency(event.amount_paid)}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column - Usage Stats */}
        <div className="space-y-6">
          {/* Usage Statistics */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center space-x-2">
              <TrendingUp className="w-5 h-5" />
              <span>Usage Statistics</span>
            </h2>

            <div className="space-y-4">
              <div className="p-4 bg-purple-50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Daily Usage</span>
                  <span className="text-sm font-semibold text-purple-600">
                    {user.usage.daily} / {user.usage.daily_limit}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-purple-600 h-2 rounded-full transition-all"
                    style={{
                      width: `${Math.min(
                        100,
                        (user.usage.daily / user.usage.daily_limit) * 100
                      )}%`,
                    }}
                  />
                </div>
                <p className="text-xs text-gray-600 mt-1">
                  {user.usage.daily_remaining} remaining
                </p>
              </div>

              <div className="p-4 bg-blue-50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Monthly Usage</span>
                  <span className="text-sm font-semibold text-blue-600">
                    {user.usage.monthly} / {user.usage.monthly_limit}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all"
                    style={{
                      width: `${Math.min(
                        100,
                        (user.usage.monthly / user.usage.monthly_limit) * 100
                      )}%`,
                    }}
                  />
                </div>
                <p className="text-xs text-gray-600 mt-1">
                  {user.usage.monthly_remaining} remaining
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 mt-6">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-600 mb-1">Total Usage</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {user.activity.total_tool_usage}
                  </p>
                </div>

                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-600 mb-1">Last 30 Days</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {user.activity.last_30_days_usage}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Favorite Tools */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Favorite Tools</h2>

            {user.activity.favorite_tools.length === 0 ? (
              <p className="text-gray-600 text-center py-8">No tool usage yet</p>
            ) : (
              <div className="space-y-3">
                {user.activity.favorite_tools.map((tool, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <span className="text-sm font-medium text-gray-900">{tool.tool}</span>
                    <span className="text-sm font-semibold text-purple-600">
                      {tool.count} uses
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Confirmation Dialogs */}
      <ConfirmDialog
        isOpen={showRoleConfirm}
        onClose={() => setShowRoleConfirm(false)}
        onConfirm={handleRoleChange}
        title="Confirm Role Change"
        message={`Are you sure you want to change this user's role to ${role}? This will affect their permissions and access.`}
        confirmText="Change Role"
        variant="default"
        loading={saving}
      />

      <ConfirmDialog
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={handleDelete}
        title="Delete User"
        message={`Are you sure you want to delete ${user.email}? This action cannot be undone and will permanently remove all user data.`}
        confirmText="Delete User"
        variant="danger"
        loading={saving}
      />
    </div>
  )
}
