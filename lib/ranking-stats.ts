import type { PickResult, ResolvedPickSummary, UserRankingStats } from '@/types/ranking'

const FORM_LIMIT = 8

export interface RawPick {
  status: string
  points: number | null
  resolved_at: string | null
}

function isResolved(pick: RawPick): pick is RawPick & { status: PickResult; resolved_at: string } {
  return (pick.status === 'won' || pick.status === 'lost') && pick.resolved_at != null
}

export function sortPicksChronological(picks: ResolvedPickSummary[]): ResolvedPickSummary[] {
  return [...picks].sort((a, b) => new Date(a.resolved_at).getTime() - new Date(b.resolved_at).getTime())
}

export function computeWinRate(totalWon: number, totalResolved: number): number | null {
  if (totalResolved === 0) return null
  return Math.round((totalWon / totalResolved) * 1000) / 10
}

export function computeStreaks(resolvedAsc: ResolvedPickSummary[]): { current: number; best: number } {
  let current = 0
  for (let i = resolvedAsc.length - 1; i >= 0; i--) {
    if (resolvedAsc[i].status !== 'won') break
    current++
  }

  let best = 0
  let running = 0
  for (const pick of resolvedAsc) {
    running = pick.status === 'won' ? running + 1 : 0
    if (running > best) best = running
  }

  return { current, best }
}

export function computeUserRankingStats(picks: RawPick[]): UserRankingStats {
  const resolved: ResolvedPickSummary[] = picks
    .filter(isResolved)
    .map(p => ({ status: p.status, points: p.points ?? 0, resolved_at: p.resolved_at }))

  const resolvedAsc = sortPicksChronological(resolved)
  const totalWon = resolvedAsc.filter(p => p.status === 'won').length
  const totalLost = resolvedAsc.length - totalWon
  const totalPending = picks.filter(p => p.status === 'pending').length
  const { current, best } = computeStreaks(resolvedAsc)

  return {
    totalResolved: resolvedAsc.length,
    totalWon,
    totalLost,
    totalPending,
    winRate: computeWinRate(totalWon, resolvedAsc.length),
    currentStreak: current,
    bestStreak: best,
    form: resolvedAsc.slice(-FORM_LIMIT),
  }
}
