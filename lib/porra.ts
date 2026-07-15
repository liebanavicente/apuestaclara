import type { FinalMatchInfo, FinalPredictionInput } from '@/types/porra'

export const FINAL_SCORE_MIN = 0
export const FINAL_SCORE_MAX = 9

/**
 * Puntos base de la porra de la final. Sin multiplicador si el pronóstico
 * falla (0 pts, igual que cualquier pick fallado); x3 si acierta el
 * resultado exacto. El valor es una elección de diseño (no hay cuota de
 * casa de apuestas para un marcador exacto) — ajustar aquí si se quiere
 * otro peso en el ranking.
 */
export const BASE_FINAL_POINTS = 5
export const FINAL_MULTIPLIER = 3

/**
 * El marcador que decide el resultado exacto es el de tras la prórroga y
 * antes de la tanda de penaltis (90'+prórroga). El ganador de penaltis es
 * un dato aparte, opcional, y no afecta a si el pronóstico de marcador es
 * "exacto" ni a los puntos.
 */
export const FINAL_RESULT_RULE =
  'Marcador tras la prórroga, antes de la tanda de penaltis' as const

export function isFinalLocked(kickoffAt: string, now: Date = new Date()): boolean {
  return now.getTime() >= new Date(kickoffAt).getTime()
}

export function isValidScore(n: unknown): n is number {
  return typeof n === 'number' && Number.isInteger(n) && n >= FINAL_SCORE_MIN && n <= FINAL_SCORE_MAX
}

export interface ValidationResult {
  valid: boolean
  error?: string
}

export function validateFinalPredictionInput(input: Partial<FinalPredictionInput>): ValidationResult {
  if (input.goals_spain === undefined || input.goals_spain === null || input.goals_rival === undefined || input.goals_rival === null) {
    return { valid: false, error: 'Indica el marcador de los dos equipos' }
  }
  if (!isValidScore(input.goals_spain) || !isValidScore(input.goals_rival)) {
    return { valid: false, error: `Los goles deben ser un número entero entre ${FINAL_SCORE_MIN} y ${FINAL_SCORE_MAX}` }
  }
  const isDraw = input.goals_spain === input.goals_rival
  if (input.penalty_winner != null) {
    if (!isDraw) {
      return { valid: false, error: 'Solo puedes indicar ganador de penaltis si el marcador está empatado' }
    }
    if (input.penalty_winner !== 'espana' && input.penalty_winner !== 'rival') {
      return { valid: false, error: 'Ganador de penaltis no válido' }
    }
  }
  return { valid: true }
}

export function isFinalPredictionExact(
  prediction: { goals_spain: number; goals_rival: number },
  actual: { actual_goals_spain: number; actual_goals_rival: number }
): boolean {
  return prediction.goals_spain === actual.actual_goals_spain && prediction.goals_rival === actual.actual_goals_rival
}

export function computeFinalPoints(exact: boolean): number {
  return exact ? BASE_FINAL_POINTS * FINAL_MULTIPLIER : 0
}

export function opponentLabel(matchInfo: Pick<FinalMatchInfo, 'opponent_name' | 'opponent_flag'>): string {
  if (!matchInfo.opponent_name) return '❓ Rival por confirmar'
  return `${matchInfo.opponent_flag ?? ''} ${matchInfo.opponent_name}`.trim()
}

/**
 * Nombre corto del rival para usar dentro de la card (etiqueta del stepper,
 * botón de penaltis, resumen del marcador guardado): el nombre confirmado,
 * o "Rival" genérico mientras no se conozca.
 */
export function opponentShortName(matchInfo: Pick<FinalMatchInfo, 'opponent_name'> | null): string {
  return matchInfo?.opponent_name?.trim() || 'Rival'
}
