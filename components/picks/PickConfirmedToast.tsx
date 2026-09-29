'use client'
import { useEffect, useState } from 'react'

interface Props {
  odds: number
  onClose: () => void
}

const STORAGE_KEY = 'gananesbets_pick_warning_dismissed'

export function PickConfirmedToast({ odds, onClose }: Props) {
  const [dontShow, setDontShow] = useState(false)

  function handleClose() {
    if (dontShow) localStorage.setItem(STORAGE_KEY, '1')
    onClose()
  }

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') handleClose()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  })

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/25 backdrop-blur-sm anim-fade-in"
      onClick={handleClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="pick-saved-title"
        onClick={e => e.stopPropagation()}
        className="w-full max-w-sm rounded-[28px] gb-glass-strong border border-white/70 shadow-[var(--gb-shadow-lg)] p-6 text-center anim-scale-in"
      >
        <span className="mx-auto mb-4 w-14 h-14 rounded-full bg-gradient-to-b from-amber-300 to-amber-500 flex items-center justify-center text-2xl shadow-[inset_0_1px_0_rgba(255,255,255,0.5),0_8px_20px_-8px_rgba(217,119,6,0.6)]">
          🎯
        </span>
        <h3 id="pick-saved-title" className="text-ink font-semibold text-xl tracking-[-0.02em]">Pick guardado</h3>
        <p className="text-ink-2 text-[15px] leading-relaxed mt-2">
          Registrado a cuota <span className="font-semibold text-ink tabular-nums">{odds.toFixed(2)}</span>. Puedes borrarlo
          hasta que empiece el partido; después ya no se puede cambiar.
        </p>
        <label className="mt-5 flex items-center justify-center gap-2 text-sm text-ink-3 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={dontShow}
            onChange={e => setDontShow(e.target.checked)}
            className="w-4 h-4 rounded accent-amber-500"
          />
          No volver a mostrar
        </label>
        <button onClick={handleClose} autoFocus className="gb-btn gb-btn-primary gb-btn-lg w-full mt-5">
          Entendido
        </button>
      </div>
    </div>
  )
}

export function shouldShowPickWarning(): boolean {
  if (typeof window === 'undefined') return false
  return localStorage.getItem(STORAGE_KEY) !== '1'
}
