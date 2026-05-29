import Link from 'next/link'
import { TrendingUp, Search, Play, Users, ShieldCheck, ChevronRight, Star, Zap, BarChart3, Lock } from 'lucide-react'
import { ResponsibleNotice } from '@/components/shared/ResponsibleNotice'

export default function HomePage() {
  return (
    <div className="overflow-hidden">
      {/* Hero */}
      <section className="relative py-24 sm:py-32">
        <div className="absolute inset-0 bg-gradient-to-br from-teal-950/40 via-slate-950 to-slate-950 pointer-events-none" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-teal-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative mx-auto max-w-4xl px-4 sm:px-6 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-teal-500/30 bg-teal-500/10 px-4 py-1.5 text-sm text-teal-300 mb-6">
            <Zap className="h-3.5 w-3.5" />
            Análisis responsable de combinadas deportivas
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold text-white leading-tight mb-6">
            Analiza.{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-cyan-400">
              Compara.
            </span>{' '}
            Decide mejor.
          </h1>

          <p className="text-slate-400 text-lg sm:text-xl max-w-2xl mx-auto mb-4 leading-relaxed">
            Cuotas reales, análisis con IA y simulador sin dinero. Todo lo que necesitas para entender el riesgo antes de apostar.
          </p>

          <p className="text-orange-400/80 text-sm mb-10">
            Las predicciones son orientativas y pueden fallar. Apostar implica riesgo.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/generador"
              className="flex items-center gap-2 bg-teal-600 hover:bg-teal-500 text-white font-semibold px-6 py-3 rounded-lg transition-colors text-base shadow-lg shadow-teal-900/40"
            >
              <TrendingUp className="h-5 w-5" />
              Crear combinada
            </Link>
            <Link
              href="/simulador"
              className="flex items-center gap-2 border border-slate-700 hover:border-slate-500 text-slate-300 hover:text-white font-semibold px-6 py-3 rounded-lg transition-colors text-base"
            >
              <Play className="h-5 w-5" />
              Simular sin dinero
            </Link>
          </div>
        </div>
      </section>

      {/* Cómo funciona */}
      <section className="py-20 border-t border-slate-800/50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-white mb-3">Cómo funciona</h2>
            <p className="text-slate-400">En tres pasos, sin complicaciones</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: Search,
                step: '01',
                title: 'Busca eventos',
                desc: 'Consulta cuotas reales de múltiples casas de apuestas para miles de eventos deportivos en todo el mundo.',
              },
              {
                icon: BarChart3,
                step: '02',
                title: 'Analiza con IA',
                desc: 'La IA analiza tus selecciones, calcula probabilidades implícitas e identifica riesgos reales. Sin promesas vacías.',
              },
              {
                icon: Play,
                step: '03',
                title: 'Simula antes de apostar',
                desc: 'Antes de apostar dinero real, prueba tu combinada con saldo ficticio y entiende la varianza.',
              },
            ].map(({ icon: Icon, step, title, desc }) => (
              <div key={step} className="relative rounded-xl border border-slate-800 bg-slate-900/50 p-6 hover:border-teal-500/30 transition-colors">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-4xl font-black text-slate-800">{step}</span>
                  <div className="w-10 h-10 rounded-lg bg-teal-500/10 border border-teal-500/20 flex items-center justify-center">
                    <Icon className="h-5 w-5 text-teal-400" />
                  </div>
                </div>
                <h3 className="text-white font-semibold text-lg mb-2">{title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Buscador de eventos */}
      <section className="py-20 bg-slate-900/30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 text-xs text-teal-400 font-semibold uppercase tracking-wider mb-4">
                <Search className="h-3.5 w-3.5" />
                Buscador de eventos
              </div>
              <h2 className="text-3xl font-bold text-white mb-4">
                Cuotas reales de las mejores casas
              </h2>
              <p className="text-slate-400 leading-relaxed mb-6">
                Filtra por deporte, liga, fecha y mercado. Compara cuotas entre bookmakers y añade picks a tu selección en un clic. Solo verás la etiqueta "Datos reales" cuando los datos provienen de la API.
              </p>
              <Link href="/buscar-eventos" className="inline-flex items-center gap-2 text-teal-400 hover:text-teal-300 font-medium transition-colors">
                Explorar eventos <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="rounded-xl border border-slate-700 bg-slate-900 p-5 space-y-3">
              {[
                { league: 'LaLiga', event: 'Real Madrid vs Barcelona', odds: '2.10', time: 'Hoy 21:00' },
                { league: 'Premier League', event: 'Arsenal vs Chelsea', odds: '2.45', time: 'Mañana 17:30' },
                { league: 'NBA', event: 'Lakers vs Warriors', odds: '1.85', time: 'Mañana 02:00' },
              ].map(({ league, event, odds, time }) => (
                <div key={event} className="flex items-center justify-between rounded-lg border border-slate-800 bg-slate-950/50 p-3 gap-3">
                  <div>
                    <p className="text-xs text-teal-400 font-medium">{league}</p>
                    <p className="text-sm text-slate-200">{event}</p>
                    <p className="text-xs text-slate-500">{time}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-xs text-slate-500 mb-0.5">Mejor cuota</p>
                    <span className="font-bold text-white text-lg">{odds}</span>
                  </div>
                </div>
              ))}
              <p className="text-xs text-slate-600 text-center">Ejemplo ilustrativo — cuotas reales al conectar tu API key</p>
            </div>
          </div>
        </div>
      </section>

      {/* Simulador */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 text-xs text-orange-400 font-semibold uppercase tracking-wider mb-4">
              <Play className="h-3.5 w-3.5" />
              Simulador sin dinero
            </div>
            <h2 className="text-3xl font-bold text-white mb-3">Antes de apostar, simúlalo.</h2>
            <p className="text-slate-400 max-w-xl mx-auto">
              Practica con 1.000 monedas ficticias. Aprende sobre cuotas, riesgo y varianza sin arriesgar nada real.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
            {[
              { label: 'Saldo inicial', value: '1.000 monedas', note: 'Gratis para todos' },
              { label: 'Sin dinero real', value: '100% ficticio', note: 'Cero riesgo económico' },
              { label: 'Historial completo', value: 'Stats & curva', note: 'Aprende de resultados' },
            ].map(({ label, value, note }) => (
              <div key={label} className="rounded-xl border border-slate-800 bg-slate-900/50 p-5 text-center">
                <p className="text-xs text-slate-500 mb-1">{label}</p>
                <p className="text-2xl font-bold text-white mb-1">{value}</p>
                <p className="text-xs text-teal-400">{note}</p>
              </div>
            ))}
          </div>

          <div className="text-center space-y-2">
            <p className="text-xs text-orange-400/80">
              Este simulador no usa dinero real. Incluso acertar en simulación no garantiza resultados futuros.
            </p>
            <Link href="/simulador" className="inline-flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-white font-medium px-5 py-2.5 rounded-lg transition-colors">
              <Play className="h-4 w-4" />
              Ir al simulador
            </Link>
          </div>
        </div>
      </section>

      {/* Comunidad */}
      <section className="py-20 bg-slate-900/30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1 space-y-3">
              {[
                { user: 'usuario_73k', pick: 'Real Madrid - 1X2 Local', odds: '1.72', confidence: 'media', status: 'pendiente' },
                { user: 'analista_pro', pick: 'Arsenal Over 2.5 goles', odds: '2.10', confidence: 'alta', status: 'acertado' },
                { user: 'pick_tracker', pick: 'Lakers Handicap -3.5', odds: '1.90', confidence: 'baja', status: 'fallado' },
              ].map(({ user, pick, odds, confidence, status }) => (
                <div key={user} className="rounded-lg border border-slate-800 bg-slate-950/50 p-4 flex items-center justify-between gap-4">
                  <div>
                    <p className="text-xs text-slate-500 mb-0.5">@{user}</p>
                    <p className="text-sm text-slate-200">{pick}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-slate-400">Cuota: <strong className="text-white">{odds}</strong></span>
                      <span className="text-xs text-slate-500">Confianza: {confidence}</span>
                    </div>
                  </div>
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full shrink-0 ${
                    status === 'acertado' ? 'bg-green-500/20 text-green-400' :
                    status === 'fallado' ? 'bg-red-500/20 text-red-400' :
                    'bg-slate-700/50 text-slate-400'
                  }`}>
                    {status}
                  </span>
                </div>
              ))}
              <p className="text-xs text-slate-600 text-center">Ejemplo ilustrativo</p>
            </div>
            <div className="order-1 lg:order-2">
              <div className="inline-flex items-center gap-2 text-xs text-teal-400 font-semibold uppercase tracking-wider mb-4">
                <Users className="h-3.5 w-3.5" />
                Comunidad de picks
              </div>
              <h2 className="text-3xl font-bold text-white mb-4">Comparte y aprende</h2>
              <p className="text-slate-400 leading-relaxed mb-4">
                Publica tus picks con argumentación, vota los de otros usuarios y sigue la evolución real de resultados. Rankings basados en rendimiento histórico verificado.
              </p>
              <p className="text-xs text-orange-400/80 mb-6">
                Los picks de la comunidad son opiniones personales, no recomendaciones de inversión.
              </p>
              <Link href="/comunidad" className="inline-flex items-center gap-2 text-teal-400 hover:text-teal-300 font-medium transition-colors">
                Ver comunidad <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Free vs Premium */}
      <section className="py-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-3">Free vs Premium</h2>
            <p className="text-slate-400">
              Premium desbloquea más herramientas de análisis, no garantiza beneficios ni aumenta tus probabilidades reales de ganar.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="rounded-xl border border-slate-700 bg-slate-900/50 p-6">
              <p className="text-slate-400 font-semibold mb-1">Free</p>
              <p className="text-3xl font-bold text-white mb-6">0 €</p>
              <ul className="space-y-3 text-sm text-slate-400">
                {[
                  '3 generaciones / día',
                  'Máximo 2 picks por combinada',
                  'Análisis básico',
                  'Historial limitado',
                  'Simulador básico',
                  'Comunidad básica',
                ].map(f => (
                  <li key={f} className="flex items-center gap-2">
                    <span className="text-slate-600">✓</span> {f}
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-xl border border-teal-500/40 bg-teal-950/30 p-6 relative overflow-hidden">
              <div className="absolute top-4 right-4 bg-teal-500/20 text-teal-300 text-xs font-semibold px-2.5 py-1 rounded-full border border-teal-500/30">
                Más popular
              </div>
              <p className="text-teal-300 font-semibold mb-1">Premium</p>
              <p className="text-3xl font-bold text-white mb-1">4,99 €<span className="text-lg font-normal text-slate-400">/mes</span></p>
              <p className="text-xs text-slate-500 mb-6">Sin permanencia. Cancela cuando quieras.</p>
              <ul className="space-y-3 text-sm text-slate-300">
                {[
                  '20 generaciones / día',
                  'Hasta 6 picks por combinada',
                  'Análisis ampliado con IA',
                  'Picks descartados + alternativas',
                  'Historial completo',
                  'Favoritos y filtros avanzados',
                  'Simulaciones ilimitadas',
                  'Estadísticas avanzadas',
                ].map(f => (
                  <li key={f} className="flex items-center gap-2">
                    <Star className="h-3.5 w-3.5 text-teal-400 shrink-0" /> {f}
                  </li>
                ))}
              </ul>
              <Link href="/premium" className="mt-6 block text-center bg-teal-600 hover:bg-teal-500 text-white font-semibold py-2.5 rounded-lg transition-colors">
                Ver Premium
              </Link>
            </div>
          </div>

          <div className="mt-6 text-center">
            <Link href="/redeem" className="text-teal-400 hover:text-teal-300 text-sm underline-offset-2 hover:underline transition-colors">
              ¿Tienes un código promocional? Canjéalo gratis →
            </Link>
          </div>
        </div>
      </section>

      {/* Juego responsable */}
      <section className="py-20 bg-slate-900/30">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 text-center">
          <div className="inline-flex items-center gap-2 text-xs text-orange-400 font-semibold uppercase tracking-wider mb-4">
            <ShieldCheck className="h-3.5 w-3.5" />
            Juego responsable
          </div>
          <h2 className="text-3xl font-bold text-white mb-4">Tu bienestar, primero</h2>
          <p className="text-slate-400 leading-relaxed mb-8">
            Apuesta Clara es una herramienta de análisis y simulación. Nunca apostamos por ti ni te decimos qué hacer.
            Si el juego deja de ser entretenimiento, busca ayuda.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8 text-left">
            {[
              { icon: '🚫', text: 'No apuestes dinero que necesitas para vivir' },
              { icon: '⏸', text: 'Haz pausas regulares y establece límites' },
              { icon: '🆘', text: 'Si pierdes el control, pide ayuda profesional' },
            ].map(({ icon, text }) => (
              <div key={text} className="rounded-lg border border-orange-500/20 bg-orange-500/5 p-4">
                <span className="text-xl mb-2 block">{icon}</span>
                <p className="text-sm text-slate-400">{text}</p>
              </div>
            ))}
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/responsable" className="inline-flex items-center gap-2 border border-orange-500/40 text-orange-400 hover:text-orange-300 hover:border-orange-400 px-5 py-2.5 rounded-lg transition-colors text-sm font-medium">
              <ShieldCheck className="h-4 w-4" />
              Más información
            </Link>
            <Link href="/responsable#necesito-parar" className="inline-flex items-center gap-2 bg-orange-600/80 hover:bg-orange-600 text-white px-5 py-2.5 rounded-lg transition-colors text-sm font-medium">
              Necesito parar
            </Link>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 border-t border-slate-800/50">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-teal-500/30 bg-teal-500/10 px-4 py-1.5 text-sm text-teal-300 mb-6">
            <Lock className="h-3.5 w-3.5" />
            Sin registro obligatorio para explorar
          </div>
          <h2 className="text-3xl font-bold text-white mb-4">Empieza a analizar</h2>
          <p className="text-slate-400 mb-8">Crea una cuenta gratis y accede al generador, simulador y comunidad.</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/register" className="bg-teal-600 hover:bg-teal-500 text-white font-semibold px-8 py-3 rounded-lg transition-colors">
              Crear cuenta gratis
            </Link>
            <Link href="/buscar-eventos" className="text-slate-400 hover:text-white transition-colors text-sm">
              Ver eventos sin registrarse →
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
