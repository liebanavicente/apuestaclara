import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { description, competition, selection, odds, stake, match_date } = await req.json()

  if (!description || !selection || !odds || !stake) {
    return NextResponse.json({ error: 'Faltan campos' }, { status: 400 })
  }

  const admin = createAdminClient()

  // One sim pick per match per user
  const { data: existing } = await admin
    .from('picks')
    .select('id')
    .eq('user_id', user.id)
    .eq('description', description)
    .eq('is_sim', true)
    .neq('status', 'void')
    .maybeSingle()

  if (existing) return NextResponse.json({ error: 'Ya tienes un pick simulado para este partido' }, { status: 400 })

  const { data, error } = await admin.from('picks').insert({
    user_id: user.id,
    description,
    competition: competition || null,
    selection,
    odds,
    stake,
    match_date: match_date || null,
    is_sim: true,
  }).select().single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}
