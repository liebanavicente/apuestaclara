import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const admin = createAdminClient()
  const { data: profile } = await admin.from('profiles').select('role').eq('user_id', user.id).single()
  if (profile?.role !== 'admin') return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  // Picks resolved in the last 24h
  const since = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
  const { data: picks } = await admin
    .from('picks')
    .select('id, user_id, description, selection, odds, status, points')
    .in('status', ['won', 'lost'])
    .gte('resolved_at', since)
    .order('resolved_at', { ascending: false })

  if (!picks || picks.length === 0) return NextResponse.json([])

  const userIds = [...new Set(picks.map(p => p.user_id))]
  const { data: profiles } = await admin.from('profiles').select('user_id, username').in('user_id', userIds)
  const usernameMap = new Map((profiles ?? []).map(p => [p.user_id, p.username]))

  return NextResponse.json(picks.map(p => ({ ...p, username: usernameMap.get(p.user_id) ?? p.user_id.slice(0, 8) })))
}
