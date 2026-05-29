import { createAdminClient } from '@/lib/supabase/admin'
import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Target } from 'lucide-react'

export const metadata = { title: 'Ranking — GañanesBets' }
export const revalidate = 60

export default async function RankingPage() {
  const admin = createAdminClient()
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // Try leaderboard view first, fall back to bankrolls
  const { data: rows } = await admin
    .from('leaderboard')
    .select('*')
    .order('total_points', { ascending: false })

  const players = rows ?? []

  return (
    <main className="max-w-2xl mx-auto px-4 py-10">
      <div className="flex items-center gap-3 mb-8">
        <span className="text-3xl">🏆</span>
        <div>
          <h1 className="text-2xl font-black text-white">Ranking Gañanes</h1>
          <p className="text-slate-400 text-sm">Puntos acumulados — acierto = cuota en pts</p>
        </div>
      </div>

      <div className="space-y-3">
        {players.length === 0 && (
          <div className="text-center py-16 text-slate-500">
            <p className="text-4xl mb-3">🐟</p>
            <p>Nadie ha resuelto picks todavía</p>
            <Link href="/dashboard" className="text-yellow-400 text-sm mt-2 block">Ir al dashboard →</Link>
          </div>
        )}
        {players.map((p: any, i: number) => {
          const isMe = user && p.user_id === user.id
          return (
            <div key={p.user_id} className={`flex items-center gap-4 rounded-xl border px-5 py-4 ${isMe ? 'border-yellow-500/50 bg-yellow-500/5' : 'border-slate-800 bg-slate-900/50'}`}>
              <div className={`text-2xl font-black w-8 text-center ${i === 0 ? 'text-yellow-400' : i === 1 ? 'text-slate-300' : i === 2 ? 'text-amber-600' : 'text-slate-600'}`}>
                {i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `${i + 1}`}
              </div>

              <div className="w-9 h-9 rounded-full bg-yellow-500 flex items-center justify-center text-sm font-black text-slate-950 shrink-0">
                {p.username?.charAt(0).toUpperCase() ?? '?'}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-white truncate">{p.username ?? 'Anónimo'}</span>
                  {isMe && <span className="text-xs text-yellow-400 font-medium">(tú)</span>}
                </div>
                <div className="flex items-center gap-3 text-xs text-slate-500 mt-0.5">
                  <span className="flex items-center gap-1">
                    <Target className="h-3 w-3" />
                    {p.total_won ?? 0}/{p.total_resolved ?? 0} aciertos
                    {p.win_rate != null && <span className="text-slate-600">({p.win_rate}%)</span>}
                  </span>
                  {p.total_pending > 0 && <span className="text-slate-600">{p.total_pending} pendientes</span>}
                </div>
              </div>

              <div className="text-right shrink-0">
                <div className="font-black text-white text-xl">{(+p.total_points || 0).toFixed(2)}</div>
                <div className="text-xs text-slate-500">puntos</div>
              </div>
            </div>
          )
        })}
      </div>

      <div className="mt-8 flex gap-3 justify-center">
        <Link href="/dashboard" className="inline-flex items-center gap-2 bg-yellow-500 hover:bg-yellow-400 text-slate-950 font-black px-5 py-2.5 rounded-lg transition-colors text-sm">
          ⚽ Hacer picks
        </Link>
        <Link href="/mis-picks" className="inline-flex items-center gap-2 border border-slate-700 hover:border-slate-500 text-white font-semibold px-5 py-2.5 rounded-lg transition-colors text-sm">
          🎯 Mis picks
        </Link>
      </div>
    </main>
  )
}
