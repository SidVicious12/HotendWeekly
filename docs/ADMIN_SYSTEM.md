# Admin Authentication & Authorization System

Complete admin authentication and authorization system for HotendWeekly with role-based access control (RBAC).

## Overview

This system provides three user roles with different permission levels:

- **`user`** - Default role for all new users
- **`admin`** - Administrative access with most permissions
- **`super_admin`** - Full system access including role management

## File Structure

```
src/
├── middleware/
│   └── admin.ts           # Server-side admin middleware and auth checks
├── lib/
│   └── admin.ts           # Admin utilities and permission checks
├── contexts/
│   └── AuthContext.tsx    # Client-side auth context with role info
└── supabase-migrations.sql # Database schema with role and audit tables
```

## Database Schema

### User Roles

Added to `user_profiles` table:

```sql
role TEXT DEFAULT 'user'
  CHECK (role IN ('user', 'admin', 'super_admin'))
```

### Audit Logs Table

New table for tracking admin actions:

```sql
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL,
  action TEXT NOT NULL,
  resource_type TEXT NOT NULL,
  resource_id UUID,
  details JSONB,
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMP
);
```

### Database Functions

- `is_admin(user_id)` - Check if user is admin or super_admin
- `is_super_admin(user_id)` - Check if user is super_admin

## Server-Side Usage

### Middleware Functions

#### `checkUserRole()`

Get current user's authentication and role information:

```typescript
import { checkUserRole } from '@/middleware/admin'

export async function GET(request: NextRequest) {
  const { isAdmin, role, userId } = await checkUserRole()

  if (!isAdmin) {
    return new Response('Unauthorized', { status: 403 })
  }

  // Admin logic here...
}
```

#### `requireAdmin(request, requireSuperAdmin?)`

Protect routes with admin checks:

```typescript
import { requireAdmin } from '@/middleware/admin'

export async function GET(request: NextRequest) {
  const authError = await requireAdmin(request)
  if (authError) return authError

  // Admin-only logic here...
}

// Require super admin
export async function DELETE(request: NextRequest) {
  const authError = await requireAdmin(request, true)
  if (authError) return authError

  // Super admin-only logic here...
}
```

#### `withAdminAuth()` Wrapper

Wrap API handlers with automatic admin checks:

```typescript
import { withAdminAuth } from '@/middleware/admin'

// Admin access required
export const GET = withAdminAuth(async (request: NextRequest) => {
  return NextResponse.json({ data: 'admin data' })
})

// Super admin access required
export const DELETE = withAdminAuth(async (request: NextRequest) => {
  return NextResponse.json({ deleted: true })
}, true)
```

### Admin Utilities

#### Permission Checks

```typescript
import {
  hasPermission,
  hasAllPermissions,
  hasAnyPermission
} from '@/lib/admin'

// Check single permission
if (await hasPermission('manage_users')) {
  // Show user management UI
}

// Check multiple permissions
if (await hasAllPermissions(['manage_users', 'manage_subscriptions'])) {
  // Show full admin panel
}

// Check any permission
if (await hasAnyPermission(['manage_users', 'view_analytics'])) {
  // Show some admin features
}
```

#### Available Permissions

- `manage_users` - Admin, Super Admin
- `manage_subscriptions` - Admin, Super Admin
- `view_analytics` - Admin, Super Admin
- `manage_content` - Admin, Super Admin
- `manage_billing` - Admin, Super Admin
- `view_audit_logs` - Admin, Super Admin
- `manage_settings` - Super Admin only
- `manage_admins` - Super Admin only

#### Audit Logging

```typescript
import { createAuditLog } from '@/lib/admin'

await createAuditLog({
  user_id: userId,
  action: 'user.role_changed',
  resource_type: 'user',
  resource_id: targetUserId,
  details: {
    old_role: 'user',
    new_role: 'admin'
  },
  ip_address: request.headers.get('x-forwarded-for'),
  user_agent: request.headers.get('user-agent')
})
```

#### Get Audit Logs

```typescript
import { getAuditLogs } from '@/lib/admin'

const { data: logs } = await getAuditLogs({
  userId: 'user-id',
  action: 'user.role_changed',
  limit: 50
})
```

#### Admin Statistics

```typescript
import { getUserStats, getSubscriptionStats } from '@/lib/admin'

// User statistics
const stats = await getUserStats()
console.log(`Total users: ${stats.total}`)
console.log(`Active users: ${stats.active}`)
console.log(`Admins: ${stats.admins}`)

// Subscription statistics
const subStats = await getSubscriptionStats()
console.log(`Free tier: ${subStats.tinkerer}`)
```

#### Validate Admin Actions

```typescript
import { validateAdminAction } from '@/lib/admin'

const validation = await validateAdminAction(
  currentUserId,
  targetUserId,
  'update_role'
)

if (!validation.allowed) {
  throw new Error(validation.reason)
}
```

## Client-Side Usage

### Auth Context

Enhanced with role and admin information:

```tsx
import { useAuth } from '@/contexts/AuthContext'

function AdminPanel() {
  const { user, role, isAdmin, isSuperAdmin, refreshProfile } = useAuth()

  if (!isAdmin) {
    return <div>Access Denied</div>
  }

  return (
    <div>
      <h1>Admin Panel</h1>
      <p>Role: {role}</p>
      {isSuperAdmin && <SuperAdminFeatures />}
    </div>
  )
}
```

### Get User Role

```typescript
import { getUserRole } from '@/lib/admin'

const role = await getUserRole()
if (role === 'admin') {
  // Show admin features
}
```

## API Route Examples

### Protected Admin Endpoint

```typescript
// src/app/api/admin/users/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/middleware/admin'
import { createServerClient } from '@/lib/supabase-server'

export async function GET(request: NextRequest) {
  // Check admin access
  const authError = await requireAdmin(request)
  if (authError) return authError

  // Get all users (admin only)
  const supabase = createServerClient()
  const { data: users, error } = await supabase
    .from('user_profiles')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ users })
}
```

### Update User Role (Super Admin Only)

```typescript
// src/app/api/admin/users/[id]/role/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin, updateUserRole } from '@/middleware/admin'
import { createAuditLog } from '@/lib/admin'

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  // Require super admin
  const authError = await requireAdmin(request, true)
  if (authError) return authError

  const { role } = await request.json()
  const userId = params.id

  // Update role
  const result = await updateUserRole(userId, role)

  if (!result.success) {
    return NextResponse.json(
      { error: result.error },
      { status: 400 }
    )
  }

  // Log action
  await createAuditLog({
    user_id: request.headers.get('x-user-id') || '',
    action: 'user.role_changed',
    resource_type: 'user',
    resource_id: userId,
    details: { new_role: role }
  })

  return NextResponse.json({ success: true })
}
```

## Row Level Security (RLS)

The system includes comprehensive RLS policies:

### User Profiles

- Users can view/update their own profile
- Admins can view all profiles
- Super admins can update any profile

### Audit Logs

- Admins can view all audit logs
- Service role can insert audit logs
- Regular users have no access

## Security Best Practices

### 1. Always Check Permissions

```typescript
// Good
const authError = await requireAdmin(request)
if (authError) return authError

// Bad - No permission check
// Directly accessing admin resources
```

### 2. Validate Before Modifying

```typescript
const validation = await validateAdminAction(adminId, targetId, 'update_role')
if (!validation.allowed) {
  throw new Error(validation.reason)
}
```

### 3. Log Administrative Actions

```typescript
await createAuditLog({
  user_id: adminId,
  action: 'user.updated',
  resource_type: 'user',
  resource_id: targetUserId,
  details: changes
})
```

### 4. Use Server-Side Checks

Never rely on client-side role checks for security. Always validate on the server:

```typescript
// Client-side - UI only
const { isAdmin } = useAuth()
if (isAdmin) {
  // Show admin UI
}

// Server-side - Security enforcement
const authError = await requireAdmin(request)
if (authError) return authError
```

## Initial Setup

### 1. Run Database Migration

Execute the updated `supabase-migrations.sql` to add:
- `role` field to `user_profiles`
- `audit_logs` table
- Admin helper functions
- RLS policies

### 2. Create First Super Admin

After running migrations, manually promote a user to super admin:

```sql
UPDATE user_profiles
SET role = 'super_admin'
WHERE email = 'your-email@example.com';
```

### 3. Test Admin Access

```typescript
// Test in an API route
const { isAdmin, role } = await checkUserRole()
console.log('Role:', role)
console.log('Is Admin:', isAdmin)
```

## Role Management

### Promote User to Admin

```typescript
import { updateUserRole } from '@/middleware/admin'

// Super admin only
const result = await updateUserRole(userId, 'admin')
```

### Demote Admin to User

```typescript
const result = await updateUserRole(userId, 'user')
```

## Audit Action Types

Available audit actions for logging:

- `user.created`
- `user.updated`
- `user.deleted`
- `user.role_changed`
- `subscription.created`
- `subscription.updated`
- `subscription.canceled`
- `admin.login`
- `admin.logout`
- `settings.updated`
- `content.created`
- `content.updated`
- `content.deleted`

## Testing

### Test Admin Middleware

```typescript
// Create test users with different roles
const regularUser = { role: 'user' }
const adminUser = { role: 'admin' }
const superAdminUser = { role: 'super_admin' }

// Test permission checks
expect(await isUserAdmin()).toBe(true) // for admin/super_admin
expect(await isUserSuperAdmin()).toBe(true) // for super_admin only
```

### Test Permissions

```typescript
// Test permission matrix
expect(await hasPermission('manage_users')).toBe(true) // admin/super_admin
expect(await hasPermission('manage_admins')).toBe(false) // admin
expect(await hasPermission('manage_admins')).toBe(true) // super_admin
```

## Troubleshooting

### Users Can't See Role

1. Check if migration ran successfully
2. Verify role field exists in `user_profiles`
3. Clear user session and re-login

### Permission Denied Errors

1. Verify user role in database
2. Check RLS policies are enabled
3. Ensure service role has correct permissions

### Audit Logs Not Created

1. Check service role permissions
2. Verify audit_logs table exists
3. Check RLS policy for insert

## Migration Guide

If you have existing users:

1. Run the migration to add the `role` field
2. All existing users will default to `role = 'user'`
3. Manually promote administrators using SQL
4. Existing functionality remains unchanged

## Production Considerations

1. **Environment Variables**: Ensure Supabase credentials are properly configured
2. **API Keys**: Never expose service role keys to the client
3. **Rate Limiting**: Implement rate limiting on admin endpoints
4. **Monitoring**: Set up alerts for admin actions
5. **Backup**: Regular backups of audit_logs table
6. **Review**: Periodic review of admin permissions and audit logs

## Support

For issues or questions:
1. Check this documentation
2. Review the code examples
3. Inspect database schema
4. Check Supabase logs for errors
