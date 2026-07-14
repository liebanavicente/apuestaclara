import { describe, expect, it } from 'vitest'
import {
  BASE_FINAL_POINTS,
  FINAL_MULTIPLIER,
  computeFinalPoints,
  isFinalLocked,
  isFinalPredictionExact,
  isValidScore,
  opponentLabel,
  validateFinalPredictionInput,
} from './porra'

describe('isValidScore', () => {
  it('accepts integers within 0-9', () => {
    expect(isValidScore(0)).toBe(true)
    expect(isValidScore(9)).toBe(true)
    expect(isValidScore(5)).toBe(true)
  })
  it('rejects out-of-range, non-integer, or non-number values', () => {
    expect(isValidScore(-1)).toBe(false)
    expect(isValidScore(10)).toBe(false)
    expect(isValidScore(2.5)).toBe(false)
    expect(isValidScore(NaN)).toBe(false)
    expect(isValidScore('3')).toBe(false)
    expect(isValidScore(null)).toBe(false)
    expect(isValidScore(undefined)).toBe(false)
  })
})

describe('validateFinalPredictionInput', () => {
  it('rejects empty/missing goal fields', () => {
    expect(validateFinalPredictionInput({}).valid).toBe(false)
    expect(validateFinalPredictionInput({ goals_spain: 2 }).valid).toBe(false)
    expect(validateFinalPredictionInput({ goals_spain: null as unknown as number, goals_rival: 1 }).valid).toBe(false)
  })

  it('rejects goals outside 0-9', () => {
    expect(validateFinalPredictionInput({ goals_spain: 10, goals_rival: 1 }).valid).toBe(false)
    expect(validateFinalPredictionInput({ goals_spain: 1, goals_rival: -1 }).valid).toBe(false)
    expect(validateFinalPredictionInput({ goals_spain: 1.5, goals_rival: 1 }).valid).toBe(false)
  })

  it('accepts a valid non-draw score with no penalty_winner', () => {
    const r = validateFinalPredictionInput({ goals_spain: 2, goals_rival: 1 })
    expect(r.valid).toBe(true)
  })

  it('rejects a penalty_winner when the score is not a draw', () => {
    const r = validateFinalPredictionInput({ goals_spain: 2, goals_rival: 1, penalty_winner: 'espana' })
    expect(r.valid).toBe(false)
  })

  it('accepts a penalty_winner when the score is a draw', () => {
    const r = validateFinalPredictionInput({ goals_spain: 1, goals_rival: 1, penalty_winner: 'rival' })
    expect(r.valid).toBe(true)
  })

  it('accepts a draw with no penalty_winner (optional)', () => {
    const r = validateFinalPredictionInput({ goals_spain: 0, goals_rival: 0 })
    expect(r.valid).toBe(true)
  })

  it('rejects an invalid penalty_winner value', () => {
    const r = validateFinalPredictionInput({ goals_spain: 1, goals_rival: 1, penalty_winner: 'francia' as unknown as 'espana' })
    expect(r.valid).toBe(false)
  })

  it('accepts the boundary values 0 and 9', () => {
    expect(validateFinalPredictionInput({ goals_spain: 0, goals_rival: 9 }).valid).toBe(true)
    expect(validateFinalPredictionInput({ goals_spain: 9, goals_rival: 0 }).valid).toBe(true)
  })
})

describe('isFinalPredictionExact', () => {
  it('is true only when both scores match exactly', () => {
    expect(
      isFinalPredictionExact({ goals_spain: 2, goals_rival: 1 }, { actual_goals_spain: 2, actual_goals_rival: 1 })
    ).toBe(true)
  })
  it('is false when either score differs', () => {
    expect(
      isFinalPredictionExact({ goals_spain: 2, goals_rival: 1 }, { actual_goals_spain: 2, actual_goals_rival: 2 })
    ).toBe(false)
    expect(
      isFinalPredictionExact({ goals_spain: 1, goals_rival: 1 }, { actual_goals_spain: 2, actual_goals_rival: 1 })
    ).toBe(false)
  })
  it('ignores penalty outcome — only the scoreline after extra time counts', () => {
    // Same drawn scoreline, regardless of who wins the shootout, is still "exact"
    expect(
      isFinalPredictionExact({ goals_spain: 1, goals_rival: 1 }, { actual_goals_spain: 1, actual_goals_rival: 1 })
    ).toBe(true)
  })
})

describe('computeFinalPoints', () => {
  it('awards base points × multiplier on an exact hit', () => {
    expect(computeFinalPoints(true)).toBe(BASE_FINAL_POINTS * FINAL_MULTIPLIER)
  })
  it('awards zero points on a miss — same as any other lost pick', () => {
    expect(computeFinalPoints(false)).toBe(0)
  })
})

describe('isFinalLocked', () => {
  it('is not locked before kickoff', () => {
    expect(isFinalLocked('2026-07-19T20:00:00Z', new Date('2026-07-19T19:59:59Z'))).toBe(false)
  })
  it('is locked exactly at kickoff and after', () => {
    expect(isFinalLocked('2026-07-19T20:00:00Z', new Date('2026-07-19T20:00:00Z'))).toBe(true)
    expect(isFinalLocked('2026-07-19T20:00:00Z', new Date('2026-07-19T20:00:01Z'))).toBe(true)
  })
})

describe('opponentLabel', () => {
  it('shows "por confirmar" when the opponent is unknown', () => {
    expect(opponentLabel({ opponent_name: null, opponent_flag: null })).toBe('❓ Rival por confirmar')
  })
  it('shows the flag and name once confirmed', () => {
    expect(opponentLabel({ opponent_name: 'Argentina', opponent_flag: '🇦🇷' })).toBe('🇦🇷 Argentina')
  })
  it('handles a missing flag gracefully', () => {
    expect(opponentLabel({ opponent_name: 'Argentina', opponent_flag: null })).toBe('Argentina')
  })
})
