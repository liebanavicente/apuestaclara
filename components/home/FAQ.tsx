'use client'
import { useState } from 'react'
import { Plus, Minus } from 'lucide-react'

const FAQS = [
  {
    q: '¿Se juega con dinero real?',
    a: 'No. GañanesBets es un juego social: registras predicciones y compites por puntos con tu grupo. Lo que está en juego es el orgullo (y, como mucho, una ronda de birras entre amigos).',
  },
  {
    q: '¿Cómo se calculan los puntos?',
    a: 'Cada acierto suma la cuota del resultado en puntos. Si aciertas un partido con cuota 3.50, ganas +3.50 puntos. Si fallas, no pierdes nada: simplemente no sumas en ese pick.',
  },
  {
    q: '¿De dónde salen las cuotas y los datos?',
    a: 'Mostramos cuotas reales y datos de partidos del Mundial, la Champions y grandes ligas. El histórico de cada predicción queda registrado para que el rendimiento sea siempre verificable.',
  },
  {
    q: '¿Las predicciones garantizan aciertos?',
    a: 'No. Las predicciones y el análisis son orientativos y pueden fallar. Mostramos métricas transparentes precisamente para que decidas con datos, no con promesas.',
  },
  {
    q: '¿Qué incluye Premium?',
    a: 'Premium amplía las herramientas de análisis: más generaciones diarias, comparador de riesgo, historial completo, filtros avanzados y simulaciones ilimitadas. No aumenta tus probabilidades reales de acertar.',
  },
]

export function FAQ() {
  const [open, setOpen] = useState<number | null>(0)

  return (
    <section className="border-t border-border/60 px-4 py-16 sm:py-24">
      <div className="mx-auto max-w-3xl">
        <div className="text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-primary">FAQ</p>
          <h2 className="mt-3 text-balance font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Preguntas frecuentes
          </h2>
        </div>

        <div className="mt-10 divide-y divide-border overflow-hidden rounded-2xl border border-border bg-card">
          {FAQS.map((f, i) => {
            const isOpen = open === i
            return (
              <div key={f.q}>
                <button
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="flex min-h-14 w-full items-center justify-between gap-4 px-5 py-4 text-left transition-colors hover:bg-secondary/40"
                  aria-expanded={isOpen}
                >
                  <span className="font-display text-base font-semibold text-foreground">{f.q}</span>
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-border text-muted-foreground">
                    {isOpen ? <Minus className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                  </span>
                </button>
                <div
                  className="grid transition-all duration-300 ease-out"
                  style={{ gridTemplateRows: isOpen ? '1fr' : '0fr' }}
                >
                  <div className="overflow-hidden">
                    <p className="px-5 pb-5 text-sm leading-relaxed text-muted-foreground">{f.a}</p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
