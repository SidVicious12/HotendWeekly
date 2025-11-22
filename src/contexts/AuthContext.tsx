'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { User } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'

/**
 * User role types
 */
export type UserRole = 'user' | 'admin' | 'super_admin'

/**
 * User profile data including role information
 */
export interface UserProfile {
  id: string
  email: string
  role: UserRole
  full_name?: string
  avatar_url?: string
}

/**
 * Authentication context interface
 */
interface AuthContextType {
  user: User | null
  profile: UserProfile | null
  role: UserRole
  isAdmin: boolean
  isSuperAdmin: boolean
  loading: boolean
  signOut: () => Promise<void>
  refreshProfile: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  role: 'user',
  isAdmin: false,
  isSuperAdmin: false,
  loading: true,
  signOut: async () => {},
  refreshProfile: async () => {},
})

/**
 * Hook to access authentication context
 *
 * @returns {AuthContextType} Authentication context with user, role, and admin status
 *
 * @example
 * const { user, isAdmin, role } = useAuth()
 * if (isAdmin) {
 *   // Show admin features
 * }
 */
export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}

/**
 * Authentication Provider Component
 * Manages user authentication state and role information
 *
 * @example
 * <AuthProvider>
 *   <App />
 * </AuthProvider>
 */
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)

  /**
   * Fetch user profile including role information
   */
  const fetchUserProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('id, email, role, full_name, avatar_url')
        .eq('id', userId)
        .single()

      if (error) {
        console.error('Error fetching user profile:', error)
        setProfile(null)
        return
      }

      if (data) {
        setProfile({
          id: data.id,
          email: data.email,
          role: (data.role as UserRole) || 'user',
          full_name: data.full_name || undefined,
          avatar_url: data.avatar_url || undefined,
        })
      }
    } catch (error) {
      console.error('Error in fetchUserProfile:', error)
      setProfile(null)
    }
  }

  /**
   * Refresh user profile data
   * Useful after profile updates or role changes
   */
  const refreshProfile = async () => {
    if (user?.id) {
      await fetchUserProfile(user.id)
    }
  }

  useEffect(() => {
    // Check active sessions
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      if (session?.user) {
        fetchUserProfile(session.user.id).finally(() => setLoading(false))
      } else {
        setProfile(null)
        setLoading(false)
      }
    })

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      if (session?.user) {
        fetchUserProfile(session.user.id)
      } else {
        setProfile(null)
      }
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  const signOut = async () => {
    await supabase.auth.signOut()
    setProfile(null)
    window.location.href = '/auth/login'
  }

  // Derive role and admin status from profile
  const role: UserRole = profile?.role || 'user'
  const isAdmin = role === 'admin' || role === 'super_admin'
  const isSuperAdmin = role === 'super_admin'

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        role,
        isAdmin,
        isSuperAdmin,
        loading,
        signOut,
        refreshProfile
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
