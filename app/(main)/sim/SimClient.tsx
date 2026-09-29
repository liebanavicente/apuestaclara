'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import type { NormalizedEvent } from '@/types/odds'
import { teamShort } from '@/lib/teamShort'
import { QuickAI } from '@/components/picks/QuickAI'

interface MyPick { id: string; description: string; selection: string; odds: number; status: string; profit: number; stake: number }
interface LeaderboardRow { user_id: string; username: string; net_profit: number; total_resolved: number; total_won: number; win_rate: number }
interface Sport { key: string; label: string; emoji: string }

interface StagedPick { eventId: string; eventName: string; selection: string; odds: number }

interface Props {
  events: NormalizedEvent[]
  sports: Sport[]
  myPicks: MyPick[]
  inProgressPicks: MyPick[]
  leaderboard: LeaderboardRow[]
  myNetProfit: number
}

function fmt(n: number) {
  const sign = n >= 0 ? '+' : ''
  return `${sign}${n.toFixed(0)}€`
}

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString('es-ES', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })
}

export function SimClient({ events, sports, myPicks, inProgressPicks, leaderboard, myNetProfit }: Props) {
  const router = useRouter()
  const [tab, setTab] = useState<'partidos' | 'ranking' | 'mispicks'>('partidos')
  const [activeLeague, setActiveLeague] = useState('all')
  const [staged, setStaged] = useState<StagedPick | null>(null)
  const [stake, setStake] = useState('50')
  const [loading, setLoading] = useState<string | null>(null)

  const myPickMap = new Map(myPicks.map(p => [p.description, p]))
  const leaguesInEvents = Array.from(new Set(events.map(e => e.league)))
  const tabs = [{ key: 'all', label: 'Todos', emoji: '🎲' }, ...sports.filter(s => leaguesInEvents.includes(s.label)).map(s => ({ key: s.label, label: s.label, emoji: s.emoji }))]
  const filtered = activeLeague === 'all' ? events : events.filter(e => e.league === activeLeague)

  // Group by day
  const byDay = filtered.reduce<Record<string, NormalizedEvent[]>>((acc, ev) => {
    const day = new Date(ev.commence_time).toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })
    ;(acc[day] ??= []).push(ev)
    return acc
  }, {})

  function stagePick(ev: NormalizedEvent, selection: string, odds: number) {
    if (staged?.eventId === ev.id && staged.selection === selection) { setStaged(null); return }
    setStaged({ eventId: ev.id, eventName: ev.event_name, selection, odds })
  }

  async function confirmPick(ev: NormalizedEvent) {
    if (!staged || staged.eventId !== ev.id) return
    const s = parseFloat(stake)
    if (!s || s <= 0) return
    setLoading(ev.id)
    await fetch('/api/picks/sim', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        description: ev.event_name,
        competition: ev.league,
        selection: staged.selection,
        odds: staged.odds,
        stake: s,
        match_date: ev.commence_time,
      }),
    })
    setStaged(null)
    setLoading(null)
    router.refresh()
  }

  async function deletePick(id: string) {
    await fetch(`/api/picks/${id}`, { method: 'DELETE' })
    router.refresh()
  }

  const pending = myPicks.filter(p => p.status === 'pending')
  const resolved = myPicks.filter(p => p.status !== 'pending')

  return (
    <main className="max-w-3xl mx-auto px-4 py-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-xl font-black text-ink">🎲 Simulador</h1>
          <p className="text-ink-3 text-xs mt-0.5">Picks ficticios con dinero virtual. No afecta al ranking principal.</p>
        </div>
        <div className="text-right">
          <span className={`text-2xl font-black ${myNetProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>{fmt(myNetProfit)}</span>
          <p className="text-xs text-ink-3">beneficio neto</p>
        </div>
      </div>

      {/* Main tabs */}
      <div className="flex gap-2 mb-5 border-b border-black/[0.06] pb-3">
        {(['partidos', 'ranking', 'mispicks'] as const).map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`text-sm font-medium px-3 py-1.5 rounded-lg transition-colors ${tab === t ? 'bg-black/[0.08] text-ink' : 'text-ink-3 hover:text-ink'}`}>
            {t === 'partidos' ? '⚽ Partidos' : t === 'ranking' ? '🏆 Ranking sim' : '📋 Mis picks'}
          </button>
        ))}
      </div>

      {/* PARTIDOS */}
      {tab === 'partidos' && (
        <>
          <div className="flex gap-1.5 overflow-x-auto pb-2 mb-4 scrollbar-none">
            {tabs.map(t => (
              <button key={t.key} onClick={() => setActiveLeague(t.key)}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap shrink-0 transition-colors ${activeLeague === t.key ? 'bg-black/[0.08] text-ink' : 'bg-black/[0.04] text-ink-2 hover:text-ink'}`}>
                {t.emoji} {t.label}
              </button>
            ))}
          </div>

          {inProgressPicks.length > 0 && (
            <div className="mb-4 space-y-1.5">
              <h3 className="text-xs text-ink-3 uppercase tracking-widest flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse inline-block" /> En juego
              </h3>
              {inProgressPicks.map(p => (
                <div key={p.id} className="rounded-xl border border-green-500/20 bg-green-500/5 px-4 py-2.5 flex items-center justify-between">
                  <div>
                    <p className="text-ink text-sm font-medium">{p.description}</p>
                    <p className="text-amber-600 text-xs">→ {teamShort(p.selection.replace(' gana', ''))} @ {p.odds.toFixed(2)} · {fmt(p.stake)} apostados</p>
                  </div>
                  <span className="text-green-600 text-xs font-medium">🟢 En juego</span>
                </div>
              ))}
            </div>
          )}

          <div className="space-y-6">
            {Object.entries(byDay).map(([day, dayEvents]) => (
              <section key={day}>
                <h2 className="text-xs font-bold text-ink-3 uppercase tracking-widest mb-2 capitalize">{day}</h2>
                <div className="space-y-2">
                  {dayEvents.map(ev => {
                    const myPick = myPickMap.get(ev.event_name)
                    const { home, draw, away } = ev.best_odds
                    const isStagingThis = staged?.eventId === ev.id
                    const matchStarted = new Date(ev.commence_time).getTime() < Date.now()
                    const outcomes = [
                      { short: teamShort(ev.home_team), full: `${ev.home_team} gana`, odds: home },
                      { short: 'X', full: 'Empate', odds: draw },
                      { short: teamShort(ev.away_team), full: `${ev.away_team} gana`, odds: away },
                    ]
                    return (
                      <div key={ev.id} className={`rounded-xl border p-3.5 transition-colors ${myPick ? 'border-black/[0.12] bg-black/[0.04]' : isStagingThis ? 'border-black/[0.12] bg-white/70' : 'border-black/[0.06] bg-white/70'}`}>
                        <div className="flex items-start justify-between gap-2 mb-2.5">
                          <div className="min-w-0">
                            <p className="text-ink font-semibold text-sm">{ev.event_name}</p>
                            <p className="text-ink-3 text-xs">{ev.league} · {fmtDate(ev.commence_time)}</p>
                          </div>
                          <div className="flex items-center gap-1.5 shrink-0">
                            {myPick?.status === 'pending' && !matchStarted && (
                              <button onClick={() => deletePick(myPick.id)} className="text-ink-3 hover:text-red-600 p-1">
                                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                              </button>
                            )}
                            {myPick && (
                              <span className={`text-xs px-2 py-1 rounded-full font-medium ${myPick.status === 'won' ? 'bg-green-500/20 text-green-600' : myPick.status === 'lost' ? 'bg-red-500/20 text-red-600' : 'bg-black/[0.08] text-ink-2'}`}>
                                {myPick.status === 'won' ? fmt(myPick.profit) : myPick.status === 'lost' ? fmt(myPick.profit) : `✓ ${teamShort(myPick.selection.replace(' gana', ''))} · ${fmt(myPick.stake)}`}
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="grid grid-cols-3 gap-2">
                          {outcomes.map(({ short, full, odds }) => {
                            if (!odds) return null
                            const isMyPick = myPick?.selection === full
                            const isStaged = isStagingThis && staged?.selection === full
                            return (
                              <button key={full} onClick={() => !myPick && stagePick(ev, full, odds)} disabled={!!myPick}
                                className={`rounded-lg border px-2 py-2.5 text-center transition-all ${
                                  isMyPick ? 'border-black/[0.18] bg-black/[0.08] cursor-default' :
                                  isStaged ? 'border-slate-400 bg-black/[0.08] ring-1 ring-slate-400/40' :
                                  myPick ? 'border-black/[0.06] bg-white/70 opacity-30 cursor-default' :
                                  'border-black/[0.08] bg-black/[0.04] hover:border-black/[0.18] hover:bg-black/[0.08] cursor-pointer'
                                }`}>
                                <div className={`text-xs font-bold ${isMyPick || isStaged ? 'text-ink' : 'text-ink-2'}`}>{short}</div>
                                <div className={`font-black text-sm mt-0.5 ${isMyPick || isStaged ? 'text-ink' : 'text-ink-2'}`}>{odds.toFixed(2)}</div>
                              </button>
                            )
                          })}
                        </div>
                        {myPick?.status === 'pending' && matchStarted && (
                          <p className="text-xs text-ink-3 mt-2">⏳ Pendiente de resultado</p>
                        )}
                        {isStagingThis && !myPick && (
                          <div className="mt-3 pt-3 border-t border-black/[0.06] space-y-2">
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-ink-2 flex-1">
                                <strong className="text-ink">{staged!.selection.replace(' gana', '')}</strong> @ <span className="text-ink font-bold">{staged!.odds.toFixed(2)}</span>
                              </span>
                              <div className="flex items-center gap-1.5">
                                <span className="text-xs text-ink-3">€</span>
                                <input type="number" value={stake} onChange={e => setStake(e.target.value)}
                                  className="w-16 rounded-lg border border-black/[0.08] bg-black/[0.04] px-2 py-1 text-ink text-xs text-center focus:border-black/[0.18] focus:outline-none"
                                  min="1" placeholder="50" />
                              </div>
                            </div>
                            <div className="text-xs text-ink-3">
                              Si aciertas: <span className="text-green-600 font-medium">+{((parseFloat(stake)||0) * (staged!.odds - 1)).toFixed(0)}€</span>
                              {' '}· Si fallas: <span className="text-red-600 font-medium">-{(parseFloat(stake)||0).toFixed(0)}€</span>
                            </div>
                            <QuickAI
                              event={ev.event_name}
                              league={ev.league}
                              selection={staged!.selection}
                              odds={staged!.odds}
                            />
                            <div className="flex gap-2">
                              <button onClick={() => setStaged(null)} className="text-xs text-ink-3 hover:text-ink px-3 py-1.5 rounded-lg border border-black/[0.08]">Cancelar</button>
                              <button onClick={() => confirmPick(ev)} disabled={loading === ev.id || !stake || parseFloat(stake) <= 0}
                                className="flex-1 text-xs bg-black/[0.08] hover:bg-black/[0.12] disabled:opacity-60 text-ink font-black py-1.5 rounded-lg">
                                {loading === ev.id ? '…' : '🎲 Simular pick'}
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              </section>
            ))}
          </div>
        </>
      )}

      {/* RANKING */}
      {tab === 'ranking' && (
        <div className="space-y-2">
          {leaderboard.length === 0 && <p className="text-ink-3 text-sm text-center py-10">Sin picks simulados todavía.</p>}
          {leaderboard.map((p, i) => (
            <div key={p.user_id} className="flex items-center gap-3 rounded-xl gb-card px-4 py-3">
              <span className="text-sm font-black text-ink-3 w-5">{i + 1}</span>
              <div className="w-8 h-8 rounded-full bg-black/[0.08] flex items-center justify-center text-xs font-black text-ink shrink-0">
                {p.username?.charAt(0).toUpperCase() ?? '?'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-ink font-bold text-sm">{p.username}</p>
                <p className="text-xs text-ink-3">{p.total_won}/{p.total_resolved} aciertos{p.win_rate ? ` · ${p.win_rate}%` : ''}</p>
              </div>
              <div className="text-right shrink-0">
                <p className={`font-black text-lg ${(p.net_profit || 0) >= 0 ? 'text-green-600' : 'text-red-600'}`}>{fmt(p.net_profit || 0)}</p>
                <p className="text-xs text-ink-3">beneficio</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* MIS PICKS */}
      {tab === 'mispicks' && (
        <div className="space-y-6">
          {pending.length > 0 && (
            <section>
              <h2 className="text-xs font-bold text-ink-3 uppercase tracking-widest mb-3">Pendientes ({pending.length})</h2>
              <div className="space-y-2">
                {pending.map(p => <SimPickCard key={p.id} pick={p} onDelete={deletePick} />)}
              </div>
            </section>
          )}
          {resolved.length > 0 && (
            <section>
              <h2 className="text-xs font-bold text-ink-3 uppercase tracking-widest mb-3">Historial ({resolved.length})</h2>
              <div className="space-y-2">
                {resolved.map(p => <SimPickCard key={p.id} pick={p} />)}
              </div>
            </section>
          )}
          {myPicks.length === 0 && <p className="text-ink-3 text-sm text-center py-10">Sin picks simulados todavía.</p>}
        </div>
      )}
    </main>
  )
}

function SimPickCard({ pick, onDelete }: { pick: MyPick; onDelete?: (id: string) => void }) {
  return (
    <div className={`rounded-xl border p-3.5 ${pick.status === 'won' ? 'border-green-500/20 bg-green-500/5' : pick.status === 'lost' ? 'border-red-500/20 bg-red-500/5' : 'border-black/[0.06] bg-white/70'}`}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <p className="text-ink font-medium text-sm">{pick.description}</p>
          <p className="text-ink-2 text-xs mt-0.5">→ {pick.selection} @ {pick.odds.toFixed(2)} · apostados {pick.stake.toFixed(0)}€</p>
        </div>
        <div className="text-right shrink-0 flex items-center gap-2">
          {pick.status === 'pending' && onDelete && (
            <button onClick={() => onDelete(pick.id)} className="text-ink-3 hover:text-red-600 p-1">
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          )}
          <span className={`text-sm font-black ${pick.status === 'won' ? 'text-green-600' : pick.status === 'lost' ? 'text-red-600' : 'text-ink-3'}`}>
            {pick.status === 'won' ? `+${pick.profit?.toFixed(0)}€` : pick.status === 'lost' ? `${pick.profit?.toFixed(0)}€` : '⏳'}
          </span>
        </div>
      </div>
    </div>
  )
}
