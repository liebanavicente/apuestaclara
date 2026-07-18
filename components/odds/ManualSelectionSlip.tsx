'use client'
import { X, TrendingUp, Play, Target, Trash2 } from 'lucide-react'
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
    <div className="fixed bottom-4 right-4 z-40 w-80 rounded-lg border border-neon/30 bg-superficie shadow-2xl shadow-black/50">
      <div className="flex items-center justify-between px-4 py-3 border-b border-superficie-hover">
        <div className="flex items-center gap-2">
          <TrendingUp className="h-4 w-4 text-neon" />
          <span className="text-white font-semibold text-sm">Mi selección</span>
          <span className="rounded-full bg-neon/10 px-1.5 py-0.5 text-xs text-neon">{picks.length}</span>
        </div>
        <button onClick={onClear} className="text-texto-secundario hover:text-red-400 transition-colors">
          <Trash2 className="h-4 w-4" />
        </button>
      </div>

      <div className="p-3 space-y-2 max-h-52 overflow-y-auto">
        {picks.map(pick => (
          <div key={pick.event_id} className="flex items-start justify-between gap-2 rounded-md border border-neon/10 bg-superficie-hover/60 p-2.5">
            <div className="flex-1 min-w-0">
              <p className="truncate text-xs text-neon">{pick.league}</p>
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
        <p className="mb-3 text-xs text-ambar/70">Las predicciones son orientativas y pueden fallar.</p>
        <div className="grid grid-cols-2 gap-2">
          <Link
            href={`/simulador?${params}`}
            className="flex items-center justify-center gap-1 rounded-md bg-superficie-hover py-2 text-xs font-medium text-white transition-colors hover:bg-superficie-hover"
          >
            <Play className="h-3.5 w-3.5" /> Simular
          </Link>
          <Link
            href={`/analizar?${params}`}
            className="flex items-center justify-center gap-1 rounded-md bg-neon/10 py-2 text-xs font-medium text-neon transition-colors hover:bg-neon/20"
          >
            <TrendingUp className="h-3.5 w-3.5" /> Analizar IA
          </Link>
        </div>
        <div className="mt-2">
          <Link
            href={isLoggedIn ? `/mis-picks?import=${encodeURIComponent(JSON.stringify(picks))}` : '/login?redirect=/mis-picks'}
            className="flex w-full items-center justify-center gap-1.5 rounded-md bg-neon py-2 text-xs font-black text-carbon transition-colors hover:brightness-110"
          >
            <Target className="h-3.5 w-3.5" /> Guardar combinada
          </Link>
        </div>
      </div>
    </div>
  )
}
