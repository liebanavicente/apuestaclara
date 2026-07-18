import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { hasSupabaseAdminConfig } from '@/lib/supabase/config'
import { supabaseAdminUnavailableResponse } from '@/lib/supabase/unavailable'
import { FEATURED_SPORTS, getCompletedMatches, getMatchResult } from '@/lib/services/odds.service'

function getMadridHour(date = new Date()) {
  return new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Europe/Madrid',
    hour: '2-digit',
    hour12: false,
  }).format(date)
}

async function runAutoResolve(req: NextRequest, options: { enforceMadridTwoAm?: boolean } = {}) {
  if (!hasSupabaseAdminConfig()) return supabaseAdminUnavailableResponse()

  // Auth: Vercel cron secret OR admin session
  const authHeader = req.headers.get('authorization')
  const cronSecret = process.env.CRON_SECRET

  const isVercelCron = cronSecret && authHeader === `Bearer ${cronSecret}`

  if (!isVercelCron) {
    // Check if request comes from admin user
    const { createClient } = await import('@/lib/supabase/server')
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const admin = createAdminClient()
    const { data: profile } = await admin.from('profiles').select('role').eq('user_id', user.id).single()
    if (profile?.role !== 'admin') return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  if (options.enforceMadridTwoAm) {
    const madridHour = getMadridHour()
    if (madridHour !== '02') {
      return NextResponse.json({
        ok: true,
        skipped: true,
        reason: 'outside_madrid_2am',
        madridHour,
      })
    }
  }

  const admin = createAdminClient()
  const sportKeys = FEATURED_SPORTS.map(s => s.key)

  let totalResolved = 0
  let totalFailed = 0
  const log: string[] = []

  for (const sportKey of sportKeys) {
    const completed = await getCompletedMatches(sportKey)

    for (const match of completed) {
      const result = getMatchResult(match)
      if (!result) continue

      // Find all pending picks for this match. New Framer picks store the
      // upstream event id; legacy picks still fall back to the old description.
      const eventName = `${match.home_team} vs ${match.away_team}`
      const { data: eventIdPicks } = await admin
        .from('picks')
        .select('id, selection, odds, user_id, selection_key')
        .eq('event_id', match.id)
        .eq('status', 'pending')

      const { data: legacyPicks } = await admin
        .from('picks')
        .select('id, selection, odds, user_id, selection_key')
        .is('event_id', null)
        .eq('description', eventName)
        .eq('status', 'pending')

      const pendingPicks = [...(eventIdPicks ?? []), ...(legacyPicks ?? [])]
      if (!pendingPicks || pendingPicks.length === 0) continue

      log.push(`${eventName}: result=${result}, picks=${pendingPicks.length}`)

      for (const pick of pendingPicks) {
        // Determine if pick won
        const sel = pick.selection.toLowerCase()
        const selectionKey = pick.selection_key?.toLowerCase()
        let won = false
        if (selectionKey) {
          won = selectionKey === result
        } else {
          if (result === 'home' && sel.includes(match.home_team.toLowerCase())) won = true
          if (result === 'away' && sel.includes(match.away_team.toLowerCase())) won = true
          if (result === 'draw' && (sel === 'empate' || sel === 'draw')) won = true
        }

        const status = won ? 'won' : 'lost'
        const points = won ? Math.round(pick.odds * 100) / 100 : 0
        const profit = won ? pick.odds - 1 : -1

        const { error } = await admin.from('picks').update({
          status,
          points,
          profit: Math.round(profit * 100) / 100,
          resolved_at: new Date().toISOString(),
        }).eq('id', pick.id)

        if (error) { totalFailed++; log.push(`  ERROR pick ${pick.id}: ${error.message}`) }
        else totalResolved++
      }
    }
  }

  return NextResponse.json({ ok: true, totalResolved, totalFailed, log })
}

// Vercel cron calls GET
export async function GET(req: NextRequest) {
  return runAutoResolve(req, { enforceMadridTwoAm: true })
}

// Manual admin trigger calls POST
export async function POST(req: NextRequest) {
  return runAutoResolve(req)
}
