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

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="glass-strong w-full max-w-sm rounded-lg p-5 shadow-2xl">
        <div className="mb-3 inline-flex rounded-md border border-neon/20 bg-neon/10 px-2 py-1 font-mono text-xs font-bold text-neon">
          PICK
        </div>
        <h3 className="text-white font-black text-lg mb-2">Pick guardado</h3>
        <p className="text-texto-secundario text-sm leading-relaxed mb-4">
          Tu pick se ha registrado a cuota <strong className="text-neon">{odds.toFixed(2)}</strong>.
          {' '}<strong className="text-white">No se puede cambiar ni eliminar una vez confirmado</strong> — solo puedes resolverlo después del partido.
        </p>
        <label className="flex items-center gap-2 text-xs text-texto-secundario cursor-pointer mb-4">
          <input type="checkbox" checked={dontShow} onChange={e => setDontShow(e.target.checked)}
            className="rounded border-superficie-hover bg-superficie-hover text-neon focus:ring-neon" />
          No volver a mostrar
        </label>
        <button onClick={handleClose}
          className="w-full rounded-md bg-neon py-2.5 font-black text-carbon transition-colors hover:brightness-110">
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
