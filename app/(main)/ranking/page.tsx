import { getLeaderboard, getPicks, type LeaderboardPlayer } from '@/lib/services/club.service'
import { getActiveFriend } from '@/lib/session'
import Link from 'next/link'

export const metadata = { title: 'Ranking — GañanesBets 🏆' }
export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function RankingPage() {
  const [players, allPicks, activeFriend] = await Promise.all([
    getLeaderboard(),
    getPicks(),
    getActiveFriend(),
  ])

  const picksByPlayer = new Map<string, typeof allPicks>()
  for (const pick of allPicks) {
    if (!picksByPlayer.has(pick.friendId)) picksByPlayer.set(pick.friendId, [])
    picksByPlayer.get(pick.friendId)!.push(pick)
  }

  const leader = players[0]
  const leaderPoints = leader ? leader.totalPoints || 1 : 1
  const totalParticipants = players.length
  const totalResolved = players.reduce((s, p) => s + p.totalResolved, 0)
  const totalPending = players.reduce((s, p) => s + p.totalPending, 0)

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-8">

        {/* Page title */}
        <div className="mb-6 anim-fade-in">
          <h1 className="text-3xl font-black text-white tracking-tight">Ranking Gañanes 🏆</h1>
          <p className="text-white/35 text-sm mt-1">acierto = cuota en puntos · fallo = 0 pts · el último invita a birras</p>
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
                  <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl mb-3"
                    style={{ background:'rgba(234,179,8,0.10)', border:'1px solid rgba(234,179,8,0.25)' }}>
                    {leader.avatarEmoji || '🐟'}
                  </div>
                  <p className="text-white font-black text-xl leading-tight">{leader.name}</p>
                  <p className="text-white/40 text-sm mt-0.5">{leader.totalWon}/{leader.totalResolved} aciertos · {leader.winRate}%</p>
                  <div className="mt-4 p-4 rounded-2xl" style={{ background:'rgba(234,179,8,0.07)', border:'1px solid rgba(234,179,8,0.15)' }}>
                    <p className="text-white/35 text-xs mb-1">Puntos acumulados</p>
                    <p className="text-yellow-400 font-black text-4xl">{leader.totalPoints.toFixed(2)}</p>
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
                { label: 'Gañanes', value: totalParticipants },
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
                  <div className="w-10 h-10 rounded-full flex items-center justify-center text-xl mx-auto mb-2"
                    style={{ background:'rgba(255,255,255,0.10)', border:'1px solid rgba(255,255,255,0.15)' }}>
                    {players[1].avatarEmoji}
                  </div>
                  <p className="text-xs font-bold text-white/60 truncate">{players[1].name}</p>
                  <p className="font-black text-white text-lg mt-0.5">{players[1].totalPoints.toFixed(2)}</p>
                  <p className="text-xs text-white/30">{players[1].totalWon}/{players[1].totalResolved} ✓</p>
                </div>

                {/* 1st */}
                <div className="rounded-[24px] p-4 text-center relative overflow-hidden anim-slide-up"
                  style={{ background:'rgba(255,255,255,0.08)', border:'1px solid rgba(234,179,8,0.30)', backdropFilter:'blur(12px)', boxShadow:'0 8px 40px rgba(234,179,8,0.18), 0 2px 8px rgba(0,0,0,0.4)' }}>
                  <div className="absolute top-0 left-0 right-0 h-[2px]"
                    style={{ background:'linear-gradient(90deg,transparent,#EAB308,transparent)' }} />
                  <div className="text-2xl mb-2">🥇</div>
                  <div className="w-11 h-11 rounded-full flex items-center justify-center text-2xl mx-auto mb-2"
                    style={{ background:'rgba(234,179,8,0.12)', border:'1px solid rgba(234,179,8,0.30)' }}>
                    {players[0].avatarEmoji}
                  </div>
                  <p className="text-xs font-bold text-white/70 truncate">{players[0].name}</p>
                  <p className="font-black text-yellow-400 text-xl mt-0.5">{players[0].totalPoints.toFixed(2)}</p>
                  <p className="text-xs text-white/30">{players[0].totalWon}/{players[0].totalResolved} ✓</p>
                </div>

                {/* 3rd */}
                <div className="rounded-[24px] p-4 text-center mt-10 anim-slide-up"
                  style={{ background:'rgba(245,158,11,0.07)', border:'1px solid rgba(245,158,11,0.20)', backdropFilter:'blur(12px)', animationDelay:'100ms' }}>
                  <div className="text-2xl mb-2">🥉</div>
                  <div className="w-10 h-10 rounded-full flex items-center justify-center text-xl mx-auto mb-2"
                    style={{ background:'rgba(245,158,11,0.12)', border:'1px solid rgba(245,158,11,0.25)' }}>
                    {players[2].avatarEmoji}
                  </div>
                  <p className="text-xs font-bold text-amber-400/80 truncate">{players[2].name}</p>
                  <p className="font-black text-amber-400 text-lg mt-0.5">{players[2].totalPoints.toFixed(2)}</p>
                  <p className="text-xs text-amber-400/40">{players[2].totalWon}/{players[2].totalResolved} ✓</p>
                </div>
              </div>
            )}

            {/* Full table */}
            <div className="space-y-2">
              {players.length === 0 && (
                <div className="text-center py-16 text-white/30 rounded-3xl"
                  style={{ background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.07)' }}>
                  <p className="text-4xl mb-3">🐟</p>
                  <p className="font-bold text-white text-base">Aún no hay amigos en el ranking</p>
                  <p className="text-sm text-white/40 mt-1">Elige tu nombre en el menú o añade amigos para empezar a jugar</p>
                  <Link href="/dashboard" className="text-yellow-400 font-black text-sm mt-4 inline-block hover:underline">
                    Ir a Partidos →
                  </Link>
                </div>
              )}

              {players.map((p, i) => {
                const isMe = activeFriend && p.id === activeFriend.id
                const isLast = players.length > 1 && i === players.length - 1
                const barPct = leaderPoints > 0 ? Math.round((p.totalPoints / leaderPoints) * 100) : 0
                const playerPicks = picksByPlayer.get(p.id) ?? []

                return (
                  <details key={p.id}
                    className="group rounded-[20px] overflow-hidden transition-all anim-slide-up"
                    style={{
                      animationDelay: `${i * 40}ms`,
                      background: isMe ? 'rgba(234,179,8,0.07)' : 'rgba(255,255,255,0.05)',
                      border: isMe
                        ? '1px solid rgba(234,179,8,0.30)'
                        : isLast
                        ? '1px solid rgba(239,68,68,0.30)'
                        : '1px solid rgba(255,255,255,0.08)',
                      backdropFilter: 'blur(12px)',
                    }}>
                    <summary className="flex items-center gap-3 p-4 cursor-pointer list-none select-none hover:bg-white/[0.03] transition-colors">
                      {/* Position */}
                      <span className={`w-7 text-center font-black text-sm shrink-0 ${
                        i === 0 ? 'text-yellow-400' :
                        i === 1 ? 'text-white/70' :
                        i === 2 ? 'text-amber-400' :
                        isLast ? 'text-red-400' : 'text-white/25'
                      }`}>
                        #{i + 1}
                      </span>

                      {/* Avatar */}
                      <div className="w-10 h-10 rounded-2xl flex items-center justify-center text-xl shrink-0"
                        style={{
                          background: isMe ? 'rgba(234,179,8,0.12)' : 'rgba(255,255,255,0.08)',
                          border: isMe ? '1px solid rgba(234,179,8,0.25)' : '1px solid rgba(255,255,255,0.10)',
                        }}>
                        {p.avatarEmoji || '🐟'}
                      </div>

                      {/* Name & stats */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className={`font-bold text-sm truncate ${isMe ? 'text-yellow-400' : 'text-white'}`}>
                            {p.name}
                          </p>
                          {isMe && (
                            <span className="text-[10px] font-black px-1.5 py-0.5 rounded-full bg-yellow-400/20 text-yellow-400 shrink-0">
                              TÚ
                            </span>
                          )}
                          {isLast && (
                            <span className="text-[10px] font-black px-1.5 py-0.5 rounded-full bg-red-500/20 text-red-400 shrink-0 flex items-center gap-1">
                              🍺 Paga birras
                            </span>
                          )}
                        </div>

                        {/* Progress bar */}
                        <div className="flex items-center gap-2 mt-1.5">
                          <div className="flex-1 h-1.5 rounded-full overflow-hidden bg-white/10">
                            <div className="h-full rounded-full transition-all duration-500"
                              style={{
                                width: `${barPct}%`,
                                background: i === 0 ? 'linear-gradient(90deg,#EAB308,#F59E0B)' : isLast ? '#EF4444' : 'rgba(255,255,255,0.4)',
                              }} />
                          </div>
                          <span className="text-[11px] text-white/35 shrink-0">
                            {p.totalWon}/{p.totalResolved} · {p.winRate}%
                          </span>
                        </div>
                      </div>

                      {/* Points */}
                      <div className="text-right shrink-0">
                        <p className={`font-black text-lg ${i === 0 ? 'text-yellow-400' : 'text-white'}`}>
                          {p.totalPoints.toFixed(2)}
                        </p>
                        <p className="text-[10px] text-white/30">pts</p>
                      </div>

                      {/* Arrow */}
                      <span className="text-white/20 text-xs ml-1 group-open:rotate-180 transition-transform">▾</span>
                    </summary>

                    {/* Expandable picks history */}
                    <div className="px-5 pb-4 pt-2 border-t border-white/[0.06] text-xs text-white/60 space-y-2">
                      <p className="font-bold text-[10px] text-white/30 uppercase tracking-widest">Últimos picks</p>
                      {playerPicks.length === 0 ? (
                        <p className="text-white/30 text-xs">Sin pronósticos aún</p>
                      ) : (
                        <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
                          {playerPicks.slice(0, 10).map(pk => (
                            <div key={pk.id} className="flex items-center justify-between text-xs py-1 px-2.5 rounded-lg bg-white/[0.03]">
                              <span className="text-white truncate max-w-[200px]">{pk.description}</span>
                              <div className="flex items-center gap-2 shrink-0">
                                <span className="text-white/40">{pk.selection}</span>
                                <span className={`font-bold ${
                                  pk.status === 'won' ? 'text-green-400' :
                                  pk.status === 'lost' ? 'text-red-400' : 'text-yellow-400'
                                }`}>
                                  {pk.status === 'won' ? `+${pk.points.toFixed(2)} pts` :
                                   pk.status === 'lost' ? '0 pts' : `@${pk.odds.toFixed(2)}`}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
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
