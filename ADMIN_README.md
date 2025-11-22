# Admin Authentication & Authorization System

**Complete role-based access control (RBAC) for HotendWeekly**

## Quick Start

1. **Run Database Migration**
   ```bash
   # Execute supabase-migrations.sql in Supabase Studio
   ```

2. **Create First Admin**
   ```sql
   UPDATE user_profiles
   SET role = 'super_admin'
   WHERE email = 'your-email@example.com';
   ```

3. **Use in Your Code**
   ```typescript
   import { requireAdmin } from '@/middleware/admin'
   import { useAuth } from '@/contexts/AuthContext'
   
   // Server-side
   const authError = await requireAdmin(request)
   
   // Client-side
   const { isAdmin, role } = useAuth()
   ```

## What's Included

### Files Created

```
src/
├── middleware/admin.ts          # Server-side auth middleware
├── lib/admin.ts                 # Permission & utility functions
└── contexts/AuthContext.tsx     # Enhanced with role support

Database:
├── role field in user_profiles
├── audit_logs table
├── Helper functions (is_admin, is_super_admin)
└── RLS policies for admin access

Documentation:
├── ADMIN_SYSTEM.md              # Complete documentation
├── ADMIN_QUICK_REFERENCE.md     # Quick reference guide
├── ADMIN_EXAMPLES.md            # Real-world examples
└── ADMIN_MIGRATION_GUIDE.md     # Step-by-step migration
```

### Features

✅ **Three Role Levels**: user, admin, super_admin  
✅ **Server-Side Protection**: Secure API routes and pages  
✅ **Client-Side Context**: Role info in React components  
✅ **Permission System**: Granular permission checks  
✅ **Audit Logging**: Track all admin actions  
✅ **Row Level Security**: Database-level protection  
✅ **TypeScript Support**: Fully typed  
✅ **Production Ready**: Error handling, validation, logging

## User Roles

| Role | Description | Permissions |
|------|-------------|-------------|
| **user** | Default role | Own data only |
| **admin** | Administrator | Manage users, subscriptions, content, analytics |
| **super_admin** | Super Administrator | Everything + role management, settings |

## Common Use Cases

### Protect an API Route

```typescript
import { requireAdmin } from '@/middleware/admin'

export async function GET(request: NextRequest) {
  const authError = await requireAdmin(request)
  if (authError) return authError
  
  // Your admin logic here
}
```

### Check Role in Component

```tsx
import { useAuth } from '@/contexts/AuthContext'

function AdminPanel() {
  const { isAdmin, role } = useAuth()
  
  if (!isAdmin) return <AccessDenied />
  
  return <div>Welcome, {role}!</div>
}
```

### Check Permission

```typescript
import { hasPermission } from '@/lib/admin'

if (await hasPermission('manage_users')) {
  // Show user management
}
```

### Log Admin Action

```typescript
import { createAuditLog } from '@/lib/admin'

await createAuditLog({
  user_id: adminId,
  action: 'user.role_changed',
  resource_type: 'user',
  resource_id: userId,
  details: { new_role: 'admin' }
})
```

## Documentation

- **📚 Full Documentation**: `ADMIN_SYSTEM.md` - Complete system documentation
- **⚡ Quick Reference**: `ADMIN_QUICK_REFERENCE.md` - Quick lookup guide
- **💡 Examples**: `ADMIN_EXAMPLES.md` - Real-world implementation examples
- **🚀 Migration Guide**: `ADMIN_MIGRATION_GUIDE.md` - Step-by-step setup

## Getting Started

### New Installation

1. Read `ADMIN_MIGRATION_GUIDE.md`
2. Run database migration
3. Create first admin user
4. Test the system
5. Build your admin pages

### Existing Project

1. Follow `ADMIN_MIGRATION_GUIDE.md`
2. Backup your database first
3. Run incremental migration
4. Update environment variables
5. Test thoroughly before deploying

## Key Concepts

### Server-Side Protection

Always validate permissions on the server:

```typescript
// ✅ Good - Server-side check
export async function GET(request: NextRequest) {
  const authError = await requireAdmin(request)
  if (authError) return authError
  // Protected code
}

// ❌ Bad - Client-side only
function AdminPanel() {
  const { isAdmin } = useAuth()
  if (isAdmin) {
    // This is NOT secure for sensitive operations
  }
}
```

### Permission Hierarchy

```
super_admin > admin > user

Super Admin:
- All permissions
- Can manage admins
- Can change roles
- Can modify settings

Admin:
- Manage users (view, edit, not promote)
- Manage subscriptions
- View analytics
- Manage content
- Manage billing

User:
- Own data only
```

### Audit Logging

Every important admin action should be logged:

```typescript
await createAuditLog({
  user_id: adminId,
  action: 'user.role_changed',
  resource_type: 'user',
  resource_id: targetUserId,
  details: { old_role: 'user', new_role: 'admin' }
})
```

## Security Best Practices

1. ✅ Always check permissions server-side
2. ✅ Log all admin actions
3. ✅ Validate before modifying data
4. ✅ Use RLS policies
5. ✅ Never expose service role key to client
6. ✅ Implement rate limiting on admin endpoints
7. ✅ Regular security audits via audit logs
8. ✅ Use environment variables for sensitive data

## Testing

```typescript
// Test role check
const { role } = await checkUserRole()
expect(role).toBe('admin')

// Test permission
expect(await hasPermission('manage_users')).toBe(true)

// Test admin access
const authError = await requireAdmin(mockRequest)
expect(authError).toBeNull()
```

## Troubleshooting

**Role not showing?**
- Clear session and re-login
- Check database migration ran
- Verify role field exists

**Permission denied?**
- Check user role in database
- Verify RLS policies enabled
- Check service role permissions

**Audit logs not created?**
- Check service role permissions
- Verify audit_logs table exists
- Check RLS insert policy

See `ADMIN_MIGRATION_GUIDE.md` for detailed troubleshooting.

## Support

- 📖 Read the documentation files
- 🔍 Check the examples in `ADMIN_EXAMPLES.md`
- 🐛 Review troubleshooting in `ADMIN_MIGRATION_GUIDE.md`
- 💬 Check database logs in Supabase Studio

## Next Steps

1. ✅ Read this overview
2. 📚 Review `ADMIN_SYSTEM.md` for details
3. 🚀 Follow `ADMIN_MIGRATION_GUIDE.md` for setup
4. 💡 Build features using `ADMIN_EXAMPLES.md`
5. ⚡ Use `ADMIN_QUICK_REFERENCE.md` during development

---

**Ready to get started?** → Begin with `ADMIN_MIGRATION_GUIDE.md`
