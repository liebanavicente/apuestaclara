'use client'
import { Info, Lightbulb, Shield, Zap, Target } from 'lucide-react'
import { PickAnalysisCard } from './PickAnalysisCard'
import type { CombinedAnalysis } from '@/types/ai'

const RISK_STYLE = {
  bajo: 'text-green-400 bg-green-500/10 border-green-500/30',
  medio: 'text-ambar bg-ambar/10 border-ambar/30',
  alto: 'text-orange-400 bg-orange-500/10 border-orange-500/30',
}

interface Props {
  analysis: CombinedAnalysis
}

export function AnalysisResults({ analysis }: Props) {
  return (
    <div className="space-y-4 mt-4">
      {/* Global summary */}
      <div className="rounded-xl border border-teal-500/30 bg-teal-950/30 p-4">
        <div className="flex items-center gap-2 mb-2">
          <Info className="h-4 w-4 text-teal-400" />
          <span className="text-sm font-semibold text-teal-300">Análisis global</span>
          <span className={`ml-auto text-xs px-2 py-0.5 rounded-full border ${RISK_STYLE[analysis.risk_level]}`}>
            Riesgo {analysis.risk_level}
          </span>
        </div>
        <p className="text-sm text-texto-secundario leading-relaxed">{analysis.global_risk_summary}</p>

        {analysis.no_data_warning && (
          <p className="text-xs text-ambar/80 mt-2 flex items-start gap-1.5">
            <span className="shrink-0">⚠️</span>{analysis.no_data_warning}
          </p>
        )}
      </div>

      {/* Pick by pick */}
      <div className="space-y-2">
        <p className="text-xs text-texto-secundario uppercase tracking-wider">Análisis por selección</p>
        {analysis.picks_analysis.map((pick, i) => (
          <PickAnalysisCard key={i} pick={pick} index={i} />
        ))}
      </div>

      {/* Alternatives (premium) */}
      {analysis.alternatives && (
        <div className="rounded-xl border border-purple-500/30 bg-purple-950/20 p-4 space-y-3">
          <div className="flex items-center gap-2 mb-1">
            <Lightbulb className="h-4 w-4 text-purple-400" />
            <span className="text-sm font-semibold text-purple-300">Alternativas sugeridas</span>
          </div>
          {[
            { icon: Shield, label: 'Conservadora', value: analysis.alternatives.prudent, color: 'text-green-400' },
            { icon: Target, label: 'Equilibrada', value: analysis.alternatives.objective, color: 'text-ambar' },
            { icon: Zap, label: 'Agresiva', value: analysis.alternatives.aggressive, color: 'text-orange-400' },
          ].map(({ icon: Icon, label, value, color }) => (
            <div key={label} className="flex items-start gap-2">
              <Icon className={`h-3.5 w-3.5 shrink-0 mt-0.5 ${color}`} />
              <div>
                <span className={`text-xs font-semibold ${color}`}>{label}: </span>
                <span className="text-xs text-texto-secundario">{value}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Disclaimer */}
      <p className="text-xs text-texto-terciario italic text-center">{analysis.disclaimer}</p>
    </div>
  )
}
