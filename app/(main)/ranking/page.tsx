import { getLeaderboard, getPicks, type LeaderboardPlayer } from '@/lib/services/club.service'
import { getActiveFriend } from '@/lib/session'
import Link from 'next/link'
import { Trophy, Flame, Beer, ChevronDown, CheckCircle2, XCircle, Clock } from 'lucide-react'

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
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">

        {/* Page title — Apple clean typography */}
        <div className="mb-8 anim-fade-in">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">Ranking del Club</h1>
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200/80">
              Temporada activa
            </span>
          </div>
          <p className="text-slate-500 text-sm mt-1">
            Acierto = cuota en puntos · Fallo = 0 pts · El último clasificado paga la ronda de birras 🍺
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-6">

          {/* LEFT: Leader Spotlight Card */}
          <aside className="rounded-3xl p-6 flex flex-col gap-6 relative overflow-hidden gb-card shadow-xs anim-slide-up">
            {/* Ambient gold glow */}
            <div className="absolute -top-16 -right-16 w-48 h-48 rounded-full bg-amber-400/10 filter blur-3xl pointer-events-none" />

            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-3">
                Líder actual
              </span>
              {leader ? (
                <div>
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-100 to-amber-50 border border-amber-200/80 flex items-center justify-center text-3xl shadow-xs mb-3">
                    {leader.avatarEmoji || '🐟'}
                  </div>
                  <h2 className="text-slate-900 font-extrabold text-xl leading-tight">{leader.name}</h2>
                  <p className="text-slate-500 text-xs mt-0.5 font-medium">
                    {leader.totalWon}/{leader.totalResolved} aciertos · {leader.winRate}% efectividad
                  </p>

                  <div className="mt-4 p-4 rounded-2xl bg-amber-50/80 border border-amber-200/80">
                    <p className="text-slate-500 text-xs font-medium mb-1">Puntos acumulados</p>
                    <p className="text-amber-600 font-black text-4xl">{leader.totalPoints.toFixed(2)}</p>
                    <p className="text-slate-400 text-[11px] mt-0.5 font-medium">puntos de victoria</p>
                  </div>
                </div>
              ) : (
                <p className="text-slate-400 text-sm mt-2">Aún no hay pronósticos resueltos</p>
              )}
            </div>

            {/* Global club stats */}
            <div className="grid grid-cols-3 gap-2 mt-auto">
              {[
                { label: 'Gañanes', value: totalParticipants },
                { label: 'Resueltos', value: totalResolved },
                { label: 'Pendientes', value: totalPending },
              ].map(({ label, value }) => (
                <div key={label} className="rounded-2xl p-3 text-center bg-slate-50 border border-slate-200/70">
                  <p className="text-slate-900 font-extrabold text-base">{value}</p>
                  <p className="text-slate-400 text-[10px] font-medium mt-0.5">{label}</p>
                </div>
              ))}
            </div>

            <Link
              href="/dashboard"
              className="block w-full text-center font-bold py-3 rounded-full text-xs text-white bg-slate-900 hover:bg-slate-800 transition-all shadow-md shadow-slate-900/10 active:scale-98"
            >
              ⚽ Ir a hacer picks
            </Link>
          </aside>

          {/* RIGHT: Podium + Full Leaderboard */}
          <div className="space-y-6">

            {/* Top 3 Podium (Apple frosted style) */}
            {players.length >= 3 && (
              <div className="grid grid-cols-3 gap-3 items-end">
                {/* 2nd Place */}
                <div className="rounded-3xl p-4 text-center mt-6 gb-card shadow-xs anim-slide-up">
                  <div className="text-xl mb-1">🥈</div>
                  <div className="w-11 h-11 rounded-2xl bg-slate-100 border border-slate-200/80 flex items-center justify-center text-xl mx-auto mb-2 shadow-xs">
                    {players[1].avatarEmoji}
                  </div>
                  <p className="text-xs font-bold text-slate-800 truncate">{players[1].name}</p>
                  <p className="font-extrabold text-slate-900 text-lg mt-0.5">{players[1].totalPoints.toFixed(2)}</p>
                  <p className="text-[11px] text-slate-400 font-medium">{players[1].totalWon}/{players[1].totalResolved} ✓</p>
                </div>

                {/* 1st Place */}
                <div className="rounded-3xl p-5 text-center relative overflow-hidden gb-card border-amber-300/80 bg-amber-50/60 shadow-md shadow-amber-500/5 anim-slide-up">
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-400 to-amber-500" />
                  <div className="text-2xl mb-1">🥇</div>
                  <div className="w-12 h-12 rounded-2xl bg-white border border-amber-200 flex items-center justify-center text-2xl mx-auto mb-2 shadow-xs">
                    {players[0].avatarEmoji}
                  </div>
                  <p className="text-xs font-extrabold text-slate-900 truncate">{players[0].name}</p>
                  <p className="font-black text-amber-600 text-2xl mt-0.5">{players[0].totalPoints.toFixed(2)}</p>
                  <p className="text-[11px] text-amber-800/60 font-semibold">{players[0].totalWon}/{players[0].totalResolved} aciertos</p>
                </div>

                {/* 3rd Place */}
                <div className="rounded-3xl p-4 text-center mt-10 gb-card shadow-xs anim-slide-up">
                  <div className="text-xl mb-1">🥉</div>
                  <div className="w-11 h-11 rounded-2xl bg-orange-50 border border-orange-200/80 flex items-center justify-center text-xl mx-auto mb-2 shadow-xs">
                    {players[2].avatarEmoji}
                  </div>
                  <p className="text-xs font-bold text-slate-800 truncate">{players[2].name}</p>
                  <p className="font-extrabold text-slate-900 text-lg mt-0.5">{players[2].totalPoints.toFixed(2)}</p>
                  <p className="text-[11px] text-slate-400 font-medium">{players[2].totalWon}/{players[2].totalResolved} ✓</p>
                </div>
              </div>
            )}

            {/* Full leaderboard list */}
            <div className="space-y-2.5">
              {players.length === 0 && (
                <div className="text-center py-16 gb-card rounded-3xl p-6">
                  <p className="text-4xl mb-3">🐟</p>
                  <p className="font-extrabold text-slate-900 text-base">Aún no hay amigos en el ranking</p>
                  <p className="text-xs text-slate-500 mt-1">Elige tu nombre en el menú superior o añade un amigo para empezar</p>
                  <Link href="/dashboard" className="text-slate-900 font-bold text-xs mt-4 inline-block hover:underline">
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
                  <details
                    key={p.id}
                    className={`group rounded-2xl overflow-hidden transition-all anim-slide-up gb-card ${
                      isMe ? 'ring-2 ring-amber-400 bg-amber-50/50' : ''
                    } ${isLast ? 'border-rose-200 bg-rose-50/20' : ''}`}
                    style={{ animationDelay: `${i * 35}ms` }}
                  >
                    <summary className="flex items-center gap-3.5 p-4 cursor-pointer list-none select-none hover:bg-slate-50/60 transition-colors">
                      {/* Position pill */}
                      <span className={`w-7 text-center font-black text-sm shrink-0 ${
                        i === 0 ? 'text-amber-600' :
                        i === 1 ? 'text-slate-600' :
                        i === 2 ? 'text-amber-700' :
                        isLast ? 'text-rose-600' : 'text-slate-400'
                      }`}>
                        #{i + 1}
                      </span>

                      {/* Avatar */}
                      <div className="w-10 h-10 rounded-2xl flex items-center justify-center text-xl shrink-0 bg-white border border-slate-200/80 shadow-xs">
                        {p.avatarEmoji || '🐟'}
                      </div>

                      {/* Name & stats */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="font-extrabold text-sm truncate text-slate-900">
                            {p.name}
                          </p>
                          {isMe && (
                            <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 shrink-0">
                              TÚ
                            </span>
                          )}
                          {isLast && (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-100 text-rose-700 border border-rose-200 shrink-0 flex items-center gap-1">
                              <Beer className="w-3 h-3 text-rose-600" /> Paga las birras
                            </span>
                          )}
                        </div>

                        {/* Progress bar */}
                        <div className="flex items-center gap-2 mt-1.5">
                          <div className="flex-1 h-1.5 rounded-full overflow-hidden bg-slate-100">
                            <div
                              className="h-full rounded-full transition-all duration-500"
                              style={{
                                width: `${barPct}%`,
                                background: i === 0
                                  ? 'linear-gradient(90deg, #F59E0B, #D97706)'
                                  : isLast
                                  ? '#F43F5E'
                                  : '#64748B',
                              }}
                            />
                          </div>
                          <span className="text-[11px] text-slate-400 font-medium shrink-0">
                            {p.totalWon}/{p.totalResolved} · {p.winRate}%
                          </span>
                        </div>
                      </div>

                      {/* Points */}
                      <div className="text-right shrink-0">
                        <p className={`font-black text-lg ${i === 0 ? 'text-amber-600' : 'text-slate-900'}`}>
                          {p.totalPoints.toFixed(2)}
                        </p>
                        <p className="text-[10px] text-slate-400 font-medium">pts</p>
                      </div>

                      {/* Arrow indicator */}
                      <ChevronDown className="w-4 h-4 text-slate-400 ml-1 group-open:rotate-180 transition-transform shrink-0" />
                    </summary>

                    {/* Expandable picks history */}
                    <div className="px-5 pb-4 pt-2 border-t border-slate-100 text-xs text-slate-600 space-y-2 bg-slate-50/50">
                      <p className="font-bold text-[10px] text-slate-400 uppercase tracking-wider">Últimos picks registrados</p>
                      {playerPicks.length === 0 ? (
                        <p className="text-slate-400 text-xs py-1">Sin pronósticos aún</p>
                      ) : (
                        <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                          {playerPicks.slice(0, 10).map(pk => (
                            <div
                              key={pk.id}
                              className="flex items-center justify-between text-xs py-1.5 px-3 rounded-xl bg-white border border-slate-200/60 shadow-xs"
                            >
                              <span className="text-slate-800 font-semibold truncate max-w-[220px]">{pk.description}</span>
                              <div className="flex items-center gap-2 shrink-0">
                                <span className="text-slate-500">{pk.selection}</span>
                                <span className={`font-bold ${
                                  pk.status === 'won' ? 'text-emerald-700' :
                                  pk.status === 'lost' ? 'text-rose-700' : 'text-amber-700'
                                }`}>
                                  {pk.status === 'won' ? `+${pk.points.toFixed(2)} pts ✓` :
                                   pk.status === 'lost' ? '0 pts ✗' : `@${pk.odds.toFixed(2)}`}
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
