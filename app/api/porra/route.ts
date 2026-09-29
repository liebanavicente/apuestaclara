import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

// GET /api/porra?match=esp-arg-final-2026
// Returns all picks + usernames for a match
export async function GET(req: NextRequest) {
  const matchId = req.nextUrl.searchParams.get('match') ?? 'esp-arg-final-2026'
  const admin = createAdminClient()

  const { data, error } = await admin
    .from('porra_picks')
    .select('id, home_goals, away_goals, user_id, created_at, profiles(username)')
    .eq('match_id', matchId)
    .order('created_at', { ascending: true })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data ?? [])
}

// POST /api/porra  { match_id, home_goals, away_goals }
export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { match_id = 'esp-arg-final-2026', home_goals, away_goals } = await req.json()

  if (home_goals == null || away_goals == null)
    return NextResponse.json({ error: 'Faltan goles' }, { status: 400 })

  const admin = createAdminClient()

  // Delete existing pick for this user+match (allows changing)
  await admin.from('porra_picks').delete()
    .eq('match_id', match_id).eq('user_id', user.id)

  const { data, error } = await admin.from('porra_picks').insert({
    match_id,
    user_id: user.id,
    home_goals: Number(home_goals),
    away_goals: Number(away_goals),
  }).select().single()

  if (error) {
    if (error.code === '23505') // unique violation → score taken
      return NextResponse.json({ error: 'Resultado ya cogido' }, { status: 409 })
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
  return NextResponse.json(data)
}

// DELETE /api/porra?match=esp-arg-final-2026
export async function DELETE(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const matchId = req.nextUrl.searchParams.get('match') ?? 'esp-arg-final-2026'
  const admin = createAdminClient()

  await admin.from('porra_picks').delete()
    .eq('match_id', matchId).eq('user_id', user.id)

  return NextResponse.json({ ok: true })
}
