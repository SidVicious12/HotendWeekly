/**
 * Usage Tracking Utilities
 *
 * Helper functions for tracking and managing user tool usage and quotas.
 * Integrates with Supabase database for usage limits and rate limiting.
 */

import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

let supabase: ReturnType<typeof createClient> | null = null;

if (supabaseUrl && supabaseKey) {
  try {
    supabase = createClient(supabaseUrl, supabaseKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });
  } catch (e) {
    console.warn('Failed to initialize usage-tracker Supabase client:', e);
  }
} else {
  console.warn('Missing Supabase credentials in usage-tracker. Usage tracking will be disabled.');
}

/**
 * Usage limit check result
 */
export interface UsageLimitResult {
  allowed: boolean;
  reason?: 'daily_limit_exceeded' | 'monthly_limit_exceeded';
  currentUsage?: number;
  limit?: number;
  dailyRemaining?: number;
  monthlyRemaining?: number;
}

/**
 * Tool usage metadata
 */
export interface ToolUsageMetadata {
  toolName: string;
  toolCategory?: string;
  requestMetadata?: Record<string, any>;
  responseMetadata?: Record<string, any>;
  processingTimeMs?: number;
  status?: 'success' | 'failed' | 'rate_limited' | 'error';
  errorMessage?: string;
}

/**
 * Check if user has exceeded usage limits
 */
export async function checkUsageLimit(
  userId: string,
  toolName: string
): Promise<UsageLimitResult> {
  try {
    if (!supabase) return { allowed: true };

    const { data, error } = await supabase.rpc('check_usage_limit', {
      p_user_id: userId,
      p_tool_name: toolName,
    });

    if (error) {
      console.error('Error checking usage limit:', error);
      // Default to allowing on error to prevent blocking users
      return { allowed: true };
    }

    return data as UsageLimitResult;
  } catch (error) {
    console.error('Error checking usage limit:', error);
    return { allowed: true };
  }
}

/**
 * Increment usage counter and record usage
 */
export async function incrementUsage(
  userId: string,
  metadata: ToolUsageMetadata
): Promise<void> {
  try {
    if (!supabase) return;

    const {
      toolName,
      toolCategory = 'ai_tools',
      requestMetadata = {},
      responseMetadata = {},
      processingTimeMs = 0,
      status = 'success',
      errorMessage,
    } = metadata;

    // Call the increment_usage function
    const { error: rpcError } = await supabase.rpc('increment_usage', {
      p_user_id: userId,
      p_tool_name: toolName,
      p_credits: 1,
    });

    if (rpcError) {
      console.error('Error incrementing usage:', rpcError);
    }

    // Also insert detailed usage record
    const { error: insertError } = await supabase.from('tool_usage').insert({
      user_id: userId,
      tool_name: toolName,
      tool_category: toolCategory,
      request_metadata: requestMetadata,
      response_metadata: responseMetadata,
      processing_time_ms: processingTimeMs,
      status,
      error_message: errorMessage,
    });

    if (insertError) {
      console.error('Error recording usage:', insertError);
    }
  } catch (error) {
    console.error('Error incrementing usage:', error);
  }
}

/**
 * Get user's current usage statistics
 */
export async function getUserUsageStats(userId: string) {
  try {
    if (!supabase) return null;

    const { data, error } = await supabase
      .from('user_subscription_details')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error) {
      console.error('Error fetching user usage stats:', error);
      return null;
    }

    return {
      dailyUsage: data.daily_usage || 0,
      monthlyUsage: data.monthly_usage || 0,
      dailyLimit: data.daily_tool_usage_limit || 0,
      monthlyLimit: data.monthly_tool_usage_limit || 0,
      dailyRemaining: data.daily_remaining || 0,
      monthlyRemaining: data.monthly_remaining || 0,
      tierName: data.tier_name || 'Tinkerer',
      tierSlug: data.tier_slug || 'tinkerer',
    };
  } catch (error) {
    console.error('Error fetching user usage stats:', error);
    return null;
  }
}

/**
 * Get usage history for a user
 */
export async function getUserUsageHistory(
  userId: string,
  options?: {
    limit?: number;
    offset?: number;
    toolName?: string;
    startDate?: string;
    endDate?: string;
  }
) {
  try {
    if (!supabase) return [];

    let query = supabase
      .from('tool_usage')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (options?.toolName) {
      query = query.eq('tool_name', options.toolName);
    }

    if (options?.startDate) {
      query = query.gte('created_at', options.startDate);
    }

    if (options?.endDate) {
      query = query.lte('created_at', options.endDate);
    }

    if (options?.limit) {
      query = query.limit(options.limit);
    }

    if (options?.offset) {
      query = query.range(options.offset, options.offset + (options.limit || 10) - 1);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching usage history:', error);
      return [];
    }

    return data;
  } catch (error) {
    console.error('Error fetching usage history:', error);
    return [];
  }
}

/**
 * Reset daily usage quota (called by scheduled job)
 */
export async function resetDailyQuotas(): Promise<void> {
  try {
    if (!supabase) return;

    const { error } = await supabase
      .from('usage_quotas')
      .update({
        daily_usage: 0,
        daily_reset_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      })
      .lte('daily_reset_at', new Date().toISOString());

    if (error) {
      console.error('Error resetting daily quotas:', error);
    } else {
      console.log('Daily quotas reset successfully');
    }
  } catch (error) {
    console.error('Error resetting daily quotas:', error);
  }
}

/**
 * Reset monthly usage quota (called by scheduled job)
 */
export async function resetMonthlyQuotas(): Promise<void> {
  try {
    if (!supabase) return;

    const { error } = await supabase
      .from('usage_quotas')
      .update({
        monthly_usage: 0,
        monthly_reset_at: new Date(
          Date.now() + 30 * 24 * 60 * 60 * 1000
        ).toISOString(),
      })
      .lte('monthly_reset_at', new Date().toISOString());

    if (error) {
      console.error('Error resetting monthly quotas:', error);
    } else {
      console.log('Monthly quotas reset successfully');
    }
  } catch (error) {
    console.error('Error resetting monthly quotas:', error);
  }
}

/**
 * Middleware function to check usage before API call
 */
export async function withUsageTracking<T>(
  userId: string,
  toolName: string,
  handler: () => Promise<T>
): Promise<{ success: boolean; data?: T; error?: string }> {
  const startTime = Date.now();

  try {
    // Check usage limit
    const limitCheck = await checkUsageLimit(userId, toolName);

    if (!limitCheck.allowed) {
      return {
        success: false,
        error: `Usage limit exceeded: ${limitCheck.reason}. Current: ${limitCheck.currentUsage}/${limitCheck.limit}`,
      };
    }

    // Execute handler
    const result = await handler();
    const processingTime = Date.now() - startTime;

    // Record successful usage
    await incrementUsage(userId, {
      toolName,
      processingTimeMs: processingTime,
      status: 'success',
    });

    return { success: true, data: result };
  } catch (error) {
    const processingTime = Date.now() - startTime;

    // Record failed usage
    await incrementUsage(userId, {
      toolName,
      processingTimeMs: processingTime,
      status: 'error',
      errorMessage: error instanceof Error ? error.message : 'Unknown error',
    });

    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}
