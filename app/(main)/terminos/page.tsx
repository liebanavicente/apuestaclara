export const metadata = { title: 'Términos de uso — ApuestaClara' }

export default function TerminosPage() {
  return (
    <main className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-2xl font-bold text-white mb-2">Términos de uso</h1>
      <p className="text-texto-terciario text-sm mb-8">Última actualización: mayo 2026</p>

      <div className="prose prose-invert prose-slate max-w-none space-y-6 text-texto-secundario text-sm leading-relaxed">
        <section>
          <h2 className="text-white font-semibold text-base mb-2">1. Descripción del servicio</h2>
          <p>ApuestaClara es una plataforma de análisis deportivo orientativo. La información proporcionada tiene carácter exclusivamente informativo y no constituye consejo de inversión, asesoramiento financiero ni recomendación de apuesta.</p>
        </section>

        <section>
          <h2 className="text-white font-semibold text-base mb-2">2. Edad mínima</h2>
          <p>El uso de esta plataforma está restringido a mayores de 18 años. Al registrarte, declaras tener al menos 18 años de edad.</p>
        </section>

        <section>
          <h2 className="text-white font-semibold text-base mb-2">3. Juego responsable</h2>
          <p>ApuestaClara promueve activamente el juego responsable. Las predicciones y análisis son orientativos y pueden fallar. Apostar implica riesgo real de pérdida económica. Si crees que puedes tener un problema con el juego, contacta con <a href="https://www.jugarbien.es" className="text-neon hover:text-ambar" target="_blank" rel="noopener">JugarBien.es</a> o llama al <strong className="text-white">900 200 225</strong>.</p>
        </section>

        <section>
          <h2 className="text-white font-semibold text-base mb-2">4. Limitación de responsabilidad</h2>
          <p>ApuestaClara no se hace responsable de las decisiones de apuesta tomadas por los usuarios basándose en el contenido de la plataforma. Los análisis de IA son generados automáticamente y pueden contener inexactitudes.</p>
        </section>

        <section>
          <h2 className="text-white font-semibold text-base mb-2">5. Cuentas de usuario</h2>
          <p>Eres responsable de mantener la confidencialidad de tus credenciales. Nos reservamos el derecho de suspender cuentas que incumplan estos términos.</p>
        </section>

        <section>
          <h2 className="text-white font-semibold text-base mb-2">6. Modificaciones</h2>
          <p>Podemos actualizar estos términos en cualquier momento. El uso continuado de la plataforma implica la aceptación de los términos vigentes.</p>
        </section>

        <section>
          <h2 className="text-white font-semibold text-base mb-2">7. Contacto</h2>
          <p>Para cualquier consulta sobre estos términos, contáctanos en <span className="text-neon">hola@gananesbets.com</span>.</p>
        </section>
      </div>
    </main>
  )
}
