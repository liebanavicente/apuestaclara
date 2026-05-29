import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { getUserAccess } from '@/lib/access'

export async function GET(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const admin = createAdminClient()
  const { searchParams } = new URL(req.url)
  const limit = Math.min(parseInt(searchParams.get('limit') ?? '20'), 50)
  const offset = parseInt(searchParams.get('offset') ?? '0')

  const { data, count } = await admin
    .from('simulations')
    .select('*, simulation_picks(*)', { count: 'exact' })
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1)

  return NextResponse.json({ simulations: data ?? [], total: count ?? 0 })
}

export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const admin = createAdminClient()
  const [{ data: profile }, { data: subscriber }] = await Promise.all([
    admin.from('profiles').select('*').eq('id', user.id).single(),
    admin.from('subscribers').select('*').eq('user_id', user.id).maybeSingle(),
  ])
  const access = getUserAccess(profile as any, subscriber as any)

  const { picks, stake } = await req.json()

  if (!picks || picks.length < 1) {
    return NextResponse.json({ error: 'Se necesita al menos 1 pick' }, { status: 400 })
  }

  // Validate stake
  const stakeNum = parseFloat(stake)
  if (isNaN(stakeNum) || stakeNum < 1) {
    return NextResponse.json({ error: 'Apuesta mínima: 1€ virtual' }, { status: 400 })
  }

  // Get wallet
  let { data: wallet } = await admin
    .from('virtual_wallets')
    .select('*')
    .eq('user_id', user.id)
    .single()

  if (!wallet) {
    const { data: created } = await admin
      .from('virtual_wallets')
      .insert({ user_id: user.id })
      .select()
      .single()
    wallet = created
  }

  if (!wallet || wallet.balance < stakeNum) {
    return NextResponse.json({ error: 'Saldo insuficiente' }, { status: 400 })
  }

  // Check simulation limit for free users
  if (!access.limits.hasUnlimitedSimulations) {
    const today = new Date().toISOString().slice(0, 10)
    const { count } = await admin
      .from('simulations')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id)
      .gte('created_at', `${today}T00:00:00Z`)
    if ((count ?? 0) >= 3) {
      return NextResponse.json({ error: 'Límite diario alcanzado (3 simulaciones/día en plan Free). Hazte Premium para ilimitadas.' }, { status: 429 })
    }
  }

  const totalOdds = picks.reduce((acc: number, p: any) => acc * p.odds, 1)
  const potentialReturn = stakeNum * totalOdds
  const potentialProfit = potentialReturn - stakeNum

  // Create simulation
  const { data: simulation, error: simError } = await admin
    .from('simulations')
    .insert({
      user_id: user.id,
      simulation_type: picks.length === 1 ? 'simple' : 'combinada',
      status: 'pending',
      total_odds: totalOdds,
      virtual_stake: stakeNum,
      potential_virtual_return: potentialReturn,
      potential_virtual_profit: potentialProfit,
    })
    .select()
    .single()

  if (simError || !simulation) {
    return NextResponse.json({ error: 'Error creando simulación' }, { status: 500 })
  }

  // Insert picks
  await admin.from('simulation_picks').insert(
    picks.map((p: any) => ({
      simulation_id: simulation.id,
      sport_key: p.sport_key,
      sport_title: p.sport_title,
      league_name: p.league,
      event_name: p.event_name,
      commence_time: p.commence_time,
      market: p.market,
      selection: p.selection,
      odds: p.odds,
      bookmaker: p.bookmaker ?? '',
    }))
  )

  // Deduct from wallet
  await admin
    .from('virtual_wallets')
    .update({
      balance: wallet.balance - stakeNum,
      total_simulated_staked: wallet.total_simulated_staked + stakeNum,
    })
    .eq('user_id', user.id)

  return NextResponse.json(simulation, { status: 201 })
}
