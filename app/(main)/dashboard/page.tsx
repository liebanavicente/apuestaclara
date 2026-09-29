import { getMultipleSportsEvents, FEATURED_SPORTS } from '@/lib/services/odds.service'
import { getActiveFriend } from '@/lib/session'
import { getPicks } from '@/lib/services/club.service'
import { DashboardClient } from './DashboardClient'

export const metadata = { title: 'GañanesBets 🐟 · Partidos' }
export const revalidate = 0

export default async function DashboardPage() {
  const activeFriend = await getActiveFriend()
  const sportKeys = FEATURED_SPORTS.map(s => s.key)

  const [events, myPicks] = await Promise.all([
    getMultipleSportsEvents(sportKeys),
    activeFriend ? getPicks(activeFriend.id) : Promise.resolve([]),
  ])

  // Show all future matches
  const now = Date.now()
  const upcoming = events
    .filter(e => new Date(e.commence_time).getTime() >= now - 3600_000)
    .sort((a, b) => new Date(a.commence_time).getTime() - new Date(b.commence_time).getTime())

  const totalPoints = myPicks.reduce((sum, p) => sum + (p.points ?? 0), 0)

  // Picks pendientes cuyo partido ya no está en la API (en juego o recién acabado)
  const eventNames = new Set(upcoming.map(e => e.event_name))
  const inProgressPicks = myPicks.filter(p =>
    p.status === 'pending' && !eventNames.has(p.description)
  )

  return (
    <DashboardClient
      events={upcoming}
      totalPoints={totalPoints}
      myPicks={myPicks}
      inProgressPicks={inProgressPicks}
      activeFriend={activeFriend}
    />
  )
}
