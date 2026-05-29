'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import type { NormalizedEvent } from '@/types/odds'
import Link from 'next/link'

interface MyPick {
  id: string
  description: string
  selection: string
  odds: number
  status: string
  points: number
}

interface Props {
  events: NormalizedEvent[]
  totalPoints: number
  myPicks: MyPick[]
}

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString('es-ES', { weekday: 'short', day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })
}

function fmtPts(n: number) {
  return n.toFixed(2)
}

export function DashboardClient({ events, totalPoints, myPicks }: Props) {
  const router = useRouter()
  const [loading, setLoading] = useState<string | null>(null)

  // Map event description → my pick
  const myPickMap = new Map(myPicks.map(p => [p.description, p]))

  async function makePick(event: NormalizedEvent, selection: string, odds: number) {
    const key = `${event.id}-${selection}`
    setLoading(key)
    await fetch('/api/picks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        description: event.event_name,
        competition: event.league,
        selection,
        odds,
        stake: 1,
        match_date: event.commence_time,
      }),
    })
    setLoading(null)
    router.refresh()
  }

  // Group by league
  const byLeague = events.reduce<Record<string, NormalizedEvent[]>>((acc, ev) => {
    ;(acc[ev.league] ??= []).push(ev)
    return acc
  }, {})

  return (
    <main className="max-w-3xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-black text-white">Dashboard 🐟</h1>
          <p className="text-slate-400 text-sm mt-0.5">Elige el resultado antes del partido</p>
        </div>
        <div className="text-right">
          <p className="text-3xl font-black text-yellow-400">{fmtPts(totalPoints)}</p>
          <p className="text-xs text-slate-500">pts acumulados</p>
          <Link href="/ranking" className="text-xs text-teal-400 hover:text-teal-300">Ver ranking →</Link>
        </div>
      </div>

      {events.length === 0 && (
        <div className="text-center py-20 text-slate-500">
          <p className="text-4xl mb-3">😴</p>
          <p className="text-lg text-white font-medium">Sin partidos esta semana</p>
          <p className="text-sm mt-1">Vuelve más tarde o añade un pick manual en <Link href="/mis-picks" className="text-yellow-400">Mis picks</Link></p>
        </div>
      )}

      <div className="space-y-8">
        {Object.entries(byLeague).map(([league, leagueEvents]) => (
          <section key={league}>
            <h2 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">{league}</h2>
            <div className="space-y-3">
              {leagueEvents.map(ev => {
                const myPick = myPickMap.get(ev.event_name)
                const { home, draw, away } = ev.best_odds

                return (
                  <div key={ev.id} className={`rounded-xl border p-4 transition-colors ${myPick ? 'border-yellow-500/30 bg-yellow-500/5' : 'border-slate-800 bg-slate-900/50'}`}>
                    {/* Match info */}
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div>
                        <p className="text-white font-semibold">{ev.event_name}</p>
                        <p className="text-slate-500 text-xs mt-0.5">{fmtDate(ev.commence_time)}</p>
                      </div>
                      {myPick && (
                        <div className="text-right shrink-0">
                          <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                            myPick.status === 'won' ? 'bg-green-500/20 text-green-400' :
                            myPick.status === 'lost' ? 'bg-red-500/20 text-red-400' :
                            'bg-yellow-500/20 text-yellow-400'
                          }`}>
                            {myPick.status === 'won' ? `+${fmtPts(myPick.points)} pts ✓` :
                             myPick.status === 'lost' ? 'Fallado ✗' :
                             `${myPick.selection} @ ${myPick.odds.toFixed(2)}`}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* 1X2 buttons */}
                    {!myPick ? (
                      <div className="grid grid-cols-3 gap-2">
                        {[
                          { label: ev.home_team.split(' ').pop()!, full: `${ev.home_team} gana`, odds: home, key: '1' },
                          { label: 'X', full: 'Empate', odds: draw, key: 'X' },
                          { label: ev.away_team.split(' ').pop()!, full: `${ev.away_team} gana`, odds: away, key: '2' },
                        ].map(({ label, full, odds, key }) => odds ? (
                          <button
                            key={key}
                            onClick={() => makePick(ev, full, odds)}
                            disabled={loading === `${ev.id}-${full}`}
                            className="rounded-lg border border-slate-700 hover:border-yellow-500/50 hover:bg-yellow-500/10 bg-slate-800 px-2 py-2.5 text-center transition-colors disabled:opacity-50 group"
                          >
                            <div className="text-xs text-slate-400 group-hover:text-slate-300 truncate font-medium">{label}</div>
                            <div className="text-yellow-400 font-black text-base mt-0.5">{odds.toFixed(2)}</div>
                          </button>
                        ) : null)}
                      </div>
                    ) : (
                      <div className="grid grid-cols-3 gap-2">
                        {[
                          { label: ev.home_team.split(' ').pop()!, full: `${ev.home_team} gana`, odds: home },
                          { label: 'X', full: 'Empate', odds: draw },
                          { label: ev.away_team.split(' ').pop()!, full: `${ev.away_team} gana`, odds: away },
                        ].map(({ label, full, odds }) => odds ? (
                          <div
                            key={full}
                            className={`rounded-lg border px-2 py-2.5 text-center ${
                              myPick.selection === full
                                ? 'border-yellow-500/50 bg-yellow-500/10'
                                : 'border-slate-800 bg-slate-900 opacity-40'
                            }`}
                          >
                            <div className="text-xs text-slate-400 truncate font-medium">{label}</div>
                            <div className={`font-black text-base mt-0.5 ${myPick.selection === full ? 'text-yellow-400' : 'text-slate-600'}`}>{odds.toFixed(2)}</div>
                          </div>
                        ) : null)}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </section>
        ))}
      </div>

      <div className="mt-10 text-center">
        <Link href="/mis-picks" className="text-sm text-slate-500 hover:text-slate-300">
          ¿Quieres picks de goleadores o combinadas? → Mis picks
        </Link>
      </div>
    </main>
  )
}
