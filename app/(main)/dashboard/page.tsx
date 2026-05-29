import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { getMultipleSportsEvents, FEATURED_SPORTS } from '@/lib/services/odds.service'
import { redirect } from 'next/navigation'
import { DashboardClient } from './DashboardClient'

export const metadata = { title: 'Dashboard — GañanesBets 🐟' }
export const revalidate = 300

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login?redirect=/dashboard')

  const admin = createAdminClient()
  const sportKeys = FEATURED_SPORTS.slice(0, 5).map(s => s.key)

  const [events, { data: myPicks }] = await Promise.all([
    getMultipleSportsEvents(sportKeys),
    admin.from('picks').select('id,description,selection,odds,status,points').eq('user_id', user.id),
  ])

  // Only show events in the next 7 days
  const now = Date.now()
  const week = now + 7 * 24 * 60 * 60 * 1000
  const upcoming = events.filter(e => {
    const t = new Date(e.commence_time).getTime()
    return t >= now - 3600_000 && t <= week
  })

  const totalPoints = (myPicks ?? []).reduce((sum: number, p: any) => sum + (p.points ?? 0), 0)

  return (
    <DashboardClient
      events={upcoming}
      totalPoints={totalPoints}
      myPicks={myPicks ?? []}
    />
  )
}
