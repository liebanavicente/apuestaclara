'use client'
import { X, TrendingUp, Play, Users, Target, Trash2 } from 'lucide-react'
import Link from 'next/link'
import type { PickSelection } from '@/types/odds'
import { formatOdds, totalOdds, impliedProbability } from '@/lib/utils'
import { RealDataBadge } from '@/components/shared/RealDataBadge'

interface ManualSelectionSlipProps {
  picks: PickSelection[]
  onRemove: (eventId: string) => void
  onClear: () => void
  isLoggedIn: boolean
}

export function ManualSelectionSlip({ picks, onRemove, onClear, isLoggedIn }: ManualSelectionSlipProps) {
  if (picks.length === 0) return null

  const combined = totalOdds(picks.map(p => p.odds))
  const impliedProb = impliedProbability(combined)

  const params = new URLSearchParams({ picks: JSON.stringify(picks) })

  return (
    <div className="fixed bottom-4 right-4 z-40 w-80 rounded-xl border border-teal-500/40 bg-superficie shadow-2xl shadow-black/50">
      <div className="flex items-center justify-between px-4 py-3 border-b border-superficie-hover">
        <div className="flex items-center gap-2">
          <TrendingUp className="h-4 w-4 text-teal-400" />
          <span className="text-white font-semibold text-sm">Mi selección</span>
          <span className="bg-teal-500/20 text-teal-300 text-xs px-1.5 py-0.5 rounded-full">{picks.length}</span>
        </div>
        <button onClick={onClear} className="text-texto-secundario hover:text-red-400 transition-colors">
          <Trash2 className="h-4 w-4" />
        </button>
      </div>

      <div className="p-3 space-y-2 max-h-52 overflow-y-auto">
        {picks.map(pick => (
          <div key={pick.event_id} className="flex items-start justify-between gap-2 bg-superficie-hover/60 rounded-lg p-2.5">
            <div className="flex-1 min-w-0">
              <p className="text-xs text-teal-400 truncate">{pick.league}</p>
              <p className="text-xs text-texto-secundario truncate">{pick.event_name}</p>
              <p className="text-xs text-texto-secundario">{pick.market} · <strong className="text-white">{pick.selection}</strong></p>
            </div>
            <div className="flex items-center gap-1.5 shrink-0">
              <span className="text-white font-bold text-sm">{formatOdds(pick.odds)}</span>
              <button onClick={() => onRemove(pick.event_id)} className="text-texto-terciario hover:text-red-400 transition-colors">
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="px-4 py-3 border-t border-superficie-hover">
        <div className="flex justify-between text-xs mb-3">
          <span className="text-texto-secundario">Cuota combinada</span>
          <div className="flex items-center gap-1.5">
            <RealDataBadge />
            <span className="text-white font-bold text-base">{formatOdds(combined)}</span>
          </div>
        </div>
        <div className="flex justify-between text-xs mb-3">
          <span className="text-texto-secundario">Prob. implícita</span>
          <span className="text-texto-secundario">{impliedProb}%</span>
        </div>
        <p className="text-xs text-orange-400/70 mb-3">Las predicciones son orientativas y pueden fallar.</p>
        <div className="grid grid-cols-2 gap-2">
          <Link
            href={`/simulador?${params}`}
            className="flex items-center justify-center gap-1 bg-superficie-hover hover:bg-superficie-hover text-white text-xs font-medium py-2 rounded-lg transition-colors"
          >
            <Play className="h-3.5 w-3.5" /> Simular
          </Link>
          <Link
            href={`/analizar?${params}`}
            className="flex items-center justify-center gap-1 bg-teal-600 hover:bg-teal-500 text-white text-xs font-medium py-2 rounded-lg transition-colors"
          >
            <TrendingUp className="h-3.5 w-3.5" /> Analizar IA
          </Link>
        </div>
        <div className="mt-2">
          <Link
            href={isLoggedIn ? `/mis-picks?import=${encodeURIComponent(JSON.stringify(picks))}` : '/login?redirect=/mis-picks'}
            className="flex items-center justify-center gap-1.5 w-full bg-neon hover:brightness-110 text-[#0B3D2E] font-black text-xs py-2 rounded-lg transition-colors"
          >
            <Target className="h-3.5 w-3.5" /> Apostar combinada 🎯
          </Link>
        </div>
      </div>
    </div>
  )
}
