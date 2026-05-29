import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const { description, competition, selection, odds, stake, note, match_date } = body

  if (!description || !selection || !odds || !stake) {
    return NextResponse.json({ error: 'Faltan campos' }, { status: 400 })
  }
  if (odds <= 1) return NextResponse.json({ error: 'Cuota debe ser mayor de 1' }, { status: 400 })
  if (stake <= 0) return NextResponse.json({ error: 'Apuesta debe ser positiva' }, { status: 400 })

  const admin = createAdminClient()

  // Check bankroll
  const { data: bankrollRow } = await admin
    .from('bankrolls')
    .select('bankroll')
    .eq('user_id', user.id)
    .single()

  const currentBankroll = bankrollRow?.bankroll ?? 1000
  if (stake > currentBankroll) {
    return NextResponse.json({ error: 'No tienes suficiente bankroll' }, { status: 400 })
  }

  const { data, error } = await admin.from('picks').insert({
    user_id: user.id,
    description,
    competition: competition || null,
    selection,
    odds,
    stake,
    note: note || null,
    match_date: match_date || null,
  }).select().single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}
