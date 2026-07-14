'use client'
import { Minus, Plus } from 'lucide-react'
import { FINAL_SCORE_MAX, FINAL_SCORE_MIN } from '@/lib/porra'

interface Props {
  label: string
  value: number
  onChange: (v: number) => void
  disabled?: boolean
}

export function GoalStepper({ label, value, onChange, disabled }: Props) {
  function clamp(v: number) {
    return Math.min(FINAL_SCORE_MAX, Math.max(FINAL_SCORE_MIN, v))
  }

  return (
    <div className="flex flex-col items-center gap-2">
      <span className="text-xs font-semibold uppercase tracking-wider text-texto-secundario">{label}</span>
      <div className="flex items-center gap-2 sm:gap-3">
        <button
          type="button"
          disabled={disabled || value <= FINAL_SCORE_MIN}
          onClick={() => onChange(clamp(value - 1))}
          aria-label={`Restar gol a ${label}`}
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-superficie-hover bg-superficie-hover/60 text-white transition-colors hover:border-rojo hover:text-rojo disabled:cursor-not-allowed disabled:opacity-30 sm:h-14 sm:w-14"
        >
          <Minus className="h-5 w-5" />
        </button>

        <span className="font-mono w-11 text-center text-4xl font-bold text-white sm:w-20 sm:text-6xl" aria-live="polite">
          {value}
        </span>

        <button
          type="button"
          disabled={disabled || value >= FINAL_SCORE_MAX}
          onClick={() => onChange(clamp(value + 1))}
          aria-label={`Sumar gol a ${label}`}
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-superficie-hover bg-superficie-hover/60 text-white transition-colors hover:border-amarillo hover:text-amarillo disabled:cursor-not-allowed disabled:opacity-30 sm:h-14 sm:w-14"
        >
          <Plus className="h-5 w-5" />
        </button>
      </div>
    </div>
  )
}
