import type { Sport, OddsEvent, NormalizedEvent } from '@/types/odds'

const BASE_URL = 'https://api.the-odds-api.com/v4'
const API_KEY = process.env.THE_ODDS_API_KEY

export const FEATURED_SPORTS: { key: string; label: string; emoji: string; featured?: boolean }[] = [
  { key: 'soccer_fifa_world_cup', label: 'Mundial 2026', emoji: '🌍', featured: true },
  { key: 'soccer_uefa_champs_league', label: 'Champions League', emoji: '⭐', featured: true },
]

export interface CompletedMatch {
  id: string
  sport_key: string
  home_team: string
  away_team: string
  completed: boolean
  scores: { name: string; score: string }[] | null
}

export type MatchResult = 'home' | 'away' | 'draw'

export function getMatchResult(match: CompletedMatch): MatchResult | null {
  if (!match.completed || !match.scores || match.scores.length < 2) return null
  const homeScore = match.scores.find(s => s.name === match.home_team)
  const awayScore = match.scores.find(s => s.name === match.away_team)
  if (!homeScore || !awayScore) return null
  const h = parseInt(homeScore.score)
  const a = parseInt(awayScore.score)
  if (isNaN(h) || isNaN(a)) return null
  if (h > a) return 'home'
  if (a > h) return 'away'
  return 'draw'
}

export async function getCompletedMatches(sportKey: string, daysFrom = 3): Promise<CompletedMatch[]> {
  if (!API_KEY) return []
  const params = new URLSearchParams({ apiKey: API_KEY, daysFrom: String(daysFrom), dateFormat: 'iso' })
  const res = await fetch(`${BASE_URL}/sports/${sportKey}/scores?${params}`, { cache: 'no-store' })
  if (!res.ok) return []
  const data: CompletedMatch[] = await res.json()
  return data.filter(m => m.completed)
}

export async function getSports(): Promise<Sport[]> {
  if (!API_KEY) return []
  const res = await fetch(`${BASE_URL}/sports/?apiKey=${API_KEY}`, {
    next: { revalidate: 3600 }, // cache 1h
  })
  if (!res.ok) return []
  return res.json()
}

export async function getEvents(sportKey: string): Promise<NormalizedEvent[]> {
  if (!API_KEY) return []

  const params = new URLSearchParams({
    apiKey: API_KEY,
    regions: 'eu',
    markets: 'h2h',
    oddsFormat: 'decimal',
    dateFormat: 'iso',
  })

  const res = await fetch(`${BASE_URL}/sports/${sportKey}/odds?${params}`, {
    next: { revalidate: 300 }, // cache 5 min
  })

  if (!res.ok) return []

  const events: OddsEvent[] = await res.json()
  return events.map(normalizeEvent)
}

export async function getMultipleSportsEvents(sportKeys: string[]): Promise<NormalizedEvent[]> {
  const results = await Promise.allSettled(sportKeys.map(k => getEvents(k)))
  return results
    .filter((r): r is PromiseFulfilledResult<NormalizedEvent[]> => r.status === 'fulfilled')
    .flatMap(r => r.value)
    .sort((a, b) => new Date(a.commence_time).getTime() - new Date(b.commence_time).getTime())
}

function normalizeEvent(event: OddsEvent): NormalizedEvent {
  const h2hMarkets = event.bookmakers
    .map(b => b.markets.find(m => m.key === 'h2h'))
    .filter(Boolean)

  const allHomeOdds: number[] = []
  const allDrawOdds: number[] = []
  const allAwayOdds: number[] = []

  for (const market of h2hMarkets) {
    if (!market) continue
    const home = market.outcomes.find(o => o.name === event.home_team)
    const draw = market.outcomes.find(o => o.name === 'Draw')
    const away = market.outcomes.find(o => o.name === event.away_team)
    if (home) allHomeOdds.push(home.price)
    if (draw) allDrawOdds.push(draw.price)
    if (away) allAwayOdds.push(away.price)
  }

  const best = (arr: number[]) => arr.length ? Math.max(...arr) : null
  const avg = (arr: number[]) => arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : null
  const impl = (odds: number | null) => odds ? Math.round((1 / odds) * 100) : null

  const sportLabel = FEATURED_SPORTS.find(s => s.key === event.sport_key)?.label ?? event.sport_title

  return {
    id: event.id,
    sport_key: event.sport_key,
    sport_title: event.sport_title,
    league: sportLabel,
    commence_time: event.commence_time,
    home_team: event.home_team,
    away_team: event.away_team,
    event_name: `${event.home_team} vs ${event.away_team}`,
    best_odds: { home: best(allHomeOdds), draw: best(allDrawOdds), away: best(allAwayOdds) },
    avg_odds: { home: avg(allHomeOdds), draw: avg(allDrawOdds), away: avg(allAwayOdds) },
    implied_probability: {
      home: impl(avg(allHomeOdds)),
      draw: impl(avg(allDrawOdds)),
      away: impl(avg(allAwayOdds)),
    },
    bookmakers_count: event.bookmakers.length,
    bookmakers: event.bookmakers,
    is_real_data: true,
  }
}
