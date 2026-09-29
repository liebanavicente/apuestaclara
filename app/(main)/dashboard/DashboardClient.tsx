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
import { Trophy, Calendar, Sparkles, Trash2, CheckCircle2, Clock, AlertCircle } from 'lucide-react'

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
    <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      {toast && <PickConfirmedToast odds={toast.odds} onClose={() => { setToast(null); router.refresh() }} />}

      {/* Header — Apple / Google minimalist style */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 anim-fade-in">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">Partidos</h1>
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200/80">
              LaLiga & UCL
            </span>
          </div>
          <p className="text-slate-500 text-sm mt-1">
            Pronostica gratis con cuotas reales. Los puntos acumulados definen el ranking.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Points Pill */}
          <div className="flex items-center gap-3 px-4 py-2 rounded-2xl bg-white/80 backdrop-blur-xl border border-slate-200/80 shadow-xs">
            <div className="text-right">
              <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block leading-none">Mis Puntos</span>
              <span className="text-lg font-black text-amber-600">{totalPoints.toFixed(2)}</span>
            </div>
            <div className="w-8 h-8 rounded-xl bg-amber-50 border border-amber-200/60 flex items-center justify-center text-sm font-bold text-amber-600">
              🏆
            </div>
          </div>

          <Link
            href="/ranking"
            className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-2xl bg-white/80 hover:bg-white border border-slate-200/80 text-xs font-bold text-slate-700 hover:text-slate-900 shadow-xs transition-all"
          >
            <Trophy className="w-3.5 h-3.5 text-amber-500" />
            <span>Ranking</span>
          </Link>
        </div>
      </div>

      {/* Banner if no active friend */}
      {!activeFriend && (
        <div className="mb-8 p-5 sm:p-6 rounded-3xl bg-gradient-to-r from-amber-500/10 via-amber-400/5 to-transparent border border-amber-200/80 backdrop-blur-xl shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 anim-slide-up">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-white/90 border border-amber-200 flex items-center justify-center text-2xl shadow-xs shrink-0">
              🐟
            </div>
            <div>
              <p className="text-slate-900 font-extrabold text-base">¿Quién eres tú en el grupo?</p>
              <p className="text-xs text-slate-500 mt-0.5">Elige tu nombre o apúntate con 1 clic para guardar tus picks</p>
            </div>
          </div>
          <button
            onClick={() => setSelectorOpen(true)}
            className="w-full sm:w-auto shrink-0 px-5 py-2.5 rounded-full bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-md shadow-slate-900/10 transition-all active:scale-95"
          >
            Elegir mi perfil →
          </button>
        </div>
      )}

      {/* In-progress picks */}
      {inProgressPicks.length > 0 && (
        <div className="mb-8 anim-slide-up">
          <h2 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            En juego ahora
          </h2>
          <div className="space-y-2">
            {inProgressPicks.map(p => (
              <div
                key={p.id}
                className="rounded-2xl px-4 py-3 bg-emerald-50/80 border border-emerald-200/80 flex items-center justify-between gap-3 shadow-xs"
              >
                <div className="min-w-0">
                  <p className="text-slate-900 font-bold text-sm truncate">{p.description}</p>
                  <p className="text-emerald-700 text-xs mt-0.5 font-medium">
                    → Pronóstico: <strong>{p.selection === 'Empate' ? 'Empate' : teamShort(p.selection.replace(' gana', ''))}</strong> @ {p.odds.toFixed(2)}
                  </p>
                </div>
                <span className="text-xs text-emerald-800 bg-white/90 font-bold px-3 py-1 rounded-full border border-emerald-200 shadow-xs flex items-center gap-1.5 shrink-0">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  En directo
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Featured next matches */}
      {featured.length > 0 && (
        <div className="mb-10">
          <div className="flex items-center gap-1.5 mb-3">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <h2 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Próximos partidos destacados</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 stagger">
            {featured.map(ev => {
              const { home, draw, away } = ev.best_odds
              const isStagingThis = staged?.eventId === ev.id
              return (
                <div
                  key={ev.id}
                  className={`rounded-3xl p-4 transition-all anim-slide-up ${
                    isStagingThis ? 'gb-card-pick ring-2 ring-amber-400' : 'gb-card'
                  }`}
                >
                  <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1.5">
                    <span className="font-semibold text-slate-500 truncate max-w-[140px]">{ev.league}</span>
                    <span>{fmtDate(ev.commence_time)}</span>
                  </div>
                  <p className="text-slate-900 font-extrabold text-sm leading-tight truncate mb-3">{ev.event_name}</p>
                  <div className="grid grid-cols-3 gap-1.5">
                    {[
                      { short: teamShort(ev.home_team), full: `${ev.home_team} gana`, odds: home },
                      { short: 'X', full: 'Empate', odds: draw },
                      { short: teamShort(ev.away_team), full: `${ev.away_team} gana`, odds: away },
                    ].map(({ short, full, odds }) => odds ? (
                      <button
                        key={full}
                        onClick={() => stagePick(ev, full, odds)}
                        className={`rounded-2xl py-2.5 text-center transition-all ${
                          isStagingThis && staged?.selection === full
                            ? 'gb-btn-odds-selected'
                            : 'gb-btn-odds'
                        }`}
                      >
                        <div className="text-[10px] font-bold tracking-tight opacity-75">{short}</div>
                        <div className="font-black text-sm mt-0.5">{odds.toFixed(2)}</div>
                      </button>
                    ) : null)}
                  </div>

                  {isStagingThis && (
                    <div className="mt-3 pt-3 border-t border-amber-300/60 space-y-2">
                      <QuickAI event={ev.event_name} league={ev.league} selection={staged!.selection} odds={staged!.odds} />
                      <div className="flex gap-2">
                        <button
                          onClick={() => setStaged(null)}
                          className="text-xs font-semibold text-slate-500 hover:text-slate-800 px-3 py-1.5 rounded-full border border-slate-200 transition-colors"
                        >
                          Cancelar
                        </button>
                        <button
                          onClick={() => confirmPick(ev)}
                          disabled={loading === ev.id}
                          className="flex-1 text-xs font-bold py-1.5 rounded-full bg-slate-900 hover:bg-slate-800 text-white transition-all disabled:opacity-50 shadow-sm"
                        >
                          {loading === ev.id ? 'Guardando...' : 'Confirmar ✓'}
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

      {/* Events grouped by day */}
      {events.length === 0 ? (
        <div className="text-center py-20 bg-white/60 backdrop-blur-xl rounded-3xl border border-slate-200/80 p-8 shadow-xs anim-fade-in">
          <p className="text-4xl mb-3 anim-float inline-block">😴</p>
          <p className="text-slate-900 font-extrabold text-base">Sin partidos programados</p>
          <p className="text-slate-400 text-xs mt-1 max-w-sm mx-auto">
            No hay partidos inmediatos de LaLiga ni Champions League en The Odds API. Vuelve en unas horas.
          </p>
        </div>
      ) : (
        <div className="space-y-10">
          {Object.entries(byDay).map(([day, dayEvents]) => (
            <section key={day}>
              <div className="flex items-center gap-2 mb-4">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider capitalize">{day}</h2>
              </div>

              <div className="space-y-3.5 stagger">
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
                    <div
                      key={ev.id}
                      className={`rounded-3xl p-5 anim-slide-up transition-all ${cardClass}`}
                      style={{ animationDelay: `${idx * 30}ms` }}
                    >
                      <div className="flex items-start justify-between gap-3 mb-3.5">
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200/80">
                              {ev.league}
                            </span>
                            <span className="text-xs text-slate-400 flex items-center gap-1 font-medium">
                              <Clock className="w-3 h-3 text-slate-400" />
                              {fmtDate(ev.commence_time)}
                            </span>
                          </div>
                          <p className="text-slate-900 font-extrabold text-base leading-tight truncate">
                            {ev.event_name}
                          </p>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          {myPick?.status === 'pending' && !matchStarted && (
                            <button
                              onClick={() => deletePick(myPick.id)}
                              title="Eliminar pronóstico"
                              className="text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors p-1.5 rounded-xl border border-transparent hover:border-rose-200"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                          {myPick && (
                            <span
                              className={`text-xs px-3 py-1 rounded-full font-bold shadow-xs flex items-center gap-1 ${
                                myPick.status === 'won'
                                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                                  : myPick.status === 'lost'
                                  ? 'bg-rose-100 text-rose-800 border border-rose-300'
                                  : 'bg-amber-100 text-amber-900 border border-amber-300'
                              }`}
                            >
                              {myPick.status === 'won' ? (
                                <>
                                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                                  +{myPick.points.toFixed(2)} pts ✓
                                </>
                              ) : myPick.status === 'lost' ? (
                                '0 pts ✗'
                              ) : (
                                `✓ ${myPick.selection === 'Empate' ? 'X' : teamShort(myPick.selection.replace(' gana', ''))} @ ${myPick.odds.toFixed(2)}`
                              )}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Odds segmented buttons */}
                      <div className="grid grid-cols-3 gap-2">
                        {outcomes.map(({ short, full, odds }) => {
                          if (!odds) return null
                          const isMyPick = myPick?.selection === full
                          const isStaged = isStagingThis && staged?.selection === full
                          return (
                            <button
                              key={full}
                              onClick={() => !myPick && stagePick(ev, full, odds)}
                              disabled={!!myPick}
                              className={`rounded-2xl py-3 text-center transition-all ${
                                isMyPick || isStaged
                                  ? 'gb-btn-odds-selected'
                                  : myPick
                                  ? 'opacity-40 cursor-default gb-btn-odds'
                                  : 'gb-btn-odds cursor-pointer'
                              }`}
                            >
                              <div className="text-[10px] font-bold opacity-75 tracking-tight">{short}</div>
                              <div className="font-extrabold text-base mt-0.5">{odds.toFixed(2)}</div>
                            </button>
                          )
                        })}
                      </div>

                      {myPick?.status === 'pending' && matchStarted && (
                        <p className="text-xs text-amber-700 mt-3 flex items-center gap-1.5 font-medium">
                          <AlertCircle className="w-3.5 h-3.5 text-amber-500" />
                          Partido en juego o finalizado · Pendiente de resultado
                        </p>
                      )}

                      {/* Staged confirmation drawer */}
                      {isStagingThis && !myPick && (
                        <div className="mt-4 pt-4 border-t border-amber-300/50 space-y-3 anim-slide-up">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                            <div className="text-xs text-slate-600">
                              Selección:{' '}
                              <strong className="text-slate-900 font-extrabold text-sm">
                                {staged!.selection === 'Empate' ? 'Empate' : staged!.selection.replace(' gana', '')}
                              </strong>{' '}
                              a cuota <strong className="text-amber-700 font-black">@{staged!.odds.toFixed(2)}</strong>
                              <span className="text-slate-400 ml-2">
                                (+{staged!.odds.toFixed(2)} puntos si aciertas)
                              </span>
                            </div>
                            <div className="flex gap-2 shrink-0">
                              <button
                                onClick={() => setStaged(null)}
                                className="text-xs font-semibold text-slate-500 hover:text-slate-800 px-4 py-2 rounded-full border border-slate-200 transition-colors"
                              >
                                Cancelar
                              </button>
                              <button
                                onClick={() => confirmPick(ev)}
                                disabled={loading === ev.id}
                                className="text-xs font-bold px-5 py-2 rounded-full bg-slate-900 hover:bg-slate-800 text-white transition-all disabled:opacity-50 shadow-md shadow-slate-900/10 active:scale-95"
                              >
                                {loading === ev.id ? 'Guardando...' : 'Confirmar pick ✓'}
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
