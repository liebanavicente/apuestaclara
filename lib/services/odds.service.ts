import type { Sport, OddsEvent, NormalizedEvent } from '@/types/odds'

const BASE_URL = 'https://api.the-odds-api.com/v4'
const API_KEY = process.env.THE_ODDS_API_KEY

// Sports to show by default (most popular in Spain/Europe)
export const FEATURED_SPORTS: { key: string; label: string; emoji: string; featured?: boolean }[] = [
  { key: 'soccer_fifa_world_cup', label: 'Mundial 2026', emoji: '🌍', featured: true },
  { key: 'soccer_uefa_champs_league', label: 'Champions League', emoji: '⭐', featured: true },
  { key: 'soccer_spain_la_liga', label: 'LaLiga', emoji: '🇪🇸' },
  { key: 'soccer_epl', label: 'Premier League', emoji: '🏴󠁧󠁢󠁥󠁮󠁧󠁿' },
  { key: 'soccer_germany_bundesliga', label: 'Bundesliga', emoji: '🇩🇪' },
  { key: 'soccer_italy_serie_a', label: 'Serie A', emoji: '🇮🇹' },
  { key: 'soccer_france_ligue_one', label: 'Ligue 1', emoji: '🇫🇷' },
  { key: 'basketball_nba', label: 'NBA', emoji: '🏀' },
]

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
