'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import type { NormalizedEvent } from '@/types/odds'
import Link from 'next/link'
import { teamShort } from '@/lib/teamShort'
import { PickConfirmedToast, shouldShowPickWarning } from '@/components/picks/PickConfirmedToast'

interface MyPick {
  id: string
  description: string
  selection: string
  odds: number
  status: string
  points: number
}

interface Sport { key: string; label: string; emoji: string }

interface Props {
  events: NormalizedEvent[]
  sports: Sport[]
  totalPoints: number
  myPicks: MyPick[]
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
    <span className={`text-xs font-medium ${diff > 0 ? 'text-green-400' : 'text-red-400'}`}>
      {currentOdds.toFixed(2)} ({diff > 0 ? '+' : ''}{diff.toFixed(2)})
    </span>
  )
}

export function DashboardClient({ events, sports, totalPoints, myPicks }: Props) {
  const router = useRouter()
  const [loading, setLoading] = useState<string | null>(null)
  const [activeLeague, setActiveLeague] = useState<string>('all')
  const [staged, setStaged] = useState<StagedPick | null>(null)
  const [toast, setToast] = useState<{ odds: number } | null>(null)

  const myPickMap = new Map(myPicks.map(p => [p.description, p]))

  const leaguesInEvents = Array.from(new Set(events.map(e => e.league)))
  const tabs = [
    { key: 'all', label: 'Todos', emoji: '🌍' },
    ...sports.filter(s => leaguesInEvents.includes(s.label)).map(s => ({ key: s.label, label: s.label, emoji: s.emoji })),
  ]

  const filtered = activeLeague === 'all' ? events : events.filter(e => e.league === activeLeague)

  // Group by day
  const byDay = filtered.reduce<Record<string, NormalizedEvent[]>>((acc, ev) => {
    const day = new Date(ev.commence_time).toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })
    ;(acc[day] ??= []).push(ev)
    return acc
  }, {})

  function stagePick(event: NormalizedEvent, selection: string, odds: number) {
    if (staged?.eventId === event.id && staged.selection === selection) { setStaged(null); return }
    setStaged({ eventId: event.id, selection, odds })
  }

  async function confirmPick(event: NormalizedEvent) {
    if (!staged || staged.eventId !== event.id) return
    setLoading(event.id)
    const confirmedOdds = staged.odds
    await fetch('/api/picks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        description: event.event_name,
        competition: event.league,
        selection: staged.selection,
        odds: staged.odds,
        stake: 1,
        match_date: event.commence_time,
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

  async function resolvePick(id: string, result: 'won' | 'lost') {
    await fetch(`/api/picks/${id}/resolve`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ result }),
    })
    router.refresh()
  }

  return (
    <main className="max-w-3xl mx-auto px-4 py-6">
      {toast && <PickConfirmedToast odds={toast.odds} onClose={() => { setToast(null); router.refresh() }} />}
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <h1 className="text-xl font-black text-white">⚽ Partidos</h1>
        <div className="flex items-center gap-3">
          <div className="text-right">
            <span className="text-2xl font-black text-yellow-400">{totalPoints.toFixed(2)}</span>
            <span className="text-xs text-slate-500 ml-1">pts</span>
          </div>
          <Link href="/ranking" className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 px-3 py-1.5 rounded-lg transition-colors">🏆 Ranking</Link>
        </div>
      </div>

      {/* League tabs */}
      {tabs.length > 1 && (
        <div className="flex gap-1.5 overflow-x-auto pb-2 mb-5 scrollbar-none">
          {tabs.map(tab => (
            <button key={tab.key} onClick={() => setActiveLeague(tab.key)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors shrink-0 ${activeLeague === tab.key ? 'bg-yellow-500 text-slate-950 font-black' : 'bg-slate-800 text-slate-400 hover:text-white'}`}>
              <span>{tab.emoji}</span><span>{tab.label}</span>
            </button>
          ))}
        </div>
      )}

      {filtered.length === 0 ? (
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

            const outcomes = [
              { short: teamShort(ev.home_team), full: `${ev.home_team} gana`, odds: home },
              { short: 'X', full: 'Empate', odds: draw },
              { short: teamShort(ev.away_team), full: `${ev.away_team} gana`, odds: away },
            ]

            // Current odds for the user's pick selection
            const myCurrentOdds = myPick ? outcomes.find(o => o.full === myPick.selection)?.odds ?? null : null
            const matchStarted = new Date(ev.commence_time).getTime() < Date.now()

            return (
              <div key={ev.id} className={`rounded-xl border p-3.5 transition-colors ${
                myPick ? 'border-yellow-500/30 bg-yellow-500/5' :
                isStagingThis ? 'border-yellow-500/20 bg-slate-900' :
                'border-slate-800 bg-slate-900/60'
              }`}>
                {/* Match header */}
                <div className="flex items-start justify-between gap-2 mb-2.5">
                  <div className="min-w-0">
                    <p className="text-white font-semibold text-sm leading-tight">{ev.event_name}</p>
                    <p className="text-slate-500 text-xs mt-0.5">{ev.league} · {fmtDate(ev.commence_time)}</p>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    {myPick?.status === 'pending' && (
                      <button onClick={() => deletePick(myPick.id)} className="text-slate-600 hover:text-red-400 transition-colors p-1" title="Eliminar pick">
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
                         `✓ ${myPick.selection.split(' ').pop()} @ ${myPick.odds.toFixed(2)}`}
                      </span>
                    )}
                  </div>
                </div>

                {/* Current odds vs pick odds */}
                {myPick?.status === 'pending' && myCurrentOdds !== null && (
                  <div className="text-xs text-slate-500 mb-2">
                    Cuota actual: <OddsDiff pickOdds={myPick.odds} currentOdds={myCurrentOdds} />
                    {myCurrentOdds > myPick.odds && <span className="text-slate-600 ml-1">— cuota subió, menos probable ahora 📉</span>}
                    {myCurrentOdds < myPick.odds && <span className="text-slate-600 ml-1">— cuota bajó, más probable ahora 📈</span>}
                  </div>
                )}

                {/* 1X2 */}
                <div className="grid grid-cols-3 gap-2">
                  {outcomes.map(({ short, full, odds }) => {
                    if (!odds) return null
                    const isMyPick = myPick?.selection === full
                    const isStaged = isStagingThis && staged?.selection === full
                    return (
                      <button key={full}
                        onClick={() => !myPick && stagePick(ev, full, odds)}
                        disabled={!!myPick}
                        className={`rounded-lg border px-2 py-2.5 text-center transition-all ${
                          isMyPick ? 'border-yellow-500/60 bg-yellow-500/15 cursor-default' :
                          isStaged ? 'border-yellow-400 bg-yellow-400/20 ring-1 ring-yellow-400/40' :
                          myPick ? 'border-slate-800 bg-slate-900 opacity-30 cursor-default' :
                          'border-slate-700 bg-slate-800 hover:border-yellow-500/50 hover:bg-yellow-500/10 cursor-pointer'
                        }`}>
                        <div className={`text-xs font-medium truncate ${isMyPick || isStaged ? 'text-yellow-300' : 'text-slate-400'}`}>{short}</div>
                        <div className={`font-black text-sm mt-0.5 ${isMyPick || isStaged ? 'text-yellow-400' : 'text-slate-300'}`}>{odds.toFixed(2)}</div>
                      </button>
                    )
                  })}
                </div>

                {/* Resolve bar — shown after match starts */}
                {myPick?.status === 'pending' && matchStarted && (
                  <div className="flex items-center gap-2 mt-3 pt-3 border-t border-slate-800">
                    <span className="text-xs text-slate-400 flex-1">¿Acertaste <strong className="text-yellow-400">{myPick.selection === 'Empate' ? 'el Empate' : teamShort(myPick.selection.replace(' gana', ''))}</strong>?</span>
                    <button onClick={() => resolvePick(myPick.id, 'won')}
                      className="text-xs bg-green-500/20 hover:bg-green-500/30 text-green-400 font-bold px-3 py-1.5 rounded-lg transition-colors">
                      ✓ Sí
                    </button>
                    <button onClick={() => resolvePick(myPick.id, 'lost')}
                      className="text-xs bg-red-500/20 hover:bg-red-500/30 text-red-400 font-bold px-3 py-1.5 rounded-lg transition-colors">
                      ✗ No
                    </button>
                  </div>
                )}

                {/* Confirm bar — shown before confirming a new pick */}
                {isStagingThis && !myPick && (
                  <div className="flex items-center gap-2 mt-3 pt-3 border-t border-slate-800">
                    <div className="flex-1 text-xs text-slate-400">
                      <span className="text-white font-medium">{staged.selection.split(' ').pop()}</span>
                      {' '}@ <span className="text-yellow-400 font-black">{staged.odds.toFixed(2)}</span>
                      <span className="text-slate-600 ml-1">→ +{staged.odds.toFixed(2)} pts si aciertas</span>
                    </div>
                    <button onClick={() => setStaged(null)} className="text-xs text-slate-500 hover:text-white px-3 py-1.5 rounded-lg border border-slate-700 transition-colors">Cancelar</button>
                    <button onClick={() => confirmPick(ev)} disabled={loading === ev.id}
                      className="text-xs bg-yellow-500 hover:bg-yellow-400 disabled:opacity-60 text-slate-950 font-black px-4 py-1.5 rounded-lg transition-colors">
                      {loading === ev.id ? '…' : 'Confirmar ✓'}
                    </button>
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
