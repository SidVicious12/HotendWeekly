-- ============================================================================
-- Fix RLS Policies for user_profiles Table
-- ============================================================================
-- This fixes the 406 error by adding proper Row Level Security policies
-- Run this in Supabase SQL Editor
-- ============================================================================

-- Step 1: Enable RLS on user_profiles (if not already enabled)
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

-- Step 2: Drop existing policies if they exist (to avoid conflicts)
DROP POLICY IF EXISTS "Users can view own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.user_profiles;

-- Step 3: Create policy to allow users to SELECT their own profile
CREATE POLICY "Users can view own profile"
ON public.user_profiles
FOR SELECT
USING (auth.uid() = id);

-- Step 4: Create policy to allow users to UPDATE their own profile
CREATE POLICY "Users can update own profile"
ON public.user_profiles
FOR UPDATE
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- Step 5: Create policy to allow users to INSERT their own profile
CREATE POLICY "Users can insert own profile"
ON public.user_profiles
FOR INSERT
WITH CHECK (auth.uid() = id);

-- ============================================================================
-- Verification
-- ============================================================================
-- Check that policies were created:
SELECT schemaname, tablename, policyname, permissive, roles, cmd
FROM pg_policies
WHERE tablename = 'user_profiles';

-- Test query (should work now):
SELECT id, email, role, full_name, avatar_url
FROM public.user_profiles
WHERE id = auth.uid();

-- ============================================================================
-- Success!
-- ============================================================================
-- After running this:
-- 1. Refresh your browser
-- 2. The 406 error should be gone
-- 3. You should be able to access the app normally
-- ============================================================================
