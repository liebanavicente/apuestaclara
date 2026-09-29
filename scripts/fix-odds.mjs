import { createClient } from '@supabase/supabase-js'

import fs from 'fs'

// Load .env.local if present
if (fs.existsSync('.env.local')) {
  const envContent = fs.readFileSync('.env.local', 'utf8')
  for (const line of envContent.split('\n')) {
    const match = line.match(/^([^#=]+)=(.*)$/)
    if (match) {
      const key = match[1].trim()
      const val = match[2].trim().replace(/^['"](.*)['"]$/, '$1')
      if (!process.env[key]) process.env[key] = val
    }
  }
}

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY
const ODDS_KEY = process.env.THE_ODDS_API_KEY
const BASE_URL = 'https://api.the-odds-api.com/v4'

const SPORTS = [
  'soccer_fifa_world_cup',
  'soccer_uefa_champs_league',
  'basketball_nba',
  'tennis_atp_french_open',
  'tennis_wta_french_open',
  'icehockey_nhl',
  'baseball_mlb',
  'soccer_conmebol_copa_libertadores',
  'mma_mixed_martial_arts',
  'boxing_boxing',
]

const supabase = createClient(SUPABASE_URL, SERVICE_KEY)

async function fetchOdds(sportKey) {
  const params = new URLSearchParams({
    apiKey: ODDS_KEY,
    regions: 'eu',
    markets: 'h2h',
    oddsFormat: 'decimal',
    dateFormat: 'iso',
  })
  const res = await fetch(`${BASE_URL}/sports/${sportKey}/odds?${params}`)
  if (!res.ok) return []
  return res.json()
}

function avgOdds(events) {
  // Returns map: event_name_lower -> { home, draw, away }
  const map = new Map()
  for (const ev of events) {
    const allHome = [], allDraw = [], allAway = []
    for (const bm of ev.bookmakers) {
      const market = bm.markets.find(m => m.key === 'h2h')
      if (!market) continue
      const home = market.outcomes.find(o => o.name === ev.home_team)
      const draw = market.outcomes.find(o => o.name === 'Draw')
      const away = market.outcomes.find(o => o.name === ev.away_team)
      if (home) allHome.push(home.price)
      if (draw) allDraw.push(draw.price)
      if (away) allAway.push(away.price)
    }
    const avg = arr => arr.length ? arr.reduce((a,b)=>a+b,0)/arr.length : null
    const key = `${ev.home_team} vs ${ev.away_team}`.toLowerCase()
    map.set(key, {
      home_team: ev.home_team,
      away_team: ev.away_team,
      home: avg(allHome),
      draw: avg(allDraw),
      away: avg(allAway),
    })
  }
  return map
}

async function main() {
  // 1. Load all pending picks
  const { data: picks, error } = await supabase
    .from('picks')
    .select('id, description, selection, odds, status')
    .eq('status', 'pending')

  if (error) { console.error('Error cargando picks:', error); return }
  console.log(`${picks.length} picks pendientes encontrados`)

  // 2. Fetch odds for all sports
  console.log('Obteniendo cuotas de la API...')
  const allEvents = []
  for (const sport of SPORTS) {
    const events = await fetchOdds(sport)
    allEvents.push(...events)
    process.stdout.write('.')
  }
  console.log(`\n${allEvents.length} partidos obtenidos`)

  const oddsMap = avgOdds(allEvents)

  // 3. Update each pick
  let updated = 0, skipped = 0

  for (const pick of picks) {
    const eventKey = pick.description.toLowerCase()
    const ev = oddsMap.get(eventKey)
    if (!ev) { skipped++; continue }

    let correctOdds = null
    const sel = pick.selection.toLowerCase()

    if (sel === 'empate' || sel === 'draw') {
      correctOdds = ev.draw
    } else {
      const teamInSel = sel.replace(' gana', '').trim()
      if (ev.home_team.toLowerCase() === teamInSel) correctOdds = ev.home
      else if (ev.away_team.toLowerCase() === teamInSel) correctOdds = ev.away
      else {
        // sim sports: selection is just the team name
        if (ev.home_team.toLowerCase().includes(teamInSel) || teamInSel.includes(ev.home_team.toLowerCase())) correctOdds = ev.home
        else if (ev.away_team.toLowerCase().includes(teamInSel) || teamInSel.includes(ev.away_team.toLowerCase())) correctOdds = ev.away
      }
    }

    if (!correctOdds) { skipped++; continue }

    const rounded = Math.round(correctOdds * 100) / 100
    if (Math.abs(rounded - pick.odds) < 0.05) { skipped++; continue }

    console.log(`  ${pick.description} | ${pick.selection}: ${pick.odds} → ${rounded}`)
    const { error: upErr } = await supabase
      .from('picks')
      .update({ odds: rounded })
      .eq('id', pick.id)

    if (upErr) { console.error('Error:', upErr); skipped++ }
    else updated++
  }

  console.log(`\n✅ Actualizados: ${updated} | Sin cambios: ${skipped}`)
}

main().catch(console.error)
