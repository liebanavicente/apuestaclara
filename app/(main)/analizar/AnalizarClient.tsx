'use client'
import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'
import { Brain, Loader2, AlertCircle, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { AnalysisResults } from '@/components/generator/AnalysisResults'
import type { PickSelection } from '@/types/odds'
import type { CombinedAnalysis } from '@/types/ai'

function AnalizarInner() {
  const searchParams = useSearchParams()
  const [analysis, setAnalysis] = useState<CombinedAnalysis | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [picks, setPicks] = useState<PickSelection[]>([])

  useEffect(() => {
    const raw = searchParams.get('picks')
    if (!raw) {
      setError('No se han recibido selecciones.')
      setLoading(false)
      return
    }

    let parsed: PickSelection[]
    try {
      parsed = JSON.parse(raw)
    } catch {
      setError('Selecciones no válidas.')
      setLoading(false)
      return
    }

    if (parsed.length < 2) {
      setError('Se necesitan al menos 2 picks para analizar.')
      setLoading(false)
      return
    }

    setPicks(parsed)
    analyze(parsed)
  }, [])

  async function analyze(parsedPicks: PickSelection[]) {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/ai/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          picks: parsedPicks,
          risk_level: 'medio',
          is_premium: true,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? 'Error desconocido')
      setAnalysis(data)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      {/* Picks summary */}
      {picks.length > 0 && (
        <div className="rounded-xl border border-neon/10 bg-superficie/80 p-4 mb-6">
          <p className="text-xs text-texto-terciario uppercase tracking-wider mb-3">Tus selecciones ({picks.length})</p>
          <div className="space-y-2">
            {picks.map((pick, i) => (
              <div key={i} className="flex items-center justify-between text-sm">
                <div className="min-w-0">
                  <span className="text-texto-secundario mr-2">#{i + 1}</span>
                  <span className="text-white">{pick.event_name}</span>
                  <span className="text-texto-terciario ml-2">· {pick.selection}</span>
                </div>
                <span className="text-neon font-bold ml-3 shrink-0">@{pick.odds.toFixed(2)}</span>
              </div>
            ))}
          </div>
          <div className="mt-3 pt-3 border-t border-neon/10 flex items-center justify-between">
            <span className="text-xs text-texto-terciario">Cuota combinada</span>
            <span className="text-white font-black text-lg">
              {picks.reduce((acc, p) => acc * p.odds, 1).toFixed(2)}
            </span>
          </div>
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="rounded-xl border border-purple-500/30 bg-purple-950/20 p-8 text-center">
          <Loader2 className="h-10 w-10 text-purple-400 animate-spin mx-auto mb-4" />
          <p className="text-white font-medium mb-1">Analizando con IA...</p>
          <p className="text-texto-secundario text-sm">Estudiando factores, estadísticas y riesgo de cada pick.</p>
        </div>
      )}

      {/* Error */}
      {error && !loading && (
        <div className="rounded-xl border border-orange-500/30 bg-orange-500/10 p-6">
          <div className="flex items-center gap-3 mb-4">
            <AlertCircle className="h-5 w-5 text-orange-400 shrink-0" />
            <p className="text-orange-300">{error}</p>
          </div>
          {picks.length >= 2 && (
            <button
              onClick={() => analyze(picks)}
              className="flex items-center gap-2 text-sm bg-orange-500/20 hover:bg-orange-500/30 text-orange-300 px-4 py-2 rounded-lg transition-colors"
            >
              <Brain className="h-4 w-4" /> Reintentar
            </button>
          )}
        </div>
      )}

      {/* Results */}
      {analysis && !loading && <AnalysisResults analysis={analysis} />}

      {/* Back */}
      <div className="mt-6">
        <Link href="/buscar-eventos" className="flex items-center gap-2 text-sm text-texto-terciario hover:text-texto-secundario transition-colors">
          <ArrowLeft className="h-4 w-4" /> Volver a buscar eventos
        </Link>
      </div>
    </div>
  )
}

export function AnalizarClient() {
  return (
    <Suspense fallback={
      <div className="flex items-center gap-2 text-texto-secundario py-8">
        <Loader2 className="h-5 w-5 animate-spin" />
        Cargando...
      </div>
    }>
      <AnalizarInner />
    </Suspense>
  )
}
