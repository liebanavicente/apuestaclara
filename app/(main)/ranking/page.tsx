import { getLeaderboard, getPicks, type LeaderboardPlayer } from '@/lib/services/club.service'
import { getActiveFriend } from '@/lib/session'
import Link from 'next/link'
import { Beer, ChevronDown, ArrowRight } from 'lucide-react'

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
  const totalResolved = players.reduce((s, p) => s + p.totalResolved, 0)
  const totalPending = players.reduce((s, p) => s + p.totalPending, 0)

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-8 pb-16">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10 anim-fade-in">
        <div>
          <p className="gb-eyebrow mb-1.5">Temporada en curso</p>
          <h1 className="text-4xl sm:text-5xl font-bold tracking-[-0.04em] text-ink">Ranking</h1>
          <p className="text-ink-2 text-[15px] mt-2">El último de la tabla paga la ronda 🍺</p>
        </div>
        <div className="flex gap-2">
          <Stat label="Gañanes" value={players.length} />
          <Stat label="Resueltos" value={totalResolved} />
          <Stat label="Pendientes" value={totalPending} />
        </div>
      </div>

      {/* Podium */}
      {players.length >= 3 && (
        <div className="grid grid-cols-3 gap-2.5 sm:gap-4 items-end mb-10 max-w-2xl mx-auto">
          <PodiumCard player={players[1]} place={2} />
          <PodiumCard player={players[0]} place={1} />
          <PodiumCard player={players[2]} place={3} />
        </div>
      )}

      {/* Leaderboard */}
      {players.length === 0 ? (
        <div className="text-center py-16 px-6 gb-card rounded-3xl">
          <p className="text-5xl mb-4">🐟</p>
          <p className="font-semibold text-ink text-lg tracking-[-0.02em]">Aún no hay nadie en el ranking</p>
          <p className="text-sm text-ink-2 mt-1.5">Elige tu nombre arriba y haz tu primer pick.</p>
          <Link href="/dashboard" className="gb-btn gb-btn-primary mt-6">
            Ir a Partidos <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      ) : (
        <div className="gb-card rounded-3xl overflow-hidden divide-y divide-black/[0.06] anim-slide-up">
          {players.map((p, i) => {
            const isMe = !!activeFriend && p.id === activeFriend.id
            const isLast = players.length > 1 && i === players.length - 1
            const barPct = leaderPoints > 0 ? Math.max(2, Math.round((p.totalPoints / leaderPoints) * 100)) : 0
            const playerPicks = picksByPlayer.get(p.id) ?? []

            return (
              <details key={p.id} className={`group ${isMe ? 'bg-amber-500/[0.06]' : ''}`}>
                <summary className="flex items-center gap-3 sm:gap-4 px-4 sm:px-5 py-3.5 cursor-pointer list-none select-none hover:bg-black/[0.025] transition-colors">
                  <span
                    className={`w-6 text-center text-sm font-semibold tabular-nums shrink-0 ${
                      i === 0 ? 'text-amber-600' : isLast ? 'text-rose-600' : 'text-ink-3'
                    }`}
                  >
                    {i + 1}
                  </span>

                  <span className="w-10 h-10 rounded-full flex items-center justify-center text-xl shrink-0 bg-black/[0.04]">
                    {p.avatarEmoji || '🐟'}
                  </span>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 min-w-0">
                      <p className="font-semibold text-[15px] tracking-[-0.01em] truncate text-ink">{p.name}</p>
                      {isMe && <span className="gb-chip gb-chip-amber shrink-0">Tú</span>}
                      {isLast && (
                        <span className="gb-chip gb-chip-red shrink-0">
                          <Beer className="w-3 h-3" /> <span className="hidden sm:inline">Paga las birras</span>
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2.5 mt-1.5">
                      <div className="flex-1 max-w-56 h-1 rounded-full overflow-hidden bg-black/[0.06]">
                        <div
                          className={`h-full rounded-full ${
                            i === 0 ? 'bg-gradient-to-r from-amber-400 to-amber-500' : isLast ? 'bg-rose-400' : 'bg-ink-3/60'
                          }`}
                          style={{ width: `${barPct}%` }}
                        />
                      </div>
                      <span className="text-xs text-ink-3 tabular-nums shrink-0">
                        {p.totalWon}/{p.totalResolved} · {p.winRate}%
                      </span>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <p className={`font-semibold text-lg tabular-nums tracking-[-0.02em] ${i === 0 ? 'text-amber-600' : 'text-ink'}`}>
                      {p.totalPoints.toFixed(2)}
                    </p>
                    <p className="text-[11px] text-ink-3 -mt-0.5">pts</p>
                  </div>

                  <ChevronDown className="w-4 h-4 text-ink-3 group-open:rotate-180 transition-transform duration-300 shrink-0" />
                </summary>

                <div className="px-4 sm:px-5 pb-4 pt-1 sm:pl-[5.25rem]">
                  <p className="gb-eyebrow mb-2">Últimos picks</p>
                  {playerPicks.length === 0 ? (
                    <p className="text-ink-3 text-sm">Sin pronósticos aún</p>
                  ) : (
                    <div className="rounded-2xl bg-white/60 divide-y divide-black/[0.05] max-h-64 overflow-y-auto">
                      {playerPicks.slice(0, 10).map(pk => (
                        <div key={pk.id} className="flex items-center justify-between gap-3 text-sm px-3.5 py-2.5">
                          <span className="text-ink truncate">{pk.description}</span>
                          <div className="flex items-center gap-2.5 shrink-0">
                            <span className="text-ink-3 hidden sm:inline">{pk.selection}</span>
                            <span
                              className={`font-semibold tabular-nums ${
                                pk.status === 'won' ? 'text-emerald-600' : pk.status === 'lost' ? 'text-rose-600' : 'text-amber-600'
                              }`}
                            >
                              {pk.status === 'won' ? `+${pk.points.toFixed(2)}` : pk.status === 'lost' ? '0' : `@${pk.odds.toFixed(2)}`}
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
      )}

      {players.length > 0 && (
        <div className="mt-8 text-center">
          <Link href="/dashboard" className="gb-btn gb-btn-primary">
            Hacer picks <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      )}
    </div>
  )
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="gb-card rounded-2xl px-4 py-2.5 min-w-[5.5rem]">
      <p className="text-xl font-semibold tabular-nums tracking-[-0.02em] text-ink">{value}</p>
      <p className="text-[11px] text-ink-3">{label}</p>
    </div>
  )
}

const MEDAL = { 1: '🥇', 2: '🥈', 3: '🥉' } as const

function PodiumCard({ player, place }: { player: LeaderboardPlayer; place: 1 | 2 | 3 }) {
  const first = place === 1
  return (
    <div
      className={`relative rounded-3xl text-center anim-slide-up ${
        first ? 'gb-card-pick px-3 pt-6 pb-5 sm:pb-7' : 'gb-card px-3 pt-5 pb-4'
      }`}
      style={{ animationDelay: `${place * 60}ms` }}
    >
      <span className="absolute -top-3 left-1/2 -translate-x-1/2 text-2xl drop-shadow-sm">{MEDAL[place]}</span>
      <span
        className={`mx-auto mb-2.5 rounded-full flex items-center justify-center bg-white/80 shadow-[0_0_0_0.5px_rgba(0,0,0,0.06),0_4px_12px_-4px_rgba(0,0,0,0.15)] ${
          first ? 'w-16 h-16 text-3xl' : 'w-12 h-12 text-2xl'
        }`}
      >
        {player.avatarEmoji || '🐟'}
      </span>
      <p className="text-sm font-semibold text-ink truncate tracking-[-0.01em]">{player.name}</p>
      <p
        className={`font-semibold tabular-nums tracking-[-0.03em] mt-0.5 ${
          first ? 'text-3xl text-amber-600' : 'text-xl text-ink'
        }`}
      >
        {player.totalPoints.toFixed(2)}
      </p>
      <p className="text-[11px] text-ink-3 tabular-nums">
        {player.totalWon}/{player.totalResolved} aciertos
      </p>
    </div>
  )
}
