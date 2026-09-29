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
import { Trophy, Sparkles, Trash2, CheckCircle2, Clock, AlertCircle } from 'lucide-react'

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
    <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-8 pb-16">
      {toast && <PickConfirmedToast odds={toast.odds} onClose={() => { setToast(null); router.refresh() }} />}

      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-5 mb-8 anim-fade-in">
        <div>
          <p className="gb-eyebrow mb-1.5">LaLiga · Champions</p>
          <h1 className="text-4xl sm:text-5xl font-bold tracking-[-0.04em] text-ink">Partidos</h1>
          <p className="text-ink-2 text-[15px] mt-2">Elige 1, X o 2. Si aciertas, sumas la cuota.</p>
        </div>

        <Link
          href="/ranking"
          className="gb-card gb-card-hover rounded-2xl pl-4 pr-3 py-2.5 flex items-center gap-4 self-start sm:self-auto"
        >
          <div>
            <span className="gb-eyebrow block">Mis puntos</span>
            <span className="text-2xl font-semibold tracking-[-0.03em] text-ink tabular-nums">{totalPoints.toFixed(2)}</span>
          </div>
          <span className="w-9 h-9 rounded-full bg-amber-500/12 text-amber-600 flex items-center justify-center">
            <Trophy className="w-4 h-4" />
          </span>
        </Link>
      </div>

      {/* No active friend */}
      {!activeFriend && (
        <div className="mb-8 gb-card rounded-3xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 anim-slide-up">
          <div className="flex items-center gap-3.5">
            <span className="w-11 h-11 rounded-2xl bg-gradient-to-b from-amber-300 to-amber-500 flex items-center justify-center text-xl shrink-0 shadow-[inset_0_1px_0_rgba(255,255,255,0.5)]">
              🐟
            </span>
            <div>
              <p className="text-ink font-semibold text-[15px] tracking-[-0.01em]">¿Quién eres en el grupo?</p>
              <p className="text-sm text-ink-2 mt-0.5">Elige tu nombre para guardar tus picks.</p>
            </div>
          </div>
          <button onClick={() => setSelectorOpen(true)} className="gb-btn gb-btn-primary w-full sm:w-auto shrink-0">
            Elegir perfil
          </button>
        </div>
      )}

      {/* In-progress picks */}
      {inProgressPicks.length > 0 && (
        <section className="mb-10 anim-slide-up">
          <h2 className="gb-eyebrow mb-3 flex items-center gap-2">
            <span className="relative flex w-2 h-2">
              <span className="absolute inset-0 rounded-full bg-emerald-500 animate-ping opacity-60" />
              <span className="relative w-2 h-2 rounded-full bg-emerald-500" />
            </span>
            En juego ahora
          </h2>
          <div className="gb-card rounded-3xl divide-y divide-black/[0.06] overflow-hidden">
            {inProgressPicks.map(p => (
              <div key={p.id} className="px-4 py-3.5 flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-ink font-semibold text-[15px] truncate tracking-[-0.01em]">{p.description}</p>
                  <p className="text-ink-2 text-sm mt-0.5">
                    {p.selection === 'Empate' ? 'Empate' : teamShort(p.selection.replace(' gana', ''))}
                    <span className="text-ink-3"> @ </span>
                    <span className="tabular-nums">{p.odds.toFixed(2)}</span>
                  </p>
                </div>
                <span className="gb-chip gb-chip-green shrink-0">En directo</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Featured next matches */}
      {featured.length > 0 && (
        <section className="mb-12">
          <h2 className="gb-eyebrow mb-3 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            Próximos destacados
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 stagger">
            {featured.map(ev => {
              const { home, draw, away } = ev.best_odds
              const isStagingThis = staged?.eventId === ev.id
              return (
                <div
                  key={ev.id}
                  className={`rounded-3xl p-4 anim-slide-up ${isStagingThis ? 'gb-card-pick' : 'gb-card'}`}
                >
                  <div className="flex items-center justify-between gap-2 text-xs text-ink-3 mb-1.5">
                    <span className="truncate">{ev.league}</span>
                    <span className="shrink-0">{fmtDate(ev.commence_time)}</span>
                  </div>
                  <p className="text-ink font-semibold text-[15px] leading-snug tracking-[-0.01em] truncate mb-3">{ev.event_name}</p>
                  <div className="grid grid-cols-3 gap-1.5">
                    {[
                      { short: teamShort(ev.home_team), full: `${ev.home_team} gana`, odds: home },
                      { short: 'X', full: 'Empate', odds: draw },
                      { short: teamShort(ev.away_team), full: `${ev.away_team} gana`, odds: away },
                    ].map(({ short, full, odds }) => odds ? (
                      <OddsButton
                        key={full}
                        label={short}
                        odds={odds}
                        selected={isStagingThis && staged?.selection === full}
                        onClick={() => stagePick(ev, full, odds)}
                        compact
                      />
                    ) : null)}
                  </div>

                  {isStagingThis && (
                    <div className="mt-3 pt-3 border-t border-amber-500/20 space-y-3 anim-fade-in">
                      <QuickAI event={ev.event_name} league={ev.league} selection={staged!.selection} odds={staged!.odds} />
                      <div className="flex gap-2">
                        <button onClick={() => setStaged(null)} className="gb-btn gb-btn-ghost gb-btn-sm">
                          Cancelar
                        </button>
                        <button
                          onClick={() => confirmPick(ev)}
                          disabled={loading === ev.id}
                          className="gb-btn gb-btn-primary gb-btn-sm flex-1"
                        >
                          {loading === ev.id ? 'Guardando…' : 'Confirmar'}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </section>
      )}

      {/* Events grouped by day */}
      {events.length === 0 ? (
        <div className="text-center py-16 px-6 gb-card rounded-3xl anim-fade-in">
          <p className="text-5xl mb-4 anim-float inline-block">😴</p>
          <p className="text-ink font-semibold text-lg tracking-[-0.02em]">Sin partidos programados</p>
          <p className="text-ink-2 text-sm mt-1.5 max-w-sm mx-auto">
            Ahora mismo no hay partidos de LaLiga ni Champions con cuotas. Vuelve en unas horas.
          </p>
        </div>
      ) : (
        <div className="space-y-10">
          {Object.entries(byDay).map(([day, dayEvents]) => (
            <section key={day}>
              <h2 className="text-xl font-semibold tracking-[-0.025em] text-ink first-letter:uppercase mb-3">{day}</h2>

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
                    <div
                      key={ev.id}
                      className={`rounded-3xl p-4 sm:p-5 anim-slide-up ${cardClass}`}
                      style={{ animationDelay: `${idx * 30}ms` }}
                    >
                      <div className="flex items-start justify-between gap-3 mb-4">
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 mb-1.5">
                            <span className="gb-chip">{ev.league}</span>
                            <span className="text-xs text-ink-3 flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {fmtDate(ev.commence_time)}
                            </span>
                          </div>
                          <p className="text-ink font-semibold text-[17px] leading-snug tracking-[-0.02em] truncate">
                            {ev.event_name}
                          </p>
                        </div>

                        <div className="flex items-center gap-1.5 shrink-0">
                          {myPick?.status === 'pending' && !matchStarted && (
                            <button
                              onClick={() => deletePick(myPick.id)}
                              title="Eliminar pronóstico"
                              aria-label="Eliminar pronóstico"
                              className="w-8 h-8 flex items-center justify-center rounded-full text-ink-3 hover:text-rose-600 hover:bg-rose-500/10 transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                          {myPick && (
                            <span
                              className={`gb-chip tabular-nums ${
                                myPick.status === 'won'
                                  ? 'gb-chip-green'
                                  : myPick.status === 'lost'
                                  ? 'gb-chip-red'
                                  : 'gb-chip-amber'
                              }`}
                            >
                              {myPick.status === 'won' ? (
                                <>
                                  <CheckCircle2 className="w-3 h-3" />
                                  +{myPick.points.toFixed(2)} pts
                                </>
                              ) : myPick.status === 'lost' ? (
                                '0 pts'
                              ) : (
                                `${myPick.selection === 'Empate' ? 'X' : teamShort(myPick.selection.replace(' gana', ''))} @ ${myPick.odds.toFixed(2)}`
                              )}
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
                            <OddsButton
                              key={full}
                              label={short}
                              odds={odds}
                              selected={isMyPick || isStaged}
                              muted={!!myPick && !isMyPick}
                              disabled={!!myPick}
                              onClick={() => !myPick && stagePick(ev, full, odds)}
                            />
                          )
                        })}
                      </div>

                      {myPick?.status === 'pending' && matchStarted && (
                        <p className="text-sm text-amber-700 mt-3 flex items-center gap-1.5">
                          <AlertCircle className="w-4 h-4 text-amber-500" />
                          En juego o finalizado · pendiente de resultado
                        </p>
                      )}

                      {isStagingThis && !myPick && (
                        <div className="mt-4 pt-4 border-t border-amber-500/20 space-y-3 anim-fade-in">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                            <p className="text-sm text-ink-2">
                              <span className="font-semibold text-ink">
                                {staged!.selection === 'Empate' ? 'Empate' : staged!.selection.replace(' gana', '')}
                              </span>{' '}
                              @ <span className="tabular-nums font-semibold text-ink">{staged!.odds.toFixed(2)}</span>
                              <span className="text-ink-3"> · +{staged!.odds.toFixed(2)} pts si aciertas</span>
                            </p>
                            <div className="flex gap-2 shrink-0">
                              <button onClick={() => setStaged(null)} className="gb-btn gb-btn-ghost gb-btn-sm">
                                Cancelar
                              </button>
                              <button
                                onClick={() => confirmPick(ev)}
                                disabled={loading === ev.id}
                                className="gb-btn gb-btn-primary gb-btn-sm flex-1 sm:flex-none"
                              >
                                {loading === ev.id ? 'Guardando…' : 'Confirmar pick'}
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
    </div>
  )
}

function OddsButton({
  label, odds, selected, muted, disabled, compact, onClick,
}: {
  label: string
  odds: number
  selected?: boolean
  muted?: boolean
  disabled?: boolean
  compact?: boolean
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      aria-pressed={selected}
      className={`rounded-2xl text-center ${compact ? 'py-2.5' : 'py-3'} ${
        selected ? 'gb-btn-odds-selected' : 'gb-btn-odds'
      } ${muted ? 'opacity-40' : ''} ${disabled ? 'cursor-default' : 'cursor-pointer'}`}
    >
      <div className="text-[11px] font-medium opacity-60 truncate px-1">{label}</div>
      <div className={`gb-odds-value font-semibold tabular-nums tracking-[-0.01em] mt-0.5 ${compact ? 'text-[15px]' : 'text-lg'}`}>
        {odds.toFixed(2)}
      </div>
    </button>
  )
}
