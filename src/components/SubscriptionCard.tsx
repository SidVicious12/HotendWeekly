'use client'

import { useState } from 'react'
import { CreditCard, ExternalLink, Loader2, Crown, Sparkles } from 'lucide-react'
import { PRICING_TIERS } from '@/lib/stripe'

interface SubscriptionCardProps {
  currentTier: 'tinkerer' | 'creator' | 'professional'
  subscriptionStatus?: string
  billingCycle?: 'monthly' | 'yearly'
  hasStripeCustomer: boolean
}

export function SubscriptionCard({
  currentTier,
  subscriptionStatus = 'active',
  billingCycle = 'monthly',
  hasStripeCustomer,
}: SubscriptionCardProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const tierConfig = PRICING_TIERS[currentTier]
  const isPaidTier = currentTier !== 'tinkerer'

  const handleUpgrade = () => {
    window.location.href = '/pricing'
  }

  const handleManageBilling = async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/billing/portal', {
        method: 'POST',
      })

      if (!response.ok) {
        throw new Error('Failed to open billing portal')
      }

      const { url } = await response.json()
      window.location.href = url
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to open billing portal')
      setLoading(false)
    }
  }

  return (
    <div className="bg-gradient-to-br from-white to-gray-50 rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-start justify-between mb-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            {isPaidTier ? (
              <Crown className="w-5 h-5 text-yellow-500" />
            ) : (
              <Sparkles className="w-5 h-5 text-gray-400" />
            )}
            <h3 className="text-lg font-semibold text-gray-900">{tierConfig.name} Plan</h3>
          </div>
          <p className="text-sm text-gray-600">{tierConfig.description}</p>
        </div>
        {subscriptionStatus && isPaidTier && (
          <span
            className={`text-xs font-medium px-3 py-1 rounded-full ${
              subscriptionStatus === 'active'
                ? 'bg-green-100 text-green-700'
                : subscriptionStatus === 'past_due'
                ? 'bg-red-100 text-red-700'
                : 'bg-gray-100 text-gray-700'
            }`}
          >
            {subscriptionStatus}
          </span>
        )}
      </div>

      {/* Pricing */}
      <div className="mb-6">
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-bold text-gray-900">
            ${isPaidTier ? tierConfig.price[billingCycle] : 0}
          </span>
          <span className="text-sm text-gray-500">
            / {billingCycle === 'yearly' ? 'year' : 'month'}
          </span>
        </div>
        {billingCycle === 'yearly' && isPaidTier && (
          <p className="text-xs text-green-600 mt-1">Save 17% with annual billing</p>
        )}
      </div>

      {/* Features */}
      <div className="space-y-3 mb-6">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
          Plan Features
        </p>
        <ul className="space-y-2">
          {tierConfig.features.map((feature, index) => (
            <li key={index} className="flex items-start gap-2 text-sm text-gray-700">
              <svg
                className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              {feature}
            </li>
          ))}
        </ul>
      </div>

      {/* Actions */}
      <div className="space-y-3">
        {!isPaidTier && (
          <button
            onClick={handleUpgrade}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium py-3 px-4 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
          >
            <Crown className="w-4 h-4" />
            Upgrade to Pro
          </button>
        )}

        {isPaidTier && hasStripeCustomer && (
          <>
            <button
              onClick={handleManageBilling}
              disabled={loading}
              className="w-full bg-white hover:bg-gray-50 text-gray-700 font-medium py-3 px-4 rounded-lg border border-gray-300 transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Opening...
                </>
              ) : (
                <>
                  <CreditCard className="w-4 h-4" />
                  Manage Billing
                  <ExternalLink className="w-3 h-3 ml-1" />
                </>
              )}
            </button>

            {error && (
              <p className="text-xs text-red-600 text-center">{error}</p>
            )}
          </>
        )}

        {!isPaidTier && (
          <a
            href="/pricing"
            className="block text-center text-sm text-gray-600 hover:text-gray-900 transition-colors"
          >
            View all plans →
          </a>
        )}
      </div>
    </div>
  )
}
