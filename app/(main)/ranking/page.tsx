import { createAdminClient } from '@/lib/supabase/admin'
import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Trophy, TrendingUp, TrendingDown, Target } from 'lucide-react'

export const metadata = { title: 'Ranking — GañanesBets' }
export const revalidate = 60

function fmt(n: number) {
  return new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(n)
}

export default async function RankingPage() {
  const admin = createAdminClient()
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: rows } = await admin
    .from('bankrolls')
    .select('*')
    .order('bankroll', { ascending: false })

  const players = rows ?? []

  return (
    <main className="max-w-2xl mx-auto px-4 py-10">
      <div className="flex items-center gap-3 mb-8">
        <Trophy className="h-7 w-7 text-yellow-400" />
        <div>
          <h1 className="text-2xl font-bold text-white">Ranking Gañanes</h1>
          <p className="text-slate-400 text-sm">Bankroll ficticio — empieza con €1.000</p>
        </div>
      </div>

      <div className="space-y-3">
        {players.length === 0 && (
          <p className="text-slate-500 text-center py-12">Nadie ha publicado picks todavía. ¡Sé el primero!</p>
        )}
        {players.map((p: any, i: number) => {
          const profit = p.bankroll - 1000
          const isMe = user && p.user_id === user.id
          return (
            <div
              key={p.user_id}
              className={`flex items-center gap-4 rounded-xl border px-5 py-4 ${
                isMe ? 'border-teal-500/50 bg-teal-500/5' : 'border-slate-800 bg-slate-900/50'
              }`}
            >
              {/* Position */}
              <div className={`text-2xl font-black w-8 text-center ${
                i === 0 ? 'text-yellow-400' : i === 1 ? 'text-slate-300' : i === 2 ? 'text-amber-600' : 'text-slate-600'
              }`}>
                {i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `${i + 1}`}
              </div>

              {/* Avatar */}
              <div className="w-9 h-9 rounded-full bg-teal-600 flex items-center justify-center text-sm font-bold text-white shrink-0">
                {p.username?.charAt(0).toUpperCase() ?? '?'}
              </div>

              {/* Name + stats */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-white truncate">{p.username ?? 'Anónimo'}</span>
                  {isMe && <span className="text-xs text-teal-400 font-medium">(tú)</span>}
                </div>
                <div className="flex items-center gap-3 text-xs text-slate-500 mt-0.5">
                  <span className="flex items-center gap-1">
                    <Target className="h-3 w-3" />
                    {p.total_won ?? 0}/{p.total_resolved ?? 0} aciertos
                    {p.win_rate != null && <span className="text-slate-600">({p.win_rate}%)</span>}
                  </span>
                  {p.total_pending > 0 && (
                    <span className="text-slate-600">{p.total_pending} pendientes</span>
                  )}
                </div>
              </div>

              {/* Bankroll */}
              <div className="text-right shrink-0">
                <div className="font-bold text-white text-lg">{fmt(p.bankroll)}</div>
                <div className={`text-xs font-medium flex items-center justify-end gap-0.5 ${profit >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {profit >= 0
                    ? <TrendingUp className="h-3 w-3" />
                    : <TrendingDown className="h-3 w-3" />}
                  {profit >= 0 ? '+' : ''}{fmt(profit)}
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <div className="mt-8 text-center">
        <Link
          href="/mis-picks"
          className="inline-flex items-center gap-2 bg-teal-600 hover:bg-teal-500 text-white font-semibold px-6 py-2.5 rounded-lg transition-colors"
        >
          Mis picks
        </Link>
      </div>
    </main>
  )
}
