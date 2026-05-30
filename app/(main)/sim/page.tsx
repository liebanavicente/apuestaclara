import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { getMultipleSportsEvents, FEATURED_SPORTS } from '@/lib/services/odds.service'
import { redirect } from 'next/navigation'
import { SimClient } from './SimClient'

export const metadata = { title: 'Simulador — GañanesBets' }
export const revalidate = 0

export default async function SimPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login?redirect=/sim')

  const admin = createAdminClient()
  const sportKeys = FEATURED_SPORTS.map(s => s.key)

  const [events, { data: myPicks }, { data: leaderboard }] = await Promise.all([
    getMultipleSportsEvents(sportKeys),
    admin.from('picks').select('id,description,selection,odds,status,profit,stake,points').eq('user_id', user.id).eq('is_sim', true),
    admin.from('sim_leaderboard').select('*').order('net_profit', { ascending: false }),
  ])

  const now = Date.now()
  const upcoming = events
    .filter(e => new Date(e.commence_time).getTime() >= now - 3600_000)
    .sort((a, b) => new Date(a.commence_time).getTime() - new Date(b.commence_time).getTime())

  const myNetProfit = (myPicks ?? []).reduce((s: number, p: any) => s + (p.profit ?? 0), 0)

  const eventNames = new Set(upcoming.map(e => e.event_name))
  const inProgressPicks = (myPicks ?? []).filter((p: any) => p.status === 'pending' && !eventNames.has(p.description))

  return (
    <SimClient
      events={upcoming}
      sports={FEATURED_SPORTS}
      myPicks={myPicks ?? []}
      inProgressPicks={inProgressPicks}
      leaderboard={leaderboard ?? []}
      myNetProfit={myNetProfit}
    />
  )
}
