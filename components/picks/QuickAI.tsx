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
  favorable: 'text-green-400 bg-green-500/10 border-green-500/30',
  dudoso: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/30',
  arriesgado: 'text-red-400 bg-red-500/10 border-red-500/30',
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
      <button onClick={analyze}
        className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-purple-400 transition-colors">
        <Brain className="h-3.5 w-3.5" />
        Analizar con IA
      </button>
    )
  }

  if (loading) {
    return (
      <div className="flex items-center gap-1.5 text-xs text-slate-500">
        <Loader2 className="h-3.5 w-3.5 animate-spin" />
        Analizando…
      </div>
    )
  }

  if (error) {
    return <p className="text-xs text-red-400">Error al analizar. <button onClick={analyze} className="underline">Reintentar</button></p>
  }

  if (!analysis) return null

  return (
    <div className="mt-2 rounded-xl border border-slate-700 bg-slate-900 p-3 space-y-2.5 text-xs">
      <div className="flex items-center gap-2">
        <Brain className="h-3.5 w-3.5 text-purple-400 shrink-0" />
        <span className="text-slate-400 font-medium">Análisis IA</span>
        <span className={`ml-auto px-2 py-0.5 rounded-full border text-xs font-bold ${VERDICT_STYLE[analysis.verdict]}`}>
          {VERDICT_LABEL[analysis.verdict]}
        </span>
      </div>

      <p className="text-slate-300 leading-relaxed">{analysis.summary}</p>

      <div className="grid grid-cols-2 gap-2">
        {analysis.pros?.length > 0 && (
          <div>
            <p className="text-green-400 font-medium mb-1">A favor</p>
            <ul className="space-y-0.5">
              {analysis.pros.map((p, i) => <li key={i} className="text-slate-400">+ {p}</li>)}
            </ul>
          </div>
        )}
        {analysis.cons?.length > 0 && (
          <div>
            <p className="text-red-400 font-medium mb-1">En contra</p>
            <ul className="space-y-0.5">
              {analysis.cons.map((c, i) => <li key={i} className="text-slate-400">− {c}</li>)}
            </ul>
          </div>
        )}
      </div>

      <p className="text-slate-600 italic">{analysis.disclaimer}</p>

      <button onClick={() => setAnalysis(null)} className="text-slate-600 hover:text-slate-400">Cerrar ×</button>
    </div>
  )
}
