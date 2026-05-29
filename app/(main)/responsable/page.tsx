import Link from 'next/link'
import { ShieldCheck, ExternalLink } from 'lucide-react'

export default function ResponsablePage() {
  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 py-12">
      <div className="flex items-center gap-3 mb-8">
        <ShieldCheck className="h-7 w-7 text-orange-400" />
        <h1 className="text-3xl font-bold text-white">Juego Responsable</h1>
      </div>

      <div className="rounded-xl border border-orange-500/30 bg-orange-500/10 p-6 mb-8">
        <p className="text-orange-300 font-semibold text-lg mb-2">Apuesta Clara no es un operador de apuestas</p>
        <p className="text-orange-200/80 leading-relaxed">
          Somos una herramienta de análisis, simulación y gestión del riesgo. No aceptamos dinero real,
          no operamos apuestas y no somos responsables de decisiones tomadas a partir de nuestros análisis.
        </p>
      </div>

      <div className="space-y-6">
        {[
          {
            icon: '🚫',
            title: 'No apuestes dinero que necesitas',
            body: 'Nunca utilices dinero destinado a alquiler, comida, facturas u otras necesidades básicas para apostar. Las apuestas deben ser entretenimiento, no una fuente de ingresos.',
          },
          {
            icon: '🔄',
            title: 'No persigas pérdidas',
            body: 'Si has perdido, no intentes recuperarlo apostando más. Las pérdidas pasadas no influyen en resultados futuros. Cada apuesta es independiente.',
          },
          {
            icon: '⏱',
            title: 'Establece límites de tiempo y dinero',
            body: 'Decide antes de empezar cuánto tiempo y dinero vas a dedicar. Cuando alcances el límite, para. Los operadores de apuestas regulados están obligados a ofrecer herramientas de límites.',
          },
          {
            icon: '⏸',
            title: 'Haz pausas regulares',
            body: 'Las sesiones largas dificultan el juicio. Haz pausas frecuentes y no apuestes bajo el efecto del alcohol, medicación u otras sustancias.',
          },
          {
            icon: '🧠',
            title: 'Reconoce las señales de alerta',
            body: 'Apostar más de lo planeado, mentir a familia o amigos sobre las apuestas, apostar para escapar de problemas personales, o sentir que necesitas apostar más para sentir la misma emoción son señales de problema.',
          },
          {
            icon: '🔞',
            title: 'Solo mayores de 18 años',
            body: 'Las apuestas deportivas están prohibidas para menores de 18 años en España. Apuesta Clara requiere ser mayor de edad para registrarse.',
          },
        ].map(({ icon, title, body }) => (
          <div key={title} className="rounded-xl border border-slate-800 bg-slate-900/50 p-5">
            <div className="flex items-start gap-4">
              <span className="text-2xl shrink-0">{icon}</span>
              <div>
                <h3 className="text-white font-semibold mb-1.5">{title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{body}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Autoexclusión RGIAJ */}
      <div className="mt-10 rounded-xl border border-orange-500/30 bg-orange-950/30 p-6">
        <h2 className="text-orange-300 font-bold text-lg mb-3">Autoexclusión en España — RGIAJ</h2>
        <p className="text-slate-400 text-sm leading-relaxed mb-4">
          El <strong className="text-slate-300">Registro General de Interdicciones de Acceso al Juego (RGIAJ)</strong> es
          el sistema oficial del Gobierno de España que permite autoexcluirse de todos los operadores de juego online
          regulados en España simultáneamente. Una vez inscrito, ningún operador puede aceptar apuestas tuyas durante
          el período elegido.
        </p>
        <a
          href="https://www.ordenacionjuego.es/es/rgiaj"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-orange-400 hover:text-orange-300 text-sm font-medium transition-colors"
        >
          Acceder al RGIAJ <ExternalLink className="h-3.5 w-3.5" />
        </a>
      </div>

      {/* Ayuda */}
      <div id="necesito-parar" className="mt-6 rounded-xl border border-red-500/40 bg-red-950/30 p-6 text-center">
        <h2 className="text-red-300 font-bold text-xl mb-3">¿Necesitas parar?</h2>
        <p className="text-slate-400 text-sm mb-6 max-w-md mx-auto">
          Si sientes que el juego está afectando tu vida o la de tu familia, busca ayuda profesional. No estás solo.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-md mx-auto">
          <a
            href="https://www.jugarbien.es"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 bg-red-600/80 hover:bg-red-600 text-white font-semibold py-3 rounded-lg transition-colors text-sm"
          >
            JugarBien.es <ExternalLink className="h-3.5 w-3.5" />
          </a>
          <a
            href="tel:900200225"
            className="flex items-center justify-center gap-2 border border-red-500/40 text-red-400 hover:text-red-300 hover:border-red-400 py-3 rounded-lg transition-colors text-sm font-medium"
          >
            900 200 225 (gratuito)
          </a>
        </div>
      </div>
    </div>
  )
}
