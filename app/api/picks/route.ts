import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const { description, competition, selection, odds, stake, note, match_date, legs } = body

  if (!description || !selection || !odds || !stake) {
    return NextResponse.json({ error: 'Faltan campos' }, { status: 400 })
  }
  if (odds <= 1) return NextResponse.json({ error: 'Cuota debe ser mayor de 1' }, { status: 400 })

  const admin = createAdminClient()

  // Check: only one pick per user per match
  const { data: existing } = await admin
    .from('picks')
    .select('id')
    .eq('user_id', user.id)
    .eq('description', description)
    .neq('status', 'void')
    .maybeSingle()

  if (existing) {
    return NextResponse.json({ error: 'Ya tienes un pick para este partido' }, { status: 400 })
  }

  const { data, error } = await admin.from('picks').insert({
    user_id: user.id,
    description,
    competition: competition || null,
    selection,
    odds,
    stake: stake || 1,
    note: note || null,
    match_date: match_date || null,
    legs: legs || null,
  }).select().single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}
