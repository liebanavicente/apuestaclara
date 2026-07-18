import { createAdminClient } from '@/lib/supabase/admin'
import { createClient } from '@/lib/supabase/server'
import { RankingList } from '@/components/ranking/RankingList'
import type { LeaderboardRow } from '@/types/ranking'
import type { RawPick } from '@/lib/ranking-stats'

export const metadata = { title: 'Ranking — ApuestaClara' }
export const revalidate = 60

export default async function RankingPage() {
  const admin = createAdminClient()
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const [{ data: rows }, { data: allPicks }] = await Promise.all([
    admin.from('leaderboard').select('*').order('total_points', { ascending: false }),
    admin.from('picks').select('user_id,status,points,resolved_at'),
  ])

  const players = (rows ?? []) as LeaderboardRow[]

  const picksByUser: Record<string, RawPick[]> = {}
  for (const p of (allPicks ?? []) as (RawPick & { user_id: string })[]) {
    const { user_id, ...rest } = p
    ;(picksByUser[user_id] ??= []).push(rest)
  }

  const totalPicks = players.reduce((s, p) => s + (p.total_resolved ?? 0), 0)
  const totalPending = players.reduce((s, p) => s + (p.total_pending ?? 0), 0)

  return (
    <main className="mx-auto max-w-4xl px-4 py-10">
      {/* Header */}
      <div className="mb-3">
        <p className="mb-2 text-xs font-bold uppercase text-neon">Leaderboard</p>
        <div>
          <h1 className="font-display text-5xl text-white">Ranking de mercado</h1>
          <p className="mt-2 text-sm text-texto-secundario">Acierto = cuota en puntos · fallo = 0 pts</p>
        </div>
      </div>
      <div className="mb-6 grid gap-2 text-xs text-texto-secundario sm:grid-cols-3">
        <span className="rounded-md border border-neon/10 bg-superficie/70 px-3 py-2">{players.length} participantes</span>
        <span className="rounded-md border border-neon/10 bg-superficie/70 px-3 py-2">{totalPicks} picks resueltos</span>
        <span className="rounded-md border border-neon/10 bg-superficie/70 px-3 py-2">{totalPending} pendientes</span>
      </div>

      <RankingList players={players} picksByUser={picksByUser} currentUserId={user?.id ?? null} />
    </main>
  )
}
