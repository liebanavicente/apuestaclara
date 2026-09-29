import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="gb-card rounded-[32px] px-8 py-12 text-center max-w-sm w-full anim-scale-in">
        <p className="text-5xl mb-4 anim-float inline-block">🐟</p>
        <p className="text-6xl font-bold tracking-[-0.05em] text-ink/15 tabular-nums">404</p>
        <h1 className="text-xl font-semibold tracking-[-0.02em] text-ink mt-2">Aquí no hay nada</h1>
        <p className="text-ink-2 text-[15px] mt-1.5">Esta página no existe o se ha movido.</p>
        <Link href="/dashboard" className="gb-btn gb-btn-primary mt-7">
          <ArrowLeft className="w-4 h-4" />
          Volver a Partidos
        </Link>
      </div>
    </div>
  )
}
