import Link from 'next/link'

export function FinalCta() {
  return (
    <section className="px-4 py-24" style={{ backgroundColor: '#0B3D2E' }}>
      <div className="mx-auto max-w-xl text-center">
        <h2 className="font-display text-4xl tracking-wide text-[#F5F5F5] sm:text-5xl">
          ¿Te apuntas a la ronda?
        </h2>
        <div className="my-6 text-6xl animate-float">🐟</div>
        <p className="mb-8 text-texto-secundario">Regístrate gratis y empieza a hacer picks</p>

        <Link
          href="/register?redirect=/dashboard"
          className="animate-glow-pulse inline-block rounded-xl bg-neon px-14 py-5 text-lg font-bold text-[#0B3D2E] transition-transform hover:scale-105"
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
