'use client'

import { useState, useEffect, useCallback } from 'react'
import { Download, RefreshCw } from 'lucide-react'
import UserTable from '@/components/admin/UserTable'
import UserFilters, { UserFilterValues } from '@/components/admin/UserFilters'
import type { UserListItem, UserListResponse } from '@/app/api/admin/users/route'

/**
 * UsersPage Component
 *
 * User management page with comprehensive features:
 * - Data table with all users
 * - Search bar (by email/name)
 * - Filter dropdowns (tier, status, role)
 * - Pagination controls
 * - Sort by columns (email, created, tier, status)
 * - Click user row to view/edit details
 * - Loading and error states
 * - Export users button
 * - Real-time data refresh
 *
 * Features:
 * - Debounced search for performance
 * - Client-side state management
 * - Responsive design
 * - Accessible controls
 */
export default function UsersPage() {
  // State management
  const [users, setUsers] = useState<UserListItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filters, setFilters] = useState<UserFilterValues>({
    search: '',
    tier: '',
    status: '',
    role: '',
  })
  const [sortBy, setSortBy] = useState('created_at')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')
  const [page, setPage] = useState(1)
  const [limit] = useState(20)
  const [totalPages, setTotalPages] = useState(1)
  const [total, setTotal] = useState(0)

  /**
   * Fetch users from API
   */
  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      // Build query parameters
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        sortBy,
        sortOrder,
      })

      if (filters.search) params.append('search', filters.search)
      if (filters.tier) params.append('tier', filters.tier)
      if (filters.status) params.append('status', filters.status)
      if (filters.role) params.append('role', filters.role)

      const response = await fetch(`/api/admin/users?${params.toString()}`)

      if (!response.ok) {
        throw new Error('Failed to fetch users')
      }

      const result = await response.json()

      if (!result.success) {
        throw new Error(result.error || 'Failed to fetch users')
      }

      const data: UserListResponse = result.data

      setUsers(data.users)
      setTotal(data.pagination.total)
      setTotalPages(data.pagination.totalPages)
    } catch (err) {
      console.error('Error fetching users:', err)
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }, [page, limit, sortBy, sortOrder, filters])

  /**
   * Fetch users on mount and when dependencies change
   */
  useEffect(() => {
    fetchUsers()
  }, [fetchUsers])

  /**
   * Handle filter changes (reset to page 1)
   */
  const handleFilterChange = useCallback((newFilters: UserFilterValues) => {
    setFilters(newFilters)
    setPage(1)
  }, [])

  /**
   * Handle sort changes
   */
  const handleSort = (field: string) => {
    if (sortBy === field) {
      // Toggle order if same field
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      // New field, default to descending
      setSortBy(field)
      setSortOrder('desc')
    }
    setPage(1) // Reset to page 1 when sorting changes
  }

  /**
   * Handle page change
   */
  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  /**
   * Handle refresh
   */
  const handleRefresh = () => {
    fetchUsers()
  }

  /**
   * Handle export users to CSV
   */
  const handleExport = async () => {
    try {
      // Build query parameters for export (no pagination)
      const params = new URLSearchParams({
        page: '1',
        limit: '10000', // Large limit to get all users
        sortBy,
        sortOrder,
      })

      if (filters.search) params.append('search', filters.search)
      if (filters.tier) params.append('tier', filters.tier)
      if (filters.status) params.append('status', filters.status)
      if (filters.role) params.append('role', filters.role)

      const response = await fetch(`/api/admin/users?${params.toString()}`)
      const result = await response.json()

      if (!result.success) {
        throw new Error(result.error || 'Failed to export users')
      }

      const data: UserListResponse = result.data

      // Convert to CSV
      const headers = ['Email', 'Name', 'Role', 'Tier', 'Status', 'Daily Usage', 'Monthly Usage', 'Created']
      const rows = data.users.map(user => [
        user.email,
        user.full_name || '',
        user.role,
        user.tier?.name || '',
        user.subscription_status,
        user.usage.daily.toString(),
        user.usage.monthly.toString(),
        new Date(user.created_at).toLocaleDateString(),
      ])

      const csv = [
        headers.join(','),
        ...rows.map(row => row.map(cell => `"${cell}"`).join(',')),
      ].join('\n')

      // Download CSV
      const blob = new Blob([csv], { type: 'text/csv' })
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `users-export-${new Date().toISOString().split('T')[0]}.csv`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      window.URL.revokeObjectURL(url)
    } catch (err) {
      console.error('Error exporting users:', err)
      alert('Failed to export users')
    }
  }

  /**
   * Get pagination info text
   */
  const getPaginationInfo = () => {
    const start = (page - 1) * limit + 1
    const end = Math.min(page * limit, total)
    return `Showing ${start}-${end} of ${total} users`
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">User Management</h1>
          <p className="text-gray-600">Manage user accounts, roles, and subscriptions</p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={handleRefresh}
            disabled={loading}
            className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>

          <button
            onClick={handleExport}
            disabled={loading || users.length === 0}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
          >
            <Download className="w-4 h-4" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Filters */}
      <UserFilters onFilterChange={handleFilterChange} loading={loading} />

      {/* Users Table */}
      <UserTable
        users={users}
        loading={loading}
        error={error || undefined}
        sortBy={sortBy}
        sortOrder={sortOrder}
        onSort={handleSort}
      />

      {/* Pagination */}
      {!loading && !error && users.length > 0 && (
        <div className="mt-6 bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0">
            {/* Pagination Info */}
            <p className="text-sm text-gray-600">{getPaginationInfo()}</p>

            {/* Pagination Controls */}
            <div className="flex items-center space-x-2">
              <button
                onClick={() => handlePageChange(1)}
                disabled={page === 1}
                className="px-3 py-1 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                First
              </button>
              <button
                onClick={() => handlePageChange(page - 1)}
                disabled={page === 1}
                className="px-3 py-1 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>

              {/* Page Numbers */}
              <div className="flex items-center space-x-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum: number
                  if (totalPages <= 5) {
                    pageNum = i + 1
                  } else if (page <= 3) {
                    pageNum = i + 1
                  } else if (page >= totalPages - 2) {
                    pageNum = totalPages - 4 + i
                  } else {
                    pageNum = page - 2 + i
                  }

                  return (
                    <button
                      key={pageNum}
                      onClick={() => handlePageChange(pageNum)}
                      className={`px-3 py-1 rounded-lg text-sm font-medium ${
                        page === pageNum
                          ? 'bg-purple-600 text-white'
                          : 'border border-gray-300 text-gray-700 bg-white hover:bg-gray-50'
                      }`}
                    >
                      {pageNum}
                    </button>
                  )
                })}
              </div>

              <button
                onClick={() => handlePageChange(page + 1)}
                disabled={page === totalPages}
                className="px-3 py-1 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
              <button
                onClick={() => handlePageChange(totalPages)}
                disabled={page === totalPages}
                className="px-3 py-1 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Last
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
