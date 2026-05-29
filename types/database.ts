export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          user_id: string
          email: string
          username: string | null
          avatar_url: string | null
          bio: string | null
          plan: 'free' | 'premium'
          role: 'user' | 'admin'
          premium_forever: boolean
          premium_until: string | null
          daily_generations_used: number
          last_generation_reset: string | null
          personal_limit_amount: number | null
          responsible_mode_enabled: boolean
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['profiles']['Row'], 'id' | 'created_at' | 'updated_at'> & {
          id?: string
          created_at?: string
          updated_at?: string
        }
        Update: Partial<Database['public']['Tables']['profiles']['Insert']>
      }
      subscribers: {
        Row: {
          id: string
          user_id: string
          email: string
          stripe_customer_id: string | null
          stripe_subscription_id: string | null
          subscribed: boolean
          subscription_status: string | null
          price_id: string | null
          current_period_start: string | null
          current_period_end: string | null
          cancel_at_period_end: boolean
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['subscribers']['Row'], 'id' | 'created_at' | 'updated_at'> & {
          id?: string
          created_at?: string
          updated_at?: string
        }
        Update: Partial<Database['public']['Tables']['subscribers']['Insert']>
      }
      promo_codes: {
        Row: {
          id: string
          code: string
          description: string | null
          duration_days: number
          max_redemptions: number
          redemptions_count: number
          active: boolean
          created_at: string
          expires_at: string | null
        }
        Insert: Omit<Database['public']['Tables']['promo_codes']['Row'], 'id' | 'created_at'> & {
          id?: string
          created_at?: string
        }
        Update: Partial<Database['public']['Tables']['promo_codes']['Insert']>
      }
      promo_redemptions: {
        Row: {
          id: string
          user_id: string
          promo_code_id: string
          redeemed_at: string
          premium_until: string
        }
        Insert: Omit<Database['public']['Tables']['promo_redemptions']['Row'], 'id'> & { id?: string }
        Update: Partial<Database['public']['Tables']['promo_redemptions']['Insert']>
      }
      referral_campaigns: {
        Row: {
          id: string
          name: string
          slug: string
          active: boolean
          reward_days: number
          max_rewards: number
          rewards_given: number
          starts_at: string | null
          ends_at: string | null
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['referral_campaigns']['Row'], 'id' | 'created_at'> & {
          id?: string
          created_at?: string
        }
        Update: Partial<Database['public']['Tables']['referral_campaigns']['Insert']>
      }
      referral_links: {
        Row: {
          id: string
          user_id: string
          referral_code: string
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['referral_links']['Row'], 'id' | 'created_at'> & {
          id?: string
          created_at?: string
        }
        Update: Partial<Database['public']['Tables']['referral_links']['Insert']>
      }
      referrals: {
        Row: {
          id: string
          referrer_user_id: string
          referred_user_id: string
          referral_code: string
          status: 'pending' | 'validated' | 'rejected'
          reason: string | null
          created_at: string
          validated_at: string | null
        }
        Insert: Omit<Database['public']['Tables']['referrals']['Row'], 'id' | 'created_at'> & {
          id?: string
          created_at?: string
        }
        Update: Partial<Database['public']['Tables']['referrals']['Insert']>
      }
      referral_rewards: {
        Row: {
          id: string
          user_id: string
          campaign_id: string
          reward_type: string
          reward_days: number
          granted_at: string
          premium_until: string
          reason: string | null
        }
        Insert: Omit<Database['public']['Tables']['referral_rewards']['Row'], 'id'> & { id?: string }
        Update: Partial<Database['public']['Tables']['referral_rewards']['Insert']>
      }
      saved_selections: {
        Row: {
          id: string
          user_id: string
          title: string | null
          total_odds: number | null
          implied_probability: number | null
          risk_level: string | null
          picks: Json
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['saved_selections']['Row'], 'id' | 'created_at'> & {
          id?: string
          created_at?: string
        }
        Update: Partial<Database['public']['Tables']['saved_selections']['Insert']>
      }
      virtual_wallets: {
        Row: {
          user_id: string
          balance: number
          starting_balance: number
          total_simulated_staked: number
          total_simulated_profit: number
          last_reset_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: Partial<Database['public']['Tables']['virtual_wallets']['Row']> & { user_id: string }
        Update: Partial<Database['public']['Tables']['virtual_wallets']['Row']>
      }
      simulations: {
        Row: {
          id: string
          user_id: string
          simulation_type: 'simple' | 'combinada'
          status: 'pending' | 'won' | 'lost' | 'void' | 'cancelled'
          total_odds: number
          virtual_stake: number
          potential_virtual_return: number
          potential_virtual_profit: number
          created_at: string
          resolved_at: string | null
        }
        Insert: Omit<Database['public']['Tables']['simulations']['Row'], 'id' | 'created_at'> & {
          id?: string
          created_at?: string
        }
        Update: Partial<Database['public']['Tables']['simulations']['Insert']>
      }
      simulation_picks: {
        Row: {
          id: string
          simulation_id: string
          sport_key: string
          sport_title: string
          league_name: string | null
          event_name: string
          commence_time: string
          market: string
          selection: string
          odds: number
          bookmaker: string | null
          status: 'pending' | 'won' | 'lost' | 'void'
          result_source: string | null
          created_at: string
          resolved_at: string | null
        }
        Insert: Omit<Database['public']['Tables']['simulation_picks']['Row'], 'id' | 'created_at'> & {
          id?: string
          created_at?: string
        }
        Update: Partial<Database['public']['Tables']['simulation_picks']['Insert']>
      }
      community_picks: {
        Row: {
          id: string
          user_id: string
          sport: string
          competition: string
          event_name: string
          market: string
          selection: string
          odds: number
          bookmaker: string | null
          event_time: string
          stake_level: 'bajo' | 'medio' | 'alto'
          confidence_level: 'baja' | 'media' | 'alta'
          reasoning: string
          risks: string
          status: 'pendiente' | 'acertado' | 'fallado' | 'nulo' | 'cancelado'
          result_declared_by_user: boolean
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['community_picks']['Row'], 'id' | 'created_at' | 'updated_at'> & {
          id?: string
          created_at?: string
          updated_at?: string
        }
        Update: Partial<Database['public']['Tables']['community_picks']['Insert']>
      }
      pick_votes: {
        Row: {
          id: string
          pick_id: string
          user_id: string
          vote_type: 'good' | 'risky'
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['pick_votes']['Row'], 'id' | 'created_at'> & {
          id?: string
          created_at?: string
        }
        Update: Partial<Database['public']['Tables']['pick_votes']['Insert']>
      }
      pick_comments: {
        Row: {
          id: string
          pick_id: string
          user_id: string
          comment: string
          reported: boolean
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['pick_comments']['Row'], 'id' | 'created_at'> & {
          id?: string
          created_at?: string
        }
        Update: Partial<Database['public']['Tables']['pick_comments']['Insert']>
      }
      user_follows: {
        Row: {
          follower_id: string
          followed_id: string
          created_at: string
        }
        Insert: Database['public']['Tables']['user_follows']['Row']
        Update: Partial<Database['public']['Tables']['user_follows']['Row']>
      }
    }
  }
}

export type Profile = Database['public']['Tables']['profiles']['Row']
export type Subscriber = Database['public']['Tables']['subscribers']['Row']
export type PromoCode = Database['public']['Tables']['promo_codes']['Row']
export type VirtualWallet = Database['public']['Tables']['virtual_wallets']['Row']
export type Simulation = Database['public']['Tables']['simulations']['Row']
export type SimulationPick = Database['public']['Tables']['simulation_picks']['Row']
export type CommunityPick = Database['public']['Tables']['community_picks']['Row']
export type PickVote = Database['public']['Tables']['pick_votes']['Row']
export type PickComment = Database['public']['Tables']['pick_comments']['Row']
export type ReferralLink = Database['public']['Tables']['referral_links']['Row']
