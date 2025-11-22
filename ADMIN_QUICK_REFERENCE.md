# Admin System Quick Reference

Quick reference for the HotendWeekly admin authentication and authorization system.

## User Roles

| Role | Access Level | Can Do |
|------|-------------|---------|
| `user` | Default | Access own data only |
| `admin` | Administrative | Manage users, subscriptions, content, billing, view analytics |
| `super_admin` | Full System | Everything + manage admins, change roles, modify settings |

## Common Patterns

### Protect an API Route

```typescript
import { requireAdmin } from '@/middleware/admin'

export async function GET(request: NextRequest) {
  const authError = await requireAdmin(request)
  if (authError) return authError

  // Admin-only code
}
```

### Check User Role

```typescript
import { checkUserRole } from '@/middleware/admin'

const { isAdmin, isSuperAdmin, role } = await checkUserRole()
```

### Client-Side Role Check

```tsx
import { useAuth } from '@/contexts/AuthContext'

function Component() {
  const { isAdmin, isSuperAdmin, role } = useAuth()

  if (!isAdmin) return <AccessDenied />
  return <AdminPanel />
}
```

### Check Permission

```typescript
import { hasPermission } from '@/lib/admin'

if (await hasPermission('manage_users')) {
  // Show user management
}
```

### Create Audit Log

```typescript
import { createAuditLog } from '@/lib/admin'

await createAuditLog({
  user_id: userId,
  action: 'user.role_changed',
  resource_type: 'user',
  resource_id: targetId,
  details: { old_role: 'user', new_role: 'admin' }
})
```

### Update User Role (Super Admin Only)

```typescript
import { updateUserRole } from '@/middleware/admin'

const result = await updateUserRole(userId, 'admin')
if (!result.success) {
  console.error(result.error)
}
```

### Validate Admin Action

```typescript
import { validateAdminAction } from '@/lib/admin'

const { allowed, reason } = await validateAdminAction(
  adminId,
  targetUserId,
  'update_role'
)
```

## Permissions Matrix

| Permission | User | Admin | Super Admin |
|-----------|------|-------|-------------|
| `manage_users` | ❌ | ✅ | ✅ |
| `manage_subscriptions` | ❌ | ✅ | ✅ |
| `view_analytics` | ❌ | ✅ | ✅ |
| `manage_content` | ❌ | ✅ | ✅ |
| `manage_billing` | ❌ | ✅ | ✅ |
| `view_audit_logs` | ❌ | ✅ | ✅ |
| `manage_settings` | ❌ | ❌ | ✅ |
| `manage_admins` | ❌ | ❌ | ✅ |

## API Endpoints Pattern

```typescript
// GET - Require admin
export const GET = withAdminAuth(async (request) => {
  return NextResponse.json({ data: 'admin data' })
})

// DELETE - Require super admin
export const DELETE = withAdminAuth(async (request) => {
  return NextResponse.json({ deleted: true })
}, true)
```

## Database Helper Functions

```sql
-- Check if user is admin
SELECT is_admin('user-uuid');

-- Check if user is super admin
SELECT is_super_admin('user-uuid');

-- Promote user to admin
UPDATE user_profiles
SET role = 'admin'
WHERE id = 'user-uuid';
```

## File Locations

```
src/
├── middleware/admin.ts          # Server-side auth checks
├── lib/admin.ts                 # Permission helpers
└── contexts/AuthContext.tsx     # Client-side auth context
```

## Initial Setup

1. Run database migration
2. Create first super admin:
   ```sql
   UPDATE user_profiles
   SET role = 'super_admin'
   WHERE email = 'your-email@example.com';
   ```
3. Test admin access

## Security Rules

✅ **DO:**
- Always validate on server-side
- Log administrative actions
- Check permissions before operations
- Use RLS policies

❌ **DON'T:**
- Rely on client-side checks for security
- Expose service role keys
- Skip permission validation
- Modify roles without validation

## Audit Actions

- `user.created` / `user.updated` / `user.deleted` / `user.role_changed`
- `subscription.created` / `subscription.updated` / `subscription.canceled`
- `admin.login` / `admin.logout`
- `settings.updated`
- `content.created` / `content.updated` / `content.deleted`

## Common Issues

**Role not showing:**
- Clear session and re-login
- Check database migration ran
- Verify role field exists

**Permission denied:**
- Verify user role in database
- Check RLS policies enabled
- Ensure correct permissions

**Audit logs not created:**
- Check service role permissions
- Verify table exists
- Check RLS insert policy

## TypeScript Types

```typescript
type UserRole = 'user' | 'admin' | 'super_admin'

type AdminPermission =
  | 'manage_users'
  | 'manage_subscriptions'
  | 'view_analytics'
  | 'manage_content'
  | 'manage_settings'
  | 'manage_admins'
  | 'view_audit_logs'
  | 'manage_billing'

type AuditAction =
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
```

## Example: Complete Admin Route

```typescript
import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin, checkUserRole } from '@/middleware/admin'
import { createAuditLog, validateAdminAction } from '@/lib/admin'
import { createServerClient } from '@/lib/supabase-server'

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  // 1. Check super admin access
  const authError = await requireAdmin(request, true)
  if (authError) return authError

  // 2. Get current user info
  const { userId } = await checkUserRole()

  // 3. Parse request
  const { role } = await request.json()
  const targetId = params.id

  // 4. Validate action
  const validation = await validateAdminAction(
    userId!,
    targetId,
    'update_role'
  )

  if (!validation.allowed) {
    return NextResponse.json(
      { error: validation.reason },
      { status: 403 }
    )
  }

  // 5. Update role
  const supabase = createServerClient()
  const { error } = await supabase
    .from('user_profiles')
    .update({ role })
    .eq('id', targetId)

  if (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }

  // 6. Log action
  await createAuditLog({
    user_id: userId!,
    action: 'user.role_changed',
    resource_type: 'user',
    resource_id: targetId,
    details: { new_role: role }
  })

  return NextResponse.json({ success: true })
}
```

## Resources

- Full Documentation: `ADMIN_SYSTEM.md`
- Middleware: `src/middleware/admin.ts`
- Utilities: `src/lib/admin.ts`
- Auth Context: `src/contexts/AuthContext.tsx`
- Database Schema: `supabase-migrations.sql`
