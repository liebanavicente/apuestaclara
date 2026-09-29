'use client'
import { useState } from 'react'
import Link from 'next/link'
import { X, Sparkles } from 'lucide-react'

interface PromoBannerProps {
  isPremium?: boolean
}

export function PromoBanner({ isPremium }: PromoBannerProps) {
  const [dismissed, setDismissed] = useState(false)

  if (isPremium || dismissed) return null

  return (
    <div className="bg-gradient-to-r from-amber-500/20 to-amber-500/25 border-b border-amber-500/30">
      <div className="mx-auto max-w-7xl px-4 py-2.5 flex items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-sm text-amber-900">
          <Sparkles className="h-4 w-4 text-amber-600 shrink-0" />
          <span>
            <strong>Lanzamiento:</strong> prueba Premium gratis durante 1 mes con el código{' '}
            <code className="bg-amber-500/25 px-1.5 py-0.5 rounded text-amber-700 font-mono text-xs">PRUEBA1MES</code>
          </span>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <Link href="/redeem" className="text-xs text-amber-700 hover:text-ink underline-offset-2 hover:underline transition-colors">
            Canjear
          </Link>
          <button onClick={() => setDismissed(true)} className="text-amber-600 hover:text-ink transition-colors">
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
