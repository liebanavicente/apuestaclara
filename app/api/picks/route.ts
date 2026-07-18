import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { hasSupabaseAdminConfig } from '@/lib/supabase/config'
import { supabaseAdminUnavailableResponse } from '@/lib/supabase/unavailable'

export async function POST(req: NextRequest) {
  if (!hasSupabaseAdminConfig()) return supabaseAdminUnavailableResponse()

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const { description, competition, selection, odds, stake, note, match_date, legs } = body
  const normalizedOdds = Number(odds)
  const competitionStake = Number(stake ?? 1)

  if (!description || !selection || !Number.isFinite(normalizedOdds)) {
    return NextResponse.json({ error: 'Faltan campos' }, { status: 400 })
  }
  if (normalizedOdds <= 1) return NextResponse.json({ error: 'Cuota debe ser mayor de 1' }, { status: 400 })
  if (!Number.isFinite(competitionStake) || competitionStake <= 0) {
    return NextResponse.json({ error: 'Unidad de competición no válida' }, { status: 400 })
  }

  const admin = createAdminClient()

  const { data, error } = await admin.from('picks').insert({
    user_id: user.id,
    description,
    competition: competition || null,
    selection,
    odds: normalizedOdds,
    stake: competitionStake,
    note: note || null,
    match_date: match_date || null,
    legs: legs || null,
  }).select().single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}
