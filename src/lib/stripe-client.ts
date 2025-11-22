/**
 * Stripe Client-Side Configuration
 *
 * This file contains the Stripe client-side configuration.
 * Used in React components and client-side operations.
 *
 * @see https://stripe.com/docs/js
 */

import { loadStripe, Stripe } from '@stripe/stripe-js';

if (!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY) {
  throw new Error('NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY is not defined in environment variables');
}

/**
 * Singleton instance of Stripe
 * This is cached to avoid loading Stripe multiple times
 */
let stripePromise: Promise<Stripe | null>;

/**
 * Get or initialize Stripe client
 */
export const getStripe = (): Promise<Stripe | null> => {
  if (!stripePromise) {
    stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);
  }
  return stripePromise;
};

/**
 * Redirect to Stripe Checkout
 */
export async function redirectToCheckout(sessionId: string): Promise<void> {
  const stripe = await getStripe();

  if (!stripe) {
    throw new Error('Failed to load Stripe');
  }

  const { error } = await stripe.redirectToCheckout({ sessionId });

  if (error) {
    throw new Error(error.message);
  }
}

/**
 * Pricing tier types
 */
export type PricingTier = 'tinkerer' | 'creator' | 'professional';
export type BillingInterval = 'monthly' | 'yearly';

/**
 * Client-side pricing configuration
 * Matches server-side configuration for consistency
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
    cta: 'Get Started Free',
    popular: false,
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
    cta: 'Start Creating',
    popular: true,
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
    cta: 'Go Professional',
    popular: false,
  },
} as const;

/**
 * Calculate savings for yearly billing
 */
export function calculateYearlySavings(tier: PricingTier): number {
  const config = PRICING_TIERS[tier];
  const monthlyTotal = config.price.monthly * 12;
  const yearlyTotal = config.price.yearly;
  return Math.round(((monthlyTotal - yearlyTotal) / monthlyTotal) * 100);
}

/**
 * Format price for display
 */
export function formatPrice(amount: number, currency: string = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: amount % 1 === 0 ? 0 : 2,
  }).format(amount);
}
