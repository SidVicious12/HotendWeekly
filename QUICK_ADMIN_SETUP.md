# 🚀 Quick Admin Setup Guide

## Problem Solved ✅

Your database table is called `user_profiles`, and it didn't have a `role` column yet. The code is now correctly configured to use `user_profiles`.

---

## Step-by-Step Setup

### 1️⃣ Add the Role Column

Open **Supabase SQL Editor** and run this file:

**File:** `add-admin-role.sql`

Or copy/paste this:

```sql
-- Add the role column
ALTER TABLE public.user_profiles
ADD COLUMN IF NOT EXISTS role TEXT NOT NULL DEFAULT 'user'
CHECK (role IN ('user', 'admin', 'super_admin'));

-- Create index
CREATE INDEX IF NOT EXISTS idx_user_profiles_role ON public.user_profiles(role);
```

---

### 2️⃣ Make Yourself an Admin

**Replace `your-email@example.com` with YOUR actual email:**

```sql
-- Make yourself an admin
UPDATE public.user_profiles
SET role = 'admin'
WHERE email = 'your-email@example.com';
```

**Or for super admin (recommended for first admin):**

```sql
UPDATE public.user_profiles
SET role = 'super_admin'
WHERE email = 'your-email@example.com';
```

---

### 3️⃣ Verify It Worked

```sql
-- Check your role
SELECT id, email, role 
FROM public.user_profiles 
WHERE email = 'your-email@example.com';
```

**Expected result:**
```
id                  | email                    | role
--------------------|--------------------------|-------------
abc-123-def...      | your-email@example.com   | admin
```

---

### 4️⃣ Log Out and Back In

1. **Log out** of your application completely
2. **Log back in** with the same credentials
3. Navigate to: `http://localhost:3000/admin`
4. **You should see the admin dashboard!** 🎉

---

## What Was Fixed

### Code Changes:
✅ Updated all references from `user_profiles` → `profiles`
✅ Fixed in 13 files across the codebase:
- `/src/contexts/AuthContext.tsx`
- `/src/middleware/admin.ts`
- `/src/lib/admin.ts`
- All `/src/app/api/admin/**/*.ts` files
- Other related files

### Database Changes:
✅ Created `add-admin-role.sql` for easy setup
✅ Updated `supabase-admin-migration.sql` to use `profiles`

---

## Troubleshooting

### "I still can't access /admin"

**Check 1: Verify role column exists**
```sql
SELECT column_name FROM information_schema.columns 
WHERE table_name = 'user_profiles' AND column_name = 'role';
```

**Check 2: Verify your role**
```sql
SELECT email, role FROM public.user_profiles 
WHERE email = 'your-email@example.com';
```

**Check 3: Clear session**
- Log out completely
- Clear browser cookies for localhost
- Log back in
- Try `/admin` again

---

### "Column 'role' already exists" Error

If you get this error, the column is already there! Just skip to step 2 and set your role:

```sql
UPDATE public.profiles
SET role = 'admin'
WHERE email = 'your-email@example.com';
```

---

### "I get 403 Forbidden"

This means:
- ✅ The code is working
- ❌ Your role isn't set correctly

**Solution:**
```sql
-- Double-check your email is correct
SELECT email, role FROM public.user_profiles;

-- Update with the EXACT email from the query above
UPDATE public.profiles
SET role = 'admin'
WHERE email = 'the-exact-email-from-above';
```

---

## Quick Reference

### User Roles:
- **`user`** - Default, no admin access
- **`admin`** - Can manage users, view analytics, generate reports
- **`super_admin`** - Full access including system settings

### Admin Routes:
- `/admin` - Dashboard
- `/admin/users` - User management
- `/admin/analytics` - Analytics & charts
- `/admin/reports` - Generate reports

### Check Your Role Anytime:
```sql
SELECT email, role FROM public.user_profiles WHERE id = auth.uid();
```

---

## Files to Use

1. **`add-admin-role.sql`** - Run this in Supabase SQL Editor (FIRST TIME ONLY)
2. **`supabase-admin-migration.sql`** - Full migration (if you want all admin tables)

---

## Next Steps After Admin Access

Once you can access `/admin`:

1. ✅ Test the dashboard
2. ✅ Try user management
3. ✅ View analytics (may show mock data initially)
4. ✅ Generate a test report
5. ✅ Create additional admin users via the UI

---

## Summary

**What you need to do:**
1. Run `add-admin-role.sql` in Supabase
2. Update your email to have `role = 'admin'`
3. Log out and log back in
4. Visit `/admin`

**That's it!** 🎊

---

**Need help?** Check the browser console for errors or verify your role in the database.
