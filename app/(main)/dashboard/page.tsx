import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { getMultipleSportsEvents, FEATURED_SPORTS } from '@/lib/services/odds.service'
import { redirect } from 'next/navigation'
import { DashboardClient } from './DashboardClient'

export const metadata = { title: 'GañanesBets 🐟' }
export const revalidate = 300

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login?redirect=/dashboard')

  const admin = createAdminClient()
  // Fetch all featured sports
  const sportKeys = FEATURED_SPORTS.map(s => s.key)

  const [events, { data: myPicks }] = await Promise.all([
    getMultipleSportsEvents(sportKeys),
    admin.from('picks').select('id,description,selection,odds,status,points').eq('user_id', user.id),
  ])

  // Next 14 days
  const now = Date.now()
  const upcoming = events.filter(e => {
    const t = new Date(e.commence_time).getTime()
    return t >= now - 3600_000 && t <= now + 14 * 24 * 60 * 60 * 1000
  })

  const totalPoints = (myPicks ?? []).reduce((sum: number, p: any) => sum + (p.points ?? 0), 0)

  return (
    <DashboardClient
      events={upcoming}
      sports={FEATURED_SPORTS}
      totalPoints={totalPoints}
      myPicks={myPicks ?? []}
    />
  )
}
