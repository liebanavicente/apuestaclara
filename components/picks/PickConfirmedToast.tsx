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
      <div className="w-full max-w-sm rounded-2xl border border-yellow-500/30 bg-slate-900 shadow-2xl p-5">
        <div className="text-2xl mb-3">🎯</div>
        <h3 className="text-white font-black text-lg mb-2">Pick guardado</h3>
        <p className="text-slate-400 text-sm leading-relaxed mb-4">
          Tu pick se ha registrado a cuota <strong className="text-yellow-400">{odds.toFixed(2)}</strong>.
          {' '}<strong className="text-white">No se puede cambiar ni eliminar una vez confirmado</strong> — solo puedes resolverlo después del partido.
        </p>
        <label className="flex items-center gap-2 text-xs text-slate-500 cursor-pointer mb-4">
          <input type="checkbox" checked={dontShow} onChange={e => setDontShow(e.target.checked)}
            className="rounded border-slate-600 bg-slate-800 text-yellow-500 focus:ring-yellow-500" />
          No volver a mostrar
        </label>
        <button onClick={handleClose}
          className="w-full bg-yellow-500 hover:bg-yellow-400 text-slate-950 font-black py-2.5 rounded-xl transition-colors">
          Entendido ✓
        </button>
      </div>
    </div>
  )
}

export function shouldShowPickWarning(): boolean {
  if (typeof window === 'undefined') return false
  return localStorage.getItem(STORAGE_KEY) !== '1'
}
