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
        style={{ background: 'linear-gradient(180deg, rgba(5,7,5,0.86) 0%, rgba(10,18,10,0.9) 55%, rgba(5,7,5,0.98) 100%)' }}
      />
      <div className="flag-watermark pointer-events-none absolute inset-0 -z-20" />
      <FloatingBackground />
      <div
        className="glow-orb pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[520px] w-[520px] rounded-full blur-[120px]"
        style={{ background: 'radial-gradient(circle, rgba(183,255,56,0.25) 0%, transparent 70%)' }}
      />

      <div className="relative mx-auto max-w-2xl text-center">
        <p className="mb-4 font-mono text-xs font-semibold uppercase text-neon">Final call</p>
        <h2 className="font-display text-5xl leading-[0.96] text-white sm:text-7xl">
          Entra antes de que el mercado corrija
        </h2>
        <p className="mx-auto mt-6 mb-8 max-w-md text-lg text-texto-secundario sm:text-xl">
          Regístrate gratis y convierte tu lectura deportiva en puntos, ranking y orgullo.
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
