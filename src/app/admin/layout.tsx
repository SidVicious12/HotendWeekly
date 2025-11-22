'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'
import AdminNav from '@/components/admin/AdminNav'
import { Menu, X, Home, LogOut, ChevronRight, User } from 'lucide-react'

/**
 * AdminLayout Component
 *
 * Layout wrapper for admin pages with:
 * - Admin-only access guard (redirects non-admins)
 * - Responsive sidebar navigation
 * - Header with user info and logout
 * - Breadcrumb navigation
 * - Mobile-friendly hamburger menu
 *
 * Security:
 * - Redirects non-admin users to home page
 * - Shows loading state during auth check
 *
 * @example
 * // app/admin/page.tsx
 * export default function AdminPage() {
 *   return <div>Admin content</div>
 * }
 */
export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const pathname = usePathname()
  const { user, profile, isAdmin, loading, signOut } = useAuth()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  /**
   * Access guard: redirect non-admin users
   */
  useEffect(() => {
    if (!loading && !isAdmin) {
      router.push('/')
    }
  }, [loading, isAdmin, router])

  /**
   * Generate breadcrumbs from current path
   */
  const getBreadcrumbs = () => {
    const paths = pathname.split('/').filter(Boolean)
    const breadcrumbs: { label: string; href: string }[] = [
      { label: 'Home', href: '/' },
    ]

    let currentPath = ''
    paths.forEach((path, index) => {
      currentPath += `/${path}`
      const label = path
        .split('-')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ')

      breadcrumbs.push({
        label,
        href: currentPath,
      })
    })

    return breadcrumbs
  }

  const breadcrumbs = getBreadcrumbs()

  /**
   * Show loading state while checking authentication
   */
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Verifying access...</p>
        </div>
      </div>
    )
  }

  /**
   * Don't render content for non-admin users (redirect will happen)
   */
  if (!isAdmin) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 z-50 h-full w-64 bg-white border-r border-gray-200 transition-transform duration-300 ease-in-out
          lg:translate-x-0
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <Link href="/admin" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-pink-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">H</span>
              </div>
              <span className="text-xl font-semibold text-gray-900">Admin</span>
            </Link>

            {/* Mobile Close Button */}
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-1 rounded-lg hover:bg-gray-100"
            >
              <X className="w-5 h-5 text-gray-600" />
            </button>
          </div>

          {/* Navigation */}
          <div className="flex-1 overflow-y-auto p-4">
            <AdminNav />
          </div>

          {/* User Info */}
          <div className="p-4 border-t border-gray-200">
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                <User className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {profile?.full_name || user?.email}
                </p>
                <p className="text-xs text-gray-500 capitalize">{profile?.role}</p>
              </div>
            </div>

            <button
              onClick={signOut}
              className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span className="text-sm font-medium">Sign Out</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="lg:pl-64">
        {/* Header */}
        <header className="sticky top-0 z-30 bg-white border-b border-gray-200">
          <div className="flex items-center justify-between px-6 py-4">
            {/* Mobile Menu Button */}
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
            >
              <Menu className="w-6 h-6 text-gray-600" />
            </button>

            {/* Breadcrumbs */}
            <nav className="flex items-center space-x-2 text-sm">
              {breadcrumbs.map((crumb, index) => (
                <div key={crumb.href} className="flex items-center space-x-2">
                  {index > 0 && <ChevronRight className="w-4 h-4 text-gray-400" />}
                  {index === breadcrumbs.length - 1 ? (
                    <span className="font-medium text-gray-900">{crumb.label}</span>
                  ) : (
                    <Link
                      href={crumb.href}
                      className="text-gray-500 hover:text-gray-700 transition-colors"
                    >
                      {index === 0 ? (
                        <Home className="w-4 h-4" />
                      ) : (
                        crumb.label
                      )}
                    </Link>
                  )}
                </div>
              ))}
            </nav>

            {/* Desktop User Info */}
            <div className="hidden lg:flex items-center space-x-3">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">
                  {profile?.full_name || user?.email}
                </p>
                <p className="text-xs text-gray-500 capitalize">{profile?.role}</p>
              </div>
              <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-white" />
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
