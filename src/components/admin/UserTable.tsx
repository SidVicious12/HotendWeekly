'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  ChevronUp,
  ChevronDown,
  ChevronsUpDown,
  User,
  Loader2,
  AlertCircle,
} from 'lucide-react'
import type { UserListItem } from '@/app/api/admin/users/route'

/**
 * UserTable Props
 */
interface UserTableProps {
  users: UserListItem[]
  loading?: boolean
  error?: string
  sortBy: string
  sortOrder: 'asc' | 'desc'
  onSort: (field: string) => void
}

/**
 * UserTable Component
 *
 * Reusable data table for displaying users with sorting and selection.
 * Features:
 * - Sortable columns (email, created_at, tier, status, role)
 * - Click user row to view/edit details
 * - Status and role badges with color coding
 * - Mobile-responsive (stacks on small screens)
 * - Loading and empty states
 * - Avatar display with fallback
 *
 * @example
 * <UserTable
 *   users={users}
 *   loading={loading}
 *   sortBy={sortBy}
 *   sortOrder={sortOrder}
 *   onSort={(field) => handleSort(field)}
 * />
 */
export default function UserTable({
  users,
  loading = false,
  error,
  sortBy,
  sortOrder,
  onSort,
}: UserTableProps) {
  const router = useRouter()
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set())

  /**
   * Get sort icon for column
   */
  const getSortIcon = (field: string) => {
    if (sortBy !== field) {
      return <ChevronsUpDown className="w-4 h-4 text-gray-400" />
    }
    return sortOrder === 'asc' ? (
      <ChevronUp className="w-4 h-4 text-purple-600" />
    ) : (
      <ChevronDown className="w-4 h-4 text-purple-600" />
    )
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
   * Get role badge styling
   */
  const getRoleBadge = (role: string) => {
    const styles: Record<string, string> = {
      super_admin: 'bg-purple-100 text-purple-700 border-purple-200',
      admin: 'bg-blue-100 text-blue-700 border-blue-200',
      user: 'bg-gray-100 text-gray-700 border-gray-200',
    }

    return styles[role] || styles.user
  }

  /**
   * Format date for display
   */
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  /**
   * Handle row click to view user details
   */
  const handleRowClick = (userId: string) => {
    router.push(`/admin/users/${userId}`)
  }

  /**
   * Toggle row selection
   */
  const toggleRowSelection = (userId: string, e: React.ChangeEvent<HTMLInputElement>) => {
    e.stopPropagation()
    const newSelection = new Set(selectedRows)
    if (newSelection.has(userId)) {
      newSelection.delete(userId)
    } else {
      newSelection.add(userId)
    }
    setSelectedRows(newSelection)
  }

  /**
   * Loading state
   */
  if (loading) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-12 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 text-purple-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading users...</p>
        </div>
      </div>
    )
  }

  /**
   * Error state
   */
  if (error) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-12 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-8 h-8 text-red-600 mx-auto mb-4" />
          <p className="text-gray-900 font-semibold mb-2">Error Loading Users</p>
          <p className="text-sm text-gray-600">{error}</p>
        </div>
      </div>
    )
  }

  /**
   * Empty state
   */
  if (users.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-12 flex items-center justify-center">
        <div className="text-center">
          <User className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-900 font-semibold mb-2">No Users Found</p>
          <p className="text-sm text-gray-600">
            Try adjusting your filters or search criteria.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      {/* Desktop Table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="w-12 px-4 py-3">
                <input
                  type="checkbox"
                  className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedRows(new Set(users.map((u) => u.id)))
                    } else {
                      setSelectedRows(new Set())
                    }
                  }}
                  checked={selectedRows.size === users.length && users.length > 0}
                />
              </th>
              <th className="px-4 py-3 text-left">
                <button
                  onClick={() => onSort('email')}
                  className="flex items-center space-x-1 text-xs font-semibold text-gray-700 uppercase tracking-wider hover:text-purple-600"
                >
                  <span>User</span>
                  {getSortIcon('email')}
                </button>
              </th>
              <th className="px-4 py-3 text-left">
                <button
                  onClick={() => onSort('role')}
                  className="flex items-center space-x-1 text-xs font-semibold text-gray-700 uppercase tracking-wider hover:text-purple-600"
                >
                  <span>Role</span>
                  {getSortIcon('role')}
                </button>
              </th>
              <th className="px-4 py-3 text-left">
                <span className="text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Tier
                </span>
              </th>
              <th className="px-4 py-3 text-left">
                <button
                  onClick={() => onSort('subscription_status')}
                  className="flex items-center space-x-1 text-xs font-semibold text-gray-700 uppercase tracking-wider hover:text-purple-600"
                >
                  <span>Status</span>
                  {getSortIcon('subscription_status')}
                </button>
              </th>
              <th className="px-4 py-3 text-left">
                <span className="text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Usage
                </span>
              </th>
              <th className="px-4 py-3 text-left">
                <button
                  onClick={() => onSort('created_at')}
                  className="flex items-center space-x-1 text-xs font-semibold text-gray-700 uppercase tracking-wider hover:text-purple-600"
                >
                  <span>Joined</span>
                  {getSortIcon('created_at')}
                </button>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {users.map((user) => (
              <tr
                key={user.id}
                onClick={() => handleRowClick(user.id)}
                className="hover:bg-gray-50 cursor-pointer transition-colors"
              >
                <td className="px-4 py-4">
                  <input
                    type="checkbox"
                    className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                    checked={selectedRows.has(user.id)}
                    onChange={(e) => toggleRowSelection(user.id, e)}
                    onClick={(e) => e.stopPropagation()}
                  />
                </td>
                <td className="px-4 py-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-semibold flex-shrink-0">
                      {user.avatar_url ? (
                        <img
                          src={user.avatar_url}
                          alt={user.full_name || user.email}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                      ) : (
                        <span className="text-sm">
                          {(user.full_name || user.email).charAt(0).toUpperCase()}
                        </span>
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {user.full_name || 'No name'}
                      </p>
                      <p className="text-sm text-gray-500 truncate">{user.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-4">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getRoleBadge(
                      user.role
                    )}`}
                  >
                    {user.role === 'super_admin' ? 'Super Admin' : user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                  </span>
                </td>
                <td className="px-4 py-4">
                  <span className="text-sm text-gray-900">
                    {user.tier?.name || 'No tier'}
                  </span>
                </td>
                <td className="px-4 py-4">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusBadge(
                      user.subscription_status
                    )}`}
                  >
                    {user.subscription_status.charAt(0).toUpperCase() + user.subscription_status.slice(1).replace('_', ' ')}
                  </span>
                </td>
                <td className="px-4 py-4">
                  <div className="text-sm">
                    <p className="text-gray-900">{user.usage.daily} / day</p>
                    <p className="text-gray-500">{user.usage.monthly} / month</p>
                  </div>
                </td>
                <td className="px-4 py-4">
                  <span className="text-sm text-gray-500">
                    {formatDate(user.created_at)}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden divide-y divide-gray-200">
        {users.map((user) => (
          <div
            key={user.id}
            onClick={() => handleRowClick(user.id)}
            className="p-4 hover:bg-gray-50 cursor-pointer transition-colors"
          >
            <div className="flex items-start space-x-3 mb-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-semibold flex-shrink-0">
                {user.avatar_url ? (
                  <img
                    src={user.avatar_url}
                    alt={user.full_name || user.email}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                ) : (
                  <span>{(user.full_name || user.email).charAt(0).toUpperCase()}</span>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {user.full_name || 'No name'}
                </p>
                <p className="text-sm text-gray-500 truncate">{user.email}</p>
                <div className="flex flex-wrap gap-2 mt-2">
                  <span
                    className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${getRoleBadge(
                      user.role
                    )}`}
                  >
                    {user.role}
                  </span>
                  <span
                    className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${getStatusBadge(
                      user.subscription_status
                    )}`}
                  >
                    {user.subscription_status}
                  </span>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <span className="text-gray-500">Tier:</span>{' '}
                <span className="text-gray-900">{user.tier?.name || 'None'}</span>
              </div>
              <div>
                <span className="text-gray-500">Usage:</span>{' '}
                <span className="text-gray-900">{user.usage.monthly}/mo</span>
              </div>
              <div className="col-span-2">
                <span className="text-gray-500">Joined:</span>{' '}
                <span className="text-gray-900">{formatDate(user.created_at)}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
