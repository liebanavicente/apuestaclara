import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const admin = createAdminClient()
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

  return NextResponse.json(wallet)
}

export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { action } = await req.json()
  if (action !== 'reset') return NextResponse.json({ error: 'Unknown action' }, { status: 400 })

  const admin = createAdminClient()
  const { data: wallet } = await admin
    .from('virtual_wallets')
    .upsert({
      user_id: user.id,
      balance: 1000,
      starting_balance: 1000,
      total_simulated_staked: 0,
      total_simulated_profit: 0,
      last_reset_at: new Date().toISOString(),
    }, { onConflict: 'user_id' })
    .select()
    .single()

  return NextResponse.json(wallet)
}
