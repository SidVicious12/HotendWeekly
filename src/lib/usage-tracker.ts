import { createClient } from '@supabase/supabase-js';
import { PLAN_CONFIG, PlanTier } from '@/lib/data/constants';

// Initialize Supabase admin client for secure operations (bypassing RLS where needed for system updates)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = supabaseUrl && supabaseKey
  ? createClient(supabaseUrl, supabaseKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })
  : null;

export interface UsageCheckResult {
  allowed: boolean;
  reason?: string;
  currentUsage?: number;
  limit?: number;
}

/**
 * Checks usage limits and resets monthly quotas if a new billing period has started.
 */
export async function checkAndEnforceLimit(
  userId: string,
  quotaType: 'image' | 'scene' | 'model_3d'
): Promise<UsageCheckResult> {
  if (!supabase) {
    console.warn('Supabase not configured, allowing usage bypass');
    return { allowed: true };
  }

  // 1. Fetch User Profile
  const { data: profile, error } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('id', userId)
    .single();

  if (error || !profile) {
    console.error('Error fetching profile for usage check:', error);
    // Allow if profile missing to avoid user lockout, but log critical error
    return { allowed: true };
  }

  // 2. Determine Plan
  const planKey = (profile.plan_tier || 'free') as PlanTier;
  const config = PLAN_CONFIG[planKey] || PLAN_CONFIG.free;

  // 3. Check for New Month / Billing Period
  const now = new Date();
  const periodStart = profile.usage_period_start ? new Date(profile.usage_period_start) : null;

  const isNewMonth = !periodStart ||
    periodStart.getUTCFullYear() !== now.getUTCFullYear() ||
    periodStart.getUTCMonth() !== now.getUTCMonth();

  if (isNewMonth) {
    // Reset quotas
    await supabase
      .from('user_profiles')
      .update({
        usage_period_start: now.toISOString(),
        images_used_this_month: 0,
        scenes_used_this_month: 0,
        models_used_this_month: 0,
      })
      .eq('id', userId);

    // Reset local values for immediate check
    profile.images_used_this_month = 0;
    profile.scenes_used_this_month = 0;
    profile.models_used_this_month = 0;
  }

  // 4. Check Limits
  let used = 0;
  let limit = 0;

  if (quotaType === 'image') {
    used = profile.images_used_this_month || 0;
    // Enterprise logic can be handled by setting a high number or checking custom flag
    limit = (config as any).custom ? 999999 : (config as any).imageLimit || 0;
  } else if (quotaType === 'scene') {
    used = profile.scenes_used_this_month || 0;
    limit = (config as any).custom ? 999999 : (config as any).sceneLimit || 0;
  } else if (quotaType === 'model_3d') {
    used = profile.models_used_this_month || 0;
    limit = (config as any).custom ? 999999 : (config as any).models3DLimit || 0;
  }

  if (used >= limit) {
    return {
      allowed: false,
      reason: `Monthly limit reached for ${quotaType}s (${used}/${limit})`,
      currentUsage: used,
      limit
    };
  }

  return { allowed: true, currentUsage: used, limit };
}

/**
 * Increments the usage counter for the specified quota type.
 */
export async function incrementUsage(
  userId: string,
  quotaType: 'image' | 'scene' | 'model_3d'
): Promise<void> {
  if (!supabase) return;

  const columnMap = {
    'image': 'images_used_this_month',
    'scene': 'scenes_used_this_month',
    'model_3d': 'models_used_this_month'
  };

  const column = columnMap[quotaType];

  // We fetch first to increment safely or use an RPC if concurrency is high.
  // For simplicity, we'll re-fetch and update, or use a raw SQL increment if RPC available.
  // Given previous pattern used RPC, but user asked for logic here. 
  // We'll trust the direct update for MVP.

  const { data: profile } = await supabase
    .from('user_profiles')
    .select(column)
    .eq('id', userId)
    .single();

  if (profile) {
    const current = (profile as any)[column] || 0;
    await supabase
      .from('user_profiles')
      .update({ [column]: current + 1 })
      .eq('id', userId);
  }
}

/**
 * Logs a generation event to the 'generations' table.
 */
export async function logGeneration(data: {
  userId: string;
  tool: string;
  inputUrl?: string;
  outputUrl?: string;
  inputMetadata?: any;
  outputMetadata?: any;
  tokensUsed?: number;
  costUsd?: number;
}) {
  if (!supabase) return;

  const { data: inserted, error } = await supabase.from('generations').insert({
    user_id: data.userId,
    tool: data.tool,
    input_url: data.inputUrl,
    output_url: data.outputUrl,
    input_metadata: data.inputMetadata,
    output_metadata: data.outputMetadata,
    tokens_used: data.tokensUsed,
    cost_usd: data.costUsd
  }).select().single();

  return inserted?.id;
}
