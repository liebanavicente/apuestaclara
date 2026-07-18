import { NextRequest, NextResponse } from 'next/server'
import { createClient as createServerClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { hasSupabaseAdminConfig, hasSupabasePublicConfig } from '@/lib/supabase/config'
import { getUserAccess } from '@/lib/access'
import { analyzeParlay } from '@/lib/services/ai.service'
import type { AnalysisRequest } from '@/types/ai'

export async function POST(req: NextRequest) {
  const supabase = hasSupabasePublicConfig() ? await createServerClient() : null
  const { data: { user } } = supabase
    ? await supabase.auth.getUser()
    : { data: { user: null } }

  const body: AnalysisRequest = await req.json()

  if (!body.picks || body.picks.length < 2) {
    return NextResponse.json({ error: 'Se necesitan al menos 2 picks' }, { status: 400 })
  }

  // MVP: todos tienen acceso premium, logueados o no
  let isPremium = true

  if (user && hasSupabaseAdminConfig()) {
    const admin = createAdminClient()
    const [{ data: profile }, { data: subscriber }] = await Promise.all([
      admin.from('profiles').select('*').eq('user_id', user.id).single(),
      admin.from('subscribers').select('*').eq('user_id', user.id).maybeSingle(),
    ])
    const access = getUserAccess(profile as any, subscriber as any)
    isPremium = access.isPremium

    // Log usage for logged-in users
    await admin.from('generation_logs').insert({
      user_id: user.id,
      type: 'ai_analysis',
      picks_count: body.picks.length,
    }).then(() => {})
  }

  body.is_premium = isPremium

  try {
    const analysis = await analyzeParlay(body)
    return NextResponse.json(analysis)
  } catch (err) {
    console.error('AI analysis error:', err)
    return NextResponse.json({ error: 'Error al generar análisis. Inténtalo de nuevo.' }, { status: 500 })
  }
}
