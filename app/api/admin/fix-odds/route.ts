import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { getMultipleSportsEvents, FEATURED_SPORTS, SIM_SPORTS } from '@/lib/services/odds.service'

export async function POST() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  const admin = createAdminClient()
  const { data: profile } = await admin.from('profiles').select('is_admin').eq('id', user.id).single()
  if (!profile?.is_admin) return NextResponse.json({ error: 'No autorizado' }, { status: 403 })

  // Fetch all picks (competition + sim)
  const { data: picks, error: picksError } = await admin
    .from('picks')
    .select('id, description, selection, odds, status, points, is_sim, stake')

  if (picksError || !picks) return NextResponse.json({ error: 'Error al leer picks' }, { status: 500 })

  // Fetch all current events (competition + sim sports)
  const allSportKeys = [...new Set([
    ...FEATURED_SPORTS.map(s => s.key),
    ...SIM_SPORTS.map(s => s.key),
  ])]
  const events = await getMultipleSportsEvents(allSportKeys)

  // Build map: event_name (lowercase) → { home, draw, away }
  const oddsMap = new Map<string, { home: number | null; draw: number | null; away: number | null }>()
  for (const ev of events) {
    oddsMap.set(ev.event_name.toLowerCase(), ev.best_odds)
  }

  let updated = 0
  let skipped = 0

  for (const pick of picks) {
    const eventOdds = oddsMap.get(pick.description.toLowerCase())
    if (!eventOdds) { skipped++; continue }

    // Find the correct odds for this selection
    let correctOdds: number | null = null
    const sel = pick.selection.toLowerCase()

    if (sel === 'empate' || sel === 'draw') {
      correctOdds = eventOdds.draw
    } else if (sel.includes(' gana')) {
      const team = sel.replace(' gana', '').trim()
      // Check if it's home or away
      const [home, , away] = pick.description.toLowerCase().split(' vs ')
      if (home?.trim() === team) correctOdds = eventOdds.home
      else if (away?.trim() === team) correctOdds = eventOdds.away
    } else {
      // Sim sports may not have draw — try home/away
      const [home, , away] = pick.description.toLowerCase().split(' vs ')
      if (home?.trim() === sel) correctOdds = eventOdds.home
      else if (away?.trim() === sel) correctOdds = eventOdds.away
    }

    if (!correctOdds || Math.abs(correctOdds - pick.odds) < 0.05) { skipped++; continue }

    // Recalculate points/profit with new odds
    let newPoints = pick.points
    if (pick.status === 'won') {
      if (pick.is_sim) {
        const stake = pick.stake ?? 10
        newPoints = stake * (correctOdds - 1)
      } else {
        newPoints = correctOdds
      }
    } else if (pick.status === 'lost') {
      newPoints = pick.is_sim ? -(pick.stake ?? 10) : 0
    }

    const { error } = await admin
      .from('picks')
      .update({ odds: correctOdds, points: newPoints })
      .eq('id', pick.id)

    if (!error) updated++
    else skipped++
  }

  return NextResponse.json({ updated, skipped, total: picks.length })
}
