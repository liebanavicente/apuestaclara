import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { BASE_FINAL_POINTS, isFinalLocked, validateFinalPredictionInput } from '@/lib/porra'
import type { FinalMatchInfo } from '@/types/porra'

async function getMatchInfo(admin: ReturnType<typeof createAdminClient>): Promise<FinalMatchInfo> {
  const { data } = await admin.from('final_match_info').select('*').eq('id', 1).single()
  return data as FinalMatchInfo
}

export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const admin = createAdminClient()
  const matchInfo = await getMatchInfo(admin)

  let myPrediction = null
  if (user) {
    const { data } = await admin
      .from('picks')
      .select('id,goals_spain,goals_rival,penalty_winner,status,points,created_at')
      .eq('user_id', user.id)
      .eq('pick_type', 'final_prediction')
      .maybeSingle()
    myPrediction = data
  }

  return NextResponse.json({ matchInfo, myPrediction })
}

export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const validation = validateFinalPredictionInput(body)
  if (!validation.valid) return NextResponse.json({ error: validation.error }, { status: 400 })

  const admin = createAdminClient()
  const matchInfo = await getMatchInfo(admin)

  if (isFinalLocked(matchInfo.kickoff_at)) {
    return NextResponse.json({ error: 'Pronósticos cerrados' }, { status: 400 })
  }

  const { goals_spain, goals_rival, penalty_winner } = body

  const { data: existing } = await admin
    .from('picks')
    .select('id')
    .eq('user_id', user.id)
    .eq('pick_type', 'final_prediction')
    .maybeSingle()

  const payload = {
    goals_spain,
    goals_rival,
    penalty_winner: penalty_winner ?? null,
    match_date: matchInfo.kickoff_at,
    selection: `${goals_spain}-${goals_rival}`,
  }

  if (existing) {
    const { data, error } = await admin
      .from('picks')
      .update(payload)
      .eq('id', existing.id)
      .select('id,goals_spain,goals_rival,penalty_winner,status,points,created_at')
      .single()
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ ok: true, prediction: data })
  }

  const { data, error } = await admin
    .from('picks')
    .insert({
      user_id: user.id,
      pick_type: 'final_prediction',
      description: 'Porra Final Mundial 2026',
      competition: 'Mundial 2026 (Final)',
      odds: BASE_FINAL_POINTS,
      stake: 1,
      ...payload,
    })
    .select('id,goals_spain,goals_rival,penalty_winner,status,points,created_at')
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true, prediction: data })
}
