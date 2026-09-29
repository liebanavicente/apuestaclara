import { createAdminClient } from '@/lib/supabase/admin'
import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'

export const metadata = { title: 'Ranking — GañanesBets' }
export const revalidate = 60

function currentWinStreak(picks: { status: string }[]): number {
  let streak = 0
  for (const pick of picks) {
    if (pick.status === 'won') streak++
    else if (pick.status === 'lost') break
  }
  return streak
}

export default async function RankingPage() {
  const admin = createAdminClient()
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const [{ data: rows }, { data: resolvedPicks }] = await Promise.all([
    admin.from('leaderboard').select('*').order('total_points', { ascending: false }),
    admin.from('picks').select('user_id, status').in('status', ['won', 'lost']).order('created_at', { ascending: false }),
  ])

  const players = rows ?? []
  const picksByUser = new Map<string, { status: string }[]>()
  for (const pick of resolvedPicks ?? []) {
    if (!picksByUser.has(pick.user_id)) picksByUser.set(pick.user_id, [])
    picksByUser.get(pick.user_id)!.push(pick)
  }

  const leader = players[0]
  const leaderPoints = leader ? (+leader.total_points || 0) : 1
  const totalParticipants = players.length
  const totalResolved = players.reduce((s: number, p: any) => s + (p.total_resolved ?? 0), 0)
  const totalPending = players.reduce((s: number, p: any) => s + (p.total_pending ?? 0), 0)

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-8">

        {/* Page title */}
        <div className="mb-6 anim-fade-in">
          <h1 className="text-3xl font-black text-white tracking-tight">Ranking Gañanes 🏆</h1>
          <p className="text-white/35 text-sm mt-1">acierto = cuota en puntos · fallo = 0 pts · el último invita</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-6">

          {/* LEFT: Leader aside */}
          <aside className="rounded-[28px] p-6 flex flex-col gap-5 relative overflow-hidden anim-slide-up"
            style={{ background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.09)', backdropFilter:'blur(16px)', boxShadow:'0 24px 60px rgba(0,0,0,0.4)' }}>
            {/* Yellow top stripe */}
            <div className="absolute top-0 left-0 right-0 h-[2px]"
              style={{ background:'linear-gradient(90deg,transparent,rgba(234,179,8,0.7),transparent)' }} />
            {/* Subtle glow */}
            <div className="absolute -top-20 -left-20 w-60 h-60 rounded-full pointer-events-none"
              style={{ background:'rgba(234,179,8,0.05)', filter:'blur(60px)' }} />

            <div className="relative">
              <span className="text-[9px] font-bold text-white/25 uppercase tracking-[0.14em]">Líder actual</span>
              {leader ? (
                <div className="mt-3">
                  <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl font-black text-yellow-400 mb-3"
                    style={{ background:'rgba(234,179,8,0.10)', border:'1px solid rgba(234,179,8,0.25)' }}>
                    {leader.username?.charAt(0).toUpperCase() ?? '?'}
                  </div>
                  <p className="text-white font-black text-xl leading-tight">{leader.username ?? 'Anónimo'}</p>
                  <p className="text-white/40 text-sm mt-0.5">{leader.total_won ?? 0}/{leader.total_resolved ?? 0} aciertos · {leader.win_rate ?? 0}%</p>
                  <div className="mt-4 p-4 rounded-2xl" style={{ background:'rgba(234,179,8,0.07)', border:'1px solid rgba(234,179,8,0.15)' }}>
                    <p className="text-white/35 text-xs mb-1">Puntos acumulados</p>
                    <p className="text-yellow-400 font-black text-4xl">{(+leader.total_points || 0).toFixed(2)}</p>
                    <p className="text-white/25 text-xs mt-1">pts</p>
                  </div>
                </div>
              ) : (
                <p className="text-white/30 text-sm mt-2">Nadie ha resuelto picks todavía</p>
              )}
            </div>

            {/* Global stats */}
            <div className="relative grid grid-cols-3 gap-2 mt-auto">
              {[
                { label: 'Participantes', value: totalParticipants },
                { label: 'Resueltos', value: totalResolved },
                { label: 'Pendientes', value: totalPending },
              ].map(({ label, value }) => (
                <div key={label} className="rounded-xl p-3 text-center"
                  style={{ background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.08)' }}>
                  <p className="text-white font-black text-lg">{value}</p>
                  <p className="text-white/30 text-[10px] mt-0.5">{label}</p>
                </div>
              ))}
            </div>

            <Link href="/dashboard"
              className="relative block w-full text-center font-black py-3 rounded-2xl text-sm transition-all text-[#07080F]"
              style={{ background:'linear-gradient(135deg,#EAB308,#F59E0B)', boxShadow:'0 4px 20px rgba(234,179,8,0.30)' }}>
              ⚽ Hacer picks
            </Link>
          </aside>

          {/* RIGHT: Podium + full table */}
          <div className="space-y-5">

            {/* Podium top 3 */}
            {players.length >= 3 && (
              <div className="grid grid-cols-3 gap-3 items-end">
                {/* 2nd */}
                <div className="rounded-[24px] p-4 text-center mt-6 anim-slide-up"
                  style={{ background:'rgba(255,255,255,0.06)', border:'1px solid rgba(255,255,255,0.10)', backdropFilter:'blur(12px)', animationDelay:'50ms' }}>
                  <div className="text-2xl mb-2">🥈</div>
                  <div className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-black text-white/70 mx-auto mb-2"
                    style={{ background:'rgba(255,255,255,0.10)', border:'1px solid rgba(255,255,255,0.15)' }}>
                    {players[1].username?.charAt(0).toUpperCase() ?? '?'}
                  </div>
                  <p className="text-xs font-bold text-white/60 truncate">{players[1].username ?? 'Anónimo'}</p>
                  <p className="font-black text-white text-lg mt-0.5">{(+players[1].total_points || 0).toFixed(2)}</p>
                  <p className="text-xs text-white/30">{players[1].total_won ?? 0}/{players[1].total_resolved ?? 0} ✓</p>
                </div>

                {/* 1st */}
                <div className="rounded-[24px] p-4 text-center relative overflow-hidden anim-slide-up"
                  style={{ background:'rgba(255,255,255,0.08)', border:'1px solid rgba(234,179,8,0.30)', backdropFilter:'blur(12px)', boxShadow:'0 8px 40px rgba(234,179,8,0.18), 0 2px 8px rgba(0,0,0,0.4)' }}>
                  <div className="absolute top-0 left-0 right-0 h-[2px]"
                    style={{ background:'linear-gradient(90deg,transparent,#EAB308,transparent)' }} />
                  <div className="text-2xl mb-2">🥇</div>
                  <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-black text-yellow-400 mx-auto mb-2"
                    style={{ background:'rgba(234,179,8,0.12)', border:'1px solid rgba(234,179,8,0.30)' }}>
                    {players[0].username?.charAt(0).toUpperCase() ?? '?'}
                  </div>
                  <p className="text-xs font-bold text-white/70 truncate">{players[0].username ?? 'Anónimo'}</p>
                  <p className="font-black text-yellow-400 text-xl mt-0.5">{(+players[0].total_points || 0).toFixed(2)}</p>
                  <p className="text-xs text-white/30">{players[0].total_won ?? 0}/{players[0].total_resolved ?? 0} ✓</p>
                </div>

                {/* 3rd */}
                <div className="rounded-[24px] p-4 text-center mt-10 anim-slide-up"
                  style={{ background:'rgba(245,158,11,0.07)', border:'1px solid rgba(245,158,11,0.20)', backdropFilter:'blur(12px)', animationDelay:'100ms' }}>
                  <div className="text-2xl mb-2">🥉</div>
                  <div className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-black text-amber-400 mx-auto mb-2"
                    style={{ background:'rgba(245,158,11,0.12)', border:'1px solid rgba(245,158,11,0.25)' }}>
                    {players[2].username?.charAt(0).toUpperCase() ?? '?'}
                  </div>
                  <p className="text-xs font-bold text-amber-400/80 truncate">{players[2].username ?? 'Anónimo'}</p>
                  <p className="font-black text-amber-400 text-lg mt-0.5">{(+players[2].total_points || 0).toFixed(2)}</p>
                  <p className="text-xs text-amber-400/40">{players[2].total_won ?? 0}/{players[2].total_resolved ?? 0} ✓</p>
                </div>
              </div>
            )}

            {/* Full table — expandable */}
            <div className="space-y-2">
              {players.length === 0 && (
                <div className="text-center py-16 text-white/30">
                  <p className="text-4xl mb-3">🐟</p>
                  <p className="font-medium text-white/60">Nadie ha resuelto picks todavía</p>
                  <Link href="/dashboard" className="text-yellow-400 font-bold text-sm mt-2 block">Hacer picks →</Link>
                </div>
              )}

              {players.map((p: any, i: number) => {
                const isMe = user && p.user_id === user.id
                const pts = +p.total_points || 0
                const winRate = +(p.win_rate ?? 0)
                const streak = currentWinStreak(picksByUser.get(p.user_id) ?? [])
                const barPct = leaderPoints > 0 ? Math.round((pts / leaderPoints) * 100) : 0
                const won = p.total_won ?? 0
                const lost = (p.total_resolved ?? 0) - won
                const pending = p.total_pending ?? 0
                const total = won + lost + pending || 1

                return (
                  <details key={p.user_id}
                    className="group rounded-[20px] overflow-hidden transition-all anim-slide-up"
                    style={{
                      animationDelay: `${i * 40}ms`,
                      background: isMe ? 'rgba(234,179,8,0.07)' : 'rgba(255,255,255,0.05)',
                      border: isMe ? '1px solid rgba(234,179,8,0.25)' : '1px solid rgba(255,255,255,0.09)',
                      backdropFilter: 'blur(10px)',
                    }}>
                    <summary className="flex items-center gap-3 px-4 py-3.5 cursor-pointer select-none list-none hover:bg-white/[0.03] transition-colors">
                      {/* Rank */}
                      <span className={`text-sm font-black w-7 text-center shrink-0 ${
                        i === 0 ? 'text-yellow-400' : i === 1 ? 'text-white/50' : i === 2 ? 'text-amber-400' : 'text-white/20'
                      }`}>{i + 1}</span>

                      {/* Avatar */}
                      <div className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-black shrink-0"
                        style={isMe
                          ? { background:'rgba(234,179,8,0.12)', border:'1px solid rgba(234,179,8,0.30)', color:'#EAB308' }
                          : { background:'rgba(255,255,255,0.08)', border:'1px solid rgba(255,255,255,0.10)', color:'rgba(255,255,255,0.60)' }}>
                        {p.username?.charAt(0).toUpperCase() ?? '?'}
                      </div>

                      {/* Name + bar */}
                      <div className="flex-1 min-w-0 overflow-hidden">
                        <div className="flex items-center gap-1.5 min-w-0">
                          <span className="font-bold text-sm text-white truncate">
                            {p.username ?? 'Anónimo'}
                          </span>
                          {isMe && <span className="text-xs text-white/30 shrink-0">(tú)</span>}
                        </div>
                        <div className="flex items-center gap-2 mt-1.5">
                          <div className="flex-1 h-1 rounded-full overflow-hidden" style={{ background:'rgba(255,255,255,0.07)' }}>
                            <div className="h-full rounded-full transition-all"
                              style={{ width:`${barPct}%`, background: isMe ? '#EAB308' : 'rgba(255,255,255,0.30)' }} />
                          </div>
                          {streak >= 2 && (
                            <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full shrink-0"
                              style={{ background:'rgba(34,197,94,0.12)', color:'#4ade80', border:'1px solid rgba(34,197,94,0.20)' }}>
                              🔥{streak}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Points */}
                      <div className="text-right shrink-0">
                        <div className={`font-black ${isMe ? 'text-yellow-400' : 'text-white'}`}>{pts.toFixed(2)}</div>
                        <div className="text-[10px] text-white/30">{winRate}% acierto</div>
                      </div>

                      {/* Expand badge */}
                      <span className="text-[10px] font-bold px-2 py-1 rounded-full transition-colors shrink-0"
                        style={{ background:'rgba(255,255,255,0.07)', color:'rgba(255,255,255,0.35)', border:'1px solid rgba(255,255,255,0.09)' }}>
                        Stats
                      </span>
                    </summary>

                    {/* Expanded content */}
                    <div className="px-4 py-5" style={{ borderTop:'1px solid rgba(255,255,255,0.07)' }}>
                      <div className="grid grid-cols-1 lg:grid-cols-[200px_1fr] gap-5">

                        {/* Left: donut + forma */}
                        <div className="rounded-2xl p-5 flex flex-col items-center gap-3"
                          style={{ background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.08)' }}>
                          <div className="relative w-24 h-24">
                            <div className="w-24 h-24 rounded-full" style={{
                              background: `conic-gradient(#22c55e ${winRate * 3.6}deg, rgba(255,255,255,0.06) 0deg)`
                            }} />
                            <div className="absolute inset-3 rounded-full flex items-center justify-center"
                              style={{ background:'#0d0e18' }}>
                              <span className="text-white font-black text-sm">{winRate}%</span>
                            </div>
                          </div>
                          <p className="text-white/30 text-xs">% acierto</p>

                          <div className="flex gap-1 mt-1">
                            {(picksByUser.get(p.user_id) ?? []).slice(0, 6).reverse().map((pick, idx) => (
                              <span key={idx} className={`w-5 h-5 rounded flex items-center justify-center text-[9px] font-black ${
                                pick.status === 'won' ? 'bg-emerald-500 text-white' : 'bg-red-500/80 text-white'
                              }`}>
                                {pick.status === 'won' ? 'W' : 'L'}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Right: KPIs + distribution */}
                        <div className="space-y-4">
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                            {[
                              { label: 'Puntos', value: pts.toFixed(2), color: '#EAB308' },
                              { label: 'Racha', value: streak >= 2 ? `🔥 ${streak}` : '—', color: '#4ade80' },
                              { label: 'Ganados', value: won, color: '#4ade80' },
                              { label: 'Fallados', value: lost, color: '#f87171' },
                            ].map(({ label, value, color }) => (
                              <div key={label} className="rounded-xl p-3"
                                style={{ background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.07)' }}>
                                <div className="flex items-center gap-1.5 mb-1">
                                  <div className="w-2 h-2 rounded-full" style={{ background: color }} />
                                  <span className="text-[10px] text-white/30 font-medium">{label}</span>
                                </div>
                                <p className="font-black text-white text-lg leading-none">{value}</p>
                              </div>
                            ))}
                          </div>

                          <div>
                            <p className="text-xs text-white/25 mb-2 font-medium">Distribución de picks</p>
                            <div className="flex h-1.5 rounded-full overflow-hidden gap-0.5">
                              {won > 0 && <div className="bg-emerald-500 rounded-full" style={{ width: `${(won / total) * 100}%` }} />}
                              {lost > 0 && <div className="bg-red-400/80 rounded-full" style={{ width: `${(lost / total) * 100}%` }} />}
                              {pending > 0 && <div className="bg-amber-400/80 rounded-full" style={{ width: `${(pending / total) * 100}%` }} />}
                            </div>
                            <div className="flex gap-4 mt-2">
                              <span className="flex items-center gap-1 text-[10px] text-white/30"><span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />{won} ganados</span>
                              <span className="flex items-center gap-1 text-[10px] text-white/30"><span className="w-2 h-2 rounded-full bg-red-400 inline-block" />{lost} fallados</span>
                              <span className="flex items-center gap-1 text-[10px] text-white/30"><span className="w-2 h-2 rounded-full bg-amber-400 inline-block" />{pending} pendientes</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </details>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
