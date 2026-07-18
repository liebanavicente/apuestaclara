import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { hasSupabaseAdminConfig } from '@/lib/supabase/config'
import { supabaseAdminUnavailableResponse } from '@/lib/supabase/unavailable'

// PATCH /api/simulator/simulations/[id] — resolve a simulation manually
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!hasSupabaseAdminConfig()) return supabaseAdminUnavailableResponse()

  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { status } = await req.json() // 'won' | 'lost' | 'void'
  if (!['won', 'lost', 'void'].includes(status)) {
    return NextResponse.json({ error: 'Estado inválido' }, { status: 400 })
  }

  const admin = createAdminClient()

  // Verify ownership
  const { data: simulation } = await admin
    .from('simulations')
    .select('*')
    .eq('id', id)
    .eq('user_id', user.id)
    .single()

  if (!simulation) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  if (simulation.status !== 'pending') {
    return NextResponse.json({ error: 'Ya resuelta' }, { status: 400 })
  }

  // Update simulation
  await admin
    .from('simulations')
    .update({ status, resolved_at: new Date().toISOString() })
    .eq('id', id)

  // Update all picks to same status
  await admin
    .from('simulation_picks')
    .update({ status, resolved_at: new Date().toISOString() })
    .eq('simulation_id', id)

  // Update wallet
  const { data: wallet } = await admin
    .from('virtual_wallets')
    .select('*')
    .eq('user_id', user.id)
    .single()

  if (wallet) {
    let balanceDelta = 0
    let profitDelta = 0

    if (status === 'won') {
      balanceDelta = simulation.potential_virtual_return
      profitDelta = simulation.potential_virtual_profit
    } else if (status === 'void') {
      // Refund stake
      balanceDelta = simulation.virtual_stake
    }
    // 'lost': no refund, profit is negative
    if (status === 'lost') {
      profitDelta = -simulation.virtual_stake
    }

    await admin
      .from('virtual_wallets')
      .update({
        balance: wallet.balance + balanceDelta,
        total_simulated_profit: wallet.total_simulated_profit + profitDelta,
      })
      .eq('user_id', user.id)
  }

  return NextResponse.json({ ok: true })
}
