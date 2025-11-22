-- ============================================================================
-- TEST DATA SEEDING SCRIPT
-- ============================================================================
-- Run this in your LOCAL/DEV Supabase SQL Editor to create test data
-- DO NOT run in production!
-- ============================================================================

-- Create test user profiles (assumes auth users already exist)
-- You'll need to sign up these users first through your app

-- Simulate usage for test users
-- Replace USER_ID_HERE with actual user IDs from auth.users table

-- Example: Add test usage for a user
INSERT INTO tool_usage (
  user_id,
  tool_name,
  tool_category,
  usage_count,
  credits_used,
  status,
  processing_time_ms,
  request_metadata,
  response_metadata
) VALUES
  -- User 1: Some successful uses
  ('USER_ID_1', 'virtual-tryon', 'ai_tools', 1, 1, 'success', 2500, '{"image_size": "1024x1024"}'::jsonb, '{"output_url": "https://example.com/output1.jpg"}'::jsonb),
  ('USER_ID_1', 'remove-bg', 'ai_tools', 1, 1, 'success', 1200, '{"image_size": "512x512"}'::jsonb, '{"output_url": "https://example.com/output2.jpg"}'::jsonb),
  ('USER_ID_1', 'flux-generate', 'ai_tools', 1, 1, 'success', 3500, '{"prompt": "fashion model"}'::jsonb, '{"output_url": "https://example.com/output3.jpg"}'::jsonb),
  
  -- User 1: Some rate limited attempts
  ('USER_ID_1', 'virtual-tryon', 'ai_tools', 1, 0, 'rate_limited', 50, '{"image_size": "1024x1024"}'::jsonb, '{}'::jsonb),
  
  -- User 2: Heavy usage
  ('USER_ID_2', 'virtual-tryon', 'ai_tools', 1, 1, 'success', 2100, '{"image_size": "2048x2048"}'::jsonb, '{"output_url": "https://example.com/output4.jpg"}'::jsonb),
  ('USER_ID_2', 'simplify-image', 'ai_tools', 1, 1, 'success', 1800, '{"complexity": "high"}'::jsonb, '{"output_url": "https://example.com/output5.jpg"}'::jsonb),
  ('USER_ID_2', 'flux-generate', 'ai_tools', 1, 1, 'success', 4200, '{"prompt": "product photo"}'::jsonb, '{"output_url": "https://example.com/output6.jpg"}'::jsonb);

-- Update usage quotas to reflect the test usage
-- Replace USER_ID_HERE with actual user IDs

UPDATE usage_quotas
SET 
  daily_usage = 4,
  monthly_usage = 4
WHERE user_id = 'USER_ID_1';

UPDATE usage_quotas
SET 
  daily_usage = 3,
  monthly_usage = 15
WHERE user_id = 'USER_ID_2';

-- Add subscription history entries
INSERT INTO subscription_history (
  user_id,
  action,
  previous_tier,
  new_tier,
  stripe_subscription_id,
  metadata
) VALUES
  ('USER_ID_2', 'upgraded', 'tinkerer', 'creator', 'sub_test123', '{"payment_method": "card", "amount": 19.99}'::jsonb),
  ('USER_ID_2', 'renewed', 'creator', 'creator', 'sub_test123', '{"payment_method": "card", "amount": 19.99}'::jsonb);

-- ============================================================================
-- VERIFICATION QUERIES
-- ============================================================================

-- Check subscription tiers
SELECT * FROM subscription_tiers ORDER BY display_order;

-- Check user profiles
SELECT 
  up.email,
  st.name as tier,
  up.subscription_status,
  uq.daily_usage,
  uq.monthly_usage,
  st.daily_tool_usage_limit,
  st.monthly_tool_usage_limit
FROM user_profiles up
LEFT JOIN subscription_tiers st ON st.id = up.subscription_tier_id
LEFT JOIN usage_quotas uq ON uq.user_id = up.id;

-- Check tool usage
SELECT 
  up.email,
  tu.tool_name,
  tu.status,
  tu.created_at
FROM tool_usage tu
JOIN user_profiles up ON up.id = tu.user_id
ORDER BY tu.created_at DESC
LIMIT 20;

-- Check usage stats
SELECT * FROM user_subscription_details;
