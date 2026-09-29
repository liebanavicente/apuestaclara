'use client'
import { useState } from 'react'
import { Brain, Loader2 } from 'lucide-react'

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
  favorable: 'text-emerald-700 bg-emerald-50 border-emerald-300',
  dudoso: 'text-amber-700 bg-amber-50 border-amber-300',
  arriesgado: 'text-rose-700 bg-rose-50 border-rose-300',
}

const VERDICT_LABEL = {
  favorable: '✓ Favorable',
  dudoso: '⚠ Dudoso',
  arriesgado: '✗ Arriesgado',
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

  if (!analysis && !loading) {
    return (
      <button
        onClick={analyze}
        className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors"
      >
        <Brain className="h-3.5 w-3.5 text-indigo-500" />
        <span>Consultar análisis IA</span>
      </button>
    )
  }

  if (loading) {
    return (
      <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
        <Loader2 className="h-3.5 w-3.5 animate-spin text-indigo-500" />
        Analizando partido…
      </div>
    )
  }

  if (error) {
    return (
      <p className="text-xs text-rose-600 font-medium">
        No se pudo obtener el análisis.{' '}
        <button onClick={analyze} className="underline font-bold">
          Reintentar
        </button>
      </p>
    )
  }

  if (!analysis) return null

  return (
    <div className="mt-2 rounded-2xl border border-slate-200/90 bg-white/95 p-3.5 space-y-2.5 text-xs shadow-xs">
      <div className="flex items-center gap-2">
        <Brain className="h-4 w-4 text-indigo-600 shrink-0" />
        <span className="text-slate-900 font-bold">Análisis rápido</span>
        <span className={`ml-auto px-2.5 py-0.5 rounded-full border text-[11px] font-extrabold ${VERDICT_STYLE[analysis.verdict]}`}>
          {VERDICT_LABEL[analysis.verdict]}
        </span>
      </div>

      <p className="text-slate-600 leading-relaxed font-normal">{analysis.summary}</p>

      <div className="grid grid-cols-2 gap-3 pt-1">
        {analysis.pros?.length > 0 && (
          <div className="p-2 rounded-xl bg-emerald-50/60 border border-emerald-100">
            <p className="text-emerald-800 font-bold mb-1">A favor</p>
            <ul className="space-y-0.5">
              {analysis.pros.map((p, i) => (
                <li key={i} className="text-emerald-700 text-[11px]">
                  + {p}
                </li>
              ))}
            </ul>
          </div>
        )}
        {analysis.cons?.length > 0 && (
          <div className="p-2 rounded-xl bg-rose-50/60 border border-rose-100">
            <p className="text-rose-800 font-bold mb-1">Riesgos</p>
            <ul className="space-y-0.5">
              {analysis.cons.map((c, i) => (
                <li key={i} className="text-rose-700 text-[11px]">
                  − {c}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between pt-1 border-t border-slate-100 text-[10px] text-slate-400">
        <p className="italic">{analysis.disclaimer}</p>
        <button onClick={() => setAnalysis(null)} className="text-slate-500 hover:text-slate-800 font-bold ml-2">
          Cerrar ×
        </button>
      </div>
    </div>
  )
}
