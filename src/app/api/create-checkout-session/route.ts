/**
 * API Route: Create Stripe Checkout Session
 *
 * Handles creation of Stripe checkout sessions for subscription upgrades.
 * This endpoint is called when a user wants to subscribe to a paid tier.
 *
 * @method POST
 * @body {tier: string, interval: 'monthly' | 'yearly'}
 * @returns {sessionId: string, url: string}
 */

import { NextRequest, NextResponse } from 'next/server';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { stripe, getPriceId, getOrCreateCustomer, createCheckoutSession } from '@/lib/stripe';

export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const body = await request.json();
    const { tier, interval } = body;

    // Validate input
    if (!tier || !interval) {
      return NextResponse.json(
        { error: 'Missing required fields: tier and interval' },
        { status: 400 }
      );
    }

    if (!['tinkerer', 'creator', 'professional'].includes(tier)) {
      return NextResponse.json({ error: 'Invalid tier' }, { status: 400 });
    }

    if (!['monthly', 'yearly'].includes(interval)) {
      return NextResponse.json({ error: 'Invalid interval' }, { status: 400 });
    }

    // Get authenticated user from Supabase
    const cookieStore = await cookies();
    const supabase = createServerComponentClient({ cookies: () => cookieStore });

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get user profile from database
    const { data: profile, error: profileError } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (profileError || !profile) {
      return NextResponse.json({ error: 'User profile not found' }, { status: 404 });
    }

    // Get or create Stripe customer
    let customerId = profile.stripe_customer_id;

    if (!customerId) {
      const customer = await getOrCreateCustomer({
        email: user.email!,
        userId: user.id,
        name: profile.full_name || undefined,
      });

      customerId = customer.id;

      // Update user profile with Stripe customer ID
      await supabase
        .from('user_profiles')
        .update({ stripe_customer_id: customerId })
        .eq('id', user.id);
    }

    // Get price ID for the selected tier and interval
    const priceId = getPriceId(tier, interval);

    if (!priceId) {
      return NextResponse.json(
        { error: 'Price ID not configured for this tier' },
        { status: 500 }
      );
    }

    // Create checkout session
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
    const session = await createCheckoutSession({
      customerId,
      priceId,
      successUrl: `${baseUrl}/dashboard?success=true&session_id={CHECKOUT_SESSION_ID}`,
      cancelUrl: `${baseUrl}/pricing?canceled=true`,
      metadata: {
        userId: user.id,
        tier,
        interval,
      },
    });

    // Return session ID and URL
    return NextResponse.json({
      sessionId: session.id,
      url: session.url,
    });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    );
  }
}
