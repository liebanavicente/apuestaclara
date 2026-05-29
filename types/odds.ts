export interface Sport {
  key: string
  group: string
  title: string
  description: string
  active: boolean
  has_outrights: boolean
}

export interface Bookmaker {
  key: string
  title: string
  last_update: string
  markets: Market[]
}

export interface Market {
  key: string
  last_update: string
  outcomes: Outcome[]
}

export interface Outcome {
  name: string
  price: number
  point?: number
}

export interface OddsEvent {
  id: string
  sport_key: string
  sport_title: string
  commence_time: string
  home_team: string
  away_team: string
  bookmakers: Bookmaker[]
}

export interface NormalizedEvent {
  id: string
  sport_key: string
  sport_title: string
  league: string
  commence_time: string
  home_team: string
  away_team: string
  event_name: string
  best_odds: {
    home: number | null
    draw: number | null
    away: number | null
  }
  avg_odds: {
    home: number | null
    draw: number | null
    away: number | null
  }
  implied_probability: {
    home: number | null
    draw: number | null
    away: number | null
  }
  bookmakers_count: number
  bookmakers: Bookmaker[]
  is_real_data: boolean
}

export interface PickSelection {
  event_id: string
  event_name: string
  sport_key: string
  sport_title: string
  league: string
  commence_time: string
  market: string
  selection: string
  odds: number
  bookmaker: string
  implied_probability: number
}
