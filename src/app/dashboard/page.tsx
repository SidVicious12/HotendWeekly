'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { UsageStats } from '@/components/UsageStats'
import { SubscriptionCard } from '@/components/SubscriptionCard'
import { User, Mail, Calendar } from 'lucide-react'
import { supabase } from '@/lib/supabase'

interface UserProfile {
  subscription_tiers?: {
    slug: string
  }
  subscription_status?: string
  billing_cycle?: string
  stripe_customer_id?: string
}

export default function DashboardPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [profileLoading, setProfileLoading] = useState(true)

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/login')
    }
  }, [user, loading, router])

  useEffect(() => {
    async function fetchProfile() {
      if (!user) return

      const { data } = await supabase
        .from('user_profiles')
        .select('*, subscription_tiers(*)')
        .eq('id', user.id)
        .single()

      setProfile(data)
      setProfileLoading(false)
    }

    if (user) {
      fetchProfile()
    }
  }, [user])

  if (loading || profileLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  // Default to tinkerer if no profile or tier found
  const currentTier = (profile?.subscription_tiers?.slug as 'tinkerer' | 'creator' | 'professional') || 'tinkerer'
  const subscriptionStatus = profile?.subscription_status || 'active'
  const billingCycle = (profile?.billing_cycle as 'monthly' | 'yearly') || 'monthly'
  const hasStripeCustomer = !!profile?.stripe_customer_id

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
              <p className="text-sm text-gray-600 mt-1">
                Manage your account and track your usage
              </p>
            </div>
            <a
              href="/"
              className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
            >
              ← Back to Home
            </a>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* User Info Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <User className="w-5 h-5 text-blue-600" />
            Account Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-3">
              <Mail className="w-4 h-4 text-gray-400" />
              <div>
                <p className="text-xs text-gray-500">Email</p>
                <p className="text-sm font-medium text-gray-900">{user.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Calendar className="w-4 h-4 text-gray-400" />
              <div>
                <p className="text-xs text-gray-500">Member Since</p>
                <p className="text-sm font-medium text-gray-900">
                  {new Date(user.created_at).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Usage Stats */}
          <div className="lg:col-span-2 space-y-8">
            <UsageStats />

            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <a
                  href="/#tools"
                  className="flex items-center gap-3 p-4 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all duration-200 group"
                >
                  <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                    <svg
                      className="w-5 h-5 text-blue-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 10V3L4 14h7v7l9-11h-7z"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Use AI Tools</p>
                    <p className="text-xs text-gray-500">Start creating</p>
                  </div>
                </a>

                <a
                  href="/pricing"
                  className="flex items-center gap-3 p-4 rounded-lg border border-gray-200 hover:border-purple-300 hover:bg-purple-50 transition-all duration-200 group"
                >
                  <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center group-hover:bg-purple-200 transition-colors">
                    <svg
                      className="w-5 h-5 text-purple-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">View Plans</p>
                    <p className="text-xs text-gray-500">Compare tiers</p>
                  </div>
                </a>
              </div>
            </div>
          </div>

          {/* Right Column - Subscription */}
          <div className="lg:col-span-1">
            <SubscriptionCard
              currentTier={currentTier}
              subscriptionStatus={subscriptionStatus}
              billingCycle={billingCycle}
              hasStripeCustomer={hasStripeCustomer}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
