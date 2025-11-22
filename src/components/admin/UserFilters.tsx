'use client'

import { Search, X, Filter } from 'lucide-react'
import { useState, useEffect } from 'react'

/**
 * UserFilters Props
 */
interface UserFiltersProps {
  onFilterChange: (filters: UserFilterValues) => void
  loading?: boolean
}

/**
 * User filter values
 */
export interface UserFilterValues {
  search: string
  tier: string
  status: string
  role: string
}

/**
 * UserFilters Component
 *
 * Search and filter controls for user management table.
 * Features:
 * - Search by email or name
 * - Filter by subscription tier, status, and role
 * - Clear all filters button
 * - Active filter count badge
 * - Responsive design
 * - Debounced search input
 *
 * @example
 * <UserFilters
 *   onFilterChange={(filters) => setFilters(filters)}
 *   loading={isLoading}
 * />
 */
export default function UserFilters({ onFilterChange, loading = false }: UserFiltersProps) {
  const [filters, setFilters] = useState<UserFilterValues>({
    search: '',
    tier: '',
    status: '',
    role: '',
  })

  const [searchInput, setSearchInput] = useState('')

  /**
   * Debounce search input
   */
  useEffect(() => {
    const timer = setTimeout(() => {
      setFilters((prev) => ({ ...prev, search: searchInput }))
    }, 300)

    return () => clearTimeout(timer)
  }, [searchInput])

  /**
   * Notify parent of filter changes
   */
  useEffect(() => {
    onFilterChange(filters)
  }, [filters, onFilterChange])

  /**
   * Clear all filters
   */
  const handleClearFilters = () => {
    setSearchInput('')
    setFilters({
      search: '',
      tier: '',
      status: '',
      role: '',
    })
  }

  /**
   * Count active filters
   */
  const getActiveFilterCount = () => {
    let count = 0
    if (filters.search) count++
    if (filters.tier) count++
    if (filters.status) count++
    if (filters.role) count++
    return count
  }

  const activeCount = getActiveFilterCount()

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Filter className="w-5 h-5 text-gray-600" />
          <h3 className="font-semibold text-gray-900">Filters</h3>
          {activeCount > 0 && (
            <span className="px-2 py-0.5 bg-purple-100 text-purple-700 text-xs font-semibold rounded-full">
              {activeCount}
            </span>
          )}
        </div>

        {activeCount > 0 && (
          <button
            onClick={handleClearFilters}
            disabled={loading}
            className="text-sm text-purple-600 hover:text-purple-700 font-medium flex items-center space-x-1 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <X className="w-4 h-4" />
            <span>Clear All</span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Search Input */}
        <div className="relative">
          <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
            Search
          </label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              id="search"
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Email or name..."
              disabled={loading}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:bg-gray-50 disabled:cursor-not-allowed text-sm"
            />
            {searchInput && (
              <button
                onClick={() => setSearchInput('')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Tier Filter */}
        <div>
          <label htmlFor="tier" className="block text-sm font-medium text-gray-700 mb-1">
            Subscription Tier
          </label>
          <select
            id="tier"
            value={filters.tier}
            onChange={(e) => setFilters({ ...filters, tier: e.target.value })}
            disabled={loading}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:bg-gray-50 disabled:cursor-not-allowed text-sm"
          >
            <option value="">All Tiers</option>
            <option value="free">Free</option>
            <option value="basic">Basic</option>
            <option value="pro">Pro</option>
            <option value="enterprise">Enterprise</option>
          </select>
        </div>

        {/* Status Filter */}
        <div>
          <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
            Subscription Status
          </label>
          <select
            id="status"
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
            disabled={loading}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:bg-gray-50 disabled:cursor-not-allowed text-sm"
          >
            <option value="">All Statuses</option>
            <option value="active">Active</option>
            <option value="trialing">Trialing</option>
            <option value="inactive">Inactive</option>
            <option value="past_due">Past Due</option>
            <option value="canceled">Canceled</option>
            <option value="unpaid">Unpaid</option>
          </select>
        </div>

        {/* Role Filter */}
        <div>
          <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">
            User Role
          </label>
          <select
            id="role"
            value={filters.role}
            onChange={(e) => setFilters({ ...filters, role: e.target.value })}
            disabled={loading}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:bg-gray-50 disabled:cursor-not-allowed text-sm"
          >
            <option value="">All Roles</option>
            <option value="user">User</option>
            <option value="admin">Admin</option>
            <option value="super_admin">Super Admin</option>
          </select>
        </div>
      </div>
    </div>
  )
}
