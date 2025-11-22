'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import {
  LayoutDashboard,
  Users,
  BarChart3,
  DollarSign,
  Wrench,
  FileText,
  Settings,
  ChevronRight,
  Shield,
} from 'lucide-react'

/**
 * Navigation item interface
 */
interface NavItem {
  name: string
  href: string
  icon: React.ComponentType<{ className?: string }>
  superAdminOnly?: boolean
}

/**
 * Navigation section interface
 */
interface NavSection {
  title?: string
  items: NavItem[]
}

/**
 * AdminNav Component
 *
 * Reusable sidebar navigation for admin dashboard
 * Features:
 * - Active link highlighting
 * - Role-based menu items (hide super-admin items from regular admins)
 * - Icons using lucide-react
 * - Responsive design
 *
 * @example
 * <AdminNav />
 */
export default function AdminNav() {
  const pathname = usePathname()
  const { isSuperAdmin } = useAuth()

  /**
   * Navigation sections with role-based visibility
   */
  const navSections: NavSection[] = [
    {
      items: [
        {
          name: 'Dashboard',
          href: '/admin',
          icon: LayoutDashboard,
        },
      ],
    },
    {
      title: 'Management',
      items: [
        {
          name: 'Users',
          href: '/admin/users',
          icon: Users,
        },
        {
          name: 'Analytics',
          href: '/admin/analytics',
          icon: BarChart3,
        },
        {
          name: 'Reports',
          href: '/admin/reports',
          icon: FileText,
        },
        {
          name: 'Revenue',
          href: '/admin/revenue',
          icon: DollarSign,
        },
        {
          name: 'Tools',
          href: '/admin/tools',
          icon: Wrench,
        },
      ],
    },
    {
      title: 'System',
      items: [
        {
          name: 'Audit Logs',
          href: '/admin/audit-logs',
          icon: FileText,
          superAdminOnly: true,
        },
        {
          name: 'Settings',
          href: '/admin/settings',
          icon: Settings,
          superAdminOnly: true,
        },
      ],
    },
  ]

  /**
   * Check if a navigation item should be visible based on user role
   */
  const isItemVisible = (item: NavItem): boolean => {
    if (item.superAdminOnly && !isSuperAdmin) {
      return false
    }
    return true
  }

  /**
   * Check if the current path matches the nav item
   */
  const isActive = (href: string): boolean => {
    if (href === '/admin') {
      return pathname === href
    }
    return pathname.startsWith(href)
  }

  return (
    <nav className="space-y-6">
      {navSections.map((section, sectionIndex) => {
        // Filter out items based on role
        const visibleItems = section.items.filter(isItemVisible)

        // Don't render section if no visible items
        if (visibleItems.length === 0) {
          return null
        }

        return (
          <div key={sectionIndex}>
            {/* Section Title */}
            {section.title && (
              <h3 className="px-3 mb-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                {section.title}
              </h3>
            )}

            {/* Navigation Items */}
            <div className="space-y-1">
              {visibleItems.map((item) => {
                const Icon = item.icon
                const active = isActive(item.href)

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`
                      group flex items-center justify-between px-3 py-2 rounded-lg transition-all duration-200
                      ${
                        active
                          ? 'bg-purple-50 text-purple-700'
                          : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                      }
                    `}
                  >
                    <div className="flex items-center space-x-3">
                      <Icon
                        className={`
                          w-5 h-5 transition-colors
                          ${active ? 'text-purple-600' : 'text-gray-400 group-hover:text-gray-600'}
                        `}
                      />
                      <span className="text-sm font-medium">{item.name}</span>
                      {item.superAdminOnly && (
                        <Shield className="w-3 h-3 text-purple-500" />
                      )}
                    </div>

                    {active && (
                      <ChevronRight className="w-4 h-4 text-purple-600" />
                    )}
                  </Link>
                )
              })}
            </div>
          </div>
        )
      })}
    </nav>
  )
}
