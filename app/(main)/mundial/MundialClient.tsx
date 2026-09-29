'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import type { NormalizedEvent } from '@/types/odds'
import type { Group } from './groups'
import { teamShort } from './groups'
import { PickConfirmedToast, shouldShowPickWarning } from '@/components/picks/PickConfirmedToast'

interface MyPick {
  id: string
  description: string
  selection: string
  odds: number
  status: string
  points: number
}

interface StagedPick {
  eventId: string
  selection: string
  odds: number
}

interface Props {
  groups: Group[]
  matchesByGroup: Record<string, NormalizedEvent[]>
  unassigned: NormalizedEvent[]
  myPicks: MyPick[]
}

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString('es-ES', {
    day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit',
  })
}

export function MundialClient({ groups, matchesByGroup, unassigned, myPicks }: Props) {
  const router = useRouter()
  const [activeGroup, setActiveGroup] = useState<string>('all')
  const [staged, setStaged] = useState<StagedPick | null>(null)
  const [loading, setLoading] = useState<string | null>(null)
  const [toast, setToast] = useState<{ odds: number } | null>(null)

  const myPickMap = new Map(myPicks.map(p => [p.description, p]))
  const totalPoints = myPicks.reduce((s, p) => s + (p.points ?? 0), 0)

  const activeGroups = groups.filter(g => (matchesByGroup[g.id] ?? []).length > 0)
  const visibleGroups = activeGroup === 'all' ? activeGroups : activeGroups.filter(g => g.id === activeGroup)
  const showUnassigned = (activeGroup === 'all' || activeGroup === '?') && unassigned.length > 0

  const groupOptions = [
    { key: 'all', label: 'Todos los grupos' },
    ...activeGroups.map(g => ({ key: g.id, label: `Grupo ${g.id} — ${g.teams.map(t => t.name).join(', ')}` })),
    ...(unassigned.length > 0 ? [{ key: '?', label: 'Otros partidos' }] : []),
  ]

  function stagePick(ev: NormalizedEvent, selection: string, odds: number) {
    if (staged?.eventId === ev.id && staged.selection === selection) { setStaged(null); return }
    setStaged({ eventId: ev.id, selection, odds })
  }

  async function confirmPick(ev: NormalizedEvent, competition: string) {
    if (!staged || staged.eventId !== ev.id) return
    setLoading(ev.id)
    const confirmedOdds = staged.odds
    await fetch('/api/picks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        description: ev.event_name,
        competition,
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

  async function resolvePick(id: string, result: 'won' | 'lost') {
    await fetch(`/api/picks/${id}/resolve`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ result }),
    })
    router.refresh()
  }

  async function deletePick(id: string) {
    await fetch(`/api/picks/${id}`, { method: 'DELETE' })
    router.refresh()
  }

  return (
    <main className="max-w-3xl mx-auto px-4 py-8">
      {toast && (
        <PickConfirmedToast odds={toast.odds} onClose={() => { setToast(null); router.refresh() }} />
      )}

      {/* Header */}
      <div className="flex items-center justify-between mb-8 anim-fade-in">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight">🌍 Mundial 2026</h1>
          <p className="text-white/35 text-sm mt-0.5">11 jun – 19 jul · USA, Canada, Mexico</p>
        </div>
        <div className="rounded-2xl px-4 py-2 text-right"
          style={{ background:'rgba(234,179,8,0.10)', border:'1px solid rgba(234,179,8,0.28)' }}>
          <span className="text-xl font-black text-yellow-400">{totalPoints.toFixed(2)}</span>
          <span className="text-xs text-yellow-400/50 ml-1.5">pts</span>
        </div>
      </div>

      {/* Group selector */}
      <div className="mb-7">
        <select
          value={activeGroup}
          onChange={e => setActiveGroup(e.target.value)}
          className="sm:hidden w-full rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none"
          style={{ background:'rgba(255,255,255,0.07)', border:'1px solid rgba(255,255,255,0.12)' }}
        >
          {groupOptions.map(o => (
            <option key={o.key} value={o.key} style={{ background:'#0f1020' }}>{o.label}</option>
          ))}
        </select>

        <div className="hidden sm:flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {[{ key:'all', label:'Todos' }, ...activeGroups.map(g => ({ key:g.id, label:`Grp ${g.id}` })), ...(unassigned.length > 0 ? [{ key:'?', label:'Otros' }] : [])].map(o => (
            <button key={o.key} onClick={() => setActiveGroup(o.key)}
              className="px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all shrink-0"
              style={activeGroup === o.key ? {
                background:'rgba(255,255,255,0.13)',
                border:'1px solid rgba(255,255,255,0.18)',
                color:'white',
              } : {
                background:'rgba(255,255,255,0.05)',
                border:'1px solid rgba(255,255,255,0.08)',
                color:'rgba(255,255,255,0.40)',
              }}>
              {o.label}
            </button>
          ))}
        </div>
      </div>

      {activeGroups.length === 0 && unassigned.length === 0 && (
        <div className="text-center py-20 anim-fade-in">
          <p className="text-5xl mb-4">🌍</p>
          <p className="text-white font-bold text-lg">Sin partidos disponibles todavía</p>
          <p className="text-white/35 text-sm mt-1">Las cuotas del Mundial aparecerán cuando se acerquen los partidos</p>
        </div>
      )}

      <div className="space-y-10">
        {visibleGroups.map(group => {
          const matches = matchesByGroup[group.id] ?? []
          return (
            <section key={group.id}>
              <div className="flex items-center gap-3 mb-4">
                <div className="font-black text-sm w-9 h-9 rounded-xl flex items-center justify-center shrink-0 text-[#07080F]"
                  style={{ background:'linear-gradient(135deg,#EAB308,#F59E0B)', boxShadow:'0 2px 12px rgba(234,179,8,0.25)' }}>
                  {group.id}
                </div>
                <div>
                  <h2 className="text-white font-bold text-sm">Grupo {group.id}</h2>
                  <p className="text-white/35 text-xs">{group.teams.map(t => t.name).join(' · ')}</p>
                </div>
                <span className="ml-auto text-xs text-white/25 font-medium">
                  {matches.length} partido{matches.length !== 1 ? 's' : ''}
                </span>
              </div>
              <div className="space-y-3 stagger">
                {matches.map(ev => (
                  <MatchCard key={ev.id} ev={ev} competition={`Grupo ${group.id} · Mundial 2026`}
                    myPick={myPickMap.get(ev.event_name) ?? null}
                    staged={staged} onStage={stagePick} onConfirm={confirmPick}
                    onResolve={resolvePick} onDelete={deletePick} loading={loading} />
                ))}
              </div>
            </section>
          )
        })}

        {showUnassigned && (
          <section>
            <div className="flex items-center gap-3 mb-4">
              <div className="text-white/30 font-black text-xs w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                style={{ background:'rgba(255,255,255,0.06)', border:'1px solid rgba(255,255,255,0.09)' }}>?</div>
              <h2 className="text-white font-bold text-sm">Sin grupo asignado</h2>
            </div>
            <div className="space-y-3 stagger">
              {unassigned.map(ev => (
                <MatchCard key={ev.id} ev={ev} competition="Mundial 2026"
                  myPick={myPickMap.get(ev.event_name) ?? null}
                  staged={staged} onStage={stagePick} onConfirm={confirmPick}
                  onResolve={resolvePick} onDelete={deletePick} loading={loading} />
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  )
}

function MatchCard({ ev, competition, myPick, staged, onStage, onConfirm, onResolve, onDelete, loading }: {
  ev: NormalizedEvent; competition: string; myPick: MyPick | null
  staged: StagedPick | null
  onStage: (ev: NormalizedEvent, sel: string, odds: number) => void
  onConfirm: (ev: NormalizedEvent, comp: string) => void
  onResolve: (id: string, r: 'won' | 'lost') => void
  onDelete: (id: string) => void
  loading: string | null
}) {
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
    <div className={`rounded-2xl p-4 transition-all anim-slide-up ${cardClass}`}>
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="min-w-0">
          <p className="text-white font-bold text-sm leading-tight">{ev.event_name}</p>
          <p className="text-white/35 text-xs mt-1">{fmtDate(ev.commence_time)}</p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {myPick?.status === 'pending' && !matchStarted && (
            <button onClick={() => onDelete(myPick.id)}
              className="text-white/20 hover:text-red-400 transition-colors p-1 rounded-lg hover:bg-red-500/[0.10]">
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
          {myPick && (
            <span className={`text-xs px-2.5 py-1 rounded-full font-bold ${
              myPick.status === 'won' ? 'text-green-400'
              : myPick.status === 'lost' ? 'text-red-400'
              : 'text-yellow-400'
            }`}
            style={{
              background: myPick.status === 'won' ? 'rgba(34,197,94,0.12)'
                : myPick.status === 'lost' ? 'rgba(239,68,68,0.12)'
                : 'rgba(234,179,8,0.12)',
              border: `1px solid ${myPick.status === 'won' ? 'rgba(34,197,94,0.25)' : myPick.status === 'lost' ? 'rgba(239,68,68,0.25)' : 'rgba(234,179,8,0.25)'}`,
            }}>
              {myPick.status === 'won'
                ? `+${myPick.points.toFixed(2)} pts ✓`
                : myPick.status === 'lost' ? '0 pts ✗'
                : `✓ ${teamShort(myPick.selection.replace(' gana', ''))} @ ${myPick.odds.toFixed(2)}`}
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
            <button key={full} onClick={() => !myPick && onStage(ev, full, odds)} disabled={!!myPick}
              className={`rounded-xl py-3 text-center transition-all ${
                isMyPick || isStaged ? 'gb-btn-odds-selected'
                : myPick ? 'gb-btn-odds opacity-30 cursor-default'
                : 'gb-btn-odds cursor-pointer'
              }`}>
              <div className={`text-[10px] font-bold ${isMyPick || isStaged ? 'text-yellow-400' : 'text-white/40'}`}>{short}</div>
              <div className={`font-black text-[17px] mt-0.5 ${isMyPick || isStaged ? 'text-yellow-400' : 'text-white'}`}>{odds.toFixed(2)}</div>
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
        <div className="mt-3 pt-3" style={{ borderTop:'1px solid rgba(234,179,8,0.15)' }}>
          <div className="flex items-center justify-between gap-3">
            <div className="text-sm text-white/50">
              <span className="text-white font-bold">{staged!.selection.replace(' gana', '')}</span>
              {' '}@ <span className="text-yellow-400 font-black">{staged!.odds.toFixed(2)}</span>
              <span className="text-white/25 text-xs ml-2">+{staged!.odds.toFixed(2)} pts si aciertas</span>
            </div>
            <div className="flex gap-2 shrink-0">
              <button onClick={() => onStage(ev, staged!.selection, staged!.odds)}
                className="text-xs text-white/35 hover:text-white/60 px-3 py-1.5 rounded-xl transition-colors"
                style={{ border:'1px solid rgba(255,255,255,0.08)' }}>
                Cancelar
              </button>
              <button onClick={() => onConfirm(ev, competition)} disabled={loading === ev.id}
                className="text-xs font-black px-4 py-1.5 rounded-xl transition-all disabled:opacity-50 text-[#07080F]"
                style={{ background:'linear-gradient(135deg,#EAB308,#F59E0B)', boxShadow:'0 4px 16px rgba(234,179,8,0.30)' }}>
                {loading === ev.id ? '…' : 'Confirmar ✓'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
