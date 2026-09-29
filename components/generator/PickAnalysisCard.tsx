'use client'
import { ChevronDown, ChevronUp, TrendingUp, TrendingDown, AlertTriangle } from 'lucide-react'
import { useState } from 'react'
import type { PickAnalysis } from '@/types/ai'

const CONFIDENCE_STYLE = {
  alta: 'bg-green-500/10 text-green-600 border-green-500/30',
  media: 'bg-amber-400/10 text-amber-600 border-amber-500/30',
  baja: 'bg-orange-500/10 text-orange-600 border-orange-500/30',
}

interface Props {
  pick: PickAnalysis
  index: number
}

export function PickAnalysisCard({ pick, index }: Props) {
  const [open, setOpen] = useState(index === 0)

  return (
    <div className="rounded-xl gb-card overflow-hidden">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between p-4 text-left hover:bg-black/[0.04] transition-colors"
      >
        <div className="flex items-center gap-3 min-w-0">
          <span className="text-xs font-bold text-ink-3 shrink-0">#{index + 1}</span>
          <div className="min-w-0">
            <p className="text-sm font-medium text-ink truncate">{pick.event_name}</p>
            <p className="text-xs text-ink-2 truncate">{pick.selection} · @{pick.odds.toFixed(2)}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0 ml-3">
          <span className={`text-xs px-2 py-0.5 rounded-full border ${CONFIDENCE_STYLE[pick.confidence]}`}>
            {pick.confidence}
          </span>
          {open ? <ChevronUp className="h-4 w-4 text-ink-3" /> : <ChevronDown className="h-4 w-4 text-ink-3" />}
        </div>
      </button>

      {open && (
        <div className="px-4 pb-4 space-y-3 border-t border-black/[0.06] pt-3">
          <p className="text-sm text-ink-2 leading-relaxed">{pick.reasoning}</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {pick.factors_for.length > 0 && (
              <div>
                <div className="flex items-center gap-1.5 mb-1.5">
                  <TrendingUp className="h-3.5 w-3.5 text-green-600" />
                  <span className="text-xs font-semibold text-green-600">A favor</span>
                </div>
                <ul className="space-y-1">
                  {pick.factors_for.map((f, i) => (
                    <li key={i} className="text-xs text-ink-2 flex items-start gap-1.5">
                      <span className="text-green-600 mt-0.5">+</span>{f}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {pick.factors_against.length > 0 && (
              <div>
                <div className="flex items-center gap-1.5 mb-1.5">
                  <TrendingDown className="h-3.5 w-3.5 text-red-600" />
                  <span className="text-xs font-semibold text-red-600">En contra</span>
                </div>
                <ul className="space-y-1">
                  {pick.factors_against.map((f, i) => (
                    <li key={i} className="text-xs text-ink-2 flex items-start gap-1.5">
                      <span className="text-red-600 mt-0.5">−</span>{f}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <div className="flex items-start gap-2 rounded-lg bg-orange-500/10 border border-orange-500/20 px-3 py-2">
            <AlertTriangle className="h-3.5 w-3.5 text-orange-600 shrink-0 mt-0.5" />
            <p className="text-xs text-orange-700">{pick.why_it_can_fail}</p>
          </div>
        </div>
      )}
    </div>
  )
}
