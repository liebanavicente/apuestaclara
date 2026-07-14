import Image from 'next/image'
import Link from 'next/link'
import { FloatingBackground } from './FloatingBackground'
import { Confetti } from './Confetti'

export function FinalCta() {
  return (
    <section className="relative z-0 overflow-hidden px-4 py-28">
      <Image src="/spain-cta.webp" alt="" fill className="-z-40 object-cover object-[50%_35%]" />
      <div
        className="absolute inset-0 -z-30"
        style={{ background: 'linear-gradient(180deg, rgba(122,12,30,0.82) 0%, rgba(74,15,36,0.88) 55%, rgba(10,18,32,0.95) 100%)' }}
      />
      <div className="flag-watermark pointer-events-none absolute inset-0 -z-20" />
      <Confetti density={24} />
      <FloatingBackground />
      <div
        className="glow-orb pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[520px] w-[520px] rounded-full blur-[120px]"
        style={{ background: 'radial-gradient(circle, rgba(198,11,30,0.5) 0%, transparent 70%)' }}
      />

      <div className="relative mx-auto max-w-xl text-center">
        <h2 className="font-display text-5xl tracking-wide text-white sm:text-7xl">
          ¿Te apuntas a la fiesta?
        </h2>
        <div className="my-7 text-7xl animate-float sm:text-8xl">🏆</div>
        <p className="mb-8 text-lg text-texto-secundario sm:text-xl">Regístrate gratis y empieza a hacer picks</p>

        <Link
          href="/register?redirect=/dashboard"
          className="shine-btn animate-glow-pulse inline-block rounded-xl bg-rojo px-14 py-5 text-xl font-bold text-white transition-transform hover:scale-105"
        >
          🏆 Crear cuenta gratis
        </Link>

        <p className="mt-5 text-sm text-texto-secundario">
          Ya tengo cuenta →{' '}
          <Link href="/login?redirect=/dashboard" className="text-amarillo hover:underline">
            Entrar
          </Link>
        </p>
      </div>
    </section>
  )
}
