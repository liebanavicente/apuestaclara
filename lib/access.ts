import type { Profile, Subscriber } from '@/types/database'

export type PremiumReason = 'admin' | 'stripe' | 'promo' | 'referral' | 'free'

export interface UserAccess {
  isAdmin: boolean
  isPremium: boolean
  premiumReason: PremiumReason
  limits: {
    maxDailyGenerations: number
    maxPicks: number
    aiAnalysesPerDay: number
    canUseAdvancedAnalysis: boolean
    canSaveFavorites: boolean
    canUseMixedSports: boolean
    canUseAdvancedStats: boolean
    canViewDiscardedPicks: boolean
    hasUnlimitedSimulations: boolean
    hasFullHistory: boolean
  }
}

export function getUserAccess(
  profile: Profile | null,
  subscriber: Subscriber | null
): UserAccess {
  if (!profile) {
    return freeAccess()
  }

  // 1. Admin premium forever
  if (profile.role === 'admin' && profile.premium_forever) {
    return adminAccess()
  }

  // 2. Stripe active
  const stripeActive =
    subscriber?.subscribed === true &&
    subscriber?.subscription_status === 'active' &&
    subscriber?.current_period_end != null &&
    new Date(subscriber.current_period_end) > new Date()

  if (stripeActive) {
    return premiumAccess('stripe')
  }

  // 3. Premium temporal (promo code / referral)
  const tempPremium =
    profile.premium_until != null && new Date(profile.premium_until) > new Date()

  if (tempPremium) {
    const reason: PremiumReason = 'promo'
    return premiumAccess(reason)
  }

  return freeAccess()
}

function adminAccess(): UserAccess {
  return {
    isAdmin: true,
    isPremium: true,
    premiumReason: 'admin',
    limits: {
      maxDailyGenerations: 999,
      maxPicks: 10,
      aiAnalysesPerDay: 999,
      canUseAdvancedAnalysis: true,
      canSaveFavorites: true,
      canUseMixedSports: true,
      canUseAdvancedStats: true,
      canViewDiscardedPicks: true,
      hasUnlimitedSimulations: true,
      hasFullHistory: true,
    },
  }
}

function premiumAccess(reason: PremiumReason): UserAccess {
  return {
    isAdmin: false,
    isPremium: true,
    premiumReason: reason,
    limits: {
      maxDailyGenerations: 20,
      maxPicks: 6,
      aiAnalysesPerDay: 20,
      canUseAdvancedAnalysis: true,
      canSaveFavorites: true,
      canUseMixedSports: true,
      canUseAdvancedStats: true,
      canViewDiscardedPicks: true,
      hasUnlimitedSimulations: true,
      hasFullHistory: true,
    },
  }
}

function freeAccess(): UserAccess {
  return {
    isAdmin: false,
    isPremium: false,
    premiumReason: 'free',
    limits: {
      maxDailyGenerations: 3,
      maxPicks: 2,
      aiAnalysesPerDay: 3,
      canUseAdvancedAnalysis: false,
      canSaveFavorites: false,
      canUseMixedSports: false,
      canUseAdvancedStats: false,
      canViewDiscardedPicks: false,
      hasUnlimitedSimulations: false,
      hasFullHistory: false,
    },
  }
}
