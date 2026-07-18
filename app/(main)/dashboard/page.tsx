import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { getMissingSupabaseAdminConfig, hasSupabaseAdminConfig } from '@/lib/supabase/config'
import { getMultipleSportsEvents, FEATURED_SPORTS } from '@/lib/services/odds.service'
import { redirect } from 'next/navigation'
import { DashboardClient } from './DashboardClient'

export const metadata = { title: 'Gañanesbets — Partidos' }
export const revalidate = 0

export default async function DashboardPage() {
  if (!hasSupabaseAdminConfig()) {
    const missing = getMissingSupabaseAdminConfig().join(', ')
    return (
      <main className="mx-auto max-w-3xl px-4 py-12">
        <p className="mb-2 text-xs font-bold uppercase text-neon">Partidos</p>
        <h1 className="font-display text-4xl text-white">Conecta Supabase para competir</h1>
        <p className="mt-3 text-sm text-texto-secundario">
          Falta configuración de servidor: {missing}. Al añadirla, esta página cargará partidos,
          tus picks y los puntos del ranking.
        </p>
      </main>
    )
  }

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login?redirect=/dashboard')

  const admin = createAdminClient()
  const sportKeys = FEATURED_SPORTS.map(s => s.key)

  const [events, { data: myPicks }] = await Promise.all([
    getMultipleSportsEvents(sportKeys),
    admin.from('picks').select('id,description,selection,odds,status,points').eq('user_id', user.id),
  ])

  // Show all future matches (no date cap — allow anticipating World Cup picks)
  const now = Date.now()
  const upcoming = events
    .filter(e => new Date(e.commence_time).getTime() >= now - 3600_000)
    .sort((a, b) => new Date(a.commence_time).getTime() - new Date(b.commence_time).getTime())

  const totalPoints = (myPicks ?? []).reduce((sum: number, p: any) => sum + (p.points ?? 0), 0)

  // Picks pendientes cuyo partido ya no está en la API (en juego o recién acabado)
  const eventNames = new Set(upcoming.map(e => e.event_name))
  const inProgressPicks = (myPicks ?? []).filter((p: any) =>
    p.status === 'pending' && !eventNames.has(p.description)
  )

  return (
    <DashboardClient
      events={upcoming}
      sports={FEATURED_SPORTS}
      totalPoints={totalPoints}
      myPicks={myPicks ?? []}
      inProgressPicks={inProgressPicks}
    />
  )
}
