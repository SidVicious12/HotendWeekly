import { NextRequest, NextResponse } from 'next/server'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { getUserUsageStats } from '@/lib/usage-tracker'

/**
 * GET /api/usage/stats
 * 
 * Returns current usage statistics for the authenticated user.
 * Includes daily/monthly usage, limits, and remaining quota.
 */
export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies()
    const supabase = createServerComponentClient({ cookies: () => cookieStore })
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const stats = await getUserUsageStats(user.id)

    if (!stats) {
      return NextResponse.json({ error: 'Stats not found' }, { status: 404 })
    }

    return NextResponse.json(stats)
  } catch (error) {
    console.error('Error fetching usage stats:', error)
    return NextResponse.json(
      { error: 'Failed to fetch stats' },
      { status: 500 }
    )
  }
}
