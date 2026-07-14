export interface FinalMatchInfo {
  id: number
  opponent_name: string | null
  opponent_flag: string | null
  kickoff_at: string
  actual_goals_spain: number | null
  actual_goals_rival: number | null
  actual_penalty_winner: 'espana' | 'rival' | null
  resolved_at: string | null
}

export interface FinalPrediction {
  id: string
  user_id: string
  goals_spain: number
  goals_rival: number
  penalty_winner: 'espana' | 'rival' | null
  status: 'pending' | 'won' | 'lost'
  points: number
  created_at: string
}

export interface FinalPredictionInput {
  goals_spain: number
  goals_rival: number
  penalty_winner?: 'espana' | 'rival' | null
}
