import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { hasSupabaseAdminConfig } from '@/lib/supabase/config'
import { supabaseAdminUnavailableResponse } from '@/lib/supabase/unavailable'

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!hasSupabaseAdminConfig()) return supabaseAdminUnavailableResponse()

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  const { result } = await req.json()
  if (result !== 'won' && result !== 'lost') {
    return NextResponse.json({ error: 'result debe ser won o lost' }, { status: 400 })
  }

  const admin = createAdminClient()

  const { data: pick } = await admin
    .from('picks')
    .select('*')
    .eq('id', id)
    .eq('user_id', user.id)
    .eq('status', 'pending')
    .single()

  if (!pick) return NextResponse.json({ error: 'Pick no encontrado' }, { status: 404 })

  // Points = odds if won, 0 if lost
  const points = result === 'won' ? Math.round(pick.odds * 100) / 100 : 0
  const profit = result === 'won' ? pick.stake * (pick.odds - 1) : -pick.stake

  const { error } = await admin
    .from('picks')
    .update({
      status: result,
      points,
      profit: Math.round(profit * 100) / 100,
      resolved_at: new Date().toISOString(),
    })
    .eq('id', id)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true, points })
}
