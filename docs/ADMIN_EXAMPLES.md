# Admin System Implementation Examples

Real-world examples for implementing admin features in HotendWeekly.

## Example 1: Admin Dashboard Route

Create a protected admin dashboard that shows user statistics.

```typescript
// src/app/admin/dashboard/page.tsx
'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'

interface Stats {
  total: number
  active: number
  admins: number
}

export default function AdminDashboard() {
  const { isAdmin, loading } = useAuth()
  const router = useRouter()
  const [stats, setStats] = useState<Stats | null>(null)

  useEffect(() => {
    if (!loading && !isAdmin) {
      router.push('/')
    }
  }, [isAdmin, loading, router])

  useEffect(() => {
    if (isAdmin) {
      fetchStats()
    }
  }, [isAdmin])

  async function fetchStats() {
    const response = await fetch('/api/admin/stats')
    const data = await response.json()
    setStats(data)
  }

  if (loading) return <div>Loading...</div>
  if (!isAdmin) return null

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

      <div className="grid grid-cols-3 gap-4">
        <StatCard
          title="Total Users"
          value={stats?.total || 0}
          color="blue"
        />
        <StatCard
          title="Active Users"
          value={stats?.active || 0}
          color="green"
        />
        <StatCard
          title="Admins"
          value={stats?.admins || 0}
          color="purple"
        />
      </div>
    </div>
  )
}

function StatCard({ title, value, color }: {
  title: string
  value: number
  color: string
}) {
  return (
    <div className={`p-6 bg-${color}-50 rounded-lg`}>
      <h3 className="text-lg font-semibold text-gray-700">{title}</h3>
      <p className={`text-4xl font-bold text-${color}-600 mt-2`}>{value}</p>
    </div>
  )
}
```

## Example 2: Admin Stats API Endpoint

Server-side API to fetch user statistics.

```typescript
// src/app/api/admin/stats/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/middleware/admin'
import { getUserStats, getSubscriptionStats } from '@/lib/admin'

export async function GET(request: NextRequest) {
  // Check admin access
  const authError = await requireAdmin(request)
  if (authError) return authError

  try {
    // Get statistics
    const userStats = await getUserStats()
    const subStats = await getSubscriptionStats()

    if (userStats.error) {
      return NextResponse.json(
        { error: userStats.error },
        { status: 500 }
      )
    }

    return NextResponse.json({
      ...userStats,
      subscriptions: subStats
    })
  } catch (error) {
    console.error('Error fetching admin stats:', error)
    return NextResponse.json(
      { error: 'Failed to fetch statistics' },
      { status: 500 }
    )
  }
}
```

## Example 3: User Management Table

Component to display and manage users.

```typescript
// src/app/admin/users/page.tsx
'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'

interface User {
  id: string
  email: string
  full_name: string
  role: string
  created_at: string
}

export default function UserManagement() {
  const { isSuperAdmin, isAdmin } = useAuth()
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchUsers()
  }, [])

  async function fetchUsers() {
    const response = await fetch('/api/admin/users')
    const data = await response.json()
    setUsers(data.users || [])
    setLoading(false)
  }

  async function updateRole(userId: string, newRole: string) {
    if (!isSuperAdmin) {
      alert('Only super admins can change roles')
      return
    }

    const confirmed = confirm(
      `Are you sure you want to change this user's role to ${newRole}?`
    )
    if (!confirmed) return

    const response = await fetch(`/api/admin/users/${userId}/role`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ role: newRole })
    })

    if (response.ok) {
      alert('Role updated successfully')
      fetchUsers()
    } else {
      const error = await response.json()
      alert(`Error: ${error.error}`)
    }
  }

  if (loading) return <div>Loading...</div>
  if (!isAdmin) return <div>Access Denied</div>

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">User Management</h1>

      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-3 text-left">Email</th>
            <th className="p-3 text-left">Name</th>
            <th className="p-3 text-left">Role</th>
            <th className="p-3 text-left">Joined</th>
            {isSuperAdmin && <th className="p-3 text-left">Actions</th>}
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id} className="border-b">
              <td className="p-3">{user.email}</td>
              <td className="p-3">{user.full_name || '-'}</td>
              <td className="p-3">
                <span className={`px-2 py-1 rounded text-sm ${
                  user.role === 'super_admin' ? 'bg-purple-100 text-purple-800' :
                  user.role === 'admin' ? 'bg-blue-100 text-blue-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {user.role}
                </span>
              </td>
              <td className="p-3">
                {new Date(user.created_at).toLocaleDateString()}
              </td>
              {isSuperAdmin && (
                <td className="p-3">
                  <select
                    value={user.role}
                    onChange={(e) => updateRole(user.id, e.target.value)}
                    className="border rounded px-2 py-1"
                  >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                    <option value="super_admin">Super Admin</option>
                  </select>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
```

## Example 4: Get All Users API

```typescript
// src/app/api/admin/users/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { withAdminAuth } from '@/middleware/admin'
import { createServerClient } from '@/lib/supabase-server'

export const GET = withAdminAuth(async (request: NextRequest) => {
  const supabase = createServerClient()

  const { data: users, error } = await supabase
    .from('user_profiles')
    .select('id, email, full_name, role, created_at, last_login_at')
    .order('created_at', { ascending: false })

  if (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }

  return NextResponse.json({ users })
})
```

## Example 5: Update User Role API

```typescript
// src/app/api/admin/users/[id]/role/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin, checkUserRole, updateUserRole } from '@/middleware/admin'
import { createAuditLog, validateAdminAction } from '@/lib/admin'

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  // Require super admin access
  const authError = await requireAdmin(request, true)
  if (authError) return authError

  // Get current user
  const { userId } = await checkUserRole()
  if (!userId) {
    return NextResponse.json(
      { error: 'User not found' },
      { status: 404 }
    )
  }

  // Parse request
  const { role } = await request.json()
  const targetId = params.id

  // Validate role
  if (!['user', 'admin', 'super_admin'].includes(role)) {
    return NextResponse.json(
      { error: 'Invalid role' },
      { status: 400 }
    )
  }

  // Validate action
  const validation = await validateAdminAction(
    userId,
    targetId,
    'update_role'
  )

  if (!validation.allowed) {
    return NextResponse.json(
      { error: validation.reason },
      { status: 403 }
    )
  }

  // Update role
  const result = await updateUserRole(targetId, role)

  if (!result.success) {
    return NextResponse.json(
      { error: result.error },
      { status: 500 }
    )
  }

  // Create audit log
  await createAuditLog({
    user_id: userId,
    action: 'user.role_changed',
    resource_type: 'user',
    resource_id: targetId,
    details: { new_role: role },
    ip_address: request.headers.get('x-forwarded-for') || undefined,
    user_agent: request.headers.get('user-agent') || undefined
  })

  return NextResponse.json({ success: true })
}
```

## Example 6: Audit Logs Viewer

```typescript
// src/app/admin/audit-logs/page.tsx
'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { formatAuditAction } from '@/lib/admin'

interface AuditLog {
  id: string
  user_id: string
  action: string
  resource_type: string
  resource_id: string
  details: any
  created_at: string
}

export default function AuditLogsPage() {
  const { isAdmin } = useAuth()
  const [logs, setLogs] = useState<AuditLog[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (isAdmin) {
      fetchLogs()
    }
  }, [isAdmin])

  async function fetchLogs() {
    const response = await fetch('/api/admin/audit-logs?limit=100')
    const data = await response.json()
    setLogs(data.logs || [])
    setLoading(false)
  }

  if (loading) return <div>Loading...</div>
  if (!isAdmin) return <div>Access Denied</div>

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Audit Logs</h1>

      <div className="space-y-2">
        {logs.map(log => (
          <div
            key={log.id}
            className="p-4 bg-white border rounded-lg shadow-sm"
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold">
                  {formatAuditAction(log.action as any)}
                </h3>
                <p className="text-sm text-gray-600">
                  Resource: {log.resource_type}
                </p>
                {log.details && (
                  <pre className="text-xs mt-2 bg-gray-50 p-2 rounded">
                    {JSON.stringify(log.details, null, 2)}
                  </pre>
                )}
              </div>
              <div className="text-right text-sm text-gray-500">
                {new Date(log.created_at).toLocaleString()}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
```

## Example 7: Audit Logs API

```typescript
// src/app/api/admin/audit-logs/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { withAdminAuth } from '@/middleware/admin'
import { getAuditLogs } from '@/lib/admin'

export const GET = withAdminAuth(async (request: NextRequest) => {
  const { searchParams } = new URL(request.url)
  const limit = parseInt(searchParams.get('limit') || '50')
  const action = searchParams.get('action') || undefined

  const { data: logs, error } = await getAuditLogs({
    action: action as any,
    limit
  })

  if (error) {
    return NextResponse.json(
      { error },
      { status: 500 }
    )
  }

  return NextResponse.json({ logs })
})
```

## Example 8: Protected Component

Component that conditionally renders based on admin status.

```tsx
// src/components/AdminOnly.tsx
import { useAuth } from '@/contexts/AuthContext'

interface AdminOnlyProps {
  children: React.ReactNode
  requireSuperAdmin?: boolean
  fallback?: React.ReactNode
}

export function AdminOnly({
  children,
  requireSuperAdmin = false,
  fallback = null
}: AdminOnlyProps) {
  const { isAdmin, isSuperAdmin, loading } = useAuth()

  if (loading) return null

  const hasAccess = requireSuperAdmin ? isSuperAdmin : isAdmin

  if (!hasAccess) return <>{fallback}</>

  return <>{children}</>
}

// Usage:
// <AdminOnly>
//   <AdminFeatures />
// </AdminOnly>

// <AdminOnly requireSuperAdmin fallback={<div>Access Denied</div>}>
//   <SuperAdminFeatures />
// </AdminOnly>
```

## Example 9: Permission-Based UI

Show/hide UI elements based on permissions.

```tsx
// src/components/PermissionGate.tsx
'use client'

import { useEffect, useState } from 'react'
import { hasPermission, hasAllPermissions, hasAnyPermission } from '@/lib/admin'

interface PermissionGateProps {
  children: React.ReactNode
  permission?: string
  allPermissions?: string[]
  anyPermissions?: string[]
  fallback?: React.ReactNode
}

export function PermissionGate({
  children,
  permission,
  allPermissions,
  anyPermissions,
  fallback = null
}: PermissionGateProps) {
  const [allowed, setAllowed] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    checkPermissions()
  }, [permission, allPermissions, anyPermissions])

  async function checkPermissions() {
    let hasAccess = false

    if (permission) {
      hasAccess = await hasPermission(permission as any)
    } else if (allPermissions) {
      hasAccess = await hasAllPermissions(allPermissions as any)
    } else if (anyPermissions) {
      hasAccess = await hasAnyPermission(anyPermissions as any)
    }

    setAllowed(hasAccess)
    setLoading(false)
  }

  if (loading) return null
  if (!allowed) return <>{fallback}</>

  return <>{children}</>
}

// Usage:
// <PermissionGate permission="manage_users">
//   <UserManagementButton />
// </PermissionGate>

// <PermissionGate allPermissions={['manage_users', 'manage_subscriptions']}>
//   <FullAdminPanel />
// </PermissionGate>
```

## Example 10: Navigation with Role-Based Access

```tsx
// src/components/AdminNav.tsx
'use client'

import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'

export function AdminNav() {
  const { isAdmin, isSuperAdmin } = useAuth()

  if (!isAdmin) return null

  return (
    <nav className="bg-gray-800 text-white">
      <div className="container mx-auto px-4">
        <ul className="flex space-x-6 py-4">
          <li>
            <Link href="/admin/dashboard" className="hover:text-blue-300">
              Dashboard
            </Link>
          </li>
          <li>
            <Link href="/admin/users" className="hover:text-blue-300">
              Users
            </Link>
          </li>
          <li>
            <Link href="/admin/subscriptions" className="hover:text-blue-300">
              Subscriptions
            </Link>
          </li>
          <li>
            <Link href="/admin/audit-logs" className="hover:text-blue-300">
              Audit Logs
            </Link>
          </li>
          {isSuperAdmin && (
            <>
              <li>
                <Link href="/admin/settings" className="hover:text-blue-300">
                  Settings
                </Link>
              </li>
              <li>
                <Link href="/admin/admins" className="hover:text-blue-300">
                  Admin Management
                </Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  )
}
```

## Best Practices Summary

1. **Always validate on server-side** - Never trust client-side checks
2. **Log important actions** - Use audit logs for accountability
3. **Validate before modifying** - Check permissions and relationships
4. **Use appropriate middleware** - `requireAdmin` for routes, `withAdminAuth` for handlers
5. **Handle errors gracefully** - Provide clear error messages
6. **Check role hierarchies** - Admins can't modify super admins
7. **Use TypeScript types** - Leverage type safety for roles and permissions
8. **Implement fallbacks** - Show appropriate UI for unauthorized users
9. **Test thoroughly** - Test with all role types
10. **Document changes** - Keep audit trail of admin actions

## Testing Checklist

- [ ] Regular users cannot access admin routes
- [ ] Admins can access admin features
- [ ] Super admins have full access
- [ ] Role updates are logged
- [ ] Admins cannot modify super admins
- [ ] RLS policies work correctly
- [ ] Client-side context updates on login
- [ ] Audit logs are created properly
- [ ] Permission checks work as expected
- [ ] Error handling works correctly
