'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import type { NormalizedEvent } from '@/types/odds'
import Link from 'next/link'
import { teamShort } from '@/lib/teamShort'
import { PickConfirmedToast, shouldShowPickWarning } from '@/components/picks/PickConfirmedToast'
import { QuickAI } from '@/components/picks/QuickAI'
import { FriendSelectorModal } from '@/components/club/FriendSelectorModal'
import type { Friend } from '@/lib/services/club.service'

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
  activeFriend?: Friend | null
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

export function DashboardClient({ events, totalPoints, myPicks, inProgressPicks, activeFriend }: Props) {
  const router = useRouter()
  const [loading, setLoading] = useState<string | null>(null)
  const [staged, setStaged] = useState<StagedPick | null>(null)
  const [toast, setToast] = useState<{ odds: number } | null>(null)
  const [selectorOpen, setSelectorOpen] = useState(false)

  const myPickMap = new Map(myPicks.map(p => [p.description, p]))

  const featured = events
    .filter(e => new Date(e.commence_time).getTime() > Date.now())
    .filter(e => !myPickMap.has(e.event_name))
    .slice(0, 3)

  const byDay = events.reduce<Record<string, NormalizedEvent[]>>((acc, ev) => {
    const day = new Date(ev.commence_time).toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })
    ;(acc[day] ??= []).push(ev)
    return acc
  }, {})

  function stagePick(ev: NormalizedEvent, selection: string, odds: number) {
    if (!activeFriend) {
      setSelectorOpen(true)
      return
    }
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
    <main className="max-w-3xl mx-auto px-4 py-8">
      {toast && <PickConfirmedToast odds={toast.odds} onClose={() => { setToast(null); router.refresh() }} />}

      {/* Header */}
      <div className="flex items-center justify-between mb-8 anim-fade-in">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight">⚽ Partidos</h1>
          <p className="text-white/35 text-sm mt-0.5">LaLiga y Champions League · picks activos</p>
        </div>
        <div className="flex items-center gap-2.5">
          <div className="rounded-2xl px-4 py-2 text-right anim-glow-pulse"
            style={{ background:'rgba(234,179,8,0.10)', border:'1px solid rgba(234,179,8,0.28)' }}>
            <span className="text-xl font-black text-yellow-400">{totalPoints.toFixed(2)}</span>
            <span className="text-xs text-yellow-400/50 ml-1.5">pts</span>
          </div>
          <Link href="/ranking"
            className="text-xs text-white/60 hover:text-white font-semibold px-3 py-2 rounded-xl transition-all hover:bg-white/[0.07]"
            style={{ border:'1px solid rgba(255,255,255,0.10)' }}>
            🏆 Ranking
          </Link>
        </div>
      </div>

      {/* Banner if no active friend */}
      {!activeFriend && (
        <div className="mb-8 p-4 sm:p-5 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 anim-slide-up"
          style={{ background: 'rgba(234,179,8,0.08)', border: '1px solid rgba(234,179,8,0.25)', boxShadow: '0 4px 24px rgba(234,179,8,0.08)' }}>
          <div className="flex items-center gap-3">
            <span className="text-3xl sm:text-4xl">🐟</span>
            <div>
              <p className="text-white font-black text-base">¿Quién eres tú en el grupo?</p>
              <p className="text-xs text-white/50 mt-0.5">Elige tu nombre o apúntate con 1 clic para hacer picks y sumar puntos</p>
            </div>
          </div>
          <button
            onClick={() => setSelectorOpen(true)}
            className="w-full sm:w-auto shrink-0 px-5 py-2.5 rounded-xl bg-yellow-500 hover:bg-yellow-400 text-slate-950 font-black text-xs transition-all shadow-md shadow-yellow-500/20"
          >
            Elegir mi perfil →
          </button>
        </div>
      )}

      {/* In-progress picks */}
      {inProgressPicks.length > 0 && (
        <div className="mb-7 anim-slide-up">
          <h2 className="text-[10px] font-bold text-white/30 uppercase tracking-[0.12em] mb-3 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse inline-block" />
            En juego ahora
          </h2>
          <div className="space-y-2">
            {inProgressPicks.map(p => (
              <div key={p.id} className="rounded-2xl px-4 py-3 flex items-center justify-between gap-3"
                style={{ background:'rgba(34,197,94,0.07)', border:'1px solid rgba(34,197,94,0.20)' }}>
                <div className="min-w-0">
                  <p className="text-white font-semibold text-sm truncate">{p.description}</p>
                  <p className="text-green-400/80 text-xs mt-0.5 font-medium">
                    → {p.selection === 'Empate' ? 'Empate' : teamShort(p.selection.replace(' gana', ''))} @ {p.odds.toFixed(2)}
                  </p>
                </div>
                <span className="text-xs text-green-400 font-bold shrink-0 flex items-center gap-1.5 px-2.5 py-1 rounded-full"
                  style={{ background:'rgba(34,197,94,0.12)', border:'1px solid rgba(34,197,94,0.25)' }}>
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse inline-block" />
                  En juego
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Featured */}
      {featured.length > 0 && (
        <div className="mb-8">
          <h2 className="text-[10px] font-bold text-white/30 uppercase tracking-[0.12em] mb-3">🔥 Próximos sin pick</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 stagger">
            {featured.map(ev => {
              const { home, draw, away } = ev.best_odds
              const isStagingThis = staged?.eventId === ev.id
              return (
                <div key={ev.id}
                  className={`rounded-2xl p-4 transition-all anim-slide-up ${isStagingThis ? 'gb-card-pick' : 'gb-card'}`}>
                  <p className="text-white font-bold text-sm leading-tight truncate">{ev.event_name}</p>
                  <p className="text-white/35 text-xs mt-1 mb-3">{fmtDate(ev.commence_time)}</p>
                  <div className="grid grid-cols-3 gap-1.5">
                    {[
                      { short: teamShort(ev.home_team), full: `${ev.home_team} gana`, odds: home },
                      { short: 'X', full: 'Empate', odds: draw },
                      { short: teamShort(ev.away_team), full: `${ev.away_team} gana`, odds: away },
                    ].map(({ short, full, odds }) => odds ? (
                      <button key={full} onClick={() => stagePick(ev, full, odds)}
                        className={`rounded-xl py-2.5 text-center transition-all ${
                          isStagingThis && staged?.selection === full
                            ? 'gb-btn-odds-selected'
                            : 'gb-btn-odds'
                        }`}>
                        <div className={`text-[10px] font-bold ${isStagingThis && staged?.selection === full ? 'text-yellow-400' : 'text-white/40'}`}>{short}</div>
                        <div className={`font-black text-sm mt-0.5 ${isStagingThis && staged?.selection === full ? 'text-yellow-400' : 'text-white'}`}>{odds.toFixed(2)}</div>
                      </button>
                    ) : null)}
                  </div>
                  {isStagingThis && (
                    <div className="mt-3 space-y-2">
                      <QuickAI event={ev.event_name} league={ev.league} selection={staged!.selection} odds={staged!.odds} />
                      <div className="flex gap-2">
                        <button onClick={() => setStaged(null)}
                          className="text-xs text-white/40 hover:text-white/70 px-3 py-1.5 rounded-xl transition-colors"
                          style={{ border:'1px solid rgba(255,255,255,0.10)' }}>
                          Cancelar
                        </button>
                        <button onClick={() => confirmPick(ev)} disabled={loading === ev.id}
                          className="flex-1 text-xs font-black py-1.5 rounded-xl transition-all disabled:opacity-50 text-[#07080F]"
                          style={{ background:'linear-gradient(135deg,#EAB308,#F59E0B)', boxShadow:'0 4px 16px rgba(234,179,8,0.30)' }}>
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
        <div className="text-center py-20 anim-fade-in">
          <p className="text-5xl mb-4 anim-float inline-block">😴</p>
          <p className="text-white font-bold text-lg mt-4">Sin partidos disponibles</p>
          <p className="text-white/35 text-sm mt-1">Vuelve cuando se acerquen los partidos</p>
        </div>
      ) : (
        <div className="space-y-10">
          {Object.entries(byDay).map(([day, dayEvents]) => (
            <section key={day}>
              <h2 className="text-[10px] font-bold text-white/25 uppercase tracking-[0.12em] mb-4 capitalize">{day}</h2>
              <div className="space-y-3 stagger">
                {dayEvents.map((ev, idx) => {
                  const myPick = myPickMap.get(ev.event_name)
                  const { home, draw, away } = ev.best_odds
                  const isStagingThis = staged?.eventId === ev.id
                  const matchStarted = new Date(ev.commence_time).getTime() < Date.now()

                  const outcomes = [
                    { short: teamShort(ev.home_team), full: `${ev.home_team} gana`, odds: home },
                    { short: 'X', full: 'Empate', odds: draw },
                    { short: teamShort(ev.away_team), full: `${ev.away_team} gana`, odds: away },
                  ]

                  const cardClass = myPick?.status === 'won'
                    ? 'gb-card-won'
                    : myPick?.status === 'lost'
                    ? 'gb-card-lost'
                    : myPick || isStagingThis
                    ? 'gb-card-pick'
                    : 'gb-card'

                  return (
                    <div key={ev.id}
                      className={`rounded-2xl p-4 anim-slide-up transition-all ${cardClass}`}
                      style={{ animationDelay: `${idx * 40}ms` }}>
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <div className="min-w-0">
                          <p className="text-white font-bold text-sm leading-tight">{ev.event_name}</p>
                          <p className="text-white/35 text-xs mt-1">{ev.league} · {fmtDate(ev.commence_time)}</p>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          {myPick?.status === 'pending' && !matchStarted && (
                            <button onClick={() => deletePick(myPick.id)}
                              className="text-white/20 hover:text-red-400 transition-colors p-1 rounded-lg hover:bg-red-500/[0.10]">
                              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                          )}
                          {myPick && (
                            <span className={`text-xs px-2.5 py-1 rounded-full font-bold ${
                              myPick.status === 'won'
                                ? 'text-green-400'
                                : myPick.status === 'lost'
                                ? 'text-red-400'
                                : 'text-yellow-400'
                            }`}
                            style={{
                              background: myPick.status === 'won'
                                ? 'rgba(34,197,94,0.12)'
                                : myPick.status === 'lost'
                                ? 'rgba(239,68,68,0.12)'
                                : 'rgba(234,179,8,0.12)',
                              border: `1px solid ${myPick.status === 'won' ? 'rgba(34,197,94,0.25)' : myPick.status === 'lost' ? 'rgba(239,68,68,0.25)' : 'rgba(234,179,8,0.25)'}`,
                            }}>
                              {myPick.status === 'won'
                                ? `+${myPick.points.toFixed(2)} pts ✓`
                                : myPick.status === 'lost'
                                ? '0 pts ✗'
                                : `✓ ${myPick.selection === 'Empate' ? 'X' : teamShort(myPick.selection.replace(' gana', ''))} @ ${myPick.odds.toFixed(2)}`}
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
                            <button key={full}
                              onClick={() => !myPick && stagePick(ev, full, odds)}
                              disabled={!!myPick}
                              className={`rounded-xl py-3 text-center transition-all ${
                                isMyPick || isStaged
                                  ? 'gb-btn-odds-selected'
                                  : myPick
                                  ? 'opacity-30 cursor-default gb-btn-odds'
                                  : 'gb-btn-odds cursor-pointer'
                              }`}>
                              <div className={`text-[10px] font-bold ${isMyPick || isStaged ? 'text-yellow-400' : 'text-white/40'}`}>
                                {short}
                              </div>
                              <div className={`font-black text-[17px] mt-0.5 ${isMyPick || isStaged ? 'text-yellow-400' : 'text-white'}`}>
                                {odds.toFixed(2)}
                              </div>
                            </button>
                          )
                        })}
                      </div>

                      {myPick?.status === 'pending' && matchStarted && (
                        <p className="text-xs text-white/30 mt-3 flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-yellow-500/60 inline-block" />
                          Pendiente de resultado oficial
                        </p>
                      )}

                      {isStagingThis && !myPick && (
                        <div className="mt-3 pt-3 space-y-3"
                          style={{ borderTop:'1px solid rgba(234,179,8,0.15)' }}>
                          <div className="flex items-center justify-between gap-3">
                            <div className="text-sm text-white/50">
                              <span className="text-white font-bold">
                                {staged!.selection === 'Empate' ? 'Empate' : staged!.selection.replace(' gana', '')}
                              </span>
                              {' '}@ <span className="text-yellow-400 font-black">{staged!.odds.toFixed(2)}</span>
                              <span className="text-white/25 text-xs ml-2">+{staged!.odds.toFixed(2)} pts si aciertas</span>
                            </div>
                            <div className="flex gap-2 shrink-0">
                              <button onClick={() => setStaged(null)}
                                className="text-xs text-white/35 hover:text-white/60 px-3 py-1.5 rounded-xl transition-colors"
                                style={{ border:'1px solid rgba(255,255,255,0.08)' }}>
                                Cancelar
                              </button>
                              <button onClick={() => confirmPick(ev)} disabled={loading === ev.id}
                                className="text-xs font-black px-4 py-1.5 rounded-xl transition-all disabled:opacity-50 text-[#07080F]"
                                style={{ background:'linear-gradient(135deg,#EAB308,#F59E0B)', boxShadow:'0 4px 16px rgba(234,179,8,0.30)' }}>
                                {loading === ev.id ? '…' : 'Confirmar ✓'}
                              </button>
                            </div>
                          </div>
                          <QuickAI event={ev.event_name} league={ev.league} selection={staged!.selection} odds={staged!.odds} />
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

      <FriendSelectorModal
        isOpen={selectorOpen}
        onClose={() => setSelectorOpen(false)}
        currentFriendId={activeFriend?.id}
      />
    </main>
  )
}
