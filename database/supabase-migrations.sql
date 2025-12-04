-- ============================================================================
-- HotendWeekly Database Schema - User Subscriptions & Usage Tracking
-- ============================================================================
-- Description: Complete schema for managing user subscriptions, tiers, and usage limits
-- Created: 2025-11-21
-- Version: 1.0.1 (cleaned + corrected)
-- ============================================================================

-- Enable required extensions
-- gen_random_uuid() comes from pgcrypto
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
-- uuid-ossp is optional; keep if you ever want uuid_generate_v4()
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- SUBSCRIPTION TIERS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS subscription_tiers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  price_monthly DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  price_yearly DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  stripe_price_id_monthly TEXT,
  stripe_price_id_yearly TEXT,
  stripe_product_id TEXT,

  -- Feature limits
  monthly_tool_usage_limit INTEGER NOT NULL DEFAULT 0,
  daily_tool_usage_limit INTEGER NOT NULL DEFAULT 0,
  max_image_size_mb INTEGER NOT NULL DEFAULT 5,
  max_concurrent_jobs INTEGER NOT NULL DEFAULT 1,
  api_access BOOLEAN DEFAULT false,
  priority_processing BOOLEAN DEFAULT false,

  -- Features enabled
  features JSONB DEFAULT '[]'::jsonb,

  -- Metadata
  is_active BOOLEAN DEFAULT true,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- USER PROFILES TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  avatar_url TEXT,

  -- Role and permissions
  role TEXT DEFAULT 'user'
    CHECK (role IN ('user', 'admin', 'super_admin')),

  -- Subscription details
  subscription_tier_id UUID REFERENCES subscription_tiers(id) ON DELETE SET NULL,
  stripe_customer_id TEXT UNIQUE,
  stripe_subscription_id TEXT UNIQUE,
  subscription_status TEXT DEFAULT 'inactive'
    CHECK (subscription_status IN ('inactive', 'active', 'trialing', 'past_due', 'canceled', 'unpaid')),
  subscription_start_date TIMESTAMP WITH TIME ZONE,
  subscription_end_date TIMESTAMP WITH TIME ZONE,
  trial_end_date TIMESTAMP WITH TIME ZONE,

  -- Billing details
  billing_email TEXT,
  billing_cycle TEXT DEFAULT 'monthly'
    CHECK (billing_cycle IN ('monthly', 'yearly')),

  -- Usage metadata
  total_credits INTEGER DEFAULT 0,
  bonus_credits INTEGER DEFAULT 0,

  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_login_at TIMESTAMP WITH TIME ZONE
);

-- ============================================================================
-- TOOL USAGE TRACKING TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS tool_usage (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,

  -- Tool information
  tool_name TEXT NOT NULL,
  tool_category TEXT NOT NULL,

  -- Usage details
  usage_count INTEGER DEFAULT 1,
  credits_used INTEGER DEFAULT 0,

  -- Request/response metadata
  request_metadata JSONB DEFAULT '{}'::jsonb,
  response_metadata JSONB DEFAULT '{}'::jsonb,

  -- Status tracking
  status TEXT DEFAULT 'success'
    CHECK (status IN ('success', 'failed', 'rate_limited', 'error')),
  error_message TEXT,

  -- Performance metrics
  processing_time_ms INTEGER,

  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  usage_date DATE DEFAULT (NOW() AT TIME ZONE 'UTC')::date
);

-- ============================================================================
-- USAGE QUOTAS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS usage_quotas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,

  -- Quota tracking
  daily_usage INTEGER DEFAULT 0,
  monthly_usage INTEGER DEFAULT 0,

  -- Reset tracking
  -- NOTE: these are "rolling" resets since signup.
  -- If you want calendar resets, swap to:
  --   daily_reset_at   DEFAULT (date_trunc('day', now()) + interval '1 day'),
  --   monthly_reset_at DEFAULT (date_trunc('month', now()) + interval '1 month')
  daily_reset_at TIMESTAMP WITH TIME ZONE DEFAULT (NOW() + INTERVAL '1 day'),
  monthly_reset_at TIMESTAMP WITH TIME ZONE DEFAULT (NOW() + INTERVAL '1 month'),

  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  UNIQUE(user_id)
);

-- ============================================================================
-- SUBSCRIPTION HISTORY TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS subscription_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  subscription_tier_id UUID REFERENCES subscription_tiers(id) ON DELETE SET NULL,

  -- Change details
  action TEXT NOT NULL
    CHECK (action IN ('created', 'upgraded', 'downgraded', 'canceled', 'renewed', 'expired')),
  previous_tier TEXT,
  new_tier TEXT,

  -- Financial details
  amount_paid DECIMAL(10,2),
  currency TEXT DEFAULT 'USD',

  -- Stripe metadata
  stripe_event_id TEXT,
  stripe_invoice_id TEXT,

  -- Additional info
  notes TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,

  -- Timestamp
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- AUDIT LOGS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,

  -- Action details
  action TEXT NOT NULL,
  resource_type TEXT NOT NULL,
  resource_id UUID,

  -- Change details
  details JSONB DEFAULT '{}'::jsonb,

  -- Request metadata
  ip_address TEXT,
  user_agent TEXT,

  -- Timestamp
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- INDEXES FOR PERFORMANCE
-- ============================================================================

-- User Profiles Indexes
CREATE INDEX IF NOT EXISTS idx_user_profiles_email ON user_profiles(email);
CREATE INDEX IF NOT EXISTS idx_user_profiles_stripe_customer ON user_profiles(stripe_customer_id);
CREATE INDEX IF NOT EXISTS idx_user_profiles_subscription_status ON user_profiles(subscription_status);
CREATE INDEX IF NOT EXISTS idx_user_profiles_tier ON user_profiles(subscription_tier_id);
CREATE INDEX IF NOT EXISTS idx_user_profiles_role ON user_profiles(role);

-- Tool Usage Indexes
CREATE INDEX IF NOT EXISTS idx_tool_usage_user_id ON tool_usage(user_id);
CREATE INDEX IF NOT EXISTS idx_tool_usage_tool_name ON tool_usage(tool_name);
CREATE INDEX IF NOT EXISTS idx_tool_usage_created_at ON tool_usage(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_tool_usage_date ON tool_usage(usage_date);
CREATE INDEX IF NOT EXISTS idx_tool_usage_user_date ON tool_usage(user_id, usage_date);

-- Usage Quotas Indexes
CREATE INDEX IF NOT EXISTS idx_usage_quotas_user_id ON usage_quotas(user_id);

-- Subscription History Indexes
CREATE INDEX IF NOT EXISTS idx_subscription_history_user_id ON subscription_history(user_id);
CREATE INDEX IF NOT EXISTS idx_subscription_history_created_at ON subscription_history(created_at DESC);

-- Audit Logs Indexes
CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_action ON audit_logs(action);
CREATE INDEX IF NOT EXISTS idx_audit_logs_resource ON audit_logs(resource_type, resource_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON audit_logs(created_at DESC);

-- ============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================

ALTER TABLE subscription_tiers ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE tool_usage ENABLE ROW LEVEL SECURITY;
ALTER TABLE usage_quotas ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscription_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Subscription Tiers: Public read access
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'subscription_tiers'
      AND policyname = 'Anyone can view active subscription tiers'
  ) THEN
    CREATE POLICY "Anyone can view active subscription tiers"
      ON subscription_tiers
      FOR SELECT
      USING (is_active = true);
  END IF;
END $$;

-- User Profiles: Users can read/update/insert their own profile
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename='user_profiles' AND policyname='Users can view own profile'
  ) THEN
    CREATE POLICY "Users can view own profile"
      ON user_profiles
      FOR SELECT
      USING (auth.uid() = id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename='user_profiles' AND policyname='Users can update own profile'
  ) THEN
    CREATE POLICY "Users can update own profile"
      ON user_profiles
      FOR UPDATE
      USING (auth.uid() = id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename='user_profiles' AND policyname='Users can insert own profile'
  ) THEN
    CREATE POLICY "Users can insert own profile"
      ON user_profiles
      FOR INSERT
      WITH CHECK (auth.uid() = id);
  END IF;
END $$;

-- Tool Usage: Users can view/insert their own usage
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename='tool_usage' AND policyname='Users can view own usage'
  ) THEN
    CREATE POLICY "Users can view own usage"
      ON tool_usage
      FOR SELECT
      USING (auth.uid() = user_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename='tool_usage' AND policyname='Users can insert own usage'
  ) THEN
    CREATE POLICY "Users can insert own usage"
      ON tool_usage
      FOR INSERT
      WITH CHECK (auth.uid() = user_id);
  END IF;
END $$;

-- Usage Quotas: Users can view/update/insert their own quotas
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename='usage_quotas' AND policyname='Users can view own quotas'
  ) THEN
    CREATE POLICY "Users can view own quotas"
      ON usage_quotas
      FOR SELECT
      USING (auth.uid() = user_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename='usage_quotas' AND policyname='Users can update own quotas'
  ) THEN
    CREATE POLICY "Users can update own quotas"
      ON usage_quotas
      FOR UPDATE
      USING (auth.uid() = user_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename='usage_quotas' AND policyname='Users can insert own quotas'
  ) THEN
    CREATE POLICY "Users can insert own quotas"
      ON usage_quotas
      FOR INSERT
      WITH CHECK (auth.uid() = user_id);
  END IF;
END $$;

-- Subscription History: Users can view their own history
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename='subscription_history' AND policyname='Users can view own subscription history'
  ) THEN
    CREATE POLICY "Users can view own subscription history"
      ON subscription_history
      FOR SELECT
      USING (auth.uid() = user_id);
  END IF;
END $$;

-- Audit Logs: Admins can view all logs, users can view their own
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename='audit_logs' AND policyname='Admins can view all audit logs'
  ) THEN
    CREATE POLICY "Admins can view all audit logs"
      ON audit_logs
      FOR SELECT
      USING (
        EXISTS (
          SELECT 1 FROM user_profiles
          WHERE id = auth.uid()
          AND role IN ('admin', 'super_admin')
        )
      );
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename='audit_logs' AND policyname='Service role can insert audit logs'
  ) THEN
    CREATE POLICY "Service role can insert audit logs"
      ON audit_logs
      FOR INSERT
      WITH CHECK (true);
  END IF;
END $$;

-- Admin policies: Admins can view all user profiles
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename='user_profiles' AND policyname='Admins can view all profiles'
  ) THEN
    CREATE POLICY "Admins can view all profiles"
      ON user_profiles
      FOR SELECT
      USING (
        EXISTS (
          SELECT 1 FROM user_profiles up
          WHERE up.id = auth.uid()
          AND up.role IN ('admin', 'super_admin')
        )
      );
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename='user_profiles' AND policyname='Super admins can update any profile'
  ) THEN
    CREATE POLICY "Super admins can update any profile"
      ON user_profiles
      FOR UPDATE
      USING (
        EXISTS (
          SELECT 1 FROM user_profiles up
          WHERE up.id = auth.uid()
          AND up.role = 'super_admin'
        )
      );
  END IF;
END $$;

-- ============================================================================
-- TRIGGERS
-- ============================================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_user_profiles_updated_at ON user_profiles;
CREATE TRIGGER update_user_profiles_updated_at
  BEFORE UPDATE ON user_profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_subscription_tiers_updated_at ON subscription_tiers;
CREATE TRIGGER update_subscription_tiers_updated_at
  BEFORE UPDATE ON subscription_tiers
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_usage_quotas_updated_at ON usage_quotas;
CREATE TRIGGER update_usage_quotas_updated_at
  BEFORE UPDATE ON usage_quotas
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Auto-create user profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_profiles (id, email, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'avatar_url'
  )
  ON CONFLICT (id) DO NOTHING;

  -- Assign default tier (Tinkerer/Free) if available
  UPDATE public.user_profiles
  SET subscription_tier_id = (
    SELECT id FROM subscription_tiers WHERE slug = 'tinkerer' LIMIT 1
  )
  WHERE id = NEW.id
    AND subscription_tier_id IS NULL;

  -- Initialize usage quota
  INSERT INTO public.usage_quotas (user_id)
  VALUES (NEW.id)
  ON CONFLICT (user_id) DO NOTHING;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- ============================================================================
-- FUNCTIONS
-- ============================================================================

-- Function to check if user has exceeded usage limits
CREATE OR REPLACE FUNCTION check_usage_limit(
  p_user_id UUID,
  p_tool_name TEXT
)
RETURNS JSONB AS $$
DECLARE
  v_quota RECORD;
  v_result JSONB;
BEGIN
  SELECT
    uq.daily_usage,
    uq.monthly_usage,
    st.daily_tool_usage_limit,
    st.monthly_tool_usage_limit
  INTO v_quota
  FROM usage_quotas uq
  JOIN user_profiles up ON up.id = uq.user_id
  JOIN subscription_tiers st ON st.id = up.subscription_tier_id
  WHERE uq.user_id = p_user_id;

  IF NOT FOUND THEN
    RETURN jsonb_build_object(
      'allowed', false,
      'reason', 'quota_or_tier_missing'
    );
  END IF;

  IF v_quota.daily_usage >= v_quota.daily_tool_usage_limit THEN
    v_result := jsonb_build_object(
      'allowed', false,
      'reason', 'daily_limit_exceeded',
      'current_usage', v_quota.daily_usage,
      'limit', v_quota.daily_tool_usage_limit
    );
  ELSIF v_quota.monthly_usage >= v_quota.monthly_tool_usage_limit THEN
    v_result := jsonb_build_object(
      'allowed', false,
      'reason', 'monthly_limit_exceeded',
      'current_usage', v_quota.monthly_usage,
      'limit', v_quota.monthly_tool_usage_limit
    );
  ELSE
    v_result := jsonb_build_object(
      'allowed', true,
      'daily_remaining', v_quota.daily_tool_usage_limit - v_quota.daily_usage,
      'monthly_remaining', v_quota.monthly_tool_usage_limit - v_quota.monthly_usage
    );
  END IF;

  RETURN v_result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to increment usage (UPSERT-safe)
CREATE OR REPLACE FUNCTION increment_usage(
  p_user_id UUID,
  p_tool_name TEXT,
  p_credits INTEGER DEFAULT 1
)
RETURNS VOID AS $$
BEGIN
  INSERT INTO usage_quotas (user_id, daily_usage, monthly_usage)
  VALUES (p_user_id, 1, 1)
  ON CONFLICT (user_id) DO UPDATE
  SET daily_usage  = usage_quotas.daily_usage + 1,
      monthly_usage = usage_quotas.monthly_usage + 1,
      updated_at = NOW();

  INSERT INTO tool_usage (user_id, tool_name, tool_category, credits_used)
  VALUES (p_user_id, p_tool_name, 'ai_tools', p_credits);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check if user is admin
CREATE OR REPLACE FUNCTION is_admin(p_user_id UUID DEFAULT NULL)
RETURNS BOOLEAN AS $$
DECLARE
  v_user_id UUID;
  v_role TEXT;
BEGIN
  -- Use provided user_id or current authenticated user
  v_user_id := COALESCE(p_user_id, auth.uid());

  IF v_user_id IS NULL THEN
    RETURN false;
  END IF;

  SELECT role INTO v_role
  FROM user_profiles
  WHERE id = v_user_id;

  RETURN v_role IN ('admin', 'super_admin');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check if user is super admin
CREATE OR REPLACE FUNCTION is_super_admin(p_user_id UUID DEFAULT NULL)
RETURNS BOOLEAN AS $$
DECLARE
  v_user_id UUID;
  v_role TEXT;
BEGIN
  -- Use provided user_id or current authenticated user
  v_user_id := COALESCE(p_user_id, auth.uid());

  IF v_user_id IS NULL THEN
    RETURN false;
  END IF;

  SELECT role INTO v_role
  FROM user_profiles
  WHERE id = v_user_id;

  RETURN v_role = 'super_admin';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- INITIAL DATA - SUBSCRIPTION TIERS (single canonical seed)
-- ============================================================================

INSERT INTO subscription_tiers (
  name, slug, description,
  price_monthly, price_yearly,
  stripe_price_id_monthly, stripe_price_id_yearly, stripe_product_id,
  monthly_tool_usage_limit, daily_tool_usage_limit,
  max_image_size_mb, max_concurrent_jobs,
  api_access, priority_processing,
  features, display_order, is_active
) VALUES
(
  'Tinkerer',
  'tinkerer',
  'Perfect for getting started with AI-powered fashion tools',
  0.00, 0.00,
  'price_1SWE8qFJGa1lyUTVTICqZ3b3', 'price_1SWE8qFJGa1lyUTVTICqZ3b3', 'prod_TTATKd5BCPYeCn',
  10, 3,
  5, 1,
  false, false,
  '["Basic AI Tools", "3 uses per day", "5MB image limit", "Community Support"]'::jsonb,
  1, true
),
(
  'Creator',
  'creator',
  'For fashion enthusiasts and content creators',
  19.99, 199.00,
  'price_1SWEIIFJGa1lyUTVWSedHj8O', 'price_1SWEK8FJGa1lyUTVxsXrztE6', 'prod_TTAcxUUbnzKqVM',
  100, 20,
  10, 3,
  false, true,
  '["All AI Tools", "20 uses per day", "10MB image limit", "Priority Processing", "Email Support"]'::jsonb,
  2, true
),
(
  'Professional',
  'professional',
  'For businesses and professional designers',
  49.99, 499.00,
  'price_1SWELUFJGa1lyUTV1OuXfH6m', 'price_1SWEMPFJGa1lyUTVKiWe9tVW', 'prod_TTAgMXlxVpTaDT',
  500, 100,
  25, 10,
  true, true,
  '["All AI Tools", "Unlimited daily use", "25MB image limit", "Priority Processing", "API Access", "Priority Support"]'::jsonb,
  3, true
)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  price_monthly = EXCLUDED.price_monthly,
  price_yearly = EXCLUDED.price_yearly,
  stripe_price_id_monthly = EXCLUDED.stripe_price_id_monthly,
  stripe_price_id_yearly = EXCLUDED.stripe_price_id_yearly,
  stripe_product_id = EXCLUDED.stripe_product_id,
  monthly_tool_usage_limit = EXCLUDED.monthly_tool_usage_limit,
  daily_tool_usage_limit = EXCLUDED.daily_tool_usage_limit,
  max_image_size_mb = EXCLUDED.max_image_size_mb,
  max_concurrent_jobs = EXCLUDED.max_concurrent_jobs,
  api_access = EXCLUDED.api_access,
  priority_processing = EXCLUDED.priority_processing,
  features = EXCLUDED.features,
  display_order = EXCLUDED.display_order,
  is_active = EXCLUDED.is_active,
  updated_at = NOW();

-- ============================================================================
-- GRANT PERMISSIONS
-- ============================================================================

GRANT SELECT ON subscription_tiers TO authenticated;
GRANT ALL ON user_profiles TO authenticated;
GRANT ALL ON tool_usage TO authenticated;
GRANT ALL ON usage_quotas TO authenticated;
GRANT SELECT ON subscription_history TO authenticated;
GRANT SELECT ON audit_logs TO authenticated;
GRANT INSERT ON audit_logs TO service_role;

GRANT SELECT ON subscription_tiers TO anon;

-- ============================================================================
-- VIEWS
-- ============================================================================

CREATE OR REPLACE VIEW user_subscription_details AS
SELECT
  up.id AS user_id,
  up.email,
  up.full_name,
  st.name AS tier_name,
  st.slug AS tier_slug,
  st.price_monthly,
  st.monthly_tool_usage_limit,
  st.daily_tool_usage_limit,
  up.subscription_status,
  up.subscription_start_date,
  up.subscription_end_date,
  uq.daily_usage,
  uq.monthly_usage,
  (st.daily_tool_usage_limit - uq.daily_usage) AS daily_remaining,
  (st.monthly_tool_usage_limit - uq.monthly_usage) AS monthly_remaining
FROM user_profiles up
LEFT JOIN subscription_tiers st ON st.id = up.subscription_tier_id
LEFT JOIN usage_quotas uq ON uq.user_id = up.id;

GRANT SELECT ON user_subscription_details TO authenticated;

-- ============================================================================
-- END OF MIGRATION
-- ============================================================================