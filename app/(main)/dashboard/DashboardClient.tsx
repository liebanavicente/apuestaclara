'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import type { NormalizedEvent } from '@/types/odds'
import Link from 'next/link'
import { teamShort } from '@/lib/teamShort'
import { PickConfirmedToast, shouldShowPickWarning } from '@/components/picks/PickConfirmedToast'
import { QuickAI } from '@/components/picks/QuickAI'

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
  inProgressPicks: MyPick[]
}

interface StagedPick {
  eventId: string
  selection: string
  odds: number
}

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString('es-ES', {
    weekday: 'short', day: 'numeric', month: 'short',
    hour: '2-digit', minute: '2-digit',
  })
}

function OddsDiff({ pickOdds, currentOdds }: { pickOdds: number; currentOdds: number }) {
  const diff = currentOdds - pickOdds
  if (Math.abs(diff) < 0.01) return <span className="text-slate-500 text-xs">{currentOdds.toFixed(2)}</span>
  return (
    <span className={`text-xs font-medium ${diff > 0 ? 'text-red-400' : 'text-green-400'}`}>
      {currentOdds.toFixed(2)} ({diff > 0 ? '+' : ''}{diff.toFixed(2)})
    </span>
  )
}

export function DashboardClient({ events, totalPoints, myPicks, inProgressPicks }: Props) {
  const router = useRouter()
  const [loading, setLoading] = useState<string | null>(null)
  const [staged, setStaged] = useState<StagedPick | null>(null)
  const [toast, setToast] = useState<{ odds: number } | null>(null)

  const myPickMap = new Map(myPicks.map(p => [p.description, p]))

  // Next 3 unpicked matches as featured
  const featured = events
    .filter(e => new Date(e.commence_time).getTime() > Date.now())
    .filter(e => !myPickMap.has(e.event_name))
    .slice(0, 3)

  // All events grouped by day
  const byDay = events.reduce<Record<string, NormalizedEvent[]>>((acc, ev) => {
    const day = new Date(ev.commence_time).toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })
    ;(acc[day] ??= []).push(ev)
    return acc
  }, {})

  function stagePick(ev: NormalizedEvent, selection: string, odds: number) {
    if (staged?.eventId === ev.id && staged.selection === selection) { setStaged(null); return }
    setStaged({ eventId: ev.id, selection, odds })
  }

  async function confirmPick(ev: NormalizedEvent) {
    if (!staged || staged.eventId !== ev.id) return
    setLoading(ev.id)
    const confirmedOdds = staged.odds
    await fetch('/api/picks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        description: ev.event_name,
        competition: ev.league,
        selection: staged.selection,
        odds: confirmedOdds,
        stake: 1,
        match_date: ev.commence_time,
      }),
    })
    setStaged(null)
    setLoading(null)
    if (shouldShowPickWarning()) setToast({ odds: confirmedOdds })
    else router.refresh()
  }

  async function deletePick(id: string) {
    await fetch(`/api/picks/${id}`, { method: 'DELETE' })
    router.refresh()
  }

  return (
    <main className="max-w-3xl mx-auto px-4 py-6">
      {toast && <PickConfirmedToast odds={toast.odds} onClose={() => { setToast(null); router.refresh() }} />}

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-black text-white">⚽ Partidos</h1>
        <div className="flex items-center gap-3">
          <div className="text-right">
            <span className="text-2xl font-black text-yellow-400">{totalPoints.toFixed(2)}</span>
            <span className="text-xs text-slate-500 ml-1">pts</span>
          </div>
          <Link href="/ranking" className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 px-3 py-1.5 rounded-lg transition-colors">🏆 Ranking</Link>
        </div>
      </div>

      {/* In-progress picks */}
      {inProgressPicks.length > 0 && (
        <div className="mb-6 space-y-1.5">
          <h2 className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-green-500 animate-pulse" /> En juego
          </h2>
          {inProgressPicks.map(p => (
            <div key={p.id} className="rounded-xl border border-green-500/20 bg-green-500/5 px-4 py-2.5 flex items-center justify-between gap-3">
              <div className="min-w-0">
                <p className="text-white font-medium text-sm truncate">{p.description}</p>
                <p className="text-yellow-400 text-xs mt-0.5">→ {p.selection === 'Empate' ? 'Empate' : teamShort(p.selection.replace(' gana', ''))} @ {p.odds.toFixed(2)}</p>
              </div>
              <span className="text-xs text-green-400 font-medium shrink-0 flex items-center gap-1">
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" /> En juego
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Featured: próximos partidos sin pick */}
      {featured.length > 0 && (
        <div className="mb-7">
          <h2 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">🔥 Próximos partidos</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {featured.map(ev => {
              const { home, draw, away } = ev.best_odds
              const isStagingThis = staged?.eventId === ev.id
              return (
                <div key={ev.id} className={`rounded-xl border p-3 transition-colors ${isStagingThis ? 'border-yellow-500/40 bg-yellow-500/5' : 'border-slate-700 bg-slate-900'}`}>
                  <p className="text-white font-bold text-xs mb-0.5 truncate">{ev.event_name}</p>
                  <p className="text-slate-500 text-xs mb-3">{fmtDate(ev.commence_time)}</p>
                  <div className="grid grid-cols-3 gap-1">
                    {[
                      { short: teamShort(ev.home_team), full: `${ev.home_team} gana`, odds: home },
                      { short: 'X', full: 'Empate', odds: draw },
                      { short: teamShort(ev.away_team), full: `${ev.away_team} gana`, odds: away },
                    ].map(({ short, full, odds }) => odds ? (
                      <button key={full} onClick={() => stagePick(ev, full, odds)}
                        className={`rounded-lg border px-1 py-2 text-center transition-all ${
                          isStagingThis && staged?.selection === full
                            ? 'border-yellow-400 bg-yellow-400/20'
                            : 'border-slate-700 bg-slate-800 hover:border-yellow-500/50 hover:bg-yellow-500/10'
                        }`}>
                        <div className="text-xs font-bold text-slate-400 truncate">{short}</div>
                        <div className="font-black text-sm text-yellow-400">{odds.toFixed(2)}</div>
                      </button>
                    ) : null)}
                  </div>
                  {isStagingThis && (
                    <div className="mt-2 space-y-1.5">
                      <QuickAI event={ev.event_name} league={ev.league} selection={staged!.selection} odds={staged!.odds} />
                      <div className="flex gap-1.5">
                        <button onClick={() => setStaged(null)} className="text-xs text-slate-500 px-2 py-1 rounded border border-slate-700">✕</button>
                        <button onClick={() => confirmPick(ev)} disabled={loading === ev.id}
                          className="flex-1 text-xs bg-yellow-500 hover:bg-yellow-400 disabled:opacity-60 text-slate-950 font-black py-1 rounded transition-colors">
                          {loading === ev.id ? '…' : 'Confirmar ✓'}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      )}

      {events.length === 0 ? (
        <div className="text-center py-16 text-slate-500">
          <p className="text-4xl mb-3">😴</p>
          <p className="text-white font-medium">Sin partidos disponibles</p>
        </div>
      ) : (
        <div className="space-y-8">
          {Object.entries(byDay).map(([day, dayEvents]) => (
            <section key={day}>
              <h2 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3 capitalize">{day}</h2>
              <div className="space-y-2.5">
                {dayEvents.map(ev => {
                  const myPick = myPickMap.get(ev.event_name)
                  const { home, draw, away } = ev.best_odds
                  const isStagingThis = staged?.eventId === ev.id
                  const matchStarted = new Date(ev.commence_time).getTime() < Date.now()
                  const myCurrentOdds = myPick ? [
                    { full: `${ev.home_team} gana`, odds: home },
                    { full: 'Empate', odds: draw },
                    { full: `${ev.away_team} gana`, odds: away },
                  ].find(o => o.full === myPick.selection)?.odds ?? null : null

                  const outcomes = [
                    { short: teamShort(ev.home_team), full: `${ev.home_team} gana`, odds: home },
                    { short: 'X', full: 'Empate', odds: draw },
                    { short: teamShort(ev.away_team), full: `${ev.away_team} gana`, odds: away },
                  ]

                  return (
                    <div key={ev.id} className={`rounded-xl border p-3.5 transition-colors ${
                      myPick ? 'border-yellow-500/30 bg-yellow-500/5' :
                      isStagingThis ? 'border-yellow-500/20 bg-slate-900' :
                      'border-slate-800 bg-slate-900/60'
                    }`}>
                      <div className="flex items-start justify-between gap-2 mb-2.5">
                        <div className="min-w-0">
                          <p className="text-white font-semibold text-sm leading-tight">{ev.event_name}</p>
                          <p className="text-slate-500 text-xs mt-0.5">{ev.league} · {fmtDate(ev.commence_time)}</p>
                        </div>
                        <div className="flex items-center gap-1.5 shrink-0">
                          {myPick?.status === 'pending' && !matchStarted && (
                            <button onClick={() => deletePick(myPick.id)} className="text-slate-600 hover:text-red-400 transition-colors p-1">
                              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                          )}
                          {myPick && (
                            <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                              myPick.status === 'won' ? 'bg-green-500/20 text-green-400' :
                              myPick.status === 'lost' ? 'bg-red-500/20 text-red-400' :
                              'bg-yellow-500/20 text-yellow-400'
                            }`}>
                              {myPick.status === 'won' ? `+${myPick.points.toFixed(2)} pts ✓` :
                               myPick.status === 'lost' ? '0 pts ✗' :
                               `✓ ${myPick.selection === 'Empate' ? 'X' : teamShort(myPick.selection.replace(' gana', ''))} @ ${myPick.odds.toFixed(2)}`}
                            </span>
                          )}
                        </div>
                      </div>

                      {myPick?.status === 'pending' && myCurrentOdds !== null && (
                        <div className="text-xs text-slate-500 mb-2">
                          Cuota actual: <OddsDiff pickOdds={myPick.odds} currentOdds={myCurrentOdds} />
                        </div>
                      )}

                      <div className="grid grid-cols-3 gap-2">
                        {outcomes.map(({ short, full, odds }) => {
                          if (!odds) return null
                          const isMyPick = myPick?.selection === full
                          const isStaged = isStagingThis && staged?.selection === full
                          return (
                            <button key={full} onClick={() => !myPick && stagePick(ev, full, odds)} disabled={!!myPick}
                              className={`rounded-lg border px-2 py-2.5 text-center transition-all ${
                                isMyPick ? 'border-yellow-500/60 bg-yellow-500/15 cursor-default' :
                                isStaged ? 'border-yellow-400 bg-yellow-400/20 ring-1 ring-yellow-400/40' :
                                myPick ? 'border-slate-800 bg-slate-900 opacity-30 cursor-default' :
                                'border-slate-700 bg-slate-800 hover:border-yellow-500/50 hover:bg-yellow-500/10 cursor-pointer'
                              }`}>
                              <div className={`text-xs font-bold ${isMyPick || isStaged ? 'text-yellow-300' : 'text-slate-400'}`}>{short}</div>
                              <div className={`font-black text-sm mt-0.5 ${isMyPick || isStaged ? 'text-yellow-400' : 'text-slate-300'}`}>{odds.toFixed(2)}</div>
                            </button>
                          )
                        })}
                      </div>

                      {myPick?.status === 'pending' && matchStarted && (
                        <p className="text-xs text-slate-600 mt-2">⏳ Pendiente de resultado oficial</p>
                      )}

                      {isStagingThis && !myPick && (
                        <div className="mt-3 pt-3 border-t border-slate-800 space-y-2">
                          <div className="flex items-center gap-2">
                            <div className="flex-1 text-xs text-slate-400">
                              <span className="text-white font-medium">{staged!.selection === 'Empate' ? 'Empate' : staged!.selection.replace(' gana', '')}</span>
                              {' '}@ <span className="text-yellow-400 font-black">{staged!.odds.toFixed(2)}</span>
                              <span className="text-slate-600 ml-1">→ +{staged!.odds.toFixed(2)} pts</span>
                            </div>
                            <button onClick={() => setStaged(null)} className="text-xs text-slate-500 hover:text-white px-3 py-1.5 rounded-lg border border-slate-700">Cancelar</button>
                            <button onClick={() => confirmPick(ev)} disabled={loading === ev.id}
                              className="text-xs bg-yellow-500 hover:bg-yellow-400 disabled:opacity-60 text-slate-950 font-black px-4 py-1.5 rounded-lg">
                              {loading === ev.id ? '…' : 'Confirmar ✓'}
                            </button>
                          </div>
                          <QuickAI
                            event={ev.event_name}
                            league={ev.league}
                            selection={staged!.selection}
                            odds={staged!.odds}
                          />
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </section>
          ))}
        </div>
      )}
    </main>
  )
}
