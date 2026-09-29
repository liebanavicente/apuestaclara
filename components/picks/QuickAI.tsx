'use client'
import { useState } from 'react'
import { Sparkles, Loader2, X } from 'lucide-react'

interface Analysis {
  verdict: 'favorable' | 'dudoso' | 'arriesgado'
  summary: string
  pros: string[]
  cons: string[]
  disclaimer: string
}

interface Props {
  event: string
  league: string
  selection: string
  odds: number
}

const VERDICT_STYLE = {
  favorable: 'gb-chip-green',
  dudoso: 'gb-chip-amber',
  arriesgado: 'gb-chip-red',
}

const VERDICT_LABEL = {
  favorable: 'Favorable',
  dudoso: 'Dudoso',
  arriesgado: 'Arriesgado',
}

export function QuickAI({ event, league, selection, odds }: Props) {
  const [analysis, setAnalysis] = useState<Analysis | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)

  async function analyze() {
    setLoading(true)
    setError(false)
    try {
      const res = await fetch('/api/ai/quick', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ event, league, selection, odds }),
      })
      if (!res.ok) throw new Error()
      setAnalysis(await res.json())
    } catch {
      setError(true)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-sm text-ink-2 h-8">
        <Loader2 className="h-4 w-4 animate-spin text-violet-500" />
        Analizando partido…
      </div>
    )
  }

  if (error) {
    return (
      <p className="text-sm text-rose-600 h-8 flex items-center">
        No se pudo obtener el análisis.&nbsp;
        <button onClick={analyze} className="font-semibold underline underline-offset-2">
          Reintentar
        </button>
      </p>
    )
  }

  if (!analysis) {
    return (
      <button onClick={analyze} className="gb-btn gb-btn-ghost gb-btn-sm -ml-2 !text-violet-600">
        <Sparkles className="h-4 w-4" />
        Análisis con IA
      </button>
    )
  }

  return (
    <div className="rounded-2xl bg-white/70 p-4 space-y-3 text-sm shadow-[0_0_0_0.5px_rgba(0,0,0,0.06)] anim-scale-in">
      <div className="flex items-center gap-2">
        <Sparkles className="h-4 w-4 text-violet-500 shrink-0" />
        <span className="text-ink font-semibold">Análisis rápido</span>
        <span className={`gb-chip ml-auto ${VERDICT_STYLE[analysis.verdict]}`}>{VERDICT_LABEL[analysis.verdict]}</span>
        <button
          onClick={() => setAnalysis(null)}
          aria-label="Cerrar análisis"
          className="w-6 h-6 flex items-center justify-center rounded-full text-ink-3 hover:bg-black/[0.05] hover:text-ink transition-colors"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      <p className="text-ink-2 leading-relaxed">{analysis.summary}</p>

      {(analysis.pros?.length > 0 || analysis.cons?.length > 0) && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {analysis.pros?.length > 0 && (
            <div className="p-3 rounded-xl bg-emerald-500/[0.08]">
              <p className="text-emerald-700 font-semibold text-xs mb-1">A favor</p>
              <ul className="space-y-1">
                {analysis.pros.map((p, i) => (
                  <li key={i} className="text-ink-2 text-[13px] leading-snug">{p}</li>
                ))}
              </ul>
            </div>
          )}
          {analysis.cons?.length > 0 && (
            <div className="p-3 rounded-xl bg-rose-500/[0.07]">
              <p className="text-rose-700 font-semibold text-xs mb-1">Riesgos</p>
              <ul className="space-y-1">
                {analysis.cons.map((c, i) => (
                  <li key={i} className="text-ink-2 text-[13px] leading-snug">{c}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      <p className="text-[11px] text-ink-3 leading-snug">{analysis.disclaimer}</p>
    </div>
  )
}
