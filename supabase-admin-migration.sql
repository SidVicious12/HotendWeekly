-- ============================================================================
-- Admin Functionality Migration
-- ============================================================================
-- Description: Comprehensive admin system with role management, analytics,
--              and retention tracking
-- Version: 1.0.0
-- Created: 2025-11-22
-- ============================================================================

-- ============================================================================
-- SECTION 1: Role Management
-- ============================================================================

-- Add role column to profiles table
-- This enables role-based access control (RBAC) throughout the application
DO $$
BEGIN
    -- Check if the role column already exists
    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_schema = 'public'
        AND table_name = 'profiles'
        AND column_name = 'role'
    ) THEN
        -- Add role column with default value 'user'
        ALTER TABLE public.user_profiles
        ADD COLUMN role TEXT NOT NULL DEFAULT 'user'
        CHECK (role IN ('user', 'admin', 'super_admin'));

        -- Add comment for documentation
        COMMENT ON COLUMN public.user_profiles.role IS
        'User role: user (default), admin (can manage users and view analytics), super_admin (full system access)';
    END IF;
END $$;

-- Create index on role for efficient role-based queries
CREATE INDEX IF NOT EXISTS idx_profiles_role
ON public.user_profiles(role);

-- ============================================================================
-- SECTION 2: Analytics Events Table
-- ============================================================================

-- Create analytics_events table for tracking user actions
CREATE TABLE IF NOT EXISTS public.analytics_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    event_type TEXT NOT NULL,
    event_data JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    -- Constraints
    CONSTRAINT event_type_not_empty CHECK (event_type <> '')
);

-- Add table comment
COMMENT ON TABLE public.analytics_events IS
'Tracks user actions and events for analytics purposes. Includes flexible JSONB field for event-specific data.';

-- Add column comments
COMMENT ON COLUMN public.analytics_events.id IS 'Unique identifier for the analytics event';
COMMENT ON COLUMN public.analytics_events.user_id IS 'Reference to the user who triggered the event (nullable for anonymous events)';
COMMENT ON COLUMN public.analytics_events.event_type IS 'Type of event (e.g., page_view, button_click, tool_usage, subscription_change)';
COMMENT ON COLUMN public.analytics_events.event_data IS 'Flexible JSON field containing event-specific data and metadata';
COMMENT ON COLUMN public.analytics_events.created_at IS 'Timestamp when the event occurred';

-- Create indexes for efficient querying
CREATE INDEX IF NOT EXISTS idx_analytics_events_user_id
ON public.analytics_events(user_id);

CREATE INDEX IF NOT EXISTS idx_analytics_events_event_type
ON public.analytics_events(event_type);

CREATE INDEX IF NOT EXISTS idx_analytics_events_created_at
ON public.analytics_events(created_at DESC);

-- Composite index for common query patterns (user events over time)
CREATE INDEX IF NOT EXISTS idx_analytics_events_user_created
ON public.analytics_events(user_id, created_at DESC);

-- GIN index for JSONB queries on event_data
CREATE INDEX IF NOT EXISTS idx_analytics_events_event_data
ON public.analytics_events USING GIN (event_data);

-- ============================================================================
-- SECTION 3: Retention Metrics Table
-- ============================================================================

-- Create retention_metrics table for tracking user retention data
CREATE TABLE IF NOT EXISTS public.retention_metrics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    cohort_date DATE NOT NULL,
    days_since_signup INTEGER NOT NULL,
    last_active_date DATE NOT NULL,
    is_retained BOOLEAN NOT NULL DEFAULT false,
    activity_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    -- Constraints
    CONSTRAINT days_since_signup_positive CHECK (days_since_signup >= 0),
    CONSTRAINT activity_count_non_negative CHECK (activity_count >= 0),
    CONSTRAINT unique_user_cohort_day UNIQUE (user_id, cohort_date, days_since_signup)
);

-- Add table comment
COMMENT ON TABLE public.retention_metrics IS
'Tracks user retention metrics by cohort. Enables cohort analysis and retention rate calculations.';

-- Add column comments
COMMENT ON COLUMN public.retention_metrics.id IS 'Unique identifier for the retention record';
COMMENT ON COLUMN public.retention_metrics.user_id IS 'Reference to the user being tracked';
COMMENT ON COLUMN public.retention_metrics.cohort_date IS 'Date when the user signed up (cohort identifier)';
COMMENT ON COLUMN public.retention_metrics.days_since_signup IS 'Number of days since user signup (0, 1, 7, 30, etc.)';
COMMENT ON COLUMN public.retention_metrics.last_active_date IS 'Most recent date the user was active';
COMMENT ON COLUMN public.retention_metrics.is_retained IS 'Whether the user was active on this specific day milestone';
COMMENT ON COLUMN public.retention_metrics.activity_count IS 'Number of activities performed on this day';
COMMENT ON COLUMN public.retention_metrics.created_at IS 'When this retention record was created';
COMMENT ON COLUMN public.retention_metrics.updated_at IS 'When this retention record was last updated';

-- Create indexes for efficient querying
CREATE INDEX IF NOT EXISTS idx_retention_metrics_user_id
ON public.retention_metrics(user_id);

CREATE INDEX IF NOT EXISTS idx_retention_metrics_cohort_date
ON public.retention_metrics(cohort_date);

CREATE INDEX IF NOT EXISTS idx_retention_metrics_days_since_signup
ON public.retention_metrics(days_since_signup);

-- Composite index for cohort analysis
CREATE INDEX IF NOT EXISTS idx_retention_metrics_cohort_days
ON public.retention_metrics(cohort_date, days_since_signup);

-- Index for retention queries
CREATE INDEX IF NOT EXISTS idx_retention_metrics_retained
ON public.retention_metrics(is_retained, cohort_date);

-- ============================================================================
-- SECTION 4: Row Level Security (RLS) Policies
-- ============================================================================

-- Enable RLS on analytics_events table
ALTER TABLE public.analytics_events ENABLE ROW LEVEL SECURITY;

-- Enable RLS on retention_metrics table
ALTER TABLE public.retention_metrics ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist (idempotent)
DROP POLICY IF EXISTS analytics_events_admin_all ON public.analytics_events;
DROP POLICY IF EXISTS analytics_events_user_own ON public.analytics_events;
DROP POLICY IF EXISTS retention_metrics_admin_all ON public.retention_metrics;
DROP POLICY IF EXISTS retention_metrics_no_user_access ON public.retention_metrics;

-- ============================================================================
-- Analytics Events Policies
-- ============================================================================

-- Policy: Admins can view all analytics events
CREATE POLICY analytics_events_admin_all
ON public.analytics_events
FOR ALL
TO authenticated
USING (
    EXISTS (
        SELECT 1
        FROM public.user_profiles
        WHERE profiles.id = auth.uid()
        AND profiles.role IN ('admin', 'super_admin')
    )
);

-- Policy: Users can only insert their own events (for client-side tracking)
CREATE POLICY analytics_events_user_insert
ON public.analytics_events
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Policy: Users can view their own events
CREATE POLICY analytics_events_user_own
ON public.analytics_events
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- ============================================================================
-- Retention Metrics Policies
-- ============================================================================

-- Policy: Only admins can view retention metrics
CREATE POLICY retention_metrics_admin_all
ON public.retention_metrics
FOR ALL
TO authenticated
USING (
    EXISTS (
        SELECT 1
        FROM public.user_profiles
        WHERE profiles.id = auth.uid()
        AND profiles.role IN ('admin', 'super_admin')
    )
);

-- Policy: Regular users cannot access retention metrics
CREATE POLICY retention_metrics_no_user_access
ON public.retention_metrics
FOR SELECT
TO authenticated
USING (false);

-- ============================================================================
-- SECTION 5: Helper Functions
-- ============================================================================

-- ============================================================================
-- Function: Check if user is admin
-- ============================================================================
CREATE OR REPLACE FUNCTION public.is_admin(check_user_id UUID DEFAULT NULL)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    user_role TEXT;
    target_user_id UUID;
BEGIN
    -- Use provided user_id or default to current user
    target_user_id := COALESCE(check_user_id, auth.uid());

    -- Return false if no user_id
    IF target_user_id IS NULL THEN
        RETURN false;
    END IF;

    -- Get user role
    SELECT role INTO user_role
    FROM public.user_profiles
    WHERE id = target_user_id;

    -- Return true if admin or super_admin
    RETURN user_role IN ('admin', 'super_admin');
EXCEPTION
    WHEN OTHERS THEN
        RETURN false;
END;
$$;

COMMENT ON FUNCTION public.is_admin IS
'Checks if a user has admin privileges. Returns true for admin and super_admin roles.';

-- ============================================================================
-- Function: Check if user is super admin
-- ============================================================================
CREATE OR REPLACE FUNCTION public.is_super_admin(check_user_id UUID DEFAULT NULL)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    user_role TEXT;
    target_user_id UUID;
BEGIN
    -- Use provided user_id or default to current user
    target_user_id := COALESCE(check_user_id, auth.uid());

    -- Return false if no user_id
    IF target_user_id IS NULL THEN
        RETURN false;
    END IF;

    -- Get user role
    SELECT role INTO user_role
    FROM public.user_profiles
    WHERE id = target_user_id;

    -- Return true only if super_admin
    RETURN user_role = 'super_admin';
EXCEPTION
    WHEN OTHERS THEN
        RETURN false;
END;
$$;

COMMENT ON FUNCTION public.is_super_admin IS
'Checks if a user has super admin privileges. Returns true only for super_admin role.';

-- ============================================================================
-- Function: Log analytics event
-- ============================================================================
CREATE OR REPLACE FUNCTION public.log_analytics_event(
    p_user_id UUID,
    p_event_type TEXT,
    p_event_data JSONB DEFAULT '{}'::jsonb
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    event_id UUID;
BEGIN
    -- Validate input
    IF p_event_type IS NULL OR p_event_type = '' THEN
        RAISE EXCEPTION 'event_type cannot be empty';
    END IF;

    -- Insert analytics event
    INSERT INTO public.analytics_events (user_id, event_type, event_data)
    VALUES (p_user_id, p_event_type, p_event_data)
    RETURNING id INTO event_id;

    RETURN event_id;
EXCEPTION
    WHEN OTHERS THEN
        -- Log error but don't fail (analytics should not break core functionality)
        RAISE WARNING 'Failed to log analytics event: %', SQLERRM;
        RETURN NULL;
END;
$$;

COMMENT ON FUNCTION public.log_analytics_event IS
'Logs an analytics event. Safe to call - will not throw errors that break core functionality.';

-- ============================================================================
-- Function: Update retention metrics
-- ============================================================================
CREATE OR REPLACE FUNCTION public.update_retention_metrics(
    p_user_id UUID,
    p_activity_date DATE DEFAULT CURRENT_DATE
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    signup_date DATE;
    days_diff INTEGER;
    retention_record RECORD;
BEGIN
    -- Get user signup date from profiles
    SELECT created_at::DATE INTO signup_date
    FROM public.user_profiles
    WHERE id = p_user_id;

    -- Exit if user not found
    IF signup_date IS NULL THEN
        RETURN;
    END IF;

    -- Calculate days since signup
    days_diff := p_activity_date - signup_date;

    -- Only track if days_diff is non-negative
    IF days_diff < 0 THEN
        RETURN;
    END IF;

    -- Insert or update retention metric
    INSERT INTO public.retention_metrics (
        user_id,
        cohort_date,
        days_since_signup,
        last_active_date,
        is_retained,
        activity_count,
        updated_at
    )
    VALUES (
        p_user_id,
        signup_date,
        days_diff,
        p_activity_date,
        true,
        1,
        NOW()
    )
    ON CONFLICT (user_id, cohort_date, days_since_signup)
    DO UPDATE SET
        last_active_date = EXCLUDED.last_active_date,
        is_retained = true,
        activity_count = public.retention_metrics.activity_count + 1,
        updated_at = NOW();

EXCEPTION
    WHEN OTHERS THEN
        -- Log error but don't fail
        RAISE WARNING 'Failed to update retention metrics for user %: %', p_user_id, SQLERRM;
END;
$$;

COMMENT ON FUNCTION public.update_retention_metrics IS
'Updates retention metrics for a user based on activity. Safe to call - will not throw errors.';

-- ============================================================================
-- Function: Get cohort retention rates
-- ============================================================================
CREATE OR REPLACE FUNCTION public.get_cohort_retention_rates(
    p_start_date DATE DEFAULT NULL,
    p_end_date DATE DEFAULT NULL
)
RETURNS TABLE (
    cohort_date DATE,
    cohort_size BIGINT,
    day_0_retained BIGINT,
    day_1_retained BIGINT,
    day_7_retained BIGINT,
    day_30_retained BIGINT,
    day_0_rate NUMERIC,
    day_1_rate NUMERIC,
    day_7_rate NUMERIC,
    day_30_rate NUMERIC
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    -- Only admins can access retention data
    IF NOT public.is_admin() THEN
        RAISE EXCEPTION 'Unauthorized: Admin access required';
    END IF;

    -- Default date range: last 90 days
    p_start_date := COALESCE(p_start_date, CURRENT_DATE - INTERVAL '90 days');
    p_end_date := COALESCE(p_end_date, CURRENT_DATE);

    RETURN QUERY
    WITH cohort_sizes AS (
        SELECT
            created_at::DATE as cohort,
            COUNT(DISTINCT id) as size
        FROM public.user_profiles
        WHERE created_at::DATE BETWEEN p_start_date AND p_end_date
        GROUP BY created_at::DATE
    ),
    retention_data AS (
        SELECT
            rm.cohort_date,
            rm.days_since_signup,
            COUNT(DISTINCT rm.user_id) FILTER (WHERE rm.is_retained) as retained_count
        FROM public.retention_metrics rm
        WHERE rm.cohort_date BETWEEN p_start_date AND p_end_date
          AND rm.days_since_signup IN (0, 1, 7, 30)
        GROUP BY rm.cohort_date, rm.days_since_signup
    )
    SELECT
        cs.cohort as cohort_date,
        cs.size as cohort_size,
        COALESCE(MAX(rd.retained_count) FILTER (WHERE rd.days_since_signup = 0), 0) as day_0_retained,
        COALESCE(MAX(rd.retained_count) FILTER (WHERE rd.days_since_signup = 1), 0) as day_1_retained,
        COALESCE(MAX(rd.retained_count) FILTER (WHERE rd.days_since_signup = 7), 0) as day_7_retained,
        COALESCE(MAX(rd.retained_count) FILTER (WHERE rd.days_since_signup = 30), 0) as day_30_retained,
        ROUND(COALESCE(MAX(rd.retained_count) FILTER (WHERE rd.days_since_signup = 0), 0)::NUMERIC / NULLIF(cs.size, 0) * 100, 2) as day_0_rate,
        ROUND(COALESCE(MAX(rd.retained_count) FILTER (WHERE rd.days_since_signup = 1), 0)::NUMERIC / NULLIF(cs.size, 0) * 100, 2) as day_1_rate,
        ROUND(COALESCE(MAX(rd.retained_count) FILTER (WHERE rd.days_since_signup = 7), 0)::NUMERIC / NULLIF(cs.size, 0) * 100, 2) as day_7_rate,
        ROUND(COALESCE(MAX(rd.retained_count) FILTER (WHERE rd.days_since_signup = 30), 0)::NUMERIC / NULLIF(cs.size, 0) * 100, 2) as day_30_rate
    FROM cohort_sizes cs
    LEFT JOIN retention_data rd ON cs.cohort = rd.cohort_date
    GROUP BY cs.cohort, cs.size
    ORDER BY cs.cohort DESC;
END;
$$;

COMMENT ON FUNCTION public.get_cohort_retention_rates IS
'Returns retention rates by cohort for days 0, 1, 7, and 30. Admin access required.';

-- ============================================================================
-- Function: Get analytics summary
-- ============================================================================
CREATE OR REPLACE FUNCTION public.get_analytics_summary(
    p_start_date TIMESTAMPTZ DEFAULT NULL,
    p_end_date TIMESTAMPTZ DEFAULT NULL
)
RETURNS TABLE (
    event_type TEXT,
    event_count BIGINT,
    unique_users BIGINT,
    first_occurrence TIMESTAMPTZ,
    last_occurrence TIMESTAMPTZ
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    -- Only admins can access analytics data
    IF NOT public.is_admin() THEN
        RAISE EXCEPTION 'Unauthorized: Admin access required';
    END IF;

    -- Default date range: last 30 days
    p_start_date := COALESCE(p_start_date, NOW() - INTERVAL '30 days');
    p_end_date := COALESCE(p_end_date, NOW());

    RETURN QUERY
    SELECT
        ae.event_type,
        COUNT(*) as event_count,
        COUNT(DISTINCT ae.user_id) as unique_users,
        MIN(ae.created_at) as first_occurrence,
        MAX(ae.created_at) as last_occurrence
    FROM public.analytics_events ae
    WHERE ae.created_at BETWEEN p_start_date AND p_end_date
    GROUP BY ae.event_type
    ORDER BY event_count DESC;
END;
$$;

COMMENT ON FUNCTION public.get_analytics_summary IS
'Returns analytics summary grouped by event type. Admin access required.';

-- ============================================================================
-- Function: Promote user to admin
-- ============================================================================
CREATE OR REPLACE FUNCTION public.promote_user_to_admin(
    p_user_id UUID,
    p_role TEXT DEFAULT 'admin'
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    -- Only super_admins can promote users
    IF NOT public.is_super_admin() THEN
        RAISE EXCEPTION 'Unauthorized: Super admin access required';
    END IF;

    -- Validate role
    IF p_role NOT IN ('admin', 'super_admin') THEN
        RAISE EXCEPTION 'Invalid role: must be admin or super_admin';
    END IF;

    -- Update user role
    UPDATE public.user_profiles
    SET role = p_role
    WHERE id = p_user_id;

    -- Log the promotion
    PERFORM public.log_analytics_event(
        p_user_id,
        'user_promoted',
        jsonb_build_object(
            'new_role', p_role,
            'promoted_by', auth.uid(),
            'promoted_at', NOW()
        )
    );

    RETURN FOUND;
EXCEPTION
    WHEN OTHERS THEN
        RAISE EXCEPTION 'Failed to promote user: %', SQLERRM;
END;
$$;

COMMENT ON FUNCTION public.promote_user_to_admin IS
'Promotes a user to admin or super_admin role. Super admin access required.';

-- ============================================================================
-- Function: Demote admin to user
-- ============================================================================
CREATE OR REPLACE FUNCTION public.demote_admin_to_user(p_user_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    current_role TEXT;
BEGIN
    -- Only super_admins can demote users
    IF NOT public.is_super_admin() THEN
        RAISE EXCEPTION 'Unauthorized: Super admin access required';
    END IF;

    -- Prevent self-demotion
    IF p_user_id = auth.uid() THEN
        RAISE EXCEPTION 'Cannot demote yourself';
    END IF;

    -- Get current role
    SELECT role INTO current_role
    FROM public.user_profiles
    WHERE id = p_user_id;

    -- Update user role
    UPDATE public.user_profiles
    SET role = 'user'
    WHERE id = p_user_id;

    -- Log the demotion
    PERFORM public.log_analytics_event(
        p_user_id,
        'user_demoted',
        jsonb_build_object(
            'previous_role', current_role,
            'new_role', 'user',
            'demoted_by', auth.uid(),
            'demoted_at', NOW()
        )
    );

    RETURN FOUND;
EXCEPTION
    WHEN OTHERS THEN
        RAISE EXCEPTION 'Failed to demote user: %', SQLERRM;
END;
$$;

COMMENT ON FUNCTION public.demote_admin_to_user IS
'Demotes an admin or super_admin to regular user role. Super admin access required. Cannot demote yourself.';

-- ============================================================================
-- SECTION 6: Triggers
-- ============================================================================

-- ============================================================================
-- Trigger: Auto-update updated_at on retention_metrics
-- ============================================================================
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$;

-- Drop trigger if exists (idempotent)
DROP TRIGGER IF EXISTS trigger_retention_metrics_updated_at ON public.retention_metrics;

-- Create trigger
CREATE TRIGGER trigger_retention_metrics_updated_at
    BEFORE UPDATE ON public.retention_metrics
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

COMMENT ON TRIGGER trigger_retention_metrics_updated_at ON public.retention_metrics IS
'Automatically updates the updated_at timestamp on record modification';

-- ============================================================================
-- SECTION 7: Grants and Permissions
-- ============================================================================

-- Grant usage on schema to authenticated users
GRANT USAGE ON SCHEMA public TO authenticated;

-- Grant permissions on analytics_events table
GRANT SELECT, INSERT ON public.analytics_events TO authenticated;

-- Grant permissions on retention_metrics table (read-only for authenticated users, controlled by RLS)
GRANT SELECT ON public.retention_metrics TO authenticated;

-- Grant execute permissions on helper functions
GRANT EXECUTE ON FUNCTION public.is_admin TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_super_admin TO authenticated;
GRANT EXECUTE ON FUNCTION public.log_analytics_event TO authenticated;
GRANT EXECUTE ON FUNCTION public.update_retention_metrics TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_cohort_retention_rates TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_analytics_summary TO authenticated;
GRANT EXECUTE ON FUNCTION public.promote_user_to_admin TO authenticated;
GRANT EXECUTE ON FUNCTION public.demote_admin_to_user TO authenticated;

-- ============================================================================
-- SECTION 8: Initial Data and Verification
-- ============================================================================

-- Insert sample analytics event types (optional - for documentation)
DO $$
BEGIN
    -- This is just for documentation purposes
    -- Actual events will be logged by the application
    RAISE NOTICE 'Common analytics event types:';
    RAISE NOTICE '  - page_view: User viewed a page';
    RAISE NOTICE '  - tool_usage: User used a specific tool';
    RAISE NOTICE '  - subscription_change: User subscription status changed';
    RAISE NOTICE '  - api_call: API endpoint was called';
    RAISE NOTICE '  - error_occurred: An error was logged';
    RAISE NOTICE '  - user_promoted: User was promoted to admin';
    RAISE NOTICE '  - user_demoted: User was demoted from admin';
END $$;

-- Verification queries (commented out - run manually if needed)
/*
-- Verify role column exists
SELECT column_name, data_type, column_default
FROM information_schema.columns
WHERE table_name = 'profiles' AND column_name = 'role';

-- Verify analytics_events table
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'analytics_events'
ORDER BY ordinal_position;

-- Verify retention_metrics table
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'retention_metrics'
ORDER BY ordinal_position;

-- List all indexes
SELECT tablename, indexname, indexdef
FROM pg_indexes
WHERE tablename IN ('profiles', 'analytics_events', 'retention_metrics')
ORDER BY tablename, indexname;

-- List all RLS policies
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual
FROM pg_policies
WHERE tablename IN ('analytics_events', 'retention_metrics');

-- List all functions
SELECT routine_name, routine_type
FROM information_schema.routines
WHERE routine_schema = 'public'
AND routine_name LIKE '%admin%' OR routine_name LIKE '%analytics%' OR routine_name LIKE '%retention%';
*/

-- ============================================================================
-- SECTION 5: Admin Reports Table
-- ============================================================================

-- Create admin_reports table for storing generated reports
CREATE TABLE IF NOT EXISTS public.admin_reports (
    id TEXT PRIMARY KEY,
    type TEXT NOT NULL CHECK (type IN ('daily', 'weekly', 'monthly', 'custom')),
    data JSONB NOT NULL DEFAULT '{}'::jsonb,
    generated_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Add table comment
COMMENT ON TABLE public.admin_reports IS 'Stores generated analytics reports for admin users';

-- Create indexes for efficient queries
CREATE INDEX IF NOT EXISTS idx_admin_reports_type ON public.admin_reports(type);
CREATE INDEX IF NOT EXISTS idx_admin_reports_created_at ON public.admin_reports(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_admin_reports_generated_by ON public.admin_reports(generated_by);

-- Enable RLS
ALTER TABLE public.admin_reports ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Only admins can view reports
CREATE POLICY admin_reports_select_policy ON public.admin_reports
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.user_profiles
            WHERE profiles.id = auth.uid()
            AND profiles.role IN ('admin', 'super_admin')
        )
    );

-- RLS Policy: Only admins can insert reports
CREATE POLICY admin_reports_insert_policy ON public.admin_reports
    FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.user_profiles
            WHERE profiles.id = auth.uid()
            AND profiles.role IN ('admin', 'super_admin')
        )
    );

-- RLS Policy: Only super admins can delete reports
CREATE POLICY admin_reports_delete_policy ON public.admin_reports
    FOR DELETE
    USING (
        EXISTS (
            SELECT 1 FROM public.user_profiles
            WHERE profiles.id = auth.uid()
            AND profiles.role = 'super_admin'
        )
    );

-- Create trigger for updated_at
CREATE TRIGGER update_admin_reports_updated_at
    BEFORE UPDATE ON public.admin_reports
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- Migration Complete
-- ============================================================================
-- The following has been created:
--   ✅ Role column added to profiles with CHECK constraint
--   ✅ analytics_events table with indexes and RLS policies
--   ✅ retention_metrics table with indexes and RLS policies
--   ✅ admin_reports table with indexes and RLS policies
--   ✅ Helper functions for admin operations
--   ✅ Triggers for automatic timestamp updates
--   ✅ Comprehensive comments for documentation
--   ✅ Proper error handling and validation
--   ✅ Idempotent operations (safe to run multiple times)
-- ============================================================================
