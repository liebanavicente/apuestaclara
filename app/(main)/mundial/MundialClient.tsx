'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import type { NormalizedEvent } from '@/types/odds'
import type { Group } from './groups'
import { teamShort } from './groups'

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

  const myPickMap = new Map(myPicks.map(p => [p.description, p]))
  const totalPoints = myPicks.reduce((s, p) => s + (p.points ?? 0), 0)

  // Groups that actually have matches
  const activeGroups = groups.filter(g => (matchesByGroup[g.id] ?? []).length > 0)

  const visibleGroups = activeGroup === 'all' ? activeGroups : activeGroups.filter(g => g.id === activeGroup)
  const showUnassigned = (activeGroup === 'all' || activeGroup === '?') && unassigned.length > 0

  function stagePick(ev: NormalizedEvent, selection: string, odds: number) {
    if (staged?.eventId === ev.id && staged.selection === selection) { setStaged(null); return }
    setStaged({ eventId: ev.id, selection, odds })
  }

  async function confirmPick(ev: NormalizedEvent, competition: string) {
    if (!staged || staged.eventId !== ev.id) return
    setLoading(ev.id)
    await fetch('/api/picks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        description: ev.event_name,
        competition,
        selection: staged.selection,
        odds: staged.odds,
        stake: 1,
        match_date: ev.commence_time,
      }),
    })
    setStaged(null)
    setLoading(null)
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

  async function deletePick(id: string) {
    await fetch(`/api/picks/${id}`, { method: 'DELETE' })
    router.refresh()
  }

  return (
    <main className="max-w-3xl mx-auto px-4 py-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-xl font-black text-white">🌍 Mundial 2026</h1>
          <p className="text-slate-500 text-xs mt-0.5">11 jun – 19 jul · USA, Canada, Mexico</p>
        </div>
        <div className="text-right">
          <span className="text-2xl font-black text-yellow-400">{totalPoints.toFixed(2)}</span>
          <span className="text-xs text-slate-500 ml-1">pts</span>
        </div>
      </div>

      {/* Group tabs */}
      <div className="flex gap-1.5 overflow-x-auto pb-2 mb-6 scrollbar-none">
        <button onClick={() => setActiveGroup('all')}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-colors shrink-0 ${activeGroup === 'all' ? 'bg-yellow-500 text-slate-950' : 'bg-slate-800 text-slate-400 hover:text-white'}`}>
          Todos
        </button>
        {activeGroups.map(g => (
          <button key={g.id} onClick={() => setActiveGroup(g.id)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-colors shrink-0 ${activeGroup === g.id ? 'bg-yellow-500 text-slate-950' : 'bg-slate-800 text-slate-400 hover:text-white'}`}>
            Grupo {g.id}
          </button>
        ))}
        {unassigned.length > 0 && (
          <button onClick={() => setActiveGroup('?')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-colors shrink-0 ${activeGroup === '?' ? 'bg-yellow-500 text-slate-950' : 'bg-slate-800 text-slate-400 hover:text-white'}`}>
            Otros
          </button>
        )}
      </div>

      {activeGroups.length === 0 && unassigned.length === 0 && (
        <div className="text-center py-16 text-slate-500">
          <p className="text-4xl mb-3">🌍</p>
          <p className="text-white font-medium">Sin partidos disponibles todavía</p>
          <p className="text-sm mt-1">Las cuotas del Mundial aparecerán cuando se acerquen los partidos</p>
        </div>
      )}

      <div className="space-y-8">
        {visibleGroups.map(group => {
          const matches = matchesByGroup[group.id] ?? []
          return (
            <section key={group.id}>
              {/* Group header */}
              <div className="flex items-center gap-3 mb-3">
                <div className="bg-yellow-500 text-slate-950 font-black text-sm w-8 h-8 rounded-lg flex items-center justify-center shrink-0">
                  {group.id}
                </div>
                <div>
                  <h2 className="text-white font-bold text-sm">Grupo {group.id}</h2>
                  <p className="text-slate-500 text-xs">{group.teams.map(t => t.name).join(' · ')}</p>
                </div>
                <span className="ml-auto text-xs text-slate-600">{matches.length} partido{matches.length !== 1 ? 's' : ''}</span>
              </div>

              <div className="space-y-2">
                {matches.map(ev => <MatchCard key={ev.id} ev={ev} competition={`Grupo ${group.id} · Mundial 2026`}
                  myPick={myPickMap.get(ev.event_name) ?? null}
                  staged={staged} onStage={stagePick} onConfirm={confirmPick}
                  onResolve={resolvePick} onDelete={deletePick} loading={loading} />)}
              </div>
            </section>
          )
        })}

        {/* Unassigned matches (knockouts, etc.) */}
        {showUnassigned && (
          <section>
            <div className="flex items-center gap-3 mb-3">
              <div className="bg-slate-700 text-slate-300 font-black text-xs w-8 h-8 rounded-lg flex items-center justify-center shrink-0">?</div>
              <h2 className="text-white font-bold text-sm">Sin grupo asignado</h2>
              <span className="ml-auto text-xs text-slate-600">{unassigned.length} partidos</span>
            </div>
            <div className="space-y-2">
              {unassigned.map(ev => <MatchCard key={ev.id} ev={ev} competition="Mundial 2026"
                myPick={myPickMap.get(ev.event_name) ?? null}
                staged={staged} onStage={stagePick} onConfirm={confirmPick}
                onResolve={resolvePick} onDelete={deletePick} loading={loading} />)}
            </div>
          </section>
        )}
      </div>
    </main>
  )
}

function MatchCard({ ev, competition, myPick, staged, onStage, onConfirm, onResolve, onDelete, loading }: {
  ev: NormalizedEvent
  competition: string
  myPick: MyPick | null
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

  return (
    <div className={`rounded-xl border p-3.5 transition-colors ${
      myPick ? 'border-yellow-500/30 bg-yellow-500/5' :
      isStagingThis ? 'border-yellow-500/20 bg-slate-900' :
      'border-slate-800 bg-slate-900/60'
    }`}>
      <div className="flex items-start justify-between gap-2 mb-2.5">
        <div className="min-w-0">
          <p className="text-white font-semibold text-sm">{ev.event_name}</p>
          <p className="text-slate-500 text-xs mt-0.5">{fmtDate(ev.commence_time)}</p>
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          {myPick?.status === 'pending' && (
            <button onClick={() => onDelete(myPick.id)} className="text-slate-600 hover:text-red-400 p-1">
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

      <div className="grid grid-cols-3 gap-2">
        {outcomes.map(({ short, full, odds }) => {
          if (!odds) return null
          const isMyPick = myPick?.selection === full
          const isStaged = isStagingThis && staged?.selection === full
          return (
            <button key={full} onClick={() => !myPick && onStage(ev, full, odds)} disabled={!!myPick}
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

      {/* Resolve after match */}
      {myPick?.status === 'pending' && matchStarted && (
        <div className="flex items-center gap-2 mt-3 pt-3 border-t border-slate-800">
          <span className="text-xs text-slate-400 flex-1">¿Acertaste <strong className="text-yellow-400">{myPick.selection.split(' ').pop()}</strong>?</span>
          <button onClick={() => onResolve(myPick.id, 'won')} className="text-xs bg-green-500/20 hover:bg-green-500/30 text-green-400 font-bold px-3 py-1.5 rounded-lg">✓ Sí</button>
          <button onClick={() => onResolve(myPick.id, 'lost')} className="text-xs bg-red-500/20 hover:bg-red-500/30 text-red-400 font-bold px-3 py-1.5 rounded-lg">✗ No</button>
        </div>
      )}

      {/* Confirm new pick */}
      {isStagingThis && !myPick && (
        <div className="flex items-center gap-2 mt-3 pt-3 border-t border-slate-800">
          <div className="flex-1 text-xs text-slate-400">
            <span className="text-white font-medium">{staged!.selection.split(' ').pop()}</span>
            {' '}@ <span className="text-yellow-400 font-black">{staged!.odds.toFixed(2)}</span>
            <span className="text-slate-600 ml-1">→ +{staged!.odds.toFixed(2)} pts si aciertas</span>
          </div>
          <button onClick={() => onStage(ev, staged!.selection, staged!.odds)} className="text-xs text-slate-500 hover:text-white px-3 py-1.5 rounded-lg border border-slate-700">Cancelar</button>
          <button onClick={() => onConfirm(ev, competition)} disabled={loading === ev.id}
            className="text-xs bg-yellow-500 hover:bg-yellow-400 disabled:opacity-60 text-slate-950 font-black px-4 py-1.5 rounded-lg">
            {loading === ev.id ? '…' : 'Confirmar ✓'}
          </button>
        </div>
      )}
    </div>
  )
}
