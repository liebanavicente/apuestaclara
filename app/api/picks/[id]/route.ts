import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { hasSupabaseAdminConfig } from '@/lib/supabase/config'
import { supabaseAdminUnavailableResponse } from '@/lib/supabase/unavailable'

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!hasSupabaseAdminConfig()) return supabaseAdminUnavailableResponse()

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  const admin = createAdminClient()

  // Only allow deleting pending picks (not resolved ones)
  const { data: pick } = await admin
    .from('picks')
    .select('id, status')
    .eq('id', id)
    .eq('user_id', user.id)
    .single()

  if (!pick) return NextResponse.json({ error: 'Pick no encontrado' }, { status: 404 })
  if (pick.status !== 'pending') return NextResponse.json({ error: 'Solo se pueden eliminar picks pendientes' }, { status: 400 })

  const { error } = await admin.from('picks').delete().eq('id', id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ ok: true })
}
