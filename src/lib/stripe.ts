/**
 * Stripe Server-Side Configuration
 *
 * This file contains the Stripe server-side configuration and utility functions.
 * Used in API routes and server-side operations.
 *
 * @see https://stripe.com/docs/api
 */

import Stripe from 'stripe';

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY is not defined in environment variables');
}

/**
 * Initialize Stripe with secret key
 * API Version: 2024-11-20.acacia (latest)
 */
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2024-11-20.acacia',
  typescript: true,
  appInfo: {
    name: 'HotendWeekly',
    version: '1.0.0',
  },
});

/**
 * Subscription tier price IDs
 * These should match the price IDs created in Stripe Dashboard
 */
export const PRICE_IDS = {
  tinkerer: {
    monthly: process.env.NEXT_PUBLIC_STRIPE_TINKERER_MONTHLY_PRICE_ID || '',
    yearly: process.env.NEXT_PUBLIC_STRIPE_TINKERER_YEARLY_PRICE_ID || '',
  },
  creator: {
    monthly: process.env.NEXT_PUBLIC_STRIPE_CREATOR_MONTHLY_PRICE_ID || '',
    yearly: process.env.NEXT_PUBLIC_STRIPE_CREATOR_YEARLY_PRICE_ID || '',
  },
  professional: {
    monthly: process.env.NEXT_PUBLIC_STRIPE_PROFESSIONAL_MONTHLY_PRICE_ID || '',
    yearly: process.env.NEXT_PUBLIC_STRIPE_PROFESSIONAL_YEARLY_PRICE_ID || '',
  },
} as const;

/**
 * Subscription tier product IDs
 */
export const PRODUCT_IDS = {
  tinkerer: process.env.NEXT_PUBLIC_STRIPE_TINKERER_PRODUCT_ID || '',
  creator: process.env.NEXT_PUBLIC_STRIPE_CREATOR_PRODUCT_ID || '',
  professional: process.env.NEXT_PUBLIC_STRIPE_PROFESSIONAL_PRODUCT_ID || '',
} as const;

/**
 * Pricing configuration for each tier
 */
export const PRICING_TIERS = {
  tinkerer: {
    name: 'Tinkerer',
    slug: 'tinkerer',
    description: 'Perfect for getting started with AI-powered fashion tools',
    price: {
      monthly: 0,
      yearly: 0,
    },
    features: [
      'Basic AI Tools',
      '3 uses per day',
      '10 uses per month',
      '5MB image limit',
      'Community Support',
    ],
    limits: {
      monthlyUsage: 10,
      dailyUsage: 3,
      maxImageSizeMB: 5,
      maxConcurrentJobs: 1,
    },
  },
  creator: {
    name: 'Creator',
    slug: 'creator',
    description: 'For fashion enthusiasts and content creators',
    price: {
      monthly: 19.99,
      yearly: 199.0,
    },
    features: [
      'All AI Tools',
      '20 uses per day',
      '100 uses per month',
      '10MB image limit',
      'Priority Processing',
      'Email Support',
    ],
    limits: {
      monthlyUsage: 100,
      dailyUsage: 20,
      maxImageSizeMB: 10,
      maxConcurrentJobs: 3,
    },
  },
  professional: {
    name: 'Professional',
    slug: 'professional',
    description: 'For businesses and professional designers',
    price: {
      monthly: 49.99,
      yearly: 499.0,
    },
    features: [
      'All AI Tools',
      'Unlimited daily use',
      '500 uses per month',
      '25MB image limit',
      'Priority Processing',
      'API Access',
      'Priority Support',
    ],
    limits: {
      monthlyUsage: 500,
      dailyUsage: 100,
      maxImageSizeMB: 25,
      maxConcurrentJobs: 10,
    },
  },
} as const;

/**
 * Type definitions for pricing tiers
 */
export type PricingTier = keyof typeof PRICING_TIERS;
export type BillingInterval = 'monthly' | 'yearly';

/**
 * Get Stripe price ID for a tier and billing interval
 */
export function getPriceId(tier: PricingTier, interval: BillingInterval): string {
  return PRICE_IDS[tier][interval];
}

/**
 * Get tier configuration
 */
export function getTierConfig(tier: PricingTier) {
  return PRICING_TIERS[tier];
}

/**
 * Create or retrieve a Stripe customer
 */
export async function getOrCreateCustomer(params: {
  email: string;
  userId: string;
  name?: string;
}): Promise<Stripe.Customer> {
  const { email, userId, name } = params;

  // Search for existing customer
  const existingCustomers = await stripe.customers.list({
    email,
    limit: 1,
  });

  if (existingCustomers.data.length > 0) {
    return existingCustomers.data[0];
  }

  // Create new customer
  return await stripe.customers.create({
    email,
    name,
    metadata: {
      userId,
    },
  });
}

/**
 * Create a checkout session for subscription
 */
export async function createCheckoutSession(params: {
  customerId: string;
  priceId: string;
  successUrl: string;
  cancelUrl: string;
  metadata?: Record<string, string>;
}): Promise<Stripe.Checkout.Session> {
  const { customerId, priceId, successUrl, cancelUrl, metadata } = params;

  return await stripe.checkout.sessions.create({
    customer: customerId,
    mode: 'subscription',
    payment_method_types: ['card'],
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    success_url: successUrl,
    cancel_url: cancelUrl,
    metadata,
    subscription_data: {
      metadata,
    },
  });
}

/**
 * Create a billing portal session for customer to manage subscription
 */
export async function createBillingPortalSession(params: {
  customerId: string;
  returnUrl: string;
}): Promise<Stripe.BillingPortal.Session> {
  const { customerId, returnUrl } = params;

  return await stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: returnUrl,
  });
}

/**
 * Cancel a subscription
 */
export async function cancelSubscription(subscriptionId: string): Promise<Stripe.Subscription> {
  return await stripe.subscriptions.cancel(subscriptionId);
}

/**
 * Update subscription to new price
 */
export async function updateSubscription(params: {
  subscriptionId: string;
  newPriceId: string;
}): Promise<Stripe.Subscription> {
  const { subscriptionId, newPriceId } = params;

  const subscription = await stripe.subscriptions.retrieve(subscriptionId);

  return await stripe.subscriptions.update(subscriptionId, {
    items: [
      {
        id: subscription.items.data[0].id,
        price: newPriceId,
      },
    ],
    proration_behavior: 'create_prorations',
  });
}

/**
 * Verify webhook signature
 */
export function verifyWebhookSignature(params: {
  payload: string | Buffer;
  signature: string;
  secret: string;
}): Stripe.Event {
  const { payload, signature, secret } = params;

  try {
    return stripe.webhooks.constructEvent(payload, signature, secret);
  } catch (error) {
    throw new Error(`Webhook signature verification failed: ${error}`);
  }
}

/**
 * Get subscription status
 */
export async function getSubscriptionStatus(
  subscriptionId: string
): Promise<Stripe.Subscription> {
  return await stripe.subscriptions.retrieve(subscriptionId);
}
