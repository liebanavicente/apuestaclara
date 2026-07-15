import { createAdminClient } from '@/lib/supabase/admin'
import { createClient } from '@/lib/supabase/server'
import { RankingList } from '@/components/ranking/RankingList'
import type { LeaderboardRow } from '@/types/ranking'
import type { RawPick } from '@/lib/ranking-stats'

export const metadata = { title: 'Ranking — GañanesBets' }
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
    <main className="max-w-2xl mx-auto px-4 py-10">
      {/* Header */}
      <div className="flex items-center gap-3 mb-2">
        <span className="text-3xl">🏆</span>
        <div>
          <h1 className="text-2xl font-black text-white">Ranking Gañanes</h1>
          <p className="text-texto-secundario text-sm">acierto = cuota en puntos · fallo = 0 pts</p>
        </div>
      </div>
      <div className="flex gap-4 text-xs text-texto-terciario mb-6 pl-1">
        <span>{players.length} participantes</span>
        <span>{totalPicks} picks resueltos</span>
        <span>{totalPending} pendientes</span>
      </div>

      <RankingList players={players} picksByUser={picksByUser} currentUserId={user?.id ?? null} />
    </main>
  )
}
