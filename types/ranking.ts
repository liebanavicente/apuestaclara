export interface LeaderboardRow {
  user_id: string
  username: string | null
  avatar_url: string | null
  total_points: number
  total_resolved: number
  total_won: number
  total_pending: number
  win_rate: number | null
}

export type PickResult = 'won' | 'lost'

export interface ResolvedPickSummary {
  status: PickResult
  points: number
  resolved_at: string
}

export interface UserRankingStats {
  totalResolved: number
  totalWon: number
  totalLost: number
  totalPending: number
  winRate: number | null
  currentStreak: number
  bestStreak: number
  form: ResolvedPickSummary[]
}
