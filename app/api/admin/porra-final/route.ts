import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { computeFinalPoints, isFinalPredictionExact } from '@/lib/porra'

async function requireAdmin() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null
  const admin = createAdminClient()
  const { data: profile } = await admin.from('profiles').select('role').eq('user_id', user.id).single()
  if (profile?.role !== 'admin') return null
  return admin
}

export async function GET() {
  const admin = await requireAdmin()
  if (!admin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const { data: matchInfo } = await admin.from('final_match_info').select('*').eq('id', 1).single()
  const { count: pendingCount } = await admin
    .from('picks')
    .select('id', { count: 'exact', head: true })
    .eq('pick_type', 'final_prediction')
    .eq('status', 'pending')

  return NextResponse.json({ matchInfo, pendingCount: pendingCount ?? 0 })
}

export async function POST(req: NextRequest) {
  const admin = await requireAdmin()
  if (!admin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const body = await req.json()

  // Acción 1: fijar/actualizar el rival (no toca pronósticos existentes)
  if (body.action === 'set_opponent') {
    const { opponent_name, opponent_flag } = body
    const { error } = await admin
      .from('final_match_info')
      .update({ opponent_name: opponent_name || null, opponent_flag: opponent_flag || null })
      .eq('id', 1)
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ ok: true })
  }

  // Acción 2: registrar el resultado real y resolver todos los pronósticos pendientes
  if (body.action === 'resolve') {
    const { actual_goals_spain, actual_goals_rival, actual_penalty_winner } = body
    if (typeof actual_goals_spain !== 'number' || typeof actual_goals_rival !== 'number') {
      return NextResponse.json({ error: 'Marcador real requerido' }, { status: 400 })
    }

    const { error: updateError } = await admin
      .from('final_match_info')
      .update({
        actual_goals_spain,
        actual_goals_rival,
        actual_penalty_winner: actual_penalty_winner ?? null,
        resolved_at: new Date().toISOString(),
      })
      .eq('id', 1)
    if (updateError) return NextResponse.json({ error: updateError.message }, { status: 500 })

    const { data: pending } = await admin
      .from('picks')
      .select('id,goals_spain,goals_rival')
      .eq('pick_type', 'final_prediction')
      .eq('status', 'pending')

    let resolved = 0
    for (const pick of pending ?? []) {
      const exact = isFinalPredictionExact(
        { goals_spain: pick.goals_spain, goals_rival: pick.goals_rival },
        { actual_goals_spain, actual_goals_rival }
      )
      const points = computeFinalPoints(exact)
      const { error } = await admin
        .from('picks')
        .update({ status: exact ? 'won' : 'lost', points, resolved_at: new Date().toISOString() })
        .eq('id', pick.id)
      if (!error) resolved++
    }

    return NextResponse.json({ ok: true, resolved, total: pending?.length ?? 0 })
  }

  return NextResponse.json({ error: 'Acción no válida' }, { status: 400 })
}
