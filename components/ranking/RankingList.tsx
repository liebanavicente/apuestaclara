'use client'
import { useState } from 'react'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { EmptyState } from '@/components/shared/EmptyState'
import { computeUserRankingStats, type RawPick } from '@/lib/ranking-stats'
import { UserStatsPanel } from './UserStatsPanel'
import type { LeaderboardRow } from '@/types/ranking'

const MEDALS = ['🥇', '🥈', '🥉']

const RANK_STYLES = [
  'border-ambar/50 bg-ambar/5',
  'border-superficie-hover bg-superficie/60',
  'border-[#8a5a2a]/40 bg-superficie/50',
]

interface Props {
  players: LeaderboardRow[]
  picksByUser: Record<string, RawPick[]>
  currentUserId: string | null
}

export function RankingList({ players, picksByUser, currentUserId }: Props) {
  const [openUserId, setOpenUserId] = useState<string | null>(null)

  if (players.length === 0) {
    return (
      <EmptyState
        icon={<span className="text-5xl">🐟</span>}
        title="Nadie ha resuelto picks todavía"
        description="En cuanto se resuelva el primer pick, aparecerá aquí el ranking."
        action={
          <Link href="/dashboard" className="text-neon text-sm hover:underline">
            Hacer picks →
          </Link>
        }
      />
    )
  }

  return (
    <div className="space-y-2">
      {players.map((p, i) => {
        const isMe = currentUserId != null && p.user_id === currentUserId
        const isOpen = openUserId === p.user_id
        const rankStyle = RANK_STYLES[i]
        const stats = computeUserRankingStats(picksByUser[p.user_id] ?? [])

        return (
          <div
            key={p.user_id}
            className={cn(
              'rounded-2xl border transition-colors',
              isOpen ? 'border-neon/50 bg-superficie/70' : (rankStyle ?? 'border-superficie-hover bg-superficie/40'),
              isMe && !isOpen && 'ring-1 ring-neon/30'
            )}
          >
            <button
              type="button"
              onClick={() => setOpenUserId(isOpen ? null : p.user_id)}
              aria-expanded={isOpen}
              className="flex w-full items-center gap-3 px-4 py-3 text-left"
            >
              <span className={cn(
                'w-7 shrink-0 text-center text-sm font-black',
                i === 0 ? 'text-ambar text-lg' : i === 1 ? 'text-texto-secundario' : i === 2 ? 'text-[#c88a4a]' : 'text-texto-terciario'
              )}>
                {MEDALS[i] ?? i + 1}
              </span>

              <div className={cn(
                'flex shrink-0 items-center justify-center rounded-full font-black text-white',
                i === 0 ? 'h-10 w-10 bg-ambar text-[#0B1E3F] text-sm' : 'h-8 w-8 bg-superficie-hover text-xs'
              )}>
                {p.username?.charAt(0).toUpperCase() ?? '?'}
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <span className="truncate text-sm font-bold text-white">{p.username ?? 'Anónimo'}</span>
                  {isMe && <span className="text-xs text-neon">(tú)</span>}
                </div>
                <div className="mt-0.5 text-xs text-texto-secundario">
                  {p.total_won ?? 0}/{p.total_resolved ?? 0} aciertos
                  {p.win_rate != null ? ` · ${p.win_rate}%` : ''}
                  {p.total_pending > 0 ? ` · ${p.total_pending} pendientes` : ''}
                </div>
              </div>

              <div className="shrink-0 text-right">
                <div className="font-black text-white">{(+p.total_points || 0).toFixed(2)}</div>
                <div className="text-xs text-texto-terciario">pts</div>
              </div>

              <svg
                viewBox="0 0 24 24"
                className={cn('h-4 w-4 shrink-0 text-texto-terciario transition-transform', isOpen && 'rotate-180')}
                fill="none" stroke="currentColor" strokeWidth={2}
              >
                <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>

            <div className={cn('ranking-expand', isOpen && 'is-open')}>
              <div className="overflow-hidden">
                <div className="border-t border-superficie-hover/60 px-4 pb-4 pt-3">
                  <UserStatsPanel stats={stats} />
                </div>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
