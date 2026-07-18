import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { FloatingBackground } from './FloatingBackground'

export function FinalCta() {
  return (
    <section className="relative z-0 overflow-hidden px-4 py-28">
      <Image src="/spain-cta.webp" alt="" fill className="-z-40 object-cover object-[50%_35%] opacity-[0.18] grayscale" />
      <div
        className="absolute inset-0 -z-30"
        style={{ background: 'linear-gradient(180deg, rgba(4,8,12,0.78) 0%, rgba(6,39,36,0.84) 55%, rgba(4,8,12,0.96) 100%)' }}
      />
      <div className="flag-watermark pointer-events-none absolute inset-0 -z-20" />
      <FloatingBackground />
      <div
        className="glow-orb pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[520px] w-[520px] rounded-full blur-[120px]"
        style={{ background: 'radial-gradient(circle, rgba(63,245,211,0.28) 0%, transparent 70%)' }}
      />

      <div className="relative mx-auto max-w-xl text-center">
        <h2 className="font-display text-5xl text-white sm:text-7xl">
          Entra antes de que cambie la marea
        </h2>
        <p className="mx-auto mt-6 mb-8 max-w-md text-lg text-texto-secundario sm:text-xl">
          Regístrate gratis y empieza a convertir lectura de mercado en puntos.
        </p>

        <Link
          href="/register?redirect=/dashboard"
          className="shine-btn animate-glow-pulse inline-flex items-center gap-2 rounded-md bg-neon px-14 py-5 text-xl font-black text-carbon transition-transform hover:scale-[1.02]"
        >
          Crear cuenta gratis
          <ArrowRight className="h-5 w-5" />
        </Link>

        <p className="mt-5 text-sm text-texto-secundario">
          Ya tengo cuenta {' '}
          <Link href="/login?redirect=/dashboard" className="text-ambar hover:underline">
            Entrar
          </Link>
        </p>
      </div>
    </section>
  )
}
