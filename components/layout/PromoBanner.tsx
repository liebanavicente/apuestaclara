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
    <div className="bg-gradient-to-r from-teal-900/80 to-teal-800/60 border-b border-teal-700/50">
      <div className="mx-auto max-w-7xl px-4 py-2.5 flex items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-sm text-teal-100">
          <Sparkles className="h-4 w-4 text-teal-400 shrink-0" />
          <span>
            <strong>Lanzamiento:</strong> prueba Premium gratis durante 1 mes con el código{' '}
            <code className="bg-teal-800/60 px-1.5 py-0.5 rounded text-teal-300 font-mono text-xs">PRUEBA1MES</code>
          </span>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <Link href="/redeem" className="text-xs text-teal-300 hover:text-white underline-offset-2 hover:underline transition-colors">
            Canjear
          </Link>
          <button onClick={() => setDismissed(true)} className="text-teal-400 hover:text-white transition-colors">
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
