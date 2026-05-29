import { NextRequest, NextResponse } from 'next/server'
import { createClient as createServerClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { getUserAccess } from '@/lib/access'
import { analyzeParlay } from '@/lib/services/ai.service'
import type { AnalysisRequest } from '@/types/ai'

export async function POST(req: NextRequest) {
  const supabase = await createServerClient()
  const { data: { user } } = await supabase.auth.getUser()

  // Require auth
  if (!user) {
    return NextResponse.json({ error: 'Autenticación requerida' }, { status: 401 })
  }

  const admin = createAdminClient()
  const [{ data: profile }, { data: subscriber }] = await Promise.all([
    admin.from('profiles').select('*').eq('id', user.id).single(),
    admin.from('subscribers').select('*').eq('user_id', user.id).maybeSingle(),
  ])

  const access = getUserAccess(profile as any, subscriber as any)

  // Check generation limit
  const today = new Date().toISOString().slice(0, 10)
  const { count } = await admin
    .from('generation_logs')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user.id)
    .eq('type', 'ai_analysis')
    .gte('created_at', `${today}T00:00:00Z`)

  const dailyUsed = count ?? 0
  const dailyLimit = access.limits.aiAnalysesPerDay ?? 3

  if (dailyUsed >= dailyLimit) {
    return NextResponse.json(
      { error: `Límite diario alcanzado (${dailyLimit} análisis/día). Vuelve mañana${!access.isPremium ? ' o hazte Premium.' : '.'}` },
      { status: 429 }
    )
  }

  const body: AnalysisRequest = await req.json()

  if (!body.picks || body.picks.length < 2) {
    return NextResponse.json({ error: 'Se necesitan al menos 2 picks' }, { status: 400 })
  }

  // Force is_premium from server-side access (don't trust client)
  body.is_premium = access.isPremium

  try {
    const analysis = await analyzeParlay(body)

    // Log the usage
    await admin.from('generation_logs').insert({
      user_id: user.id,
      type: 'ai_analysis',
      picks_count: body.picks.length,
    })

    return NextResponse.json(analysis)
  } catch (err) {
    console.error('AI analysis error:', err)
    return NextResponse.json({ error: 'Error al generar análisis. Inténtalo de nuevo.' }, { status: 500 })
  }
}
