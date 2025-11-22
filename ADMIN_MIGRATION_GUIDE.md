# Admin System Migration Guide

Step-by-step guide to add the admin authentication system to your existing HotendWeekly project.

## Prerequisites

- Supabase project set up and connected
- Existing user authentication working
- Database access (Supabase Studio or SQL editor)

## Step 1: Backup Your Database

Before making any changes, create a backup of your database.

```sql
-- In Supabase Studio: Database > Backups > Create Backup
```

## Step 2: Update Database Schema

### Option A: Run Full Migration (Recommended)

If you haven't run the migration yet, execute the entire `supabase-migrations.sql` file which now includes:
- `role` field in `user_profiles`
- `audit_logs` table
- Admin helper functions
- RLS policies

```bash
# Using Supabase CLI
supabase db push

# Or copy-paste the SQL into Supabase Studio SQL Editor
```

### Option B: Add Admin Features Only

If you already have existing tables, run these SQL statements separately:

```sql
-- 1. Add role column to user_profiles
ALTER TABLE user_profiles
ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'user'
CHECK (role IN ('user', 'admin', 'super_admin'));

-- 2. Add index for role
CREATE INDEX IF NOT EXISTS idx_user_profiles_role
ON user_profiles(role);

-- 3. Create audit_logs table
CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  action TEXT NOT NULL,
  resource_type TEXT NOT NULL,
  resource_id UUID,
  details JSONB DEFAULT '{}'::jsonb,
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Add indexes for audit_logs
CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_action ON audit_logs(action);
CREATE INDEX IF NOT EXISTS idx_audit_logs_resource ON audit_logs(resource_type, resource_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON audit_logs(created_at DESC);

-- 5. Enable RLS
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- 6. Create admin RLS policies
CREATE POLICY "Admins can view all audit logs"
ON audit_logs FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM user_profiles
    WHERE id = auth.uid()
    AND role IN ('admin', 'super_admin')
  )
);

CREATE POLICY "Service role can insert audit logs"
ON audit_logs FOR INSERT
WITH CHECK (true);

CREATE POLICY "Admins can view all profiles"
ON user_profiles FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM user_profiles up
    WHERE up.id = auth.uid()
    AND up.role IN ('admin', 'super_admin')
  )
);

CREATE POLICY "Super admins can update any profile"
ON user_profiles FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM user_profiles up
    WHERE up.id = auth.uid()
    AND up.role = 'super_admin'
  )
);

-- 7. Create helper functions
CREATE OR REPLACE FUNCTION is_admin(p_user_id UUID DEFAULT NULL)
RETURNS BOOLEAN AS $$
DECLARE
  v_user_id UUID;
  v_role TEXT;
BEGIN
  v_user_id := COALESCE(p_user_id, auth.uid());
  IF v_user_id IS NULL THEN
    RETURN false;
  END IF;
  SELECT role INTO v_role FROM user_profiles WHERE id = v_user_id;
  RETURN v_role IN ('admin', 'super_admin');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION is_super_admin(p_user_id UUID DEFAULT NULL)
RETURNS BOOLEAN AS $$
DECLARE
  v_user_id UUID;
  v_role TEXT;
BEGIN
  v_user_id := COALESCE(p_user_id, auth.uid());
  IF v_user_id IS NULL THEN
    RETURN false;
  END IF;
  SELECT role INTO v_role FROM user_profiles WHERE id = v_user_id;
  RETURN v_role = 'super_admin';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 8. Grant permissions
GRANT SELECT ON audit_logs TO authenticated;
GRANT INSERT ON audit_logs TO service_role;
```

## Step 3: Verify Database Changes

Check that all changes were applied successfully:

```sql
-- Check role column exists
SELECT column_name, data_type, column_default
FROM information_schema.columns
WHERE table_name = 'user_profiles' AND column_name = 'role';

-- Check audit_logs table exists
SELECT table_name
FROM information_schema.tables
WHERE table_name = 'audit_logs';

-- Check functions exist
SELECT routine_name
FROM information_schema.routines
WHERE routine_name IN ('is_admin', 'is_super_admin');

-- Verify RLS policies
SELECT schemaname, tablename, policyname
FROM pg_policies
WHERE tablename IN ('user_profiles', 'audit_logs');
```

## Step 4: Add TypeScript Files

Copy the following files to your project:

### 1. Middleware
```bash
# Create middleware directory if it doesn't exist
mkdir -p src/middleware

# File: src/middleware/admin.ts
# (Copy content from the created file)
```

### 2. Admin Utilities
```bash
# File: src/lib/admin.ts
# (Copy content from the created file)
```

### 3. Update Auth Context
```bash
# File: src/contexts/AuthContext.tsx
# (Replace existing file with updated version)
```

## Step 5: Install Dependencies

Ensure you have all required dependencies:

```bash
npm install @supabase/supabase-js
# or
yarn add @supabase/supabase-js
```

## Step 6: Create Your First Admin

Manually promote a user to admin or super_admin:

```sql
-- Replace 'your-email@example.com' with actual email
UPDATE user_profiles
SET role = 'super_admin'
WHERE email = 'your-email@example.com';

-- Verify the change
SELECT id, email, role
FROM user_profiles
WHERE email = 'your-email@example.com';
```

## Step 7: Test the System

### 7.1 Test Database Access

```sql
-- Test as regular user (should return false)
SELECT is_admin('regular-user-uuid');

-- Test as admin (should return true)
SELECT is_admin('admin-user-uuid');
```

### 7.2 Test Client-Side Context

Create a test page:

```tsx
// src/app/test-admin/page.tsx
'use client'

import { useAuth } from '@/contexts/AuthContext'

export default function TestAdminPage() {
  const { user, role, isAdmin, isSuperAdmin, loading } = useAuth()

  if (loading) return <div>Loading...</div>

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Admin Test Page</h1>
      <div className="space-y-2">
        <p>Email: {user?.email}</p>
        <p>Role: {role}</p>
        <p>Is Admin: {isAdmin ? 'Yes' : 'No'}</p>
        <p>Is Super Admin: {isSuperAdmin ? 'Yes' : 'No'}</p>
      </div>
    </div>
  )
}
```

### 7.3 Test API Protection

Create a test API endpoint:

```typescript
// src/app/api/test-admin/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/middleware/admin'

export async function GET(request: NextRequest) {
  const authError = await requireAdmin(request)
  if (authError) return authError

  return NextResponse.json({
    message: 'Admin access confirmed!',
    timestamp: new Date().toISOString()
  })
}
```

Test the endpoint:
```bash
# As admin - should succeed
curl -H "Authorization: Bearer YOUR_TOKEN" http://localhost:3000/api/test-admin

# As regular user - should fail with 403
```

## Step 8: Update Existing Code (If Needed)

### 8.1 Update Type Imports

If you use custom user types, update them:

```typescript
// Before
interface User {
  id: string
  email: string
}

// After
import type { UserRole } from '@/contexts/AuthContext'

interface User {
  id: string
  email: string
  role: UserRole
}
```

### 8.2 Update Auth Checks

Replace any existing auth checks:

```typescript
// Before
const { user } = useAuth()
if (!user) return <LoginRequired />

// After - no change needed for basic auth
const { user } = useAuth()
if (!user) return <LoginRequired />

// New - admin checks
const { isAdmin } = useAuth()
if (!isAdmin) return <AccessDenied />
```

## Step 9: Create Admin Routes

Create admin-only pages:

```bash
mkdir -p src/app/admin
```

### 9.1 Admin Layout

```tsx
// src/app/admin/layout.tsx
'use client'

import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function AdminLayout({
  children
}: {
  children: React.ReactNode
}) {
  const { isAdmin, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !isAdmin) {
      router.push('/')
    }
  }, [isAdmin, loading, router])

  if (loading) return <div>Loading...</div>
  if (!isAdmin) return null

  return (
    <div>
      <nav className="bg-gray-800 text-white p-4">
        <h1 className="text-xl font-bold">Admin Panel</h1>
      </nav>
      <main>{children}</main>
    </div>
  )
}
```

### 9.2 Admin Dashboard

```tsx
// src/app/admin/page.tsx
'use client'

export default function AdminDashboard() {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold">Admin Dashboard</h1>
      <p className="mt-4">Welcome to the admin panel!</p>
    </div>
  )
}
```

## Step 10: Environment Variables

Ensure all required environment variables are set:

```env
# .env.local
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

## Step 11: Deploy

### 11.1 Pre-Deployment Checklist

- [ ] Database migration completed
- [ ] First admin user created
- [ ] All files copied to project
- [ ] Tests passing
- [ ] Environment variables configured

### 11.2 Deploy to Production

```bash
# Build locally first
npm run build

# Deploy to Vercel
vercel deploy --prod

# Or other hosting platform
```

### 11.3 Post-Deployment

1. Verify database connection
2. Test admin login
3. Check admin routes are protected
4. Verify audit logging works

## Troubleshooting

### Issue: Role not showing after update

**Solution:**
```typescript
// Force profile refresh
const { refreshProfile } = useAuth()
await refreshProfile()

// Or clear session and re-login
```

### Issue: Permission denied errors

**Solution:**
```sql
-- Check RLS policies
SELECT * FROM pg_policies WHERE tablename = 'user_profiles';

-- Verify user role
SELECT id, email, role FROM user_profiles WHERE email = 'your-email';
```

### Issue: Audit logs not created

**Solution:**
```sql
-- Check table permissions
SELECT grantee, privilege_type
FROM information_schema.role_table_grants
WHERE table_name = 'audit_logs';

-- Grant if needed
GRANT INSERT ON audit_logs TO service_role;
```

### Issue: TypeScript errors

**Solution:**
```bash
# Rebuild types
npm run build

# Or restart TypeScript server in your IDE
```

## Rollback Plan

If you need to rollback the changes:

```sql
-- Remove admin policies
DROP POLICY IF EXISTS "Admins can view all audit logs" ON audit_logs;
DROP POLICY IF EXISTS "Service role can insert audit logs" ON audit_logs;
DROP POLICY IF EXISTS "Admins can view all profiles" ON user_profiles;
DROP POLICY IF EXISTS "Super admins can update any profile" ON user_profiles;

-- Drop functions
DROP FUNCTION IF EXISTS is_admin(UUID);
DROP FUNCTION IF EXISTS is_super_admin(UUID);

-- Drop audit_logs table
DROP TABLE IF EXISTS audit_logs;

-- Remove role column (optional - may want to keep data)
-- ALTER TABLE user_profiles DROP COLUMN IF EXISTS role;
```

## Next Steps

1. ✅ System installed and tested
2. Create admin pages (dashboard, user management)
3. Implement audit log viewer
4. Add permission-based UI components
5. Set up monitoring and alerts
6. Document admin procedures for your team

## Support Resources

- Full Documentation: `ADMIN_SYSTEM.md`
- Quick Reference: `ADMIN_QUICK_REFERENCE.md`
- Examples: `ADMIN_EXAMPLES.md`
- GitHub Issues: Report bugs or request features

## Migration Checklist

- [ ] Database backed up
- [ ] Migration SQL executed
- [ ] Database changes verified
- [ ] TypeScript files copied
- [ ] Dependencies installed
- [ ] First admin created
- [ ] Client-side test passed
- [ ] Server-side test passed
- [ ] Admin routes created
- [ ] Environment variables set
- [ ] Build successful
- [ ] Deployed to production
- [ ] Production tests passed

---

**Migration completed?** Start using the admin system with the examples in `ADMIN_EXAMPLES.md`!
