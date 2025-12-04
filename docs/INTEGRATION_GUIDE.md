# Integration Guide: Usage Tracking

Guide for integrating usage tracking and subscription limits into existing HotendWeekly tools.

## Quick Start

### Step 1: Import Usage Tracker

```typescript
import { checkUsageLimit, incrementUsage } from '@/lib/usage-tracker';
```

### Step 2: Check Limits Before Processing

```typescript
// Check if user has exceeded usage limits
const limitCheck = await checkUsageLimit(userId, 'tool-name');

if (!limitCheck.allowed) {
  return NextResponse.json(
    {
      error: `Usage limit exceeded: ${limitCheck.reason}`,
      currentUsage: limitCheck.currentUsage,
      limit: limitCheck.limit,
      upgradeUrl: '/pricing',
    },
    { status: 429 } // Too Many Requests
  );
}
```

### Step 3: Track Usage After Success

```typescript
// Record successful usage
await incrementUsage(userId, {
  toolName: 'tool-name',
  toolCategory: 'ai_tools',
  processingTimeMs: Date.now() - startTime,
  status: 'success',
  requestMetadata: { imageSize: imageSizeMB },
  responseMetadata: { outputFormat: 'png' },
});
```

## Example: Integrate into Virtual Try-On API

### Before (No Usage Tracking)

```typescript
// src/app/api/virtual-tryon/route.ts
export async function POST(request: NextRequest) {
  try {
    // Process request...
    const result = await processVirtualTryon(imageData);
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}
```

### After (With Usage Tracking)

```typescript
// src/app/api/virtual-tryon/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { checkUsageLimit, incrementUsage } from '@/lib/usage-tracker';

export async function POST(request: NextRequest) {
  const startTime = Date.now();

  try {
    // 1. Authenticate user
    const cookieStore = await cookies();
    const supabase = createServerComponentClient({ cookies: () => cookieStore });
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // 2. Check usage limits
    const limitCheck = await checkUsageLimit(user.id, 'virtual-tryon');

    if (!limitCheck.allowed) {
      // Record rate-limited attempt
      await incrementUsage(user.id, {
        toolName: 'virtual-tryon',
        toolCategory: 'ai_tools',
        status: 'rate_limited',
        processingTimeMs: Date.now() - startTime,
      });

      return NextResponse.json(
        {
          error: `Usage limit exceeded: ${limitCheck.reason}`,
          currentUsage: limitCheck.currentUsage,
          limit: limitCheck.limit,
          dailyRemaining: limitCheck.dailyRemaining,
          monthlyRemaining: limitCheck.monthlyRemaining,
          upgradeUrl: '/pricing',
        },
        { status: 429 }
      );
    }

    // 3. Parse and validate request
    const body = await request.json();
    const { garmentImage, personImage } = body;

    if (!garmentImage || !personImage) {
      return NextResponse.json(
        { error: 'Missing required images' },
        { status: 400 }
      );
    }

    // 4. Process request
    const result = await processVirtualTryon({ garmentImage, personImage });

    // 5. Record successful usage
    await incrementUsage(user.id, {
      toolName: 'virtual-tryon',
      toolCategory: 'ai_tools',
      processingTimeMs: Date.now() - startTime,
      status: 'success',
      requestMetadata: {
        garmentImageSize: garmentImage.length,
        personImageSize: personImage.length,
      },
      responseMetadata: {
        outputFormat: result.format,
        outputSize: result.size,
      },
    });

    return NextResponse.json(result);
  } catch (error) {
    // Record failed usage
    await incrementUsage(user.id, {
      toolName: 'virtual-tryon',
      toolCategory: 'ai_tools',
      processingTimeMs: Date.now() - startTime,
      status: 'error',
      errorMessage: error instanceof Error ? error.message : 'Unknown error',
    });

    return NextResponse.json(
      { error: 'Processing failed' },
      { status: 500 }
    );
  }
}
```

## Tool Names Reference

Use consistent tool names across your application:

```typescript
const TOOL_NAMES = {
  VIRTUAL_TRYON: 'virtual-tryon',
  REMOVE_BG: 'remove-background',
  FLUX_GENERATE: 'flux-generate',
  SIMPLIFY_IMAGE: 'simplify-image',
  // Add more as needed
} as const;
```

## Client-Side: Display Usage Stats

### Create a Usage Stats Component

```typescript
// components/UsageStats.tsx
'use client';

import { useEffect, useState } from 'react';

interface UsageStats {
  dailyUsage: number;
  monthlyUsage: number;
  dailyLimit: number;
  monthlyLimit: number;
  dailyRemaining: number;
  monthlyRemaining: number;
  tierName: string;
}

export function UsageStats() {
  const [stats, setStats] = useState<UsageStats | null>(null);

  useEffect(() => {
    async function fetchStats() {
      const response = await fetch('/api/usage/stats');
      const data = await response.json();
      setStats(data);
    }

    fetchStats();
  }, []);

  if (!stats) return null;

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold mb-4">Usage This Month</h3>

      <div className="space-y-4">
        {/* Daily Usage */}
        <div>
          <div className="flex justify-between text-sm mb-2">
            <span>Daily ({stats.dailyUsage}/{stats.dailyLimit})</span>
            <span className="text-gray-500">
              {stats.dailyRemaining} remaining
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full"
              style={{
                width: `${(stats.dailyUsage / stats.dailyLimit) * 100}%`,
              }}
            />
          </div>
        </div>

        {/* Monthly Usage */}
        <div>
          <div className="flex justify-between text-sm mb-2">
            <span>Monthly ({stats.monthlyUsage}/{stats.monthlyLimit})</span>
            <span className="text-gray-500">
              {stats.monthlyRemaining} remaining
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-purple-600 h-2 rounded-full"
              style={{
                width: `${(stats.monthlyUsage / stats.monthlyLimit) * 100}%`,
              }}
            />
          </div>
        </div>

        {/* Current Tier */}
        <div className="text-sm text-gray-600 pt-2 border-t">
          Current Plan: <span className="font-semibold">{stats.tierName}</span>
        </div>
      </div>
    </div>
  );
}
```

### Create Usage Stats API Route

```typescript
// src/app/api/usage/stats/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { getUserUsageStats } from '@/lib/usage-tracker';

export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const supabase = createServerComponentClient({ cookies: () => cookieStore });
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const stats = await getUserUsageStats(user.id);

    if (!stats) {
      return NextResponse.json({ error: 'Stats not found' }, { status: 404 });
    }

    return NextResponse.json(stats);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 });
  }
}
```

## Usage Tracking Helper

For simpler integration, use the `withUsageTracking` helper:

```typescript
import { withUsageTracking } from '@/lib/usage-tracker';

export async function POST(request: NextRequest) {
  const user = await authenticateUser(request);

  const result = await withUsageTracking(
    user.id,
    'virtual-tryon',
    async () => {
      // Your processing logic here
      return await processVirtualTryon(data);
    }
  );

  if (!result.success) {
    return NextResponse.json({ error: result.error }, { status: 429 });
  }

  return NextResponse.json(result.data);
}
```

## Existing Tools to Update

Update these API routes to include usage tracking:

1. `/src/app/api/virtual-tryon/route.ts` → Tool: `virtual-tryon`
2. `/src/app/api/flux-generate/route.ts` → Tool: `flux-generate`
3. `/src/app/api/remove-bg/route.ts` → Tool: `remove-background`
4. `/src/app/api/simplify-image/route.ts` → Tool: `simplify-image`

## Error Responses

### Rate Limited Response (429)

```json
{
  "error": "Usage limit exceeded: daily_limit_exceeded",
  "currentUsage": 3,
  "limit": 3,
  "dailyRemaining": 0,
  "monthlyRemaining": 7,
  "upgradeUrl": "/pricing",
  "resetTime": "2025-11-22T00:00:00Z"
}
```

### Unauthorized Response (401)

```json
{
  "error": "Unauthorized",
  "message": "Please sign in to use this tool",
  "loginUrl": "/login"
}
```

## Best Practices

1. **Always authenticate users** before checking usage limits
2. **Record both successful and failed attempts** for analytics
3. **Include processing time** for performance monitoring
4. **Add relevant metadata** for debugging and analytics
5. **Show remaining usage** to encourage upgrades
6. **Handle errors gracefully** and record them
7. **Use consistent tool names** across the application
8. **Display usage stats** in user dashboard

## Testing

### Test Usage Limits

```bash
# Test with free tier user (3 daily uses)
curl -X POST http://localhost:3000/api/virtual-tryon \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"garmentImage": "...", "personImage": "..."}'

# Call 4 times - 4th should return 429
```

### Reset Quotas (for testing)

```sql
-- Reset daily usage for a user
UPDATE usage_quotas
SET daily_usage = 0
WHERE user_id = 'user-uuid-here';

-- Reset monthly usage for a user
UPDATE usage_quotas
SET monthly_usage = 0
WHERE user_id = 'user-uuid-here';
```

## Next Steps

1. Update all existing API routes with usage tracking
2. Create dashboard page to show usage stats
3. Add upgrade prompts when limits are reached
4. Set up scheduled jobs for quota resets
5. Monitor usage patterns and adjust limits
6. Add analytics for conversion tracking

## Support

For questions or issues:
- Review `SETUP_STRIPE.md` for configuration
- Check Supabase logs for database errors
- Review Stripe webhook logs for payment issues
- Test locally with Stripe CLI before deploying
