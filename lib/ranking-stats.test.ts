import { describe, expect, it } from 'vitest'
import { computeStreaks, computeUserRankingStats, computeWinRate, sortPicksChronological } from './ranking-stats'
import type { ResolvedPickSummary } from '@/types/ranking'

function pick(status: 'won' | 'lost', day: number, points = status === 'won' ? 2 : 0): ResolvedPickSummary {
  return { status, points, resolved_at: `2026-07-${String(day).padStart(2, '0')}T12:00:00Z` }
}

describe('computeWinRate', () => {
  it('returns null with zero resolved picks', () => {
    expect(computeWinRate(0, 0)).toBeNull()
  })

  it('rounds to one decimal', () => {
    expect(computeWinRate(1, 3)).toBeCloseTo(33.3)
  })

  it('handles a perfect record', () => {
    expect(computeWinRate(4, 4)).toBe(100)
  })
})

describe('sortPicksChronological', () => {
  it('sorts ascending by resolved_at without mutating input', () => {
    const input = [pick('won', 5), pick('lost', 1), pick('won', 3)]
    const sorted = sortPicksChronological(input)
    expect(sorted.map(p => p.resolved_at)).toEqual([
      '2026-07-01T12:00:00Z',
      '2026-07-03T12:00:00Z',
      '2026-07-05T12:00:00Z',
    ])
    expect(input[0].resolved_at).toBe('2026-07-05T12:00:00Z')
  })
})

describe('computeStreaks', () => {
  it('returns zero streaks for an empty history', () => {
    expect(computeStreaks([])).toEqual({ current: 0, best: 0 })
  })

  it('current streak is 0 right after a loss', () => {
    const asc = [pick('won', 1), pick('won', 2), pick('lost', 3)]
    expect(computeStreaks(asc)).toEqual({ current: 0, best: 2 })
  })

  it('finds the best streak even when it is not the current one', () => {
    const asc = [pick('won', 1), pick('won', 2), pick('lost', 3), pick('won', 4), pick('won', 5), pick('won', 6)]
    expect(computeStreaks(asc)).toEqual({ current: 3, best: 3 })
  })

  it('counts an all-wins history as one long streak', () => {
    const asc = [pick('won', 1), pick('won', 2), pick('won', 3), pick('won', 4)]
    expect(computeStreaks(asc)).toEqual({ current: 4, best: 4 })
  })

  it('an all-losses history has zero current and best streak', () => {
    const asc = [pick('lost', 1), pick('lost', 2)]
    expect(computeStreaks(asc)).toEqual({ current: 0, best: 0 })
  })
})

describe('computeUserRankingStats', () => {
  it('handles a user with no resolved picks at all', () => {
    const stats = computeUserRankingStats([{ status: 'pending', points: null, resolved_at: null }])
    expect(stats).toEqual({
      totalResolved: 0,
      totalWon: 0,
      totalLost: 0,
      totalPending: 1,
      winRate: null,
      currentStreak: 0,
      bestStreak: 0,
      form: [],
    })
  })

  it('ignores pending/void picks and computes from resolved ones only', () => {
    const stats = computeUserRankingStats([
      { status: 'won', points: 2.1, resolved_at: '2026-07-01T12:00:00Z' },
      { status: 'pending', points: null, resolved_at: null },
      { status: 'lost', points: 0, resolved_at: '2026-07-02T12:00:00Z' },
      { status: 'won', points: 1.5, resolved_at: '2026-07-03T12:00:00Z' },
    ])
    expect(stats.totalResolved).toBe(3)
    expect(stats.totalWon).toBe(2)
    expect(stats.totalLost).toBe(1)
    expect(stats.totalPending).toBe(1)
    expect(stats.winRate).toBeCloseTo(66.7)
    expect(stats.currentStreak).toBe(1)
    expect(stats.form.map(f => f.status)).toEqual(['won', 'lost', 'won'])
  })

  it('caps the form strip to the most recent 8 resolved picks', () => {
    const picks = Array.from({ length: 12 }, (_, i) => ({
      status: i % 2 === 0 ? 'won' : 'lost',
      points: i % 2 === 0 ? 2 : 0,
      resolved_at: `2026-07-${String(i + 1).padStart(2, '0')}T12:00:00Z`,
    }))
    const stats = computeUserRankingStats(picks)
    expect(stats.form).toHaveLength(8)
    expect(stats.form[0].resolved_at).toBe('2026-07-05T12:00:00Z')
    expect(stats.form[stats.form.length - 1].resolved_at).toBe('2026-07-12T12:00:00Z')
  })
})
