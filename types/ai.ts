import type { PickSelection } from './odds'

export interface AnalysisRequest {
  picks: PickSelection[]
  risk_level: 'bajo' | 'medio' | 'alto'
  is_premium: boolean
}

export interface PickAnalysis {
  event_name: string
  selection: string
  odds: number
  reasoning: string
  implied_probability: number
  factors_for: string[]
  factors_against: string[]
  why_it_can_fail: string
  confidence: 'baja' | 'media' | 'alta'
}

export interface CombinedAnalysis {
  total_odds: number
  risk_level: 'bajo' | 'medio' | 'alto'
  global_risk_summary: string
  picks_analysis: PickAnalysis[]
  discarded_picks?: PickAnalysis[]
  alternatives?: {
    prudent: string
    objective: string
    aggressive: string
  }
  disclaimer: string
  no_data_warning?: string
}
