import Link from 'next/link'
import { FloatingBackground } from './FloatingBackground'

export function FinalCta() {
  return (
    <section className="relative z-0 overflow-hidden px-4 py-28" style={{ backgroundColor: '#0B3D2E' }}>
      <FloatingBackground />
      <div
        className="glow-orb pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[520px] w-[520px] rounded-full blur-[120px]"
        style={{ background: 'radial-gradient(circle, rgba(0,230,118,0.5) 0%, transparent 70%)' }}
      />

      <div className="relative mx-auto max-w-xl text-center">
        <h2 className="font-display text-5xl tracking-wide text-[#F5F5F5] sm:text-7xl">
          ¿Te apuntas a la ronda?
        </h2>
        <div className="my-7 text-7xl animate-float sm:text-8xl">🐟</div>
        <p className="mb-8 text-lg text-texto-secundario sm:text-xl">Regístrate gratis y empieza a hacer picks</p>

        <Link
          href="/register?redirect=/dashboard"
          className="animate-glow-pulse inline-block rounded-xl bg-neon px-14 py-5 text-xl font-bold text-[#0B3D2E] transition-transform hover:scale-105"
        >
          🚀 Crear cuenta gratis
        </Link>

        <p className="mt-5 text-sm text-texto-secundario">
          Ya tengo cuenta →{' '}
          <Link href="/login?redirect=/dashboard" className="text-neon hover:underline">
            Entrar
          </Link>
        </p>
      </div>
    </section>
  )
}
