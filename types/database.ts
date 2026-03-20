export type SubscriptionStatus = 'active' | 'cancelled' | 'lapsed'
export type DrawStatus = 'draft' | 'published'
export type DrawType = 'random' | 'weighted'
export type PayoutStatus = 'pending' | 'paid'
export type VerificationStatus = 'pending' | 'approved' | 'rejected'
export type Plan = 'monthly' | 'yearly'

export interface User {
  id: string
  email: string
  full_name: string
  charity_id: string | null
  charity_pct: number
  is_admin: boolean
  created_at: string
}

export interface Subscription {
  id: string
  user_id: string
  stripe_customer_id: string
  stripe_sub_id: string
  plan: Plan
  status: SubscriptionStatus
  period_end: string
}

export interface Score {
  id: string
  user_id: string
  score: number
  played_at: string
  created_at: string
}

export interface Charity {
  id: string
  name: string
  description: string
  image_url: string
  featured: boolean
  events: CharityEvent[]
}

export interface CharityEvent {
  title: string
  date: string
  location: string
}

export interface Draw {
  id: string
  month: string
  draw_type: DrawType
  numbers: number[]
  status: DrawStatus
  jackpot_rollover: boolean
  rolled_jackpot_amt: number
  created_at: string
}

export interface DrawEntry {
  id: string
  draw_id: string
  user_id: string
  matched_count: number
  prize_amount: number
  payout_status: PayoutStatus
}

export interface WinnerVerification {
  id: string
  draw_entry_id: string
  proof_url: string
  status: VerificationStatus
  reviewed_at: string | null
}

export interface PrizePoolConfig {
  id: string
  draw_id: string
  tier_5_amount: number
  tier_4_amount: number
  tier_3_amount: number
  subscriber_count: number
}