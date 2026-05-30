import { createAdminClient } from '@/lib/supabase/admin'
import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'

export const metadata = { title: 'Ranking — GañanesBets' }
export const revalidate = 60

export default async function RankingPage() {
  const admin = createAdminClient()
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: rows } = await admin
    .from('leaderboard')
    .select('*')
    .order('total_points', { ascending: false })

  const players = rows ?? []
  const totalPicks = players.reduce((s: number, p: any) => s + (p.total_resolved ?? 0), 0)
  const totalPending = players.reduce((s: number, p: any) => s + (p.total_pending ?? 0), 0)

  return (
    <main className="max-w-2xl mx-auto px-4 py-10">
      {/* Header */}
      <div className="flex items-center gap-3 mb-2">
        <span className="text-3xl">🏆</span>
        <div>
          <h1 className="text-2xl font-black text-white">Ranking Gañanes</h1>
          <p className="text-slate-400 text-sm">acierto = cuota en puntos · fallo = 0 pts</p>
        </div>
      </div>
      <div className="flex gap-4 text-xs text-slate-600 mb-8 pl-1">
        <span>{players.length} participantes</span>
        <span>{totalPicks} picks resueltos</span>
        <span>{totalPending} pendientes</span>
      </div>

      {/* Podium top 3 */}
      {players.length >= 3 && (
        <div className="grid grid-cols-3 gap-3 mb-8">
          {[players[1], players[0], players[2]].map((p: any, podiumIdx) => {
            const rank = podiumIdx === 0 ? 2 : podiumIdx === 1 ? 1 : 3
            const isMe = user && p.user_id === user.id
            return (
              <div key={p.user_id} className={`rounded-xl border text-center p-3 ${
                rank === 1 ? 'border-yellow-500/40 bg-yellow-500/5 col-start-2' :
                rank === 2 ? 'border-slate-600/40 bg-slate-900/50 col-start-1 row-start-1 self-end' :
                'border-amber-700/30 bg-slate-900/50 self-end'
              }`} style={rank === 1 ? {} : { marginTop: rank === 2 ? '1rem' : '2rem' }}>
                <div className="text-2xl mb-1">{rank === 1 ? '🥇' : rank === 2 ? '🥈' : '🥉'}</div>
                <div className={`w-8 h-8 rounded-full mx-auto mb-1 flex items-center justify-center text-sm font-black ${rank === 1 ? 'bg-yellow-500 text-slate-950' : 'bg-slate-700 text-white'}`}>
                  {p.username?.charAt(0).toUpperCase() ?? '?'}
                </div>
                <p className={`text-xs font-bold truncate ${isMe ? 'text-yellow-400' : 'text-white'}`}>{p.username ?? 'Anónimo'}{isMe ? ' 👈' : ''}</p>
                <p className={`font-black mt-0.5 ${rank === 1 ? 'text-yellow-400 text-lg' : 'text-white text-base'}`}>{(+p.total_points || 0).toFixed(2)}</p>
                <p className="text-xs text-slate-500">{p.total_won ?? 0}/{p.total_resolved ?? 0} ✓</p>
              </div>
            )
          })}
        </div>
      )}

      {/* Full table */}
      <div className="space-y-2">
        {players.length === 0 && (
          <div className="text-center py-16 text-slate-500">
            <p className="text-4xl mb-3">🐟</p>
            <p>Nadie ha resuelto picks todavía</p>
            <Link href="/dashboard" className="text-yellow-400 text-sm mt-2 block">Hacer picks →</Link>
          </div>
        )}
        {players.map((p: any, i: number) => {
          const isMe = user && p.user_id === user.id
          return (
            <div key={p.user_id} className={`flex items-center gap-3 rounded-xl border px-4 py-3 ${isMe ? 'border-yellow-500/40 bg-yellow-500/5' : 'border-slate-800 bg-slate-900/40'}`}>
              <span className={`text-sm font-black w-6 text-center ${i === 0 ? 'text-yellow-400' : i === 1 ? 'text-slate-300' : i === 2 ? 'text-amber-600' : 'text-slate-600'}`}>
                {i + 1}
              </span>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-black shrink-0 ${isMe ? 'bg-yellow-500 text-slate-950' : 'bg-slate-700 text-white'}`}>
                {p.username?.charAt(0).toUpperCase() ?? '?'}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-white text-sm truncate">{p.username ?? 'Anónimo'}</span>
                  {isMe && <span className="text-xs text-yellow-400">(tú)</span>}
                </div>
                <div className="text-xs text-slate-500 mt-0.5">
                  {p.total_won ?? 0}/{p.total_resolved ?? 0} aciertos
                  {p.win_rate != null ? ` · ${p.win_rate}%` : ''}
                  {p.total_pending > 0 ? ` · ${p.total_pending} pendientes` : ''}
                </div>
              </div>
              <div className="text-right shrink-0">
                <div className="font-black text-white">{(+p.total_points || 0).toFixed(2)}</div>
                <div className="text-xs text-slate-600">pts</div>
              </div>
            </div>
          )
        })}
      </div>

      <div className="mt-8 text-center">
        <Link href="/dashboard" className="inline-flex items-center gap-2 bg-yellow-500 hover:bg-yellow-400 text-slate-950 font-black px-5 py-2.5 rounded-lg transition-colors text-sm">
          ⚽ Hacer picks
        </Link>
      </div>
    </main>
  )
}
