import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { hasSupabasePublicConfig } from '@/lib/supabase/config'
import { getUserAccess } from '@/lib/access'
import { Star, Check, Zap } from 'lucide-react'
import type { Subscriber } from '@/types/database'

const FREE_FEATURES = [
  '3 generaciones diarias',
  'Máximo 2 picks por combinada',
  'Análisis básico con IA',
  'Historial limitado (últimas 10)',
  'Simulador básico',
  'Comunidad: lectura y voto',
]

const PREMIUM_FEATURES = [
  '20 generaciones diarias',
  'Hasta 6 picks por combinada',
  'Análisis ampliado con IA',
  'Picks descartados + alternativas',
  'Comparador de riesgo (prudente / objetivo / agresivo)',
  'Historial completo',
  'Favoritos ilimitados',
  'Estadísticas avanzadas de simulador',
  'Filtros avanzados de eventos',
  'Simulaciones ilimitadas',
  'Deportes mixtos en una combinada',
  'Comunidad avanzada',
]

export default async function PremiumPage() {
  const supabase = hasSupabasePublicConfig() ? await createClient() : null
  const { data: { user } } = supabase ? await supabase.auth.getUser() : { data: { user: null } }

  let isPremium = false
  if (user && supabase) {
    const [profileRes, subscriberRes] = await Promise.all([
      supabase.from('profiles').select('*').eq('user_id', user.id).single(),
      supabase.from('subscribers').select('*').eq('user_id', user.id).maybeSingle(),
    ])
    const access = getUserAccess(profileRes.data, subscriberRes.data as Subscriber | null)
    isPremium = access.isPremium
  }

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 text-xs text-neon font-semibold uppercase tracking-wider mb-4">
          <Star className="h-3.5 w-3.5" />
          Premium
        </div>
        <h1 className="text-4xl font-extrabold text-white mb-3">Más herramientas. Más análisis.</h1>
        <p className="text-texto-secundario max-w-xl mx-auto text-lg">
          Premium desbloquea más herramientas de análisis.
        </p>
        <p className="text-orange-400/80 text-sm mt-2">
          Premium no garantiza beneficios ni aumenta tus probabilidades reales de ganar.
        </p>
      </div>

      {isPremium && (
        <div className="mb-8 rounded-xl border border-neon/30 bg-neon/10 p-5 text-center">
          <p className="text-neon font-semibold">Ya eres usuario Premium</p>
          <p className="text-texto-secundario text-sm mt-1">Todas las funciones están disponibles en tu cuenta.</p>
          <Link href="/account" className="inline-block mt-3 text-neon hover:text-ambar text-sm underline-offset-2 hover:underline transition-colors">
            Gestionar suscripción
          </Link>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-10">
        {/* Free */}
        <div className="rounded-xl border border-neon/10 bg-superficie/80 p-6">
          <p className="text-texto-secundario font-semibold mb-1">Free</p>
          <p className="text-4xl font-black text-white mb-1">0 €</p>
          <p className="text-texto-terciario text-sm mb-6">Para siempre gratis</p>
          <ul className="space-y-3">
            {FREE_FEATURES.map(f => (
              <li key={f} className="flex items-center gap-2.5 text-sm text-texto-secundario">
                <Check className="h-4 w-4 text-texto-terciario shrink-0" />
                {f}
              </li>
            ))}
          </ul>
          <div className="mt-6">
            {!user ? (
              <Link href="/register" className="block text-center border border-slate-600 hover:border-slate-400 text-texto-secundario hover:text-white py-2.5 rounded-lg transition-colors text-sm font-medium">
                Empezar gratis
              </Link>
            ) : (
              <p className="text-center text-texto-terciario text-sm">Tu plan actual</p>
            )}
          </div>
        </div>

        {/* Premium */}
        <div className="rounded-xl border border-neon/30 bg-neon/10 p-6 relative overflow-hidden">
          <div className="absolute top-4 right-4 flex items-center gap-1 bg-neon/10 text-neon text-xs font-semibold px-2.5 py-1 rounded-full border border-neon/30">
            <Zap className="h-3 w-3" /> Más popular
          </div>
          <p className="text-neon font-semibold mb-1">Premium</p>
          <p className="text-4xl font-black text-white mb-1">4,99 €<span className="text-xl font-normal text-texto-secundario">/mes</span></p>
          <p className="text-texto-terciario text-sm mb-6">Sin permanencia · Cancela cuando quieras</p>
          <ul className="space-y-3 mb-6">
            {PREMIUM_FEATURES.map(f => (
              <li key={f} className="flex items-center gap-2.5 text-sm text-texto-secundario">
                <Star className="h-4 w-4 text-neon shrink-0" />
                {f}
              </li>
            ))}
          </ul>
          {!isPremium && (
            <div className="space-y-2">
              {user ? (
                <form action="/api/stripe/checkout" method="POST">
                  <button className="w-full bg-neon hover:brightness-110 text-carbon font-bold py-3 rounded-lg transition-colors text-base shadow-lg shadow-neon/10">
                    Activar Premium ahora
                  </button>
                </form>
              ) : (
                <Link href="/register" className="block text-center bg-neon hover:brightness-110 text-carbon font-bold py-3 rounded-lg transition-colors text-base">
                  Registrarse y activar Premium
                </Link>
              )}
              <Link href="/redeem" className="block text-center text-neon hover:text-ambar text-sm transition-colors py-1">
                ¿Tienes código promo? Úsalo gratis →
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* FAQ */}
      <div className="border-t border-neon/10 pt-10">
        <h2 className="text-xl font-bold text-white mb-6 text-center">Preguntas frecuentes</h2>
        <div className="space-y-4 max-w-2xl mx-auto">
          {[
            {
              q: '¿Puedo cancelar en cualquier momento?',
              a: 'Sí. Puedes cancelar desde "Mi cuenta" en cualquier momento. Mantendrás el acceso hasta el fin del período pagado.',
            },
            {
              q: '¿Premium garantiza que ganaré más apuestas?',
              a: 'No. Premium desbloquea más herramientas de análisis, no aumenta tus probabilidades reales de acertar. Las predicciones son orientativas.',
            },
            {
              q: '¿Hay prueba gratuita?',
              a: 'Sí. Usa el código PRUEBA1MES para obtener 30 días de Premium sin necesidad de tarjeta de crédito.',
            },
            {
              q: '¿Cómo funciona el pago?',
              a: 'Pagos gestionados por Stripe, el estándar de la industria. No almacenamos datos de tarjetas.',
            },
          ].map(({ q, a }) => (
            <div key={q} className="rounded-lg border border-neon/10 bg-superficie/80 p-4">
              <p className="text-white font-medium mb-1.5">{q}</p>
              <p className="text-texto-secundario text-sm">{a}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
