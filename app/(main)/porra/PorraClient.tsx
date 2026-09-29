'use client'
import { useState, useTransition, useCallback, useMemo } from 'react'
import { useRouter } from 'next/navigation'

interface PorraPick {
  id: string
  home_goals: number
  away_goals: number
  user_id: string
  created_at: string
  profiles: { username: string | null } | null
}

interface Props {
  picks: PorraPick[]
  myUserId: string | null
  matchId: string
}

const MAX_GOALS = 6

export function PorraClient({ picks, myUserId, matchId }: Props) {
  const router = useRouter()
  const [pending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const [optimisticMy, setOptimisticMy] = useState<{ h: number; a: number } | null>(() => {
    const mine = picks.find(p => p.user_id === myUserId)
    return mine ? { h: mine.home_goals, a: mine.away_goals } : null
  })
  const [optimisticPicks, setOptimisticPicks] = useState<PorraPick[]>(picks)

  const pickMap = useMemo(
    () => new Map(optimisticPicks.map(p => [`${p.home_goals}-${p.away_goals}`, p])),
    [optimisticPicks]
  )

  const handlePick = useCallback(async (h: number, a: number) => {
    if (!myUserId) return
    setError(null)

    const key = `${h}-${a}`
    const existing = pickMap.get(key)
    // Score already taken by someone else
    if (existing && existing.user_id !== myUserId) return

    // Toggle off if clicking own pick
    if (optimisticMy?.h === h && optimisticMy?.a === a) {
      setOptimisticMy(null)
      setOptimisticPicks(prev => prev.filter(p => p.user_id !== myUserId))
      startTransition(async () => {
        await fetch(`/api/porra?match=${matchId}`, { method: 'DELETE' })
        router.refresh()
      })
      return
    }

    // Optimistic update
    const prev = optimisticPicks
    setOptimisticMy({ h, a })
    setOptimisticPicks(ps => [
      ...ps.filter(p => p.user_id !== myUserId),
      { id: 'optimistic', home_goals: h, away_goals: a, user_id: myUserId, created_at: '', profiles: null },
    ])

    startTransition(async () => {
      const res = await fetch('/api/porra', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ match_id: matchId, home_goals: h, away_goals: a }),
      })
      if (!res.ok) {
        const { error: msg } = await res.json()
        setError(msg ?? 'Error al guardar')
        setOptimisticMy(prev.find(p => p.user_id === myUserId)
          ? { h: prev.find(p => p.user_id === myUserId)!.home_goals, a: prev.find(p => p.user_id === myUserId)!.away_goals }
          : null)
        setOptimisticPicks(prev)
      } else {
        router.refresh()
      }
    })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [myUserId, optimisticMy, optimisticPicks, matchId, pickMap, router])

  const goals = Array.from({ length: MAX_GOALS + 1 }, (_, i) => i)

  return (
    <div className="space-y-8">
      {/* Score grid */}
      <div>
        {/* Y-axis label */}
        <div className="flex items-center gap-4 mb-3">
          <div className="w-8 shrink-0" />
          <p className="text-ink/30 text-[10px] uppercase tracking-widest font-bold">Argentina (visitante) →</p>
        </div>

        {/* Column headers */}
        <div className="flex gap-1.5 mb-1.5">
          <div className="w-8 shrink-0" />
          {goals.map(a => (
            <div key={a} className="w-11 text-center text-[10px] font-bold text-ink/25">{a}</div>
          ))}
        </div>

        {/* Rows = España goals */}
        <div className="space-y-1.5">
          {goals.map(h => (
            <div key={h} className="flex items-center gap-1.5">
              <div className="w-8 text-center text-[10px] font-bold text-ink/25 shrink-0">{h}</div>
              {goals.map(a => {
                const key = `${h}-${a}`
                const pick = pickMap.get(key)
                const isMine = optimisticMy?.h === h && optimisticMy?.a === a
                const isTaken = !!pick && pick.user_id !== myUserId
                const username = pick?.profiles?.username ?? null

                return (
                  <button
                    key={key}
                    onClick={() => handlePick(h, a)}
                    disabled={isTaken || !myUserId || pending}
                    title={isTaken ? `${username ?? 'Alguien'} ya lo tiene` : isMine ? 'Tu resultado — click para quitar' : `España ${h} – ${a} Argentina`}
                    className={`w-11 h-11 rounded-xl text-xs font-black transition-all relative group flex flex-col items-center justify-center shrink-0 ${
                      isMine
                        ? 'scale-105'
                        : isTaken
                        ? 'cursor-not-allowed opacity-60'
                        : myUserId
                        ? 'cursor-pointer hover:scale-105'
                        : 'cursor-default'
                    }`}
                    style={
                      isMine
                        ? { background: 'linear-gradient(135deg,#EAB308,#F59E0B)', boxShadow: '0 4px 20px rgba(234,179,8,0.40)', color: '#07080F' }
                        : isTaken
                        ? { background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)' }
                        : { background: 'rgba(255,255,255,0.055)', border: '1px solid rgba(255,255,255,0.08)' }
                    }
                  >
                    {isMine ? (
                      <>
                        <span className="text-[10px] leading-none">{h}–{a}</span>
                        <span className="text-[8px] opacity-70 leading-none mt-0.5">✓ yo</span>
                      </>
                    ) : isTaken ? (
                      <>
                        <span className="text-[9px] text-ink/50 leading-none">{h}–{a}</span>
                        <span className="text-[7px] text-ink/30 leading-none mt-0.5 max-w-[40px] truncate px-0.5">
                          {username?.substring(0, 5) ?? '?'}
                        </span>
                      </>
                    ) : (
                      <span className="text-ink/20 text-[9px] group-hover:text-ink/60 transition-colors">{h}–{a}</span>
                    )}
                  </button>
                )
              })}
            </div>
          ))}
        </div>

        {/* Row label */}
        <div className="flex items-center gap-4 mt-3">
          <div className="w-8 shrink-0" />
          <p className="text-ink/30 text-[10px] uppercase tracking-widest font-bold rotate-0">↑ España (local)</p>
        </div>
      </div>

      {error && (
        <p className="text-red-600 text-sm text-center"
          style={{ background: 'rgba(239,68,68,0.10)', border: '1px solid rgba(239,68,68,0.20)', borderRadius: 12, padding: '10px 16px' }}>
          {error}
        </p>
      )}

      {/* Who has what */}
      {optimisticPicks.length > 0 && (
        <div>
          <p className="text-ink/25 text-[10px] uppercase tracking-widest font-bold mb-3">Resultados elegidos</p>
          <div className="space-y-2">
            {[...optimisticPicks]
              .sort((a, b) => (a.home_goals !== b.home_goals ? b.home_goals - a.home_goals : b.away_goals - a.away_goals))
              .map(p => {
                const isMe = p.user_id === myUserId
                const uname = p.profiles?.username ?? (isMe ? 'Tú' : '?')
                return (
                  <div key={p.id} className="flex items-center gap-3 rounded-xl px-4 py-3 transition-all"
                    style={isMe
                      ? { background: 'rgba(234,179,8,0.08)', border: '1px solid rgba(234,179,8,0.25)' }
                      : { background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }
                    }>
                    <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-black shrink-0"
                      style={isMe
                        ? { background: 'rgba(234,179,8,0.15)', border: '1px solid rgba(234,179,8,0.30)', color: '#EAB308' }
                        : { background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)', color: 'rgba(255,255,255,0.50)' }
                      }>
                      {uname.charAt(0).toUpperCase()}
                    </div>
                    <span className={`text-sm font-semibold flex-1 ${isMe ? 'text-amber-600' : 'text-ink/60'}`}>
                      {isMe ? 'Tú' : uname}
                    </span>
                    <span className={`text-lg font-black ${isMe ? 'text-ink' : 'text-ink/70'}`}>
                      🇪🇸 {p.home_goals} – {p.away_goals} 🇦🇷
                    </span>
                  </div>
                )
              })}
          </div>
        </div>
      )}

      {!myUserId && (
        <p className="text-center text-ink/40 text-sm">
          <a href="/login?redirect=/porra" className="text-amber-600 font-bold underline underline-offset-2">Inicia sesión</a> para participar
        </p>
      )}
    </div>
  )
}
