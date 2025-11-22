/**
 * API Route: Stripe Webhooks
 *
 * Handles Stripe webhook events for subscription lifecycle management.
 * This endpoint is called by Stripe when subscription events occur.
 *
 * Events handled:
 * - checkout.session.completed: New subscription created
 * - customer.subscription.updated: Subscription changed
 * - customer.subscription.deleted: Subscription canceled
 * - invoice.payment_succeeded: Payment successful
 * - invoice.payment_failed: Payment failed
 *
 * @method POST
 * @see https://stripe.com/docs/webhooks
 */

import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { stripe, verifyWebhookSignature } from '@/lib/stripe';
import { createClient } from '@supabase/supabase-js';
import Stripe from 'stripe';

// Initialize Supabase Admin client (bypasses RLS)
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);

/**
 * Handle checkout.session.completed event
 */
async function handleCheckoutSessionCompleted(session: Stripe.Checkout.Session) {
  const userId = session.metadata?.userId;
  const tier = session.metadata?.tier;
  const interval = session.metadata?.interval;

  if (!userId || !tier) {
    console.error('Missing metadata in checkout session:', session.id);
    return;
  }

  // Get subscription tier ID
  const { data: tierData } = await supabaseAdmin
    .from('subscription_tiers')
    .select('id')
    .eq('slug', tier)
    .single();

  if (!tierData) {
    console.error('Subscription tier not found:', tier);
    return;
  }

  // Update user profile
  await supabaseAdmin
    .from('user_profiles')
    .update({
      subscription_tier_id: tierData.id,
      stripe_customer_id: session.customer as string,
      stripe_subscription_id: session.subscription as string,
      subscription_status: 'active',
      subscription_start_date: new Date().toISOString(),
      billing_cycle: interval || 'monthly',
    })
    .eq('id', userId);

  // Record subscription history
  await supabaseAdmin.from('subscription_history').insert({
    user_id: userId,
    subscription_tier_id: tierData.id,
    action: 'created',
    new_tier: tier,
    amount_paid: (session.amount_total || 0) / 100, // Convert cents to dollars
    currency: session.currency?.toUpperCase() || 'USD',
    stripe_event_id: session.id,
    metadata: { interval },
  });

  console.log(`Subscription created for user ${userId}, tier: ${tier}`);
}

/**
 * Handle customer.subscription.updated event
 */
async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
  const userId = subscription.metadata?.userId;

  if (!userId) {
    // Try to find user by stripe_subscription_id
    const { data: profile } = await supabaseAdmin
      .from('user_profiles')
      .select('id')
      .eq('stripe_subscription_id', subscription.id)
      .single();

    if (!profile) {
      console.error('User not found for subscription:', subscription.id);
      return;
    }
  }

  // Get the price ID and determine tier
  const priceId = subscription.items.data[0]?.price.id;
  let tierSlug = 'tinkerer'; // Default fallback

  // Map price ID to tier (you'll need to implement this based on your price IDs)
  // This is a simplified version
  const { data: tierData } = await supabaseAdmin
    .from('subscription_tiers')
    .select('id, slug')
    .or(
      `stripe_price_id_monthly.eq.${priceId},stripe_price_id_yearly.eq.${priceId}`
    )
    .single();

  if (tierData) {
    tierSlug = tierData.slug;
  }

  // Update user profile
  await supabaseAdmin
    .from('user_profiles')
    .update({
      subscription_status: subscription.status,
      subscription_end_date: subscription.cancel_at
        ? new Date(subscription.cancel_at * 1000).toISOString()
        : null,
    })
    .eq('stripe_subscription_id', subscription.id);

  console.log(`Subscription updated: ${subscription.id}, status: ${subscription.status}`);
}

/**
 * Handle customer.subscription.deleted event
 */
async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  // Find user by stripe_subscription_id
  const { data: profile } = await supabaseAdmin
    .from('user_profiles')
    .select('id, subscription_tier_id')
    .eq('stripe_subscription_id', subscription.id)
    .single();

  if (!profile) {
    console.error('User not found for subscription:', subscription.id);
    return;
  }

  // Get free tier ID
  const { data: freeTier } = await supabaseAdmin
    .from('subscription_tiers')
    .select('id')
    .eq('slug', 'tinkerer')
    .single();

  // Downgrade to free tier
  await supabaseAdmin
    .from('user_profiles')
    .update({
      subscription_tier_id: freeTier?.id || null,
      subscription_status: 'canceled',
      stripe_subscription_id: null,
      subscription_end_date: new Date().toISOString(),
    })
    .eq('id', profile.id);

  // Record subscription history
  await supabaseAdmin.from('subscription_history').insert({
    user_id: profile.id,
    subscription_tier_id: freeTier?.id || null,
    action: 'canceled',
    new_tier: 'tinkerer',
    stripe_event_id: subscription.id,
  });

  console.log(`Subscription canceled for user ${profile.id}`);
}

/**
 * Handle invoice.payment_succeeded event
 */
async function handleInvoicePaymentSucceeded(invoice: Stripe.Invoice) {
  const subscriptionId = invoice.subscription as string;

  if (!subscriptionId) {
    return;
  }

  // Update user profile
  await supabaseAdmin
    .from('user_profiles')
    .update({
      subscription_status: 'active',
    })
    .eq('stripe_subscription_id', subscriptionId);

  console.log(`Payment succeeded for subscription: ${subscriptionId}`);
}

/**
 * Handle invoice.payment_failed event
 */
async function handleInvoicePaymentFailed(invoice: Stripe.Invoice) {
  const subscriptionId = invoice.subscription as string;

  if (!subscriptionId) {
    return;
  }

  // Update user profile
  await supabaseAdmin
    .from('user_profiles')
    .update({
      subscription_status: 'past_due',
    })
    .eq('stripe_subscription_id', subscriptionId);

  console.log(`Payment failed for subscription: ${subscriptionId}`);
}

/**
 * Main webhook handler
 */
export async function POST(request: NextRequest) {
  const body = await request.text();
  const headersList = await headers();
  const signature = headersList.get('stripe-signature');

  if (!signature) {
    return NextResponse.json({ error: 'No signature' }, { status: 400 });
  }

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!webhookSecret) {
    console.error('STRIPE_WEBHOOK_SECRET is not configured');
    return NextResponse.json({ error: 'Webhook secret not configured' }, { status: 500 });
  }

  try {
    // Verify webhook signature
    const event = verifyWebhookSignature({
      payload: body,
      signature,
      secret: webhookSecret,
    });

    console.log(`Received webhook event: ${event.type}`);

    // Handle different event types
    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutSessionCompleted(event.data.object as Stripe.Checkout.Session);
        break;

      case 'customer.subscription.updated':
        await handleSubscriptionUpdated(event.data.object as Stripe.Subscription);
        break;

      case 'customer.subscription.deleted':
        await handleSubscriptionDeleted(event.data.object as Stripe.Subscription);
        break;

      case 'invoice.payment_succeeded':
        await handleInvoicePaymentSucceeded(event.data.object as Stripe.Invoice);
        break;

      case 'invoice.payment_failed':
        await handleInvoicePaymentFailed(event.data.object as Stripe.Invoice);
        break;

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 400 }
    );
  }
}
