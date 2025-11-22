-- ============================================================================
-- Complete Admin Setup - Run This Once
-- ============================================================================
-- This script does EVERYTHING needed to fix the admin panel:
-- 1. Adds the role column
-- 2. Fixes RLS policies
-- 3. Makes you an admin
-- Run this entire file in Supabase SQL Editor
-- ============================================================================

-- ============================================================================
-- PART 1: Add Role Column
-- ============================================================================

-- Add the role column if it doesn't exist
ALTER TABLE public.user_profiles
ADD COLUMN IF NOT EXISTS role TEXT NOT NULL DEFAULT 'user'
CHECK (role IN ('user', 'admin', 'super_admin'));

-- Create index for performance
CREATE INDEX IF NOT EXISTS idx_user_profiles_role ON public.user_profiles(role);

-- Add documentation
COMMENT ON COLUMN public.user_profiles.role IS 'User role: user (default), admin, super_admin';

-- ============================================================================
-- PART 2: Fix RLS Policies (This fixes the 406 error!)
-- ============================================================================

-- Enable RLS
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Users can view own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Enable read access for authenticated users" ON public.user_profiles;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON public.user_profiles;
DROP POLICY IF EXISTS "Enable update for users based on id" ON public.user_profiles;

-- Create new policies that allow users to access their own data
CREATE POLICY "Users can view own profile"
ON public.user_profiles
FOR SELECT
USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
ON public.user_profiles
FOR UPDATE
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
ON public.user_profiles
FOR INSERT
WITH CHECK (auth.uid() = id);

-- ============================================================================
-- PART 3: Make Yourself an Admin
-- ============================================================================
-- ⚠️ IMPORTANT: Replace 'your-email@example.com' with YOUR actual email!

-- Option A: Make yourself a regular admin
UPDATE public.user_profiles
SET role = 'admin'
WHERE email = 'your-email@example.com';  -- ⚠️ CHANGE THIS!

-- Option B: Make yourself a super admin (recommended for first admin)
-- Uncomment the line below and comment out the line above:
-- UPDATE public.user_profiles
-- SET role = 'super_admin'
-- WHERE email = 'your-email@example.com';  -- ⚠️ CHANGE THIS!

-- ============================================================================
-- PART 4: Verification
-- ============================================================================

-- Check that the role column exists
SELECT column_name, data_type, column_default
FROM information_schema.columns
WHERE table_name = 'user_profiles'
AND column_name = 'role';

-- Check RLS policies
SELECT schemaname, tablename, policyname, permissive, roles, cmd
FROM pg_policies
WHERE tablename = 'user_profiles';

-- Check your role (replace with your email)
SELECT id, email, role, created_at
FROM public.user_profiles
WHERE email = 'your-email@example.com';  -- ⚠️ CHANGE THIS!

-- ============================================================================
-- Expected Results:
-- ============================================================================
-- Query 1 (role column): Should show one row with column_name = 'role'
-- Query 2 (policies): Should show 3 policies (view, update, insert)
-- Query 3 (your role): Should show your email with role = 'admin' or 'super_admin'
-- ============================================================================

-- ============================================================================
-- After Running This Script:
-- ============================================================================
-- 1. The 406 error should be GONE
-- 2. Log out of your app
-- 3. Log back in
-- 4. Navigate to http://localhost:3000/admin
-- 5. You should see the admin dashboard!
-- ============================================================================
