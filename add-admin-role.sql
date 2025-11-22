-- ============================================================================
-- Add Admin Role to Existing user_profiles Table
-- ============================================================================
-- This script adds the role column to your existing user_profiles table
-- Run this in Supabase SQL Editor
-- ============================================================================

-- Step 1: Add the role column with default value 'user'
ALTER TABLE public.user_profiles
ADD COLUMN IF NOT EXISTS role TEXT NOT NULL DEFAULT 'user'
CHECK (role IN ('user', 'admin', 'super_admin'));

-- Step 2: Create an index for performance
CREATE INDEX IF NOT EXISTS idx_user_profiles_role ON public.user_profiles(role);

-- Step 3: Add documentation
COMMENT ON COLUMN public.user_profiles.role IS 'User role: user (default), admin (can manage users and view analytics), super_admin (full system access)';

-- ============================================================================
-- Verification Query
-- ============================================================================
-- Run this to verify the column was added successfully:
SELECT column_name, data_type, column_default
FROM information_schema.columns
WHERE table_name = 'user_profiles'
AND column_name = 'role';

-- ============================================================================
-- Make Yourself an Admin
-- ============================================================================
-- Replace 'your-email@example.com' with YOUR actual email address:

-- For regular admin access:
UPDATE public.user_profiles
SET role = 'admin'
WHERE email = 'your-email@example.com';

-- OR for super admin access (recommended for first admin):
-- UPDATE public.user_profiles
-- SET role = 'super_admin'
-- WHERE email = 'your-email@example.com';

-- ============================================================================
-- Verify Your Role
-- ============================================================================
-- Check that your role was updated:
SELECT id, email, role, created_at
FROM public.user_profiles
WHERE email = 'your-email@example.com';

-- ============================================================================
-- Success!
-- ============================================================================
-- After running this:
-- 1. Log out of your application
-- 2. Log back in
-- 3. Navigate to http://localhost:3000/admin
-- 4. You should now have admin access!
-- ============================================================================
